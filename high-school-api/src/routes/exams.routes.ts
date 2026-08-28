import { Router } from 'express'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess, sendCreated, sendNoContent } from '@/utils/apiResponse'

const router = Router()
router.use(authenticate)

let exams = [
  { id: 'EXM-001', title: 'Fall Midterm Examination 2026', academicYear: '2026-2027', term: 'Term 1', startDate: '2026-10-12', endDate: '2026-10-23', status: 'UPCOMING', totalSubjects: 8, classesCovered: ['Grade 10 - A', 'Grade 10 - B', 'Grade 11 - A', 'Grade 12 - A'] },
  { id: 'EXM-002', title: 'First Term Diagnostic Assessment', academicYear: '2026-2027', term: 'Term 1', startDate: '2026-09-05', endDate: '2026-09-09', status: 'ACTIVE', totalSubjects: 6, classesCovered: ['Grade 10 - A', 'Grade 10 - B'] },
  { id: 'EXM-003', title: 'Summer Final Semester Assessment 2026', academicYear: '2025-2026', term: 'Term 3', startDate: '2026-06-10', endDate: '2026-06-25', status: 'COMPLETED', totalSubjects: 10, classesCovered: ['Grade 10 - A', 'Grade 11 - A', 'Grade 12 - A'] },
]

let examSchedules = [
  { id: 'SCH-01', examId: 'EXM-001', subject: 'Advanced Mathematics', date: '2026-10-12', timeSlot: '09:00 AM - 11:30 AM', room: 'Hall A (Auditorium)', totalStudents: 95, supervisor: 'Sarah Jenkins', maxMarks: 100, passingMarks: 50 },
  { id: 'SCH-02', examId: 'EXM-001', subject: 'Physics & Thermodynamics', date: '2026-10-14', timeSlot: '09:00 AM - 11:00 AM', room: 'Science Annex 102', totalStudents: 78, supervisor: 'Michael Chang', maxMarks: 100, passingMarks: 50 },
  { id: 'SCH-03', examId: 'EXM-001', subject: 'World Literature & Essay', date: '2026-10-16', timeSlot: '01:00 PM - 03:00 PM', room: 'Room 204', totalStudents: 90, supervisor: 'Emily Rodriguez', maxMarks: 100, passingMarks: 45 },
]

let markEntries = [
  { id: 'MK-101', examId: 'EXM-001', subject: 'Advanced Mathematics', studentId: 'std-101', studentName: 'Alexander Vance', rollNumber: 'G10-001', marksObtained: 94, maxMarks: 100, grade: 'A+', remarks: 'Outstanding problem-solving skills' },
  { id: 'MK-102', examId: 'EXM-001', subject: 'Advanced Mathematics', studentId: 'std-102', studentName: 'Sophia Lin', rollNumber: 'G10-002', marksObtained: 88, maxMarks: 100, grade: 'A', remarks: 'Strong analytical performance' },
  { id: 'MK-103', examId: 'EXM-001', subject: 'Advanced Mathematics', studentId: 'std-103', studentName: 'Marcus Reynolds', rollNumber: 'G10-003', marksObtained: 72, maxMarks: 100, grade: 'B', remarks: 'Good grasp on core concepts' },
]

let reportCards = [
  {
    id: 'RC-2026-001',
    studentId: 'std-101',
    studentName: 'Alexander Vance',
    class: 'Grade 10 - A',
    academicYear: '2026-2027',
    term: 'Fall Term 1',
    overallGpa: 3.92,
    rank: 1,
    attendanceRate: 98,
    subjects: [
      { subject: 'Advanced Mathematics', score: 94, grade: 'A+', credits: 4, remarks: 'Excellent' },
      { subject: 'Physics', score: 91, grade: 'A', credits: 4, remarks: 'Very Good' },
      { subject: 'English Literature', score: 89, grade: 'A', credits: 3, remarks: 'Well Written' },
      { subject: 'World History', score: 95, grade: 'A+', credits: 3, remarks: 'Outstanding' },
    ],
    conduct: 'Exemplary',
    issueDate: '2026-10-30',
  },
]

/**
 * 1. Exams Management
 */
router.get('/', requirePermission('grades', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, exams)
}))

