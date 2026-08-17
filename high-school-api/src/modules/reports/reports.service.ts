import { prisma } from '@/config/database'

export const reportsService = {
  async attendance(filters: { classId?: string; from?: string; to?: string }) {
    return prisma.attendance.findMany({
      where: {
        student: filters.classId ? { classId: filters.classId } : undefined,
        date:
          filters.from || filters.to
            ? {
                gte: filters.from ? new Date(filters.from) : undefined,
                lte: filters.to ? new Date(filters.to) : undefined,
              }
            : undefined,
      },
      include: { student: { include: { user: true } } },
    })
  },

  async grades(filters: { classId?: string; subjectId?: string; period?: string }) {
    return prisma.grade.findMany({
      where: {
        subjectId: filters.subjectId,
        period: filters.period as never,
        student: filters.classId ? { classId: filters.classId } : undefined,
      },
      include: { student: { include: { user: true } }, subject: true },
    })
  },

  async forStudent(studentId: string) {
    const [attendance, grades, leaveRequests] = await Promise.all([
      prisma.attendance.groupBy({ by: ['status'], where: { studentId }, _count: true }),
      prisma.grade.findMany({ where: { studentId }, include: { subject: true } }),
      prisma.leaveRequest.findMany({ where: { studentId } }),
    ])
    return { attendance, grades, leaveRequests }
  },

  async forTeacher(teacherId: string) {
    const [subjects, classesLed, homeworkGiven, quizzesGiven] = await Promise.all([
      prisma.teacherSubject.findMany({ where: { teacherId }, include: { subject: true } }),
      prisma.class.findMany({ where: { homeroomTeacherId: teacherId } }),
      prisma.homework.count({ where: { teacherId } }),
      prisma.quiz.count({ where: { teacherId } }),
    ])
    return { subjects, classesLed, homeworkGiven, quizzesGiven }
  },
}