import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  BulkMarkBody,
  CheckInBody,
  ListAttendanceQuery,
  UpdateAttendanceBody,
} from './attendance.validation'

const STATUS = ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as const
type Status = (typeof STATUS)[number]

/**
 * Shape returned by the list endpoint for a student with no attendance row
 * on the requested day. Includes the same `student` projection as a real
 * record so the client can render both without branching.
 */
interface UnmarkedRow {
  id: string
  studentId: string
  date: Date
  status: 'ABSENT'
  checkIn: null
  checkOut: null
  note: null
  createdAt: Date
  student: unknown
}

export const attendanceService = {
  async studentIdForUser(userId: string) {
    const student = await prisma.student.findUnique({
      where: { userId },
      select: { id: true },
    })
    if (!student) throw ApiError.notFound('Student profile not found')
    return student.id
  },

  async list(filters: ListAttendanceQuery & { includeUnmarked?: boolean }) {
    const dateFilter = filters.date
      ? { equals: filters.date }
      : filters.from || filters.to
        ? { gte: filters.from, lte: filters.to }
        : undefined

    const where = {
      ...(filters.studentId ? { studentId: filters.studentId } : {}),
      ...(dateFilter ? { date: dateFilter } : {}),
      ...(filters.classId ? { student: { classId: filters.classId } } : {}),
    }

    const records = await prisma.attendance.findMany({
      where,
      include: {
        student: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true, email: true },
            },
            class: {
              select: { id: true, name: true, gradeLevel: true },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    })

    // Only synthesize "unmarked" rows when the caller asked for a single
    // day and is a staff member (includeUnmarked === true). Without a single
    // target date, we have no day to synthesize against.
    if (
      !filters.date ||
      filters.studentId ||
      filters.includeUnmarked === false
    ) {
      return records
    }

    const students = await prisma.student.findMany({
      where: {
        deletedAt: null,
        ...(filters.classId ? { classId: filters.classId } : {}),
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        class: {
          select: { id: true, name: true, gradeLevel: true },
        },
      },
    })

    const byStudent = new Map(records.map((r) => [r.studentId, r]))

    // The synthesized `id` is NOT a database id — it's a placeholder so the
    // client can key the row in a list. Attempting to PATCH or DELETE it will
    // 404 because Prisma won't find the row. This is intentional: `unmarked`
    // means "no record exists", so there's nothing to edit or delete until
    // the client POSTs a check-in.
    return students.map(
      (student): unknown =>
        byStudent.get(student.id) ?? {
          id: `unmarked:${student.id}:${filters.date!.toISOString().slice(0, 10)}`,
          studentId: student.id,
          date: filters.date!,
          status: 'ABSENT',
          checkIn: null,
          checkOut: null,
          note: null,
          createdAt: new Date(),
          student,
        }
    )
  },

  async getById(attendanceId: string) {
    const record = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: {
        student: {
          include: { user: true, class: true },
        },
      },
    })
    if (!record) throw ApiError.notFound('Attendance record not found')
    return record
  },

  async checkIn(input: CheckInBody) {
    const { studentId, date, status, note, checkIn, checkOut } = input

    // Verify the student exists before upserting. Without this, a typo in the
    // studentId fails with a foreign-key error at the DB layer and surfaces
    // as a generic 500. A 404 here is clearer and faster.
    const student = await prisma.student.findFirst({
      where: { id: studentId, deletedAt: null },
      select: { id: true },
    })
    if (!student) throw ApiError.notFound('Student not found')

    return prisma.attendance.upsert({
      where: { studentId_date: { studentId, date } },
      create: {
        studentId,
        date,
        status,
        note,
        checkIn: checkIn ?? autoCheckIn(status),
        checkOut,
      },
      update: {
        status,
        note,
        ...(checkIn ? { checkIn } : {}),
        ...(checkOut ? { checkOut } : {}),
      },
    })
  },

  async bulkMark(input: BulkMarkBody) {
    const { date, records } = input

    // Validate all studentIds in one query rather than N. A 500-student batch
    // is common; N single-row lookups would be wasteful and slow.
    const ids = [...new Set(records.map((r) => r.studentId))]
    const found = await prisma.student.findMany({
      where: { id: { in: ids }, deletedAt: null },
      select: { id: true },
    })
    const foundIds = new Set(found.map((s) => s.id))
    const missing = ids.filter((id) => !foundIds.has(id))
    if (missing.length > 0) {
      throw ApiError.badRequest('Some studentId values are invalid', { missing })
    }

    const results = await prisma.$transaction(
      records.map((r) =>
        prisma.attendance.upsert({
          where: { studentId_date: { studentId: r.studentId, date } },
          create: {
            studentId: r.studentId,
            date,
            status: r.status,
            note: r.note,
            checkIn: r.checkIn ?? autoCheckIn(r.status),
            checkOut: r.checkOut,
          },
          update: {
            status: r.status,
            note: r.note,
            ...(r.checkIn ? { checkIn: r.checkIn } : {}),
            ...(r.checkOut ? { checkOut: r.checkOut } : {}),
          },
        })
      )
    )

    return { count: results.length, records: results }
  },

  async getStats(date: Date, filters: { studentId?: string; classId?: string }) {
    const [records, totalStudents] = await Promise.all([
      prisma.attendance.findMany({
        where: {
          date: { equals: date },
          ...(filters.studentId ? { studentId: filters.studentId } : {}),
          ...(filters.classId ? { student: { classId: filters.classId } } : {}),
        },
        select: { status: true },
      }),
      prisma.student.count({
        where: {
          deletedAt: null,
          ...(filters.studentId ? { id: filters.studentId } : {}),
          ...(filters.classId ? { classId: filters.classId } : {}),
        },
      }),
    ])

    // Single pass instead of four filters over the same array.
    const byStatus = { PRESENT: 0, ABSENT: 0, LATE: 0, EXCUSED: 0 } as Record<
      Status,
      number
    >
    for (const r of records) byStatus[r.status as Status]++

    const attendanceRate =
      totalStudents > 0
        ? Number(
            (((byStatus.PRESENT + byStatus.LATE) / totalStudents) * 100).toFixed(1)
          )
        : 0

    return {
      date: date.toISOString().slice(0, 10),
      total: totalStudents,
      present: byStatus.PRESENT,
      absent: byStatus.ABSENT,
      late: byStatus.LATE,
      excused: byStatus.EXCUSED,
      attendanceRate,
    }
  },

  async checkOut(studentId: string, date: Date, checkOutTime?: Date) {
    const existing = await prisma.attendance.findUnique({
      where: { studentId_date: { studentId, date } },
      select: { id: true },
    })
    if (!existing) {
      throw ApiError.notFound('No attendance record exists for this student on this date')
    }

    return prisma.attendance.update({
      where: { id: existing.id },
      data: { checkOut: checkOutTime ?? new Date() },
    })
  },

  async update(attendanceId: string, input: UpdateAttendanceBody) {
    const existing = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Attendance record not found')

    return prisma.attendance.update({
      where: { id: attendanceId },
      data: input,
    })
  },

  async remove(attendanceId: string) {
    const existing = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Attendance record not found')

    await prisma.attendance.delete({ where: { id: attendanceId } })
  },
}

/**
 * A PRESENT or LATE record with no explicit checkIn time gets "now". An
 * ABSENT or EXCUSED record gets null — there's no meaningful time to record.
 */
function autoCheckIn(status: Status): Date | null {
  return status === 'PRESENT' || status === 'LATE' ? new Date() : null
}