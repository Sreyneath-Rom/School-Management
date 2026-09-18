import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type { Prisma } from '@/generated/prisma/client'
import type {
  CreateSchoolBody,
  UpdateSchoolBody,
} from './school.validation'

type Tx = Omit<
  Prisma.TransactionClient,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>

const RETRY_LIMIT = 3
const RETRY_BASE_MS = 25

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

/**
 * The `upsert` route accepts the update shape (all fields optional) but
 * must produce a valid row on the create branch, which requires `name` and
 * `academicYear`. This helper narrows the input at runtime with a clear 400
 * — the alternative (accept the wider type and let Prisma fail) surfaces as
 * a generic error with no actionable message.
 */
function requireCreateFields(
  input: UpdateSchoolBody
): asserts input is UpdateSchoolBody & { name: string; academicYear: string } {
  if (!input.name) {
    throw ApiError.badRequest(
      'name is required when setting up the school for the first time'
    )
  }
  if (!input.academicYear) {
    throw ApiError.badRequest(
      'academicYear is required when setting up the school for the first time'
    )
  }
}

export const schoolService = {
  async get() {
    const school = await prisma.school.findFirst()
    if (!school) throw ApiError.notFound('School not configured')
    return school
  },

  async create(input: CreateSchoolBody) {
    return runSerializable(async (tx) => {
      const existing = await tx.school.findFirst({ select: { id: true } })
      if (existing) {
        throw ApiError.conflict(
          'School is already configured. Use PATCH /school to update it.'
        )
      }
      return tx.school.create({ data: input })
    })
  },

  async update(input: UpdateSchoolBody) {
    const existing = await prisma.school.findFirst({ select: { id: true } })
    if (!existing) {
      throw ApiError.notFound(
        'School is not configured yet. Use PATCH /school/setup to create it.'
      )
    }
    return prisma.school.update({ where: { id: existing.id }, data: input })
  },

  async upsert(input: UpdateSchoolBody) {
    return runSerializable(async (tx) => {
      const existing = await tx.school.findFirst({ select: { id: true } })

      if (existing) {
        return tx.school.update({ where: { id: existing.id }, data: input })
      }

      // Create branch — narrow the input so Prisma sees the required fields.
      // The runtime assert above raises a 400 (not a type error) when the
      // caller tried to create without them.
      requireCreateFields(input)
      return tx.school.create({
        data: {
          name: input.name,
          academicYear: input.academicYear,
          ...(input.logoUrl !== undefined ? { logoUrl: input.logoUrl } : {}),
          ...(input.address !== undefined ? { address: input.address } : {}),
          ...(input.phone !== undefined ? { phone: input.phone } : {}),
          ...(input.email !== undefined ? { email: input.email } : {}),
          ...(input.settings !== undefined ? { settings: input.settings } : {}),
        },
      })
    })
  },

  async remove() {
    const existing = await prisma.school.findFirst({ select: { id: true } })
    if (!existing) throw ApiError.notFound('School not configured')
    await prisma.school.delete({ where: { id: existing.id } })
  },

  async updateLogo(logoUrl: string) {
    const existing = await prisma.school.findFirst({ select: { id: true } })
    if (!existing) {
      throw ApiError.notFound('Configure the school before uploading a logo')
    }
    return prisma.school.update({
      where: { id: existing.id },
      data: { logoUrl },
    })
  },

  async removeLogo() {
    const existing = await prisma.school.findFirst({ select: { id: true } })
    if (!existing) throw ApiError.notFound('School not configured')
    return prisma.school.update({
      where: { id: existing.id },
      data: { logoUrl: null },
    })
  },
}