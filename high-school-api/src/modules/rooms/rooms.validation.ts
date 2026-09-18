import { z } from 'zod'

const roomType = z.enum(['Classroom', 'Science Lab', 'Computer Lab', 'Auditorium', 'Library Wing'])
const roomStatus = z.enum(['Available', 'Occupied', 'Maintenance'])

const roomFields = z.object({
  name: z.string().trim().min(1).max(120),
  code: z.string().trim().min(1).max(40),
  building: z.string().trim().min(1).max(120),
  floor: z.string().trim().min(1).max(60),
  type: roomType,
  capacity: z.number().int().min(1).max(5000),
  amenities: z.array(z.string().trim().min(1).max(100)).max(50).default([]),
  status: roomStatus.default('Available'),
  currentClass: z.string().trim().max(120).optional().nullable(),
})

export const createRoomSchema = roomFields
export const updateRoomSchema = roomFields.partial().refine((data) => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
})
