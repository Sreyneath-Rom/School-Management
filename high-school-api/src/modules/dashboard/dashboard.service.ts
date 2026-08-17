import { prisma } from '@/config/database'

export const dashboardService = {
  async stats() {
    const [studentCount, teacherCount, classCount, pendingLeaveRequests] = await Promise.all([
      prisma.student.count({ where: { deletedAt: null } }),
      prisma.teacher.count({ where: { deletedAt: null } }),
      prisma.class.count({ where: { deletedAt: null } }),
      prisma.leaveRequest.count({ where: { status: 'PENDING' } }),
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