import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type { Prisma } from '@/generated/prisma/client'
import type {
  CreateTermBody,
  ListTermsQuery,
  UpdateTermBody,
} from './terms.validation'

type Tx = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

const RETRY_LIMIT = 3
const RETRY_BASE_MS = 25

/**
 * Retries serializable-transaction conflicts (Postgres 40001 → Prisma P2034).
 *
 * This matters most for the "exactly one active term per academic year"
 * invariant. Without serializable isolation, two concurrent calls to
 * `setActive` can both mark their target as `Active` and both mark the
 * previously-active term as `Completed`, leaving the year with two active
 * terms — or, on an interleaving where each sees the other as already-
 * active, zero. Serializable isolation plus retry makes one succeed and the
 * other see the first's committed state on retry.
 */
async function runSerializable<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  let lastError: unknown
  for (let attempt = 0; attempt < RETRY_LIMIT; attempt++) {
    try {
      return await prisma.$transaction(fn, { isolationLevel: 'Serializable' })
    } catch (err) {
      if ((err as { code?: string } | null)?.code !== 'P2034') throw err
      lastError = err
      await new Promise((r) => setTimeout(r, RETRY_BASE_MS * 2 ** attempt))
    }
  }
  throw lastError
}

const termInclude = {
  academicYear: { select: { id: true, name: true, isCurrent: true } },
} as const

/**
 * Enforces the three date-ordering invariants on a fully merged term.
 * Called with the post-update values so a partial PATCH that changes only
 * `startDate` is checked against the stored `endDate` and `gradingDeadline`.
 */
function assertDatesOrdered(input: {
  startDate: Date
  endDate: Date
  gradingDeadline: Date
}): void {
  if (input.startDate >= input.endDate) {
    throw ApiError.badRequest('startDate must be earlier than endDate')
  }
  if (input.gradingDeadline < input.startDate) {
    throw ApiError.badRequest('gradingDeadline cannot be before startDate')
  }
  if (input.gradingDeadline > input.endDate) {
    throw ApiError.badRequest('gradingDeadline cannot be after endDate')
  }
}

/**
 * Confirms the academic year exists before writing a foreign key that
 * points at it. One query, one clear error message.
 */
async function assertAcademicYearExists(
  tx: Tx,
  academicYearId: string
): Promise<void> {
  const year = await tx.academicYear.findUnique({
    where: { id: academicYearId },
    select: { id: true },
  })
  if (!year) {
    throw ApiError.badRequest(
      'academicYearId does not refer to an existing academic year'
    )
  }
}

