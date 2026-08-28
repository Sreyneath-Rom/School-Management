import { Router } from 'express'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess, sendCreated, sendNoContent } from '@/utils/apiResponse'

const router = Router()
router.use(authenticate)

// In-memory or database persistent records for Finance Module
let feeStructures = [
  { id: 'fs-1', title: 'Grade 10 - Standard Tuition (Term 1)', code: 'TUT-G10-T1', amount: 1200, category: 'Tuition', frequency: 'Termly', gradeLevel: 'Grade 10', dueDate: '2026-09-15', isActive: true },
  { id: 'fs-2', title: 'Grade 11 - STEM & Lab Fee', code: 'LAB-STEM-G11', amount: 450, category: 'Laboratory', frequency: 'Annual', gradeLevel: 'Grade 11', dueDate: '2026-10-01', isActive: true },
  { id: 'fs-3', title: 'Annual Transport Subscription - Zone A', code: 'TRN-ZN-A', amount: 600, category: 'Transport', frequency: 'Annual', gradeLevel: 'All Grades', dueDate: '2026-09-20', isActive: true },
  { id: 'fs-4', title: 'Hostel Boarding & Meal Plan (Sem 1)', code: 'HST-SEM1', amount: 1800, category: 'Hostel', frequency: 'Semester', gradeLevel: 'All Grades', dueDate: '2026-09-10', isActive: true },
]

let invoices = [
  { id: 'INV-2026-001', studentId: 'std-101', studentName: 'Alexander Vance', class: 'Grade 10 - A', title: 'Term 1 Tuition & Lab Fees', totalAmount: 1650, paidAmount: 1650, balance: 0, status: 'PAID', dueDate: '2026-09-15', issueDate: '2026-08-15' },
  { id: 'INV-2026-002', studentId: 'std-102', studentName: 'Sophia Lin', class: 'Grade 10 - B', title: 'Term 1 Tuition Fee', totalAmount: 1200, paidAmount: 600, balance: 600, status: 'PARTIAL', dueDate: '2026-09-15', issueDate: '2026-08-15' },
  { id: 'INV-2026-003', studentId: 'std-103', studentName: 'Marcus Reynolds', class: 'Grade 11 - A', title: 'Annual STEM Lab & Tuition', totalAmount: 1650, paidAmount: 0, balance: 1650, status: 'UNPAID', dueDate: '2026-09-10', issueDate: '2026-08-10' },
  { id: 'INV-2026-004', studentId: 'std-104', studentName: 'Emma Watson', class: 'Grade 12 - A', title: 'Graduation & Exam Fee Package', totalAmount: 850, paidAmount: 850, balance: 0, status: 'PAID', dueDate: '2026-08-30', issueDate: '2026-08-01' },
]

let payments = [
  { id: 'PAY-8821', invoiceId: 'INV-2026-001', studentName: 'Alexander Vance', amount: 1650, method: 'BANK_TRANSFER', reference: 'TXN-998124', date: '2026-08-20', status: 'SUCCESS' },
  { id: 'PAY-8822', invoiceId: 'INV-2026-002', studentName: 'Sophia Lin', amount: 600, method: 'CREDIT_CARD', reference: 'STRIPE-CH-4412', date: '2026-08-22', status: 'SUCCESS' },
  { id: 'PAY-8823', invoiceId: 'INV-2026-004', studentName: 'Emma Watson', amount: 850, method: 'CASH', reference: 'RCP-11092', date: '2026-08-25', status: 'SUCCESS' },
]

/**
 * 1. Fee Structure Endpoints
 */
router.get('/structures', requirePermission('fees', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, feeStructures)
}))

