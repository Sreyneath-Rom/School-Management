import { prisma } from '@/config/database'

export const dashboardService = {
  async stats(cohort?: string) {
    const gradeLevelFilter = cohort === 'Upper Sec (10-12)'
      ? { gte: 10, lte: 12 }
      : cohort === 'Lower Sec (7-9)'
        ? { gte: 7, lte: 9 }
        : undefined
    const classFilter = gradeLevelFilter ? { gradeLevel: gradeLevelFilter } : undefined
    const studentFilter = gradeLevelFilter ? { class: { gradeLevel: gradeLevelFilter } } : undefined
    const [studentCount, teacherCount, classCount, pendingLeaveRequests] = await Promise.all([
      prisma.student.count({ where: { deletedAt: null, ...studentFilter } }),
      prisma.teacher.count({ where: { deletedAt: null } }),
      prisma.class.count({ where: { deletedAt: null, ...classFilter } }),
      prisma.leaveRequest.count({ where: { status: 'PENDING', ...(studentFilter ? { student: studentFilter } : {}) } }),
    ])
    return { studentCount, teacherCount, classCount, pendingLeaveRequests }
  },

  async attendanceSummary(filters: { from?: string; to?: string }) {
    return prisma.attendance.groupBy({
      by: ['status'],
      where: {
        date:
          filters.from || filters.to
            ? {
                gte: filters.from ? new Date(filters.from) : undefined,
                lte: filters.to ? new Date(filters.to) : undefined,
              }
            : undefined,
      },
      _count: true,
    })
  },

  async gradeSummary() {
    return prisma.grade.groupBy({ by: ['subjectId'], _avg: { score: true }, _count: true })
  },

  async recentNotifications(requestingUserId: string) {
    return prisma.notification.findMany({
      where: { userId: requestingUserId, readAt: null },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
  },
}