export const termsService = {
  async list(query: ListTermsQuery) {
    return prisma.term.findMany({
      where: {
        ...(query.academicYearId ? { academicYearId: query.academicYearId } : {}),
        ...(query.status ? { status: query.status } : {}),
      },
      include: termInclude,
      orderBy: { startDate: 'asc' },
    })
  },

  async getById(id: string) {
    const term = await prisma.term.findUnique({
      where: { id },
      include: termInclude,
    })
    if (!term) throw ApiError.notFound('Term not found')
    return term
  },

  /**
   * Creates a term. If `status: 'Active'` is requested, the year's currently
   * active term (if any) is marked `Completed` in the same transaction —
   * the invariant is "at most one active term per academic year".
   *
   * Serializable isolation ensures two concurrent creates can't both see
   * "no active term" and both insert an Active one.
   */
  async create(input: CreateTermBody) {
    assertDatesOrdered(input)

    return runSerializable(async (tx) => {
      await assertAcademicYearExists(tx, input.academicYearId)

      const duplicate = await tx.term.findUnique({
        where: {
          academicYearId_name: {
            academicYearId: input.academicYearId,
            name: input.name,
          },
        },
        select: { id: true },
      })
      if (duplicate) {
        throw ApiError.conflict(
          `A term named "${input.name}" already exists for this academic year`
        )
      }

      if (input.status === 'Active') {
        await tx.term.updateMany({
          where: { academicYearId: input.academicYearId, status: 'Active' },
          data: { status: 'Completed' },
        })
      }

      return tx.term.create({ data: input, include: termInclude })
    })
  },

  /**
   * Partial update of a term.
   *
   * The date-ordering check runs against the merged values, so a PATCH
   * that changes only `startDate` to a value after the stored `endDate`
   * produces a 400 instead of an invalid row.
   *
   * Uniqueness on (academicYearId, name) is re-checked only when either
   * of those fields is actually changing.
   */
  async update(id: string, changes: UpdateTermBody) {
    const existing = await prisma.term.findUnique({
      where: { id },
      select: {
        id: true,
        academicYearId: true,
        name: true,
        startDate: true,
        endDate: true,
        gradingDeadline: true,
      },
    })
    if (!existing) throw ApiError.notFound('Term not found')

    // Merge for the ordering check.
    assertDatesOrdered({
      startDate: changes.startDate ?? existing.startDate,
      endDate: changes.endDate ?? existing.endDate,
      gradingDeadline: changes.gradingDeadline ?? existing.gradingDeadline,
    })

    const nextAcademicYearId = changes.academicYearId ?? existing.academicYearId
    const nextName = changes.name ?? existing.name

    return runSerializable(async (tx) => {
      if (changes.academicYearId !== undefined) {
        await assertAcademicYearExists(tx, changes.academicYearId)
      }

      // Re-check uniqueness when name or academicYearId is changing.
      const nameOrYearChanging =
        (changes.name !== undefined && changes.name !== existing.name) ||
        (changes.academicYearId !== undefined &&
          changes.academicYearId !== existing.academicYearId)

      if (nameOrYearChanging) {
        const duplicate = await tx.term.findUnique({
          where: {
            academicYearId_name: {
              academicYearId: nextAcademicYearId,
              name: nextName,
            },
          },
          select: { id: true },
        })
        if (duplicate && duplicate.id !== id) {
          throw ApiError.conflict(
            `A term named "${nextName}" already exists for this academic year`
          )
        }
      }

      // If we're activating a term, deactivate the currently active one in
      // the same academic year. This is the same rule as `setActive`, applied
      // via the update path.
      if (changes.status === 'Active') {
        await tx.term.updateMany({
          where: {
            academicYearId: nextAcademicYearId,
            status: 'Active',
            id: { not: id },
          },
          data: { status: 'Completed' },
        })
      }

      return tx.term.update({
        where: { id },
        data: changes,
        include: termInclude,
      })
    })
  },

  /**
   * Marks a term as Active and the year's previously-active term (if any)
   * as Completed. The two writes are atomic; without serializable isolation
   * two concurrent calls could both succeed and leave the year with two
   * active terms.
   */
  async setActive(id: string) {
    return runSerializable(async (tx) => {
      const term = await tx.term.findUnique({
        where: { id },
        select: { id: true, academicYearId: true, status: true },
      })
      if (!term) throw ApiError.notFound('Term not found')

      // Idempotent — setting an already-active term as active is a no-op
      // rather than an error. A client retrying a failed request shouldn't
      // see a spurious conflict.
      if (term.status === 'Active') {
        return tx.term.findUniqueOrThrow({
          where: { id },
          include: termInclude,
        })
      }

      await tx.term.updateMany({
        where: {
          academicYearId: term.academicYearId,
          status: 'Active',
          id: { not: id },
        },
        data: { status: 'Completed' },
      })

      return tx.term.update({
        where: { id },
        data: { status: 'Active' },
        include: termInclude,
      })
    })
  },

  /**
   * Deletes a term. Two guards:
   *
   *   1. Refuses if the term is currently Active — deleting the active term
   *      leaves its academic year in a state with no active term, which the
   *      rest of the app assumes can't happen.
   *
   *   2. Refuses if any exam still references it. The previous version
   *      trusted the denormalized `examCount` column, which a client could
   *      have set to 0 via PATCH. This queries the actual Exam table.
   *
   * NOTE — the exam-reference guard is currently disabled because the exams
   * module is a stub with no Prisma model yet (see src/modules/exams). Once
   * an `Exam` model with a `termId` FK is added to prisma/schema.prisma,
   * uncomment the block below. Until then, terms with no database-level
   * exam references can be deleted freely — which is correct, since there
   * is nowhere for an exam reference to exist.
   */
  async remove(id: string) {
    const term = await prisma.term.findUnique({
      where: { id },
      select: { id: true, name: true, status: true },
    })
    if (!term) throw ApiError.notFound('Term not found')

    if (term.status === 'Active') {
      throw ApiError.conflict(
        'Cannot delete the active term. Set a different term as active first.'
      )
    }

    // TODO: re-enable once the Exam model exists.
    //
    // const examCount = await prisma.exam.count({ where: { termId: id } })
    // if (examCount > 0) {
    //   throw ApiError.conflict(
    //     `Cannot delete "${term.name}": ${examCount} exam(s) still reference it. ` +
    //       'Delete or reassign the exams first.'
    //   )
    // }

    await prisma.term.delete({ where: { id } })
  },
}