router.post('/structures', requirePermission('fees', 'create'), asyncHandler(async (req, res) => {
  const newStructure = {
    id: `fs-${Date.now()}`,
    title: req.body.title || 'Untitled Fee',
    code: req.body.code || `FEE-${Math.floor(1000 + Math.random() * 9000)}`,
    amount: Number(req.body.amount) || 0,
    category: req.body.category || 'General',
    frequency: req.body.frequency || 'Termly',
    gradeLevel: req.body.gradeLevel || 'All Grades',
    dueDate: req.body.dueDate || new Date().toISOString().split('T')[0],
    isActive: req.body.isActive !== false,
  }
  feeStructures.unshift(newStructure)
  sendCreated(res, newStructure)
}))

router.put('/structures/:id', requirePermission('fees', 'edit'), asyncHandler(async (req, res) => {
  const index = feeStructures.findIndex((f) => f.id === req.params.id)
  if (index === -1) return res.status(404).json({ success: false, message: 'Fee structure not found' })
  feeStructures[index] = { ...feeStructures[index], ...req.body }
  sendSuccess(res, feeStructures[index])
}))

router.delete('/structures/:id', requirePermission('fees', 'delete'), asyncHandler(async (req, res) => {
  feeStructures = feeStructures.filter((f) => f.id !== req.params.id)
  sendNoContent(res)
}))

/**
 * 2. Invoices Endpoints
 */
router.get('/invoices', requirePermission('fees', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, invoices)
}))

router.post('/invoices', requirePermission('fees', 'create'), asyncHandler(async (req, res) => {
  const newInvoice = {
    id: `INV-2026-${String(invoices.length + 1).padStart(3, '0')}`,
    studentId: req.body.studentId || 'std-100',
    studentName: req.body.studentName || 'Student Name',
    class: req.body.class || 'General Class',
    title: req.body.title || 'Tuition Invoice',
    totalAmount: Number(req.body.totalAmount) || 1000,
    paidAmount: Number(req.body.paidAmount) || 0,
    balance: (Number(req.body.totalAmount) || 1000) - (Number(req.body.paidAmount) || 0),
    status: req.body.status || 'UNPAID',
    dueDate: req.body.dueDate || new Date().toISOString().split('T')[0],
    issueDate: new Date().toISOString().split('T')[0],
  }
  invoices.unshift(newInvoice)
  sendCreated(res, newInvoice)
}))

router.get('/invoices/:id', requirePermission('fees', 'view'), asyncHandler(async (req, res) => {
  const inv = invoices.find((i) => i.id === req.params.id)
  if (!inv) return res.status(404).json({ success: false, message: 'Invoice not found' })
  sendSuccess(res, inv)
}))

/**
 * 3. Payment Processing & History
 */
router.get('/payments', requirePermission('fees', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, payments)
}))

router.post('/payments', requirePermission('fees', 'create'), asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount) || 0
  const invoiceId = req.body.invoiceId

  const inv = invoices.find((i) => i.id === invoiceId)
  if (inv) {
    inv.paidAmount += amount
    inv.balance = Math.max(0, inv.totalAmount - inv.paidAmount)
    inv.status = inv.balance === 0 ? 'PAID' : 'PARTIAL'
  }

  const paymentRecord = {
    id: `PAY-${Math.floor(1000 + Math.random() * 9000)}`,
    invoiceId: invoiceId || 'INV-GENERAL',
    studentName: req.body.studentName || inv?.studentName || 'Student',
    amount,
    method: req.body.method || 'CASH',
    reference: req.body.reference || `REF-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    status: 'SUCCESS',
  }
  payments.unshift(paymentRecord)
  sendCreated(res, paymentRecord)
}))

/**
 * 4. Finance Statistics & Metrics
 */
router.get('/stats', requirePermission('fees', 'view'), asyncHandler(async (_req, res) => {
  const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0)
  const totalCollected = invoices.reduce((sum, i) => sum + i.paidAmount, 0)
  const outstanding = invoices.reduce((sum, i) => sum + i.balance, 0)
  const collectionRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 0

  sendSuccess(res, {
    totalBilled,
    totalCollected,
    outstanding,
    collectionRate,
    invoicesCount: invoices.length,
    paymentsCount: payments.length,
  })
}))

export default router
