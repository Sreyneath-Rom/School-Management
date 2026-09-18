import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const leaveRequestsService = {
  async studentIdForUser(userId: string) {
    const student = await prisma.student.findUnique({ where: { userId }, select: { id: true } })
    if (!student) throw ApiError.notFound('Student profile not found')
    return student.id
  },

  async list(filters: { studentId?: string; status?: string }) {
    return prisma.leaveRequest.findMany({
      where: { studentId: filters.studentId, status: filters.status as never },
      include: { student: { include: { user: { select: { firstName: true, lastName: true, email: true } }, class: true } } },
      orderBy: { createdAt: 'desc' },
    })
  },

  async getById(leaveRequestId: string) {
    const leaveRequest = await prisma.leaveRequest.findUnique({ where: { id: leaveRequestId } })
    if (!leaveRequest) throw ApiError.notFound('Leave request not found')
    return leaveRequest
  },

  async create(input: { studentId: string; startDate: Date; endDate: Date; reason: string }) {
    if (input.endDate < input.startDate) throw ApiError.badRequest('End date must be on or after start date')
    const student = await prisma.student.findFirst({ where: { id: input.studentId, deletedAt: null } })
    if (!student) throw ApiError.badRequest('Student profile not found')
    return prisma.leaveRequest.create({ data: input })
  },

  /** Edits dates/reason. Only allowed while still PENDING — changing the
   *  details out from under an already-reviewed request would make the
   *  approval/rejection decision stale. */
  async update(leaveRequestId: string, changes: Partial<{ startDate: Date; endDate: Date; reason: string }>) {
    const leaveRequest = await prisma.leaveRequest.findUnique({ where: { id: leaveRequestId } })
    if (!leaveRequest) throw ApiError.notFound('Leave request not found')

    if (leaveRequest.status !== 'PENDING') {
      throw ApiError.conflict('Cannot edit a leave request that has already been reviewed')
    }

    return prisma.leaveRequest.update({ where: { id: leaveRequestId }, data: changes })
  },

  async review(leaveRequestId: string, status: 'APPROVED' | 'REJECTED', reviewerId: string) {
    const leaveRequest = await prisma.leaveRequest.findUnique({ where: { id: leaveRequestId } })
    if (!leaveRequest) throw ApiError.notFound('Leave request not found')

    return prisma.leaveRequest.update({
      where: { id: leaveRequestId },
      data: { status, reviewedBy: reviewerId, reviewedAt: new Date() },
    })
  },

  /** Cancels a request. Same PENDING-only guard as update — once reviewed,
   *  it's a record that should stick around rather than disappear. */
  async remove(leaveRequestId: string) {
    const leaveRequest = await prisma.leaveRequest.findUnique({ where: { id: leaveRequestId } })
    if (!leaveRequest) throw ApiError.notFound('Leave request not found')

    if (leaveRequest.status !== 'PENDING') {
      throw ApiError.conflict('Cannot delete a leave request that has already been reviewed')
    }

    await prisma.leaveRequest.delete({ where: { id: leaveRequestId } })
  },
}