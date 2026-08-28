import { Router } from 'express'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess, sendCreated, sendNoContent } from '@/utils/apiResponse'

const router = Router()
router.use(authenticate)

let categories = [
  { id: 'cat-1', name: 'Classroom & Stationery', code: 'CAT-STAT', count: 18, totalItems: 1450, description: 'Notebooks, markers, chalks, whiteboards, and desk organizers' },
  { id: 'cat-2', name: 'Science Laboratory Equipment', code: 'CAT-SCI', count: 12, totalItems: 320, description: 'Microscopes, test tubes, beakers, bunsen burners, and chemicals' },
  { id: 'cat-3', name: 'Sports & Physical Education', code: 'CAT-SPT', count: 15, totalItems: 480, description: 'Footballs, basketballs, track gear, cones, and jerseys' },
  { id: 'cat-4', name: 'IT Hardware & Audio Visual', code: 'CAT-IT', count: 24, totalItems: 210, description: 'Projectors, monitors, keyboards, cables, and document cameras' },
]

let items = [
  { id: 'ITM-001', name: 'Dry Erase Whiteboard Markers (Set of 12)', code: 'STA-MRK-12', category: 'Classroom & Stationery', quantity: 85, minQuantity: 20, unit: 'Sets', unitPrice: 8.50, supplier: 'Apex Educational Supplies', location: 'Stationery Depot (Cabinet B-1)', status: 'IN_STOCK' },
  { id: 'ITM-002', name: 'Digital Compound Microscope 1000x', code: 'LAB-MIC-01', category: 'Science Laboratory Equipment', quantity: 18, minQuantity: 5, unit: 'Units', unitPrice: 220.00, supplier: 'Nova BioTech Instruments', location: 'Science Lab Annex (Shelf 3)', status: 'IN_STOCK' },
  { id: 'ITM-003', name: 'Wilson NCAA Official Match Football', code: 'SPT-FTB-04', category: 'Sports & Physical Education', quantity: 6, minQuantity: 10, unit: 'Balls', unitPrice: 35.00, supplier: 'Champion Athletics Co.', location: 'Sports Storage (Rack A)', status: 'LOW_STOCK' },
  { id: 'ITM-004', name: 'HDMI to USB-C Presentation Dongle', code: 'IT-CAB-09', category: 'IT Hardware & Audio Visual', quantity: 32, minQuantity: 10, unit: 'Pieces', unitPrice: 16.00, supplier: 'TechCore Solutions', location: 'IT Helpdesk Locker', status: 'IN_STOCK' },
]

let issuances = [
  { id: 'ISS-001', itemId: 'ITM-001', itemName: 'Dry Erase Whiteboard Markers (Set of 12)', quantity: 3, issuedToId: 'tch-1', issuedToName: 'Sarah Jenkins', issuedToRole: 'TEACHER', department: 'Mathematics', issueDate: '2026-08-20', returnDueDate: '2026-12-15', status: 'ISSUED', notes: 'For Room 101 Class whiteboard' },
  { id: 'ISS-002', itemId: 'ITM-002', itemName: 'Digital Compound Microscope 1000x', quantity: 2, issuedToId: 'tch-2', issuedToName: 'Michael Chang', issuedToRole: 'TEACHER', department: 'Science', issueDate: '2026-08-22', returnDueDate: '2026-08-29', status: 'ISSUED', notes: 'For Advanced Biology Practical Lab' },
]

let suppliers = [
  { id: 'SUP-01', name: 'Apex Educational Supplies', contactPerson: 'David Miller', email: 'sales@apexedu.com', phone: '+1 (555) 123-4567', category: 'Classroom & Stationery', address: '124 Commerce Way, Syracuse, NY', rating: 4.8, activeOrders: 2 },
  { id: 'SUP-02', name: 'Nova BioTech Instruments', contactPerson: 'Dr. Elena Rostova', email: 'support@novabiotech.io', phone: '+1 (555) 876-5432', category: 'Science Laboratory Equipment', address: '88 Innovation Parkway, Cambridge, MA', rating: 4.9, activeOrders: 1 },
]

/**
 * 1. Item Categories
 */
router.get('/categories', requirePermission('inventory', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, categories)
}))

router.post('/categories', requirePermission('inventory', 'create'), asyncHandler(async (req, res) => {
  const newCat = {
    id: `cat-${Date.now()}`,
    name: req.body.name || 'New Category',
    code: req.body.code || `CAT-${Math.floor(100 + Math.random() * 900)}`,
    count: 0,
    totalItems: 0,
    description: req.body.description || '',
  }
  categories.push(newCat)
  sendCreated(res, newCat)
}))

/**
 * 2. Inventory Items
 */
