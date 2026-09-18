import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'

export const subjectsService = {
  async list(filters: { department?: string; category?: string; search?: string } = {}) {
    const search = filters.search?.trim()
    const subjects = await prisma.subject.findMany({
      where: {
        deletedAt: null,
        ...(filters.department ? { department: filters.department } : {}),
        ...(filters.category ? { category: filters.category } : {}),
        ...(search ? { OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ] } : {}),
      },
      orderBy: { name: 'asc' },
    })
    return subjects.map(toSubjectItem)
  },

  async getById(id: string) {
    const subject = await prisma.subject.findFirst({ where: { id, deletedAt: null } })
    if (!subject) throw ApiError.notFound('Subject not found')
    return toSubjectItem(subject)
  },

  async create(input: {
    name: string
    code: string
    department: string
    category: string
    description?: string
    credits: number
    weeklyHours: number
    gradeLevel: string
    teachers: string[]
  }) {
    const [existingCode, existingName] = await Promise.all([
      prisma.subject.findFirst({ where: { code: input.code, deletedAt: null } }),
      prisma.subject.findFirst({ where: { name: input.name, deletedAt: null } }),
    ])
    if (existingCode) throw ApiError.conflict(`Subject code "${input.code}" already exists`)
    if (existingName) throw ApiError.conflict(`Subject name "${input.name}" already exists`)

    const { teachers, ...subjectData } = input
    return toSubjectItem(await prisma.subject.create({ data: { ...subjectData, teacherNames: teachers } }))
  },

  async update(
    id: string,
    input: Partial<{
      name: string
      code: string
      department: string
      category: string
      description: string
      credits: number
      weeklyHours: number
      gradeLevel: string
      teachers: string[]
    }>
  ) {
    await subjectsService.getById(id) // 404s if missing

    const [existingCode, existingName] = await Promise.all([
      input.code ? prisma.subject.findFirst({ where: { code: input.code, deletedAt: null } }) : null,
      input.name ? prisma.subject.findFirst({ where: { name: input.name, deletedAt: null } }) : null,
    ])
    if (existingCode && existingCode.id !== id) throw ApiError.conflict(`Subject code "${input.code}" already exists`)
    if (existingName && existingName.id !== id) throw ApiError.conflict(`Subject name "${input.name}" already exists`)

    const { teachers, ...subjectData } = input
    return toSubjectItem(await prisma.subject.update({ where: { id }, data: { ...subjectData, ...(teachers ? { teacherNames: teachers } : {}) } }))
  },

  async remove(id: string) {
    await subjectsService.getById(id) // 404s if missing

    await prisma.subject.update({ where: { id }, data: { deletedAt: new Date() } })
  },
}

function toSubjectItem(subject: any) {
  const teacherNames = Array.isArray(subject.teacherNames) ? subject.teacherNames : []
  return {
    ...subject,
    teachers: teacherNames.map((name: string, index: number) => ({ id: `name-${index}-${name}`, name, label: name.slice(0, 2).toUpperCase(), color: 'brand' })),
  }
}