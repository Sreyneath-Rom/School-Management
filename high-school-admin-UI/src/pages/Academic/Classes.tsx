// src/pages/Academic/Classes.tsx
import { useState, useMemo } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  School,
  Plus,
  Search,
  Users,
  User,
  DoorOpen,
  BookOpen,
  CalendarDays,
  ShieldCheck,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  Clock,
  GraduationCap,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { Link } from 'react-router-dom'

export interface ClassItem {
  id: string
  name: string
  gradeLevel: string
  section: string
  room: string
  classTeacher: string
  studentCount: number
  maxCapacity: number
  subjectsCount: number
  schedulePeriod: string
  academicYear?: string
  status?: 'Active' | 'Archived'
}

const INITIAL_CLASSES: ClassItem[] = [
  {
    id: 'cls-7a',
    name: 'Grade 7-A (អនុវិទ្យាល័យ)',
    gradeLevel: 'Grade 7',
    section: 'A',
    room: 'Room 101',
    classTeacher: 'Sokha Chea',
    studentCount: 35,
    maxCapacity: 40,
    subjectsCount: 7,
    schedulePeriod: '07:30 - 16:30',
    status: 'Active',
  },
  {
    id: 'cls-8a',
    name: 'Grade 8-A (អនុវិទ្យាល័យ)',
    gradeLevel: 'Grade 8',
    section: 'A',
    room: 'Room 102',
    classTeacher: 'Rithy Chan',
    studentCount: 34,
    maxCapacity: 40,
    subjectsCount: 7,
    schedulePeriod: '07:30 - 16:30',
    status: 'Active',
  },
  {
    id: 'cls-9a',
    name: 'Grade 9-A (ត្រៀមប្រឡងឌីប្លូម Dip. 9)',
    gradeLevel: 'Grade 9',
    section: 'A',
    room: 'Room 103',
    classTeacher: 'Vannak Yin',
    studentCount: 35,
    maxCapacity: 40,
    subjectsCount: 7,
    schedulePeriod: '07:30 - 16:30',
    status: 'Active',
  },
  {
    id: 'cls-10a',
    name: 'Grade 10-A (មូលដ្ឋានវិទ្យាល័យ)',
    gradeLevel: 'Grade 10',
    section: 'A',
    room: 'Room 201',
    classTeacher: 'Dr. John Whitfield',
    studentCount: 32,
    maxCapacity: 35,
    subjectsCount: 9,
    schedulePeriod: '07:30 - 16:30',
    status: 'Active',
  },
  {
    id: 'cls-11a',
    name: 'Grade 11-A (ថ្នាក់វិទ្យាសាស្ត្រ Science Track)',
    gradeLevel: 'Grade 11',
    section: 'A',
    room: 'Lab 201',
    classTeacher: 'Dr. Vicheth Keo',
    studentCount: 30,
    maxCapacity: 35,
    subjectsCount: 8,
    schedulePeriod: '07:30 - 16:30',
    status: 'Active',
  },
  {
    id: 'cls-11b',
    name: 'Grade 11-B (ថ្នាក់វិទ្យាសាស្ត្រសង្គម Social Science)',
    gradeLevel: 'Grade 11',
    section: 'B',
    room: 'Room 203',
    classTeacher: 'Vicheka Nhem',
    studentCount: 29,
    maxCapacity: 35,
    subjectsCount: 7,
    schedulePeriod: '07:30 - 16:30',
    status: 'Active',
  },
  {
    id: 'cls-12a',
    name: 'Grade 12-A (ត្រៀមបាក់ឌុប Bac II - Science)',
    gradeLevel: 'Grade 12',
    section: 'A',
    room: 'Room 301',
    classTeacher: 'Prof. Marcus Kane',
    studentCount: 28,
    maxCapacity: 32,
    subjectsCount: 8,
    schedulePeriod: '07:30 - 16:30',
    status: 'Active',
  },
  {
    id: 'cls-12b',
    name: 'Grade 12-B (ត្រៀមបាក់ឌុប Bac II - Social Science)',
    gradeLevel: 'Grade 12',
    section: 'B',
    room: 'Room 302',
    classTeacher: 'Elena Vance',
    studentCount: 27,
    maxCapacity: 32,
    subjectsCount: 7,
    schedulePeriod: '07:30 - 16:30',
    status: 'Active',
  },
]