router.get('/items', requirePermission('inventory', 'view'), asyncHandler(async (req, res) => {
  const { category, search } = req.query
  let result = items
  if (category && category !== 'All') {
    result = result.filter((i) => i.category === category)
  }
  if (search) {
    const s = String(search).toLowerCase()
    result = result.filter((i) => i.name.toLowerCase().includes(s) || i.code.toLowerCase().includes(s) || i.supplier.toLowerCase().includes(s))
  }
  sendSuccess(res, result)
}))

router.post('/items', requirePermission('inventory', 'create'), asyncHandler(async (req, res) => {
  const newItem = {
    id: `ITM-${String(items.length + 1).padStart(3, '0')}`,
    name: req.body.name || 'New Item',
    code: req.body.code || `ITM-${Math.floor(1000 + Math.random() * 9000)}`,
    category: req.body.category || 'Classroom & Stationery',
    quantity: Number(req.body.quantity) || 0,
    minQuantity: Number(req.body.minQuantity) || 5,
    unit: req.body.unit || 'Units',
    unitPrice: Number(req.body.unitPrice) || 0,
    supplier: req.body.supplier || 'Standard Supplier',
    location: req.body.location || 'General Storage',
    status: (Number(req.body.quantity) || 0) <= (Number(req.body.minQuantity) || 5) ? 'LOW_STOCK' : 'IN_STOCK',
  }
  items.unshift(newItem)
  sendCreated(res, newItem)
}))

router.put('/items/:id', requirePermission('inventory', 'edit'), asyncHandler(async (req, res) => {
  const index = items.findIndex((i) => i.id === req.params.id)
  if (index === -1) return res.status(404).json({ success: false, message: 'Item not found' })
  items[index] = { ...items[index], ...req.body }
  sendSuccess(res, items[index])
}))

router.delete('/items/:id', requirePermission('inventory', 'delete'), asyncHandler(async (req, res) => {
  items = items.filter((i) => i.id !== req.params.id)
  sendNoContent(res)
}))

/**
 * 3. Issuance & Distribution
 */
router.get('/issuance', requirePermission('inventory', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, issuances)
}))

router.post('/issuance', requirePermission('inventory', 'create'), asyncHandler(async (req, res) => {
  const item = items.find((i) => i.id === req.body.itemId)
  const qty = Number(req.body.quantity) || 1

  if (item && item.quantity >= qty) {
    item.quantity -= qty
    if (item.quantity <= item.minQuantity) {
      item.status = item.quantity === 0 ? 'OUT_OF_STOCK' : 'LOW_STOCK'
    }
  }

  const record = {
    id: `ISS-${String(issuances.length + 1).padStart(3, '0')}`,
    itemId: req.body.itemId,
    itemName: item?.name || req.body.itemName || 'Inventory Item',
    quantity: qty,
    issuedToId: req.body.issuedToId || 'usr-1',
    issuedToName: req.body.issuedToName || 'Staff Member',
    issuedToRole: req.body.issuedToRole || 'TEACHER',
    department: req.body.department || 'General',
    issueDate: new Date().toISOString().split('T')[0],
    returnDueDate: req.body.returnDueDate || '2026-12-31',
    status: 'ISSUED',
    notes: req.body.notes || '',
  }
  issuances.unshift(record)
  sendCreated(res, record)
}))

router.patch('/issuance/:id/return', requirePermission('inventory', 'edit'), asyncHandler(async (req, res) => {
  const issuance = issuances.find((i) => i.id === req.params.id)
  if (!issuance) return res.status(404).json({ success: false, message: 'Issuance record not found' })

  issuance.status = 'RETURNED'
  const item = items.find((i) => i.id === issuance.itemId)
  if (item) {
    item.quantity += issuance.quantity
    if (item.quantity > item.minQuantity) {
      item.status = 'IN_STOCK'
    }
  }

  sendSuccess(res, issuance)
}))

/**
 * 4. Suppliers
 */
router.get('/suppliers', requirePermission('inventory', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, suppliers)
}))

router.post('/suppliers', requirePermission('inventory', 'create'), asyncHandler(async (req, res) => {
  const newSup = {
    id: `SUP-${String(suppliers.length + 1).padStart(2, '0')}`,
    name: req.body.name || 'New Supplier',
    contactPerson: req.body.contactPerson || '',
    email: req.body.email || '',
    phone: req.body.phone || '',
    category: req.body.category || 'General',
    address: req.body.address || '',
    rating: 5.0,
    activeOrders: 0,
  }
  suppliers.push(newSup)
  sendCreated(res, newSup)
}))

/**
 * 5. Stats
 */
router.get('/stats', requirePermission('inventory', 'view'), asyncHandler(async (_req, res) => {
  const totalItemsCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalValue = items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0)
  const lowStockCount = items.filter((i) => i.status === 'LOW_STOCK' || i.status === 'OUT_OF_STOCK').length

  sendSuccess(res, {
    totalSKUs: items.length,
    totalItemsCount,
    totalValue,
    lowStockCount,
    activeIssuances: issuances.filter((i) => i.status === 'ISSUED').length,
    suppliersCount: suppliers.length,
  })
}))

export default router
