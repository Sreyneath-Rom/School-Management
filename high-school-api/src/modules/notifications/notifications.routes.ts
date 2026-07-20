import { prisma } from '@/config/database'
import { createCrudRouter } from '@/utils/createCrudRouter'
import { createNotificationSchema, updateNotificationSchema } from './notifications.validation'

export default createCrudRouter({
  model: prisma.notification,
  createSchema: createNotificationSchema,
  updateSchema: updateNotificationSchema,
  permissionModule: 'notifications',
})
