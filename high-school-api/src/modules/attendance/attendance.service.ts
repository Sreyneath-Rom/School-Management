import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const attendanceService = {
  async list(filters: { studentId?: string; date?: string; from?: string; to?: string; classId?: string }) {
    const dateFilter = filters.date
      ? { equals: new Date(filters.date) }
      : filters.from || filters.to
      ? {
          gte: filters.from ? new Date(filters.from) : undefined,
          lte: filters.to ? new Date(filters.to) : undefined,
        }
      : undefined

    return prisma.attendance.findMany({
      where: {
        studentId: filters.studentId,
        date: dateFilter,
      },
      include: {
        student: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
            class: {
              select: {
                id: true,
                name: true,
                gradeLevel: true,
              },
            },
          },
        },
      },
      orderBy: { date: 'desc' },
    })
  },

  async getById(attendanceId: string) {
    const record = await prisma.attendance.findUnique({
      where: { id: attendanceId },
      include: {
        student: {
          include: {
            user: true,
            class: true,
          },
        },
      },
    })
    if (!record) throw ApiError.notFound('Attendance record not found')
    return record
  },

  async checkIn(input: {
    studentId: string
    date: Date
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
    checkIn?: Date
    checkOut?: Date
    note?: string
  }) {
    const { studentId, date, status, note, checkIn, checkOut } = input
    return prisma.attendance.upsert({
      where: { studentId_date: { studentId, date } },
      create: { studentId, date, status, note, checkIn: checkIn || (status === 'PRESENT' || status === 'LATE' ? new Date() : null), checkOut },
      update: { status, note, ...(checkIn ? { checkIn } : {}), ...(checkOut ? { checkOut } : {}) },
    })
  },

  async bulkMark(input: {
    date: Date
    records: Array<{
      studentId: string
      status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
      checkIn?: Date
      checkOut?: Date
      note?: string
    }>
  }) {
    const { date, records } = input
    const results = await prisma.$transaction(
      records.map((r) =>
        prisma.attendance.upsert({
          where: { studentId_date: { studentId: r.studentId, date } },
          create: {
            studentId: r.studentId,
            date,
            status: r.status,
            note: r.note,
            checkIn: r.checkIn || (r.status === 'PRESENT' || r.status === 'LATE' ? new Date() : null),
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

  async getStats(date?: string) {
    const targetDate = date ? new Date(date) : new Date()
    const records = await prisma.attendance.findMany({
      where: {
        date: { equals: targetDate },
      },
    })

    const present = records.filter((r: any) => r.status === 'PRESENT').length
    const absent = records.filter((r: any) => r.status === 'ABSENT').length
    const late = records.filter((r: any) => r.status === 'LATE').length
    const excused = records.filter((r: any) => r.status === 'EXCUSED').length
    const total = records.length
    const attendanceRate = total > 0 ? Number(((present + late) / total * 100).toFixed(1)) : 0

    return {
      date: targetDate.toISOString().split('T')[0],
      total,
      present,
      absent,
      late,
      excused,
      attendanceRate,
    }
  },

  async checkOut(studentId: string, date: Date, checkOutTime?: Date) {
    const existing = await prisma.attendance.findUnique({ where: { studentId_date: { studentId, date } } })
    if (!existing) throw ApiError.notFound('No check-in found for this student/date')

    return prisma.attendance.update({
      where: { id: existing.id },
      data: { checkOut: checkOutTime || new Date() },
    })
  },

  async remove(attendanceId: string) {
    const record = await prisma.attendance.findUnique({ where: { id: attendanceId } })
    if (!record) throw ApiError.notFound('Attendance record not found')

    await prisma.attendance.delete({ where: { id: attendanceId } })
  },
}
