import { prisma } from '@/config/database'
import type { Prisma } from '@/generated/prisma/client'
import type {
  AttendanceSummaryQuery,
  GradeSummaryQuery,
  StatsQuery,
} from './dashboard.validation'

/**
 * Maps a cohort slug to the grade-level range it covers. Returning
 * `undefined` for "all" means "no filter" — callers spread the result and
 * Prisma treats `undefined` fields as absent.
 */
function gradeLevelRange(cohort: StatsQuery['cohort']):
  | { gte: number; lte: number }
  | undefined {
  switch (cohort) {
    case 'lower-secondary':
      return { gte: 7, lte: 9 }
    case 'upper-secondary':
      return { gte: 10, lte: 12 }
    case 'all':
    default:
      return undefined
  }
}

export const dashboardService = {
  async stats(query: StatsQuery) {
    const range = gradeLevelRange(query.cohort)

    // Build the two `where` fragments up front. Spreading `undefined` in a
    // JS object literal is a no-op, but doing it conditionally here keeps the
    // query construction readable and typed.
    const studentWhere: Prisma.StudentWhereInput = {
      deletedAt: null,
      ...(range ? { class: { gradeLevel: range } } : {}),
    }
    const classWhere: Prisma.ClassWhereInput = {
      deletedAt: null,
      ...(range ? { gradeLevel: range } : {}),
    }
    const leaveWhere: Prisma.LeaveRequestWhereInput = {
      status: 'PENDING',
      ...(range ? { student: { class: { gradeLevel: range } } } : {}),
    }

    const [studentCount, teacherCount, classCount, pendingLeaveRequests] =
      await Promise.all([
        prisma.student.count({ where: studentWhere }),
        // Teachers are not scoped to a cohort — a teacher can teach across
        // cohorts, and the model has no direct gradeLevel link on Teacher.
        prisma.teacher.count({ where: { deletedAt: null } }),
        prisma.class.count({ where: classWhere }),
        prisma.leaveRequest.count({ where: leaveWhere }),
      ])

    return {
      cohort: query.cohort,
      studentCount,
      teacherCount,
      classCount,
      pendingLeaveRequests,
    }
  },

  async attendanceSummary(query: AttendanceSummaryQuery) {
    const dateFilter =
      query.from || query.to
        ? {
            ...(query.from ? { gte: query.from } : {}),
            ...(query.to ? { lte: query.to } : {}),
          }
        : undefined

    const rows = await prisma.attendance.groupBy({
      by: ['status'],
      where: dateFilter ? { date: dateFilter } : undefined,
      _count: { _all: true },
    })

    // Guarantee every status appears in the response, even at zero. A
    // dashboard widget rendering a fixed set of buckets (Present/Absent/Late/
    // Excused) shouldn't have to special-case "the API omitted this one
    // because there were no rows".
    const counts: Record<string, number> = {
      PRESENT: 0,
      ABSENT: 0,
      LATE: 0,
      EXCUSED: 0,
    }
    for (const row of rows) {
      counts[row.status] = row._count._all
    }

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0)

    return {
      from: query.from?.toISOString().slice(0, 10) ?? null,
      to: query.to?.toISOString().slice(0, 10) ?? null,
      total,
      ...counts,
    }
  },

  async gradeSummary(query: GradeSummaryQuery) {
    const where: Prisma.GradeWhereInput = {
      ...(query.subjectId ? { subjectId: query.subjectId } : {}),
      ...(query.classId ? { student: { classId: query.classId } } : {}),
      ...(query.periodLabel ? { periodLabel: query.periodLabel } : {}),
    }

    // Resolve subject names in the same response. The previous version
    // returned only `subjectId` values, forcing the client to fetch the
    // subject list separately and join client-side. That's an N+1 that grows
    // with the number of subjects.
    const [bySubject, subjects] = await Promise.all([
      prisma.grade.groupBy({
        by: ['subjectId'],
        where,
        _avg: { score: true },
        _count: { _all: true },
      }),
      prisma.subject.findMany({
        select: { id: true, name: true, code: true },
      }),
    ])

    const subjectById = new Map(subjects.map((s) => [s.id, s]))

    return bySubject.map((row) => {
      const subject = subjectById.get(row.subjectId)
      return {
        subjectId: row.subjectId,
        subjectName: subject?.name ?? 'Unknown subject',
        subjectCode: subject?.code ?? null,
        averageScore:
          row._avg.score !== null ? Number(row._avg.score.toFixed(2)) : null,
        gradeCount: row._count._all,
      }
    })
  },

  async recentNotifications(requestingUserId: string) {
    return prisma.notification.findMany({
      where: { userId: requestingUserId, readAt: null },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
  },
}