export default function Classes() {
  const { showToast } = useToast()
  const [classes, setClasses] = useState<ClassItem[]>(INITIAL_CLASSES)
  const [searchTerm, setSearchTerm] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')

  // Modals state
  const [detailClass, setDetailClass] = useState<ClassItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<ClassItem | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<ClassItem | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    gradeLevel: 'Grade 10',
    section: 'A',
    room: 'Room 101',
    classTeacher: 'Dr. John Whitfield',
    maxCapacity: 35,
    schedulePeriod: '08:00 - 15:30',
    status: 'Active' as 'Active' | 'Archived',
  })

  // Filtered classes (UC-CLASS-01)
  const filteredClasses = useMemo(() => {
    return classes.filter((c) => {
      const q = searchTerm.toLowerCase()
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.classTeacher.toLowerCase().includes(q) ||
        c.room.toLowerCase().includes(q)
      const matchesGrade = gradeFilter === 'All' || c.gradeLevel === gradeFilter
      return matchesSearch && matchesGrade
    })
  }, [classes, searchTerm, gradeFilter])

  // Aggregate stats
  const stats = useMemo(() => {
    const total = classes.length
    const totalStudents = classes.reduce((sum, c) => sum + c.studentCount, 0)
    const totalCapacity = classes.reduce((sum, c) => sum + c.maxCapacity, 0)
    const fillRate =
      totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0
    return { total, totalStudents, totalCapacity, fillRate }
  }, [classes])

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      gradeLevel: 'Grade 10',
      section: 'A',
      room: 'Room 101',
      classTeacher: 'Dr. John Whitfield',
      maxCapacity: 35,
      schedulePeriod: '08:00 - 15:30',
      status: 'Active',
    })
    setEditingClass(null)
  }

  // Open Create Modal (UC-CLASS-03)
  const handleOpenCreate = () => {
    resetForm()
    setIsModalOpen(true)
  }

  // Open Edit Modal (UC-CLASS-04)
  const handleOpenEdit = (cls: ClassItem) => {
    setEditingClass(cls)
    setFormData({
      name: cls.name,
      gradeLevel: cls.gradeLevel,
      section: cls.section,
      room: cls.room,
      classTeacher: cls.classTeacher,
      maxCapacity: cls.maxCapacity,
      schedulePeriod: cls.schedulePeriod,
      status: cls.status || 'Active',
    })
    setIsModalOpen(true)
  }

  // Submit Create or Edit
  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault()

    // 400 Bad Request prevention
    if (!formData.section.trim()) {
      showToast('Section identifier is required', 'error')
      return
    }

    if (editingClass) {
      // UC-CLASS-04: Edit
      const updated: ClassItem = {
        ...editingClass,
        name: formData.name.trim() || `${formData.gradeLevel}-${formData.section}`,
        gradeLevel: formData.gradeLevel,
        section: formData.section.toUpperCase(),
        room: formData.room,
        classTeacher: formData.classTeacher,
        maxCapacity: Number(formData.maxCapacity) || 35,
        schedulePeriod: formData.schedulePeriod,
        status: formData.status,
      }
      setClasses((prev) => prev.map((c) => (c.id === updated.id ? updated : c)))
      if (detailClass?.id === updated.id) setDetailClass(updated)
      showToast(`Class "${updated.name}" updated successfully`, 'success')
    } else {
      // UC-CLASS-03: Create
      const newCls: ClassItem = {
        id: `cls-${Date.now()}`,
        name: formData.name.trim() || `${formData.gradeLevel}-${formData.section}`,
        gradeLevel: formData.gradeLevel,
        section: formData.section.toUpperCase(),
        room: formData.room,
        classTeacher: formData.classTeacher,
        studentCount: 0,
        maxCapacity: Number(formData.maxCapacity) || 35,
        subjectsCount: 6,
        schedulePeriod: formData.schedulePeriod,
        status: 'Active',
      }
      setClasses((prev) => [newCls, ...prev])
      showToast(`Class "${newCls.name}" created successfully`, 'success')
    }

    setIsModalOpen(false)
    resetForm()
  }

  // Delete Handler (UC-CLASS-05) with 409 Conflict check
  const handleDelete = () => {
    if (!deleteCandidate) return

    // Precondition check: If class has enrolled students, reject deletion (409 Conflict)
    if (deleteCandidate.studentCount > 0) {
      showToast(
        `Conflict (409): Cannot delete class "${deleteCandidate.name}" because it has ${deleteCandidate.studentCount} active enrolled students. Reassign students first.`,
        'error'
      )
      setDeleteCandidate(null)
      return
    }

    setClasses((prev) => prev.filter((c) => c.id !== deleteCandidate.id))
    if (detailClass?.id === deleteCandidate.id) setDetailClass(null)
    showToast(`Class "${deleteCandidate.name}" deleted successfully`, 'success')
    setDeleteCandidate(null)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Split CRUD Use Case Badges */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageHeading
            title="Classes & Sections"
            subtitle="Cohort sections, homeroom faculty assignments, capacity limits, and course distribution"
          />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800/40">
              <ShieldCheck size={12} /> Standard: Split CRUD Use Cases
            </span>
            <span className="text-xs text-stone-500 font-mono">
              [UC-CLASS-01 to 05] • RBAC: classes.view | create | edit | delete
            </span>
          </div>
        </div>

        <button
          id="btn-create-class"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Create New Class</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <School size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs font-medium text-stone-500">Active Classes</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <Users size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.totalStudents}
            </div>
            <div className="text-xs font-medium text-stone-500">Enrolled Students</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <DoorOpen size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.totalCapacity}
            </div>
            <div className="text-xs font-medium text-stone-500">Total Desk Capacity</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
            <GraduationCap size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.fillRate}%
            </div>
            <div className="text-xs font-medium text-stone-500">Average Fill Rate</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (UC-CLASS-01) */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search class name, homeroom teacher, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 text-stone-900 dark:text-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 text-xs font-medium rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 text-stone-800 dark:text-stone-200 cursor-pointer w-full sm:w-44"
          >
            <option value="All">All Grade Levels</option>
            <option value="Grade 7">Grade 7 (អនុវិទ្យាល័យ)</option>
            <option value="Grade 8">Grade 8 (អនុវិទ្យាល័យ)</option>
            <option value="Grade 9">Grade 9 (ត្រៀមឌីប្លូម)</option>
            <option value="Grade 10">Grade 10 (មូលដ្ឋាន)</option>
            <option value="Grade 11">Grade 11 (បំបែកថ្នាក់)</option>
            <option value="Grade 12">Grade 12 (ត្រៀមបាក់ឌុប)</option>
          </select>
        </div>
      </div>

      {/* Classes Grid (UC-CLASS-01) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const fillPercentage = Math.round(
            (cls.studentCount / cls.maxCapacity) * 100
          )
          return (
            <div
              key={cls.id}
              className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      <School size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-stone-900 dark:text-white">
                        {cls.name}
                      </h3>
                      <div className="text-xs text-stone-500 font-medium">
                        {cls.gradeLevel} • Section {cls.section}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    {cls.status || 'Active'}
                  </span>
                </div>

                <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <User size={13} /> Class Teacher:
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-white">
                      {cls.classTeacher}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <DoorOpen size={13} /> Assigned Room:
                    </span>
                    <span className="font-medium">{cls.room}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <BookOpen size={13} /> Subjects:
                    </span>
                    <span className="font-medium">{cls.subjectsCount} Subjects</span>
                  </div>

                  {/* Student Capacity Progress Bar */}
                  <div className="pt-1.5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-stone-500">Student Capacity</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {cls.studentCount} / {cls.maxCapacity} ({fillPercentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-stone-200/70 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillPercentage > 90
                            ? 'bg-amber-500'
                            : fillPercentage > 75
                            ? 'bg-brand-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons (UC-CLASS-02, 04, 05) */}
              <div className="pt-3.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setDetailClass(cls)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 transition flex items-center gap-1"
                    title="View Class Details (UC-CLASS-02)"
                  >
                    <Eye size={13} /> Details
                  </button>
                  <Link
                    to="/academic/schedules"
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-500 hover:text-white text-stone-700 dark:text-stone-200 transition cursor-pointer flex items-center gap-1"
                  >
                    <CalendarDays size={13} /> Timetable
                  </Link>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(cls)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-brand-600 hover:bg-stone-100 dark:hover:bg-white/10 transition"
                    title="Edit Class (UC-CLASS-04)"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(cls)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Delete Class (UC-CLASS-05)"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* ========================================================= */}
      {/* MODAL: VIEW CLASS DETAILS (UC-CLASS-02) */}
      {/* ========================================================= */}
      {detailClass && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                  <School size={28} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    {detailClass.name}
                  </h3>
                  <p className="text-xs text-stone-500">
                    {detailClass.gradeLevel} • Section {detailClass.section} • {detailClass.room}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setDetailClass(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Use Case & Permission Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-700 dark:text-brand-300">
                Use Case: UC-CLASS-02 (View Class Details)
              </span>
              <span className="font-mono text-[11px] text-brand-600 dark:text-brand-400">
                Permission: classes.view
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400 flex items-center gap-1">
                  <User size={12} /> Homeroom Teacher
                </span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {detailClass.classTeacher}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400 flex items-center gap-1">
                  <DoorOpen size={12} /> Assigned Classroom
                </span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {detailClass.room}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400 flex items-center gap-1">
                  <Clock size={12} /> Daily Schedule
                </span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {detailClass.schedulePeriod}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400 flex items-center gap-1">
                  <BookOpen size={12} /> Registered Subjects
                </span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {detailClass.subjectsCount} Subject Courses
                </span>
              </div>
            </div>

            {/* Capacity Meter */}
            <div className="p-3.5 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-700 dark:text-stone-300">
                  Roster Occupancy
                </span>
                <span className="font-bold text-stone-900 dark:text-white">
                  {detailClass.studentCount} / {detailClass.maxCapacity} Students (
                  {Math.round((detailClass.studentCount / detailClass.maxCapacity) * 100)}%)
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-stone-200/80 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{
                    width: `${Math.min(
                      (detailClass.studentCount / detailClass.maxCapacity) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-[11px] text-stone-400">
                {detailClass.maxCapacity - detailClass.studentCount > 0
                  ? `${detailClass.maxCapacity - detailClass.studentCount} open seats available in this section.`
                  : 'Section is at maximum seat capacity.'}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200/60 dark:border-white/10">
              <button
                onClick={() => {
                  const c = detailClass
                  setDetailClass(null)
                  handleOpenEdit(c)
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200 transition"
              >
                Edit Class
              </button>
              <button
                onClick={() => setDetailClass(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT CLASS (UC-CLASS-03 & 04) */}
      {/* ========================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {editingClass ? 'Edit Class Division' : 'Create New Class'}
                </h3>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-mono">
                  {editingClass
                    ? 'UC-CLASS-04 (Edit Class) • classes.edit'
                    : 'UC-CLASS-03 (Create Class) • classes.create'}
                </span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Class Label (Optional Override)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grade 10-A (Honors STEM)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Grade Level
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Grade 7">Grade 7 (Lower Secondary)</option>
                    <option value="Grade 8">Grade 8 (Lower Secondary)</option>
                    <option value="Grade 9">Grade 9 (Dip. 9 Prep)</option>
                    <option value="Grade 10">Grade 10 (Foundation)</option>
                    <option value="Grade 11">Grade 11 (Streams)</option>
                    <option value="Grade 12">Grade 12 (Bac II Prep)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Section Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A, B, C"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Room 101"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Max Student Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={formData.maxCapacity}
                    onChange={(e) =>
                      setFormData({ ...formData, maxCapacity: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Homeroom / Class Teacher
                </label>
                <input
                  type="text"
                  value={formData.classTeacher}
                  onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Dr. John Whitfield"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Daily Schedule Window
                </label>
                <input
                  type="text"
                  value={formData.schedulePeriod}
                  onChange={(e) => setFormData({ ...formData, schedulePeriod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  placeholder="08:00 - 15:30"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition shadow-sm"
                >
                  {editingClass ? 'Save Changes' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION (UC-CLASS-05) */}
      {/* ========================================================= */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 dark:text-rose-400">
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/40">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Delete Class Cohort
                </h3>
                <span className="text-xs text-rose-600 font-mono">
                  UC-CLASS-05 • classes.delete
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to permanently delete class section{' '}
              <span className="font-bold text-stone-900 dark:text-white">
                "{deleteCandidate.name}"
              </span>
              ?
            </p>

            {deleteCandidate.studentCount > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-bold block mb-0.5">Precondition Warning (409 Conflict):</span>
                This class currently has {deleteCandidate.studentCount} enrolled students. Deleting it without reassigning students will be blocked.
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white transition shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
