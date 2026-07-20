import { prisma } from '@/config/database'
import { createCrudRouter } from '@/utils/createCrudRouter'
import { createSubjectSchema, updateSubjectSchema } from './subjects.validation'

export default createCrudRouter({
  model: prisma.subject,
  createSchema: createSubjectSchema,
  updateSchema: updateSubjectSchema,
  permissionModule: 'subjects',
})
