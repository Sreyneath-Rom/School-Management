import { Router } from 'express'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess, sendCreated, sendNoContent } from '@/utils/apiResponse'

const router = Router()
router.use(authenticate)

let rooms = [
  { id: 'RM-A101', roomNumber: '101', block: 'Block A (Boys Dorm)', floor: '1st Floor', type: 'Triple Bed', capacity: 3, occupied: 3, costPerTerm: 1800, amenities: ['Attached Bath', 'Study Desk', 'Air Conditioning', 'WiFi'], status: 'OCCUPIED' },
  { id: 'RM-A102', roomNumber: '102', block: 'Block A (Boys Dorm)', floor: '1st Floor', type: 'Double Bed', capacity: 2, occupied: 1, costPerTerm: 2200, amenities: ['Attached Bath', 'Study Desk', 'Balcony', 'WiFi'], status: 'AVAILABLE' },
  { id: 'RM-B201', roomNumber: '201', block: 'Block B (Girls Dorm)', floor: '2nd Floor', type: 'Single Premium', capacity: 1, occupied: 1, costPerTerm: 3000, amenities: ['Private Bath', 'Executive Desk', 'Air Conditioning', 'WiFi', 'Mini Fridge'], status: 'OCCUPIED' },
  { id: 'RM-B202', roomNumber: '202', block: 'Block B (Girls Dorm)', floor: '2nd Floor', type: 'Triple Bed', capacity: 3, occupied: 2, costPerTerm: 1800, amenities: ['Attached Bath', 'Study Desk', 'WiFi'], status: 'AVAILABLE' },
]

let allocations = [
  { id: 'ALC-001', studentId: 'std-101', studentName: 'Alexander Vance', gender: 'Male', class: 'Grade 10 - A', block: 'Block A (Boys Dorm)', roomNumber: '101', bedNumber: 'Bed-01', checkInDate: '2026-08-15', guardianName: 'David Vance', emergencyContact: '+1 (555) 987-6543', status: 'ACTIVE' },
  { id: 'ALC-002', studentId: 'std-102', studentName: 'Sophia Lin', gender: 'Female', class: 'Grade 10 - B', block: 'Block B (Girls Dorm)', roomNumber: '201', bedNumber: 'Bed-01', checkInDate: '2026-08-14', guardianName: 'Helen Lin', emergencyContact: '+1 (555) 876-5432', status: 'ACTIVE' },
]

let hostelFees = [
  { id: 'HF-2026-01', studentId: 'std-101', studentName: 'Alexander Vance', roomNumber: '101', block: 'Block A', period: 'Term 1 (Fall 2026)', amount: 1800, paidAmount: 1800, balance: 0, status: 'PAID', dueDate: '2026-09-10' },
  { id: 'HF-2026-02', studentId: 'std-102', studentName: 'Sophia Lin', roomNumber: '201', block: 'Block B', period: 'Term 1 (Fall 2026)', amount: 3000, paidAmount: 1500, balance: 1500, status: 'PARTIAL', dueDate: '2026-09-10' },
]

/**
 * 1. Hostel Rooms
 */
router.get('/rooms', requirePermission('hostel', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, rooms)
}))

router.post('/rooms', requirePermission('hostel', 'create'), asyncHandler(async (req, res) => {
  const newRoom = {
    id: `RM-${req.body.roomNumber || Date.now()}`,
    roomNumber: req.body.roomNumber || '000',
    block: req.body.block || 'Block A',
    floor: req.body.floor || '1st Floor',
    type: req.body.type || 'Double Bed',
    capacity: Number(req.body.capacity) || 2,
    occupied: 0,
    costPerTerm: Number(req.body.costPerTerm) || 2000,
    amenities: req.body.amenities || ['WiFi', 'Study Desk'],
    status: 'AVAILABLE',
  }
  rooms.push(newRoom)
  sendCreated(res, newRoom)
}))

router.put('/rooms/:id', requirePermission('hostel', 'edit'), asyncHandler(async (req, res) => {
  const index = rooms.findIndex((r) => r.id === req.params.id)
  if (index === -1) return res.status(404).json({ success: false, message: 'Room not found' })
  rooms[index] = { ...rooms[index], ...req.body }
  sendSuccess(res, rooms[index])
}))

router.delete('/rooms/:id', requirePermission('hostel', 'delete'), asyncHandler(async (req, res) => {
  rooms = rooms.filter((r) => r.id !== req.params.id)
  sendNoContent(res)
}))

/**
 * 2. Room Allocations
 */
router.get('/allocations', requirePermission('hostel', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, allocations)
}))

router.post('/allocations', requirePermission('hostel', 'create'), asyncHandler(async (req, res) => {
  const newAllocation = {
    id: `ALC-${String(allocations.length + 1).padStart(3, '0')}`,
    studentId: req.body.studentId || 'std-1',
    studentName: req.body.studentName || 'Student Name',
    gender: req.body.gender || 'Other',
    class: req.body.class || 'Grade 10',
    block: req.body.block || 'Block A',
    roomNumber: req.body.roomNumber || '101',
    bedNumber: req.body.bedNumber || 'Bed-01',
    checkInDate: req.body.checkInDate || new Date().toISOString().split('T')[0],
    guardianName: req.body.guardianName || 'Guardian',
    emergencyContact: req.body.emergencyContact || '',
    status: 'ACTIVE',
  }
  allocations.push(newAllocation)
  sendCreated(res, newAllocation)
}))

router.delete('/allocations/:id', requirePermission('hostel', 'delete'), asyncHandler(async (req, res) => {
  allocations = allocations.filter((a) => a.id !== req.params.id)
  sendNoContent(res)
}))

/**
 * 3. Hostel Fees
 */
router.get('/fees', requirePermission('hostel', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, hostelFees)
}))

router.post('/fees', requirePermission('hostel', 'create'), asyncHandler(async (req, res) => {
  const newFee = {
    id: `HF-2026-${String(hostelFees.length + 1).padStart(2, '0')}`,
    studentId: req.body.studentId,
    studentName: req.body.studentName,
    roomNumber: req.body.roomNumber,
    block: req.body.block,
    period: req.body.period || 'Term 1 (Fall 2026)',
    amount: Number(req.body.amount) || 1800,
    paidAmount: Number(req.body.paidAmount) || 0,
    balance: (Number(req.body.amount) || 1800) - (Number(req.body.paidAmount) || 0),
    status: req.body.status || 'UNPAID',
    dueDate: req.body.dueDate || '2026-09-10',
  }
  hostelFees.push(newFee)
  sendCreated(res, newFee)
}))

/**
 * 4. Hostel Stats
 */
router.get('/stats', requirePermission('hostel', 'view'), asyncHandler(async (_req, res) => {
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0)
  const totalOccupied = rooms.reduce((sum, r) => sum + r.occupied, 0)
  const totalRooms = rooms.length
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0

  sendSuccess(res, {
    totalRooms,
    totalCapacity,
    totalOccupied,
    availableBeds: totalCapacity - totalOccupied,
    occupancyRate,
  })
}))

export default router
