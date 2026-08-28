import { Router } from 'express'
import { authenticate } from '@/middleware/auth.middleware'
import { requirePermission } from '@/middleware/role.middleware'
import { asyncHandler } from '@/utils/asyncHandler'
import { sendSuccess, sendCreated, sendNoContent } from '@/utils/apiResponse'

const router = Router()
router.use(authenticate)

let categories = [
  { id: 'cat-1', name: 'Science & Physics', code: 'SCI-PHY', count: 142, description: 'Textbooks, lab manuals, and scientific journals' },
  { id: 'cat-2', name: 'Mathematics & Calculus', code: 'MATH-CALC', count: 98, description: 'Algebra, geometry, statistics, and competition math' },
  { id: 'cat-3', name: 'World Literature & Fiction', code: 'LIT-WLD', count: 215, description: 'Classic novels, modern anthologies, and poetry' },
  { id: 'cat-4', name: 'World History & Civics', code: 'HIST-CIV', count: 85, description: 'Historical timelines, geography, and constitutional law' },
  { id: 'cat-5', name: 'Computer Science & AI', code: 'CS-TECH', count: 74, description: 'Programming, data structures, algorithms, and web development' },
]

let books = [
  { id: 'bk-1', title: 'University Physics with Modern Physics', author: 'Young & Freedman', isbn: '978-0135159552', category: 'Science & Physics', totalCopies: 15, availableCopies: 9, rackLocation: 'A-102', publisher: 'Pearson', publicationYear: 2022 },
  { id: 'bk-2', title: 'Calculus: Early Transcendentals', author: 'James Stewart', isbn: '978-1305272378', category: 'Mathematics & Calculus', totalCopies: 20, availableCopies: 14, rackLocation: 'B-201', publisher: 'Cengage', publicationYear: 2020 },
  { id: 'bk-3', title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '978-0061120084', category: 'World Literature & Fiction', totalCopies: 30, availableCopies: 22, rackLocation: 'C-305', publisher: 'HarperCollins', publicationYear: 2015 },
  { id: 'bk-4', title: 'Introduction to Algorithms (4th Edition)', author: 'Cormen, Leiserson, Rivest, Stein', isbn: '978-0262046305', category: 'Computer Science & AI', totalCopies: 10, availableCopies: 3, rackLocation: 'D-401', publisher: 'MIT Press', publicationYear: 2022 },
]

let borrowings = [
  { id: 'BRW-101', bookId: 'bk-1', bookTitle: 'University Physics with Modern Physics', borrowerId: 'std-1', borrowerName: 'Alexander Vance', borrowerRole: 'STUDENT', issueDate: '2026-08-10', dueDate: '2026-08-24', returnDate: null, status: 'OVERDUE', fineAmount: 4.50 },
  { id: 'BRW-102', bookId: 'bk-4', bookTitle: 'Introduction to Algorithms (4th Edition)', borrowerId: 'std-2', borrowerName: 'Sophia Lin', borrowerRole: 'STUDENT', issueDate: '2026-08-18', dueDate: '2026-09-01', returnDate: null, status: 'BORROWED', fineAmount: 0 },
  { id: 'BRW-103', bookId: 'bk-3', bookTitle: 'To Kill a Mockingbird', borrowerId: 'tch-1', borrowerName: 'Sarah Jenkins', borrowerRole: 'TEACHER', issueDate: '2026-08-12', dueDate: '2026-08-26', returnDate: '2026-08-25', status: 'RETURNED', fineAmount: 0 },
]

/**
 * 1. Book Catalog Routes
 */
router.get('/books', requirePermission('library', 'view'), asyncHandler(async (req, res) => {
  const { category, search } = req.query
  let result = books
  if (category && category !== 'All') {
    result = result.filter((b) => b.category === category)
  }
  if (search) {
    const s = String(search).toLowerCase()
    result = result.filter((b) => b.title.toLowerCase().includes(s) || b.author.toLowerCase().includes(s) || b.isbn.includes(s))
  }
  sendSuccess(res, result)
}))

