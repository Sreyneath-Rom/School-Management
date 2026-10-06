import { prisma } from '@/config/database'
import { ApiError } from '@/utils/ApiError'
import type {
  CreateHomeworkBody,
  GradeHomeworkBody,
  ListHomeworkQuery,
  SubmitHomeworkBody,
  UpdateHomeworkBody,
} from './homework.validation'

const homeworkInclude = {
  subject: { select: { id: true, name: true, code: true } },
  teacher: {
    select: {
      id: true,
      teacherCode: true,
      user: { select: { id: true, firstName: true, lastName: true } },
    },
  },
  _count: { select: { submissions: true } },
} as const

async function assertSubjectExists(subjectId: string) {
  const subject = await prisma.subject.findUnique({
    where: { id: subjectId },
    select: { id: true },
  })
  if (!subject) throw ApiError.badRequest('subjectId does not refer to an existing subject')
}

export async function teacherIdForUser(userId: string): Promise<string> {
  const teacher = await prisma.teacher.findUnique({
    where: { userId },
    select: { id: true },
  })
  if (!teacher) throw ApiError.forbidden('Only teachers can perform this action')
  return teacher.id
}

export async function studentIdForUser(userId: string): Promise<string> {
  const student = await prisma.student.findUnique({
    where: { userId },
    select: { id: true, classId: true },
  })
  if (!student) throw ApiError.forbidden('Only students can submit homework')
  return student.id
}

export const homeworkService = {
  async list(filters: ListHomeworkQuery) {
    const where = {
      ...(filters.subjectId ? { subjectId: filters.subjectId } : {}),
      ...(filters.classId ? { classId: filters.classId } : {}),
      ...(filters.teacherId ? { teacherId: filters.teacherId } : {}),
      ...(filters.dueFrom || filters.dueTo
        ? {
            dueDate: {
              ...(filters.dueFrom ? { gte: filters.dueFrom } : {}),
              ...(filters.dueTo ? { lte: filters.dueTo } : {}),
            },
          }
        : {}),
    }

    const [items, total] = await Promise.all([
      prisma.homework.findMany({
        where,
        include: homeworkInclude,
        orderBy: { [filters.sortBy ?? 'dueDate']: filters.sortOrder },
        skip: (filters.page - 1) * filters.limit,
        take: filters.limit,
      }),
      prisma.homework.count({ where }),
    ])

    return { items, total, page: filters.page, limit: filters.limit }
  },

  async getById(
    homeworkId: string,
    viewer: { roleName: string; userId: string }
  ) {
    const homework = await prisma.homework.findUnique({
      where: { id: homeworkId },
      include: {
        ...homeworkInclude,
        submissions:
          viewer.roleName === 'student'
            ? {
                where: { student: { userId: viewer.userId } },
                include: {
                  student: {
                    select: {
                      id: true,
                      studentCode: true,
                      user: { select: { id: true, firstName: true, lastName: true } },
                    },
                  },
                },
              }
            : {
                include: {
                  student: {
                    select: {
                      id: true,
                      studentCode: true,
                      user: { select: { id: true, firstName: true, lastName: true } },
                    },
                  },
                },
              },
      },
    })

    if (!homework) throw ApiError.notFound('Homework not found')
    return homework
  },

  async create(input: CreateHomeworkBody & { teacherId: string }) {
    await assertSubjectExists(input.subjectId)
    const { teacherId, ...rest } = input
    return prisma.homework.create({
      data: { ...rest, teacherId },
      include: homeworkInclude,
    })
  },

  async update(homeworkId: string, changes: UpdateHomeworkBody) {
    const existing = await prisma.homework.findUnique({
      where: { id: homeworkId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Homework not found')

    if (changes.subjectId) {
      await assertSubjectExists(changes.subjectId)
    }

    return prisma.homework.update({
      where: { id: homeworkId },
      data: changes,
      include: homeworkInclude,
    })
  },

  async remove(homeworkId: string) {
    const existing = await prisma.homework.findUnique({
      where: { id: homeworkId },
      select: { id: true },
    })
    if (!existing) throw ApiError.notFound('Homework not found')

    await prisma.homework.delete({ where: { id: homeworkId } })
  },

  async submit(
    homeworkId: string,
    studentId: string,
    input: SubmitHomeworkBody
  ) {
    const homework = await prisma.homework.findUnique({
      where: { id: homeworkId },
      select: {
        id: true,
        dueDate: true,
        classId: true,
        allowLateSubmissions: true,
      },
    })
    if (!homework) throw ApiError.notFound('Homework not found')

    if (homework.classId) {
      const enrollment = await prisma.student.findFirst({
        where: { id: studentId, classId: homework.classId, deletedAt: null },
        select: { id: true },
      })
      if (!enrollment) {
        throw ApiError.forbidden(
          'You are not enrolled in the class this homework belongs to'
        )
      }
    }

    if (!homework.allowLateSubmissions && new Date() > homework.dueDate) {
      throw ApiError.badRequest('The submission deadline has passed')
    }

    const submittedAt = new Date()

    return prisma.homeworkSubmission.upsert({
      where: { homeworkId_studentId: { homeworkId, studentId } },
      create: {
        homeworkId,
        studentId,
        content: input.content,
        fileUrl: input.fileUrl,
        submittedAt,
      },
      update: {
        content: input.content,
        fileUrl: input.fileUrl,
        submittedAt,
        // Resubmission invalidates any prior grade — the new content wasn't
        // what the teacher graded.
        score: null,
        feedback: null,
        gradedAt: null,
      },
    })
  },

  async grade(
    submissionId: string,
    teacherId: string,
    input: GradeHomeworkBody,
    isAdmin: boolean = false
  ) {
    const submission = await prisma.homeworkSubmission.findUnique({
      where: { id: submissionId },
      include: {
        homework: { select: { id: true, teacherId: true, maxScore: true } },
      },
    })
    if (!submission) throw ApiError.notFound('Submission not found')

    if (!isAdmin && submission.homework.teacherId !== teacherId) {
      throw ApiError.forbidden('You can only grade submissions for your own homework')
    }

    if (input.score > submission.homework.maxScore) {
      throw ApiError.badRequest(
        `score cannot exceed the homework's maxScore (${submission.homework.maxScore})`
      )
    }

    return prisma.homeworkSubmission.update({
      where: { id: submissionId },
      data: {
        score: input.score,
        feedback: input.feedback,
        gradedAt: new Date(),
      },
    })
  },
}