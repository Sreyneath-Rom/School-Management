import { prisma } from '@/config/database'
import { createCrudRouter } from '@/utils/createCrudRouter'
import { createClassSchema, updateClassSchema } from './classes.validation'

export default createCrudRouter({
  model: prisma.class,
  createSchema: createClassSchema,
  updateSchema: updateClassSchema,
  permissionModule: 'classes',
  softDelete: true,
  include: { homeroomTeacher: { include: { user: { select: { firstName: true, lastName: true } } } } },
})
