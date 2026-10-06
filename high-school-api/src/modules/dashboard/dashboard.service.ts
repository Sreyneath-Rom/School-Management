import { prisma } from '@/config/database'
import type { Prisma } from '@/generated/prisma/client'
import { toUtcMidnight } from '@/utils/date'
import type {
  AttendanceSummaryQuery,
  GradeSummaryQuery,
  StatsQuery,
} from './dashboard.validation'

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
    // Default to today when no range is given — aggregating the whole table
    // is never what a dashboard widget wants and forces a full scan.
    const today = toUtcMidnight(new Date())
    const from = query.from ?? today
    const to = query.to ?? today

    const rows = await prisma.attendance.groupBy({
      by: ['status'],
      where: { date: { gte: from, lte: to } },
      _count: { _all: true },
    })

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
      from: from.toISOString().slice(0, 10),
      to: to.toISOString().slice(0, 10),
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