router.post('/books', requirePermission('library', 'create'), asyncHandler(async (req, res) => {
  const newBook = {
    id: `bk-${Date.now()}`,
    title: req.body.title || 'Untitled Book',
    author: req.body.author || 'Unknown Author',
    isbn: req.body.isbn || `978-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    category: req.body.category || 'General',
    totalCopies: Number(req.body.totalCopies) || 1,
    availableCopies: Number(req.body.totalCopies) || 1,
    rackLocation: req.body.rackLocation || 'General Rack',
    publisher: req.body.publisher || 'School Press',
    publicationYear: Number(req.body.publicationYear) || new Date().getFullYear(),
  }
  books.unshift(newBook)
  sendCreated(res, newBook)
}))

router.get('/books/:id', requirePermission('library', 'view'), asyncHandler(async (req, res) => {
  const book = books.find((b) => b.id === req.params.id)
  if (!book) return res.status(404).json({ success: false, message: 'Book not found' })
  sendSuccess(res, book)
}))

router.put('/books/:id', requirePermission('library', 'edit'), asyncHandler(async (req, res) => {
  const index = books.findIndex((b) => b.id === req.params.id)
  if (index === -1) return res.status(404).json({ success: false, message: 'Book not found' })
  books[index] = { ...books[index], ...req.body }
  sendSuccess(res, books[index])
}))

router.delete('/books/:id', requirePermission('library', 'delete'), asyncHandler(async (req, res) => {
  books = books.filter((b) => b.id !== req.params.id)
  sendNoContent(res)
}))

/**
 * 2. Library Categories
 */
router.get('/categories', requirePermission('library', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, categories)
}))

router.post('/categories', requirePermission('library', 'create'), asyncHandler(async (req, res) => {
  const newCat = {
    id: `cat-${Date.now()}`,
    name: req.body.name || 'New Category',
    code: req.body.code || `CAT-${Math.floor(100 + Math.random() * 900)}`,
    count: 0,
    description: req.body.description || '',
  }
  categories.push(newCat)
  sendCreated(res, newCat)
}))

/**
 * 3. Borrowing & Circulation
 */
router.get('/borrow', requirePermission('library', 'view'), asyncHandler(async (_req, res) => {
  sendSuccess(res, borrowings)
}))

router.post('/borrow', requirePermission('library', 'create'), asyncHandler(async (req, res) => {
  const book = books.find((b) => b.id === req.body.bookId)
  if (book && book.availableCopies > 0) {
    book.availableCopies -= 1
  }

  const record = {
    id: `BRW-${Math.floor(100 + Math.random() * 900)}`,
    bookId: req.body.bookId,
    bookTitle: book?.title || req.body.bookTitle || 'Book Title',
    borrowerId: req.body.borrowerId || 'std-1',
    borrowerName: req.body.borrowerName || 'Borrower Name',
    borrowerRole: req.body.borrowerRole || 'STUDENT',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: req.body.dueDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    returnDate: null,
    status: 'BORROWED',
    fineAmount: 0,
  }
  borrowings.unshift(record)
  sendCreated(res, record)
}))

router.post('/return', requirePermission('library', 'edit'), asyncHandler(async (req, res) => {
  const borrowRecord = borrowings.find((b) => b.id === req.body.borrowId)
  if (!borrowRecord) return res.status(404).json({ success: false, message: 'Borrow record not found' })

  borrowRecord.returnDate = new Date().toISOString().split('T')[0]
  borrowRecord.status = 'RETURNED'
  borrowRecord.fineAmount = Number(req.body.fineAmount) || 0

  const book = books.find((b) => b.id === borrowRecord.bookId)
  if (book) {
    book.availableCopies = Math.min(book.totalCopies, book.availableCopies + 1)
  }

  sendSuccess(res, borrowRecord)
}))

router.get('/overdue', requirePermission('library', 'view'), asyncHandler(async (_req, res) => {
  const overdueList = borrowings.filter((b) => b.status === 'OVERDUE' || (!b.returnDate && new Date(b.dueDate) < new Date()))
  sendSuccess(res, overdueList)
}))

router.get('/stats', requirePermission('library', 'view'), asyncHandler(async (_req, res) => {
  const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0)
  const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0)
  const activeLoans = borrowings.filter((b) => b.status === 'BORROWED' || b.status === 'OVERDUE').length
  const overdueLoans = borrowings.filter((b) => b.status === 'OVERDUE').length

  sendSuccess(res, {
    totalTitles: books.length,
    totalBooks,
    availableBooks,
    activeLoans,
    overdueLoans,
    categoriesCount: categories.length,
  })
}))

export default router
