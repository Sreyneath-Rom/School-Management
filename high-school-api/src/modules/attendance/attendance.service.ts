import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const attendanceService = {
  async list(filters: { studentId?: string; from?: string; to?: string }) {
    return prisma.attendance.findMany({
      where: {
        studentId: filters.studentId,
        date:
          filters.from || filters.to
            ? {
                gte: filters.from ? new Date(filters.from) : undefined,
                lte: filters.to ? new Date(filters.to) : undefined,
              }
            : undefined,
      },
      orderBy: { date: 'desc' },
    })
  },

  async getById(attendanceId: string) {
    const record = await prisma.attendance.findUnique({ where: { id: attendanceId } })
    if (!record) throw ApiError.notFound('Attendance record not found')
    return record
  },

  async checkIn(input: {
    studentId: string
    date: Date
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
    note?: string
  }) {
    const { studentId, date, status, note } = input
    return prisma.attendance.upsert({
      where: { studentId_date: { studentId, date } },
      create: { studentId, date, status, note, checkIn: new Date() },
      update: { status, note, checkIn: new Date() },
    })
  },

  async checkOut(studentId: string, date: Date) {
    const existing = await prisma.attendance.findUnique({ where: { studentId_date: { studentId, date } } })
    if (!existing) throw ApiError.notFound('No check-in found for this student/date')

    return prisma.attendance.update({ where: { id: existing.id }, data: { checkOut: new Date() } })
  },

  async remove(attendanceId: string) {
    const record = await prisma.attendance.findUnique({ where: { id: attendanceId } })
    if (!record) throw ApiError.notFound('Attendance record not found')

    await prisma.attendance.delete({ where: { id: attendanceId } })
  },
}