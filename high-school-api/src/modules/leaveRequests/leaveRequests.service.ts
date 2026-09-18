import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateLeaveRequestForStudentBody,
  CreateLeaveRequestBody,
  ListLeaveRequestsQuery,
  ReviewLeaveRequestBody,
  UpdateLeaveRequestBody,
} from './leaveRequests.validation'

/**
 * `reviewedBy` is a plain `String?` column on LeaveRequest — a bare user id,
 * not a relation. That means the `include` block can't resolve the reviewer's
 * name. Instead of an N+1 lookup (one query per row), `attachReviewers`
 * collects every reviewer id from a batch of rows and fetches them in a
 * single `findMany`.
 */
const leaveRequestInclude = {
  student: {
    select: {
      id: true,
      studentCode: true,
      user: { select: { id: true, firstName: true, lastName: true, email: true } },
      class: { select: { id: true, name: true, gradeLevel: true } },
    },
  },
} as const

interface WithReviewerId {
  reviewedBy: string | null
}

/**
 * Enriches a batch of leave-request rows with a `reviewer` field: the User
 * record whose id matches `row.reviewedBy`, or `null` when unset.
 *
 * One query for all distinct reviewer ids in the batch, one map lookup per
 * row. Avoids the N+1 that a per-row `user.findUnique` would produce.
 */
async function attachReviewers<T extends WithReviewerId>(rows: T[]) {
  const reviewerIds = [
    ...new Set(
      rows
        .map((r) => r.reviewedBy)
        .filter((id): id is string => typeof id === 'string' && id.length > 0)
    ),
  ]

  if (reviewerIds.length === 0) {
    return rows.map((r) => ({ ...r, reviewer: null }))
  }

  const users = await prisma.user.findMany({
    where: { id: { in: reviewerIds } },
    select: { id: true, email: true, firstName: true, lastName: true },
  })
  const byId = new Map(users.map((u) => [u.id, u]))

  return rows.map((r) => ({
    ...r,
    reviewer: r.reviewedBy ? byId.get(r.reviewedBy) ?? null : null,
  }))
}

export async function studentIdForUser(userId: string): Promise<string> {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (!student) {
    throw ApiError.forbidden('Only students can file their own leave requests')
  }
  return student.id
}

export const leaveRequestsService = {
  async list(filters: ListLeaveRequestsQuery) {
    const where = {
      ...(filters.studentId ? { studentId: filters.studentId } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.from || filters.to
        ? {
            startDate: {
              ...(filters.from ? { gte: filters.from } : {}),
              ...(filters.to ? { lte: filters.to } : {}),
            },
          }
        : {}),
    }

    const [rows, total] = await Promise.all([
      prisma.leaveRequest.findMany({
        where,
        include: leaveRequestInclude,
        orderBy: { [filters.sortBy ?? 'createdAt']: filters.sortOrder },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.leaveRequest.count({ where }),
    ])

    const items = await attachReviewers(rows)

    return { items, total, page: filters.page, limit: filters.limit }
  },

  async getById(
    leaveRequestId: string,
    viewer: { roleName: string; userId: string }
  ) {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveRequestId },
      include: leaveRequestInclude,
    })
    if (!leaveRequest) throw ApiError.notFound('Leave request not found')

    if (
      viewer.roleName === 'student' &&
      (leaveRequest as { student: { user: { id: string } } }).student.user.id !==
        viewer.userId
    ) {
      throw ApiError.forbidden('You can only view your own leave requests')
    }

    const [enriched] = await attachReviewers([leaveRequest])
    return enriched
  },

  async createForSelf(studentId: string, input: CreateLeaveRequestBody) {
    const student = await prisma.student.findFirst({
      where: { id: studentId, deletedAt: null },
      select: { id: true },
    })
    if (!student) {
      throw ApiError.unauthorized('Your student profile is no longer active')
    }

    const row = await prisma.leaveRequest.create({
      data: {
        studentId,
        startDate: input.startDate,
        endDate: input.endDate,
        reason: input.reason,
        status: 'PENDING',
      },
      include: leaveRequestInclude,
    })
    const [enriched] = await attachReviewers([row])
    return enriched
  },

  async createForStudent(input: CreateLeaveRequestForStudentBody) {
    const student = await prisma.student.findFirst({
      where: { id: input.studentId, deletedAt: null },
      select: { id: true },
    })
    if (!student) {
      throw ApiError.badRequest('studentId does not refer to an existing student')
    }

    const row = await prisma.leaveRequest.create({
      data: {
        studentId: input.studentId,
        startDate: input.startDate,
        endDate: input.endDate,
        reason: input.reason,
        status: 'PENDING',
      },
      include: leaveRequestInclude,
    })
    const [enriched] = await attachReviewers([row])
    return enriched
  },

  async update(leaveRequestId: string, changes: UpdateLeaveRequestBody) {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveRequestId },
      select: {
        id: true,
        status: true,
        startDate: true,
        endDate: true,
      },
    })
    if (!leaveRequest) throw ApiError.notFound('Leave request not found')

    if (leaveRequest.status !== 'PENDING') {
      throw ApiError.conflict(
        'Cannot edit a leave request that has already been reviewed'
      )
    }

    const nextStart = changes.startDate ?? leaveRequest.startDate
    const nextEnd = changes.endDate ?? leaveRequest.endDate
    if (nextEnd < nextStart) {
      throw ApiError.badRequest('endDate must be on or after startDate')
    }

    const row = await prisma.leaveRequest.update({
      where: { id: leaveRequestId },
      data: changes,
      include: leaveRequestInclude,
    })
    const [enriched] = await attachReviewers([row])
    return enriched
  },

  async review(
    leaveRequestId: string,
    reviewerId: string,
    input: ReviewLeaveRequestBody
  ) {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveRequestId },
      select: { id: true, status: true },
    })
    if (!leaveRequest) throw ApiError.notFound('Leave request not found')

    if (leaveRequest.status !== 'PENDING') {
      throw ApiError.conflict(
        `Leave request has already been reviewed (status: ${leaveRequest.status})`
      )
    }

    /**
     * `reviewedBy` is a scalar string column, so it takes the reviewer's user
     * id directly — no `connect`. If a `reviewer` relation is added later,
     * change this to `reviewedBy: { connect: { id: reviewerId } }` and restore
     * the include.
     *
     * `reviewNote` is written only when the caller supplied one. The
     * conditional spread avoids clobbering an existing note with `undefined`
     * on an update path — though `review` is PENDING-only, so this is
     * defensive.
     */
    const row = await prisma.leaveRequest.update({
      where: { id: leaveRequestId },
      data: {
        status: input.status,
        reviewedBy: reviewerId,
        reviewedAt: new Date(),
        ...(input.note !== undefined ? { reviewNote: input.note } : {}),
      },
      include: leaveRequestInclude,
    })
    const [enriched] = await attachReviewers([row])
    return enriched
  },

  async remove(leaveRequestId: string) {
    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: leaveRequestId },
      select: { id: true, status: true },
    })
    if (!leaveRequest) throw ApiError.notFound('Leave request not found')

    if (leaveRequest.status !== 'PENDING') {
      throw ApiError.conflict(
        'Cannot delete a leave request that has already been reviewed'
      )
    }

    await prisma.leaveRequest.delete({ where: { id: leaveRequestId } })
  },
}