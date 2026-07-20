import { prisma } from '@/config/database'
import { createCrudRouter } from '@/utils/createCrudRouter'
import { createLessonSchema, updateLessonSchema } from './lessons.validation'

export default createCrudRouter({
  model: prisma.lesson,
  createSchema: createLessonSchema,
  updateSchema: updateLessonSchema,
  permissionModule: 'lessons',
  include: { subject: true },
})
