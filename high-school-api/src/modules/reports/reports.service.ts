import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  AttendanceReportQuery,
  GradesReportQuery,
} from './reports.validation'

const ATTENDANCE_STATUSES = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const
type AttendanceStatus = (typeof ATTENDANCE_STATUSES)[number]

/**
 * Returned for `forStudent.attendance`. Fixed shape regardless of the
 * underlying data — a student with zero absences still gets `absent: 0`, so
 * a client rendering a fixed set of counters never has to guard against a
 * missing key.
 */
interface AttendanceSummary {
  total: number
  present: number
  absent: number
  late: number
  excused: number
  /** (present + late) / total, to one decimal. 0 when total is 0. */
  attendanceRate: number
}

function summarize(
  rows: Array<{ status: AttendanceStatus; _count: { _all: number } }>
): AttendanceSummary {
  const counts: Record<AttendanceStatus, number> = {
    PRESENT: 0,
    ABSENT: 0,
    LATE: 0,
    EXCUSED: 0,
  }
  for (const row of rows) {
    counts[row.status] = row._count._all
  }

  const total =
    counts.PRESENT + counts.ABSENT + counts.LATE + counts.EXCUSED
  const attendanceRate =
    total > 0
      ? Number(
          (((counts.PRESENT + counts.LATE) / total) * 100).toFixed(1)
        )
      : 0

  return {
    total,
    present: counts.PRESENT,
    absent: counts.ABSENT,
    late: counts.LATE,
    excused: counts.EXCUSED,
    attendanceRate,
  }
}

export const reportsService = {
  async attendance(query: AttendanceReportQuery) {
    const where = {
      ...(query.classId ? { student: { classId: query.classId } } : {}),
      ...(query.studentId ? { studentId: query.studentId } : {}),
      ...(query.from || query.to
        ? {
            date: {
              ...(query.from ? { gte: query.from } : {}),
              ...(query.to ? { lte: query.to } : {}),
            },
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      prisma.attendance.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              studentCode: true,
              user: { select: { id: true, firstName: true, lastName: true } },
              class: { select: { id: true, name: true, gradeLevel: true } },
            },
          },
        },
        orderBy: { date: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.attendance.count({ where }),
    ])

    return { items, total, page: query.page, limit: query.limit }
  },

  async grades(query: GradesReportQuery) {
    const where = {
      ...(query.subjectId ? { subjectId: query.subjectId } : {}),
      ...(query.period ? { period: query.period } : {}),
      ...(query.periodLabel ? { periodLabel: query.periodLabel } : {}),
      ...(query.studentId ? { studentId: query.studentId } : {}),
      ...(query.classId ? { student: { classId: query.classId } } : {}),
    }

    const [items, total] = await Promise.all([
      prisma.grade.findMany({
        where,
        include: {
          student: {
            select: {
              id: true,
              studentCode: true,
              user: { select: { id: true, firstName: true, lastName: true } },
              class: { select: { id: true, name: true, gradeLevel: true } },
            },
          },
          subject: { select: { id: true, name: true, code: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      prisma.grade.count({ where }),
    ])

    return { items, total, page: query.page, limit: query.limit }
  },

  async forStudent(studentId: string) {
    // Existence check first — otherwise a bad id returns an empty payload
    // that looks identical to "this student has no data".
    const student = await prisma.student.findFirst({
      where: { id: studentId, deletedAt: null },
      select: {
        id: true,
        studentCode: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
        class: { select: { id: true, name: true, gradeLevel: true } },
      },
    })
    if (!student) throw ApiError.notFound('Student not found')

    const [attendanceRows, grades, leaveRequests] = await Promise.all([
      prisma.attendance.groupBy({
        by: ['status'],
        where: { studentId },
        _count: { _all: true },
      }),
      prisma.grade.findMany({
        where: { studentId },
        include: { subject: { select: { id: true, name: true, code: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.leaveRequest.findMany({
        where: { studentId },
        orderBy: { createdAt: 'desc' },
      }),
    ])

    return {
      student,
      attendance: summarize(attendanceRows),
      grades,
      leaveRequests,
    }
  },

  async forTeacher(teacherId: string) {
    const teacher = await prisma.teacher.findFirst({
      where: { id: teacherId, deletedAt: null },
      select: {
        id: true,
        teacherCode: true,
        user: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    })
    if (!teacher) throw ApiError.notFound('Teacher not found')

    const [subjects, classesLed, homeworkGiven, quizzesGiven] = await Promise.all([
      prisma.teacherSubject.findMany({
        where: { teacherId },
        include: { subject: { select: { id: true, name: true, code: true } } },
      }),
      // `_count.students` — a class list without an enrollment count is
      // almost never what a report consumer wants; the previous version
      // returned the class rows bare.
      prisma.class.findMany({
        where: { homeroomTeacherId: teacherId, deletedAt: null },
        select: {
          id: true,
          name: true,
          gradeLevel: true,
          _count: { select: { students: true } },
        },
        orderBy: { name: 'asc' },
      }),
      prisma.homework.count({ where: { teacherId } }),
      prisma.quiz.count({ where: { teacherId } }),
    ])

    return {
      teacher,
      subjects,
      classesLed,
      homeworkGiven,
      quizzesGiven,
    }
  },
}