router.post('/', requirePermission('grades', 'create'), asyncHandler(async (req, res) => {
  const newExam = {
    id: `EXM-${String(exams.length + 1).padStart(3, '0')}`,
    title: req.body.title || 'Untitled Exam',
    academicYear: req.body.academicYear || '2026-2027',
    term: req.body.term || 'Term 1',
    startDate: req.body.startDate || new Date().toISOString().split('T')[0],
    endDate: req.body.endDate || new Date().toISOString().split('T')[0],
    status: 'UPCOMING',
    totalSubjects: Number(req.body.totalSubjects) || 1,
    classesCovered: req.body.classesCovered || [],
  }
  exams.unshift(newExam)
  sendCreated(res, newExam)
}))

router.get('/:id', requirePermission('grades', 'view'), asyncHandler(async (req, res) => {
  const exam = exams.find((e) => e.id === req.params.id)
  if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' })
  sendSuccess(res, exam)
}))

router.put('/:id', requirePermission('grades', 'edit'), asyncHandler(async (req, res) => {
  const index = exams.findIndex((e) => e.id === req.params.id)
  if (index === -1) return res.status(404).json({ success: false, message: 'Exam not found' })
  exams[index] = { ...exams[index], ...req.body }
  sendSuccess(res, exams[index])
}))

router.delete('/:id', requirePermission('grades', 'delete'), asyncHandler(async (req, res) => {
  exams = exams.filter((e) => e.id !== req.params.id)
  sendNoContent(res)
}))

/**
 * 2. Exam Schedules
 */
router.get('/schedules/all', requirePermission('grades', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, examSchedules)
}))

router.post('/schedules', requirePermission('grades', 'create'), asyncHandler(async (req, res) => {
  const schedule = {
    id: `SCH-${String(examSchedules.length + 1).padStart(2, '0')}`,
    examId: req.body.examId,
    subject: req.body.subject || 'Subject',
    date: req.body.date || new Date().toISOString().split('T')[0],
    timeSlot: req.body.timeSlot || '09:00 AM - 11:00 AM',
    room: req.body.room || 'Main Hall',
    totalStudents: Number(req.body.totalStudents) || 30,
    supervisor: req.body.supervisor || 'Staff',
    maxMarks: Number(req.body.maxMarks) || 100,
    passingMarks: Number(req.body.passingMarks) || 50,
  }
  examSchedules.push(schedule)
  sendCreated(res, schedule)
}))

/**
 * 3. Mark Entry
 */
router.get('/marks/entries', requirePermission('grades', 'view'), asyncHandler(async (req, res) => {
  const { examId, subject } = req.query
  let list = markEntries
  if (examId) list = list.filter((m) => m.examId === examId)
  if (subject) list = list.filter((m) => m.subject === subject)
  sendSuccess(res, list)
}))

router.post('/marks/batch', requirePermission('grades', 'create'), asyncHandler(async (req, res) => {
  const entries = req.body.marks || []
  entries.forEach((item: any) => {
    const idx = markEntries.findIndex((m) => m.studentId === item.studentId && m.examId === item.examId && m.subject === item.subject)
    if (idx !== -1) {
      markEntries[idx] = { ...markEntries[idx], ...item }
    } else {
      markEntries.push({ id: `MK-${Date.now()}-${Math.random()}`, ...item })
    }
  })
  sendSuccess(res, { updated: entries.length })
}))

/**
 * 4. Report Cards
 */
router.get('/report-cards/all', requirePermission('grades', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, reportCards)
}))

router.post('/report-cards/generate', requirePermission('grades', 'create'), asyncHandler(async (req, res) => {
  const card = {
    id: `RC-2026-${String(reportCards.length + 1).padStart(3, '0')}`,
    studentId: req.body.studentId || 'std-101',
    studentName: req.body.studentName || 'Student Name',
    class: req.body.class || 'Grade 10 - A',
    academicYear: req.body.academicYear || '2026-2027',
    term: req.body.term || 'Term 1',
    overallGpa: Number(req.body.overallGpa) || 3.8,
    rank: Number(req.body.rank) || 1,
    attendanceRate: Number(req.body.attendanceRate) || 95,
    subjects: req.body.subjects || [],
    conduct: req.body.conduct || 'Good',
    issueDate: new Date().toISOString().split('T')[0],
  }
  reportCards.unshift(card)
  sendCreated(res, card)
}))

export default router
