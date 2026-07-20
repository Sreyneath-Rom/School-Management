import { prisma } from '@/config/database'
import { createCrudRouter } from '@/utils/createCrudRouter'
import { createAnnouncementSchema, updateAnnouncementSchema } from './announcements.validation'

export default createCrudRouter({
  model: prisma.announcement,
  createSchema: createAnnouncementSchema,
  updateSchema: updateAnnouncementSchema,
  permissionModule: 'announcements',
})
