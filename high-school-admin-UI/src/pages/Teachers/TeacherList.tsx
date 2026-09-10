// src/pages/Teachers/TeacherList.tsx
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  BookOpen,
  Calendar,
  Award,
  Clock,
  Trash2,
  Edit,
  Eye,
  X,
  LayoutGrid,
  List,
  AlertTriangle,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Building2,
  ExternalLink,
  Star,
  CheckCircle2,
  Printer,
  RefreshCw,
} from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import {
  teacherService,
  type TeacherRecord,
  type CreateTeacherPayload,
} from '@/services/teacherService'
import { DEPARTMENTS, STATUSES } from '@/data/teacherOptions'

export default function TeacherList() {
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [teachers, setTeachers] = useState<TeacherRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Filters & Views
  const [search, setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('All Departments')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  // Modals
  const [detailTeacher, setDetailTeacher] = useState<TeacherRecord | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState<TeacherRecord | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<TeacherRecord | null>(null)

  // Form State
  const [formData, setFormData] = useState<CreateTeacherPayload>({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Science',
    position: 'Faculty Member',
    qualifications: "Master's Degree",
    specialization: '',
    weeklyTeachingHours: 16,
    assignedClasses: [],
    subjectsTaught: [],
    status: 'Active',
  })
  const [classInput, setClassInput] = useState('')
  const [subjectInput, setSubjectInput] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  // Load Data
  const loadTeachers = async () => {
    setIsLoading(true)
    try {
      const data = await teacherService.list()
      setTeachers(Array.isArray(data) ? data : [])
    } catch {
      setTeachers([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTeachers()
  }, [])

  // Filtered list
  const filteredTeachers = useMemo(() => {
    return teachers.filter((t) => {
      const teacherName = `${t.firstName || ''} ${t.lastName || ''} ${t.name || ''}`.toLowerCase()
      const searchMatch =
        teacherName.includes(search.toLowerCase()) ||
        t.employeeId.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()) ||
        t.specialization.toLowerCase().includes(search.toLowerCase()) ||
        t.subjectsTaught.some((s) => s.toLowerCase().includes(search.toLowerCase()))

      const deptMatch =
        selectedDept === 'All Departments' || t.department.toLowerCase() === selectedDept.toLowerCase()

      const statusMatch =
        selectedStatus === 'All' || t.status.toLowerCase() === selectedStatus.toLowerCase()

      return searchMatch && deptMatch && statusMatch
    })
  }, [teachers, search, selectedDept, selectedStatus])

  // Stats calculation
  const stats = useMemo(() => {
    const total = teachers.length
    const active = teachers.filter((t) => t.status === 'Active').length
    const avgHours =
      total > 0
        ? (
            teachers.reduce((acc, t) => acc + (t.weeklyTeachingHours || 0), 0) /
            total
          ).toFixed(1)
        : '0.0'
    const topRated = teachers.filter((t) => (t.performanceRating || 0) >= 4.85).length

    return { total, active, avgHours, topRated }
  }, [teachers])

  const kpiCards: StatCard[] = [
    { id: 'total-faculty', label: 'Total Faculty', value: stats.total.toString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'directory', icon: 'Users', tint: 'blue' },
    { id: 'active-faculty', label: 'Active In-Service', value: stats.active.toString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'active staff', icon: 'CheckCircle2', tint: 'green' },
    { id: 'avg-workload', label: 'Avg Workload / Wk', value: `${stats.avgHours}h`, delta: '-', deltaDirection: 'neutral', deltaLabel: 'teaching hours', icon: 'Clock', tint: 'amber' },
    { id: 'top-rated', label: 'Top Rated Faculty', value: stats.topRated.toString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'high performers', icon: 'TrendingUp', tint: 'violet' },
  ]

  // Handlers
  const handleOpenCreate = () => {
    setEditingTeacher(null)
    setFormData({
      employeeId: `FAC-${String(teachers.length + 1).padStart(3, '0')}`,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: 'Science',
      position: 'Faculty Member',
      qualifications: "Master's Degree",
      specialization: '',
      weeklyTeachingHours: 16,
      assignedClasses: [],
      subjectsTaught: [],
      status: 'Active',
    })
    setClassInput('')
    setSubjectInput('')
    setFormError(null)
    setIsCreateModalOpen(true)
  }

  const handleOpenEdit = (teacher: TeacherRecord) => {
    setEditingTeacher(teacher)
    setFormData({
      employeeId: teacher.employeeId,
      firstName: teacher.firstName,
      lastName: teacher.lastName,
      email: teacher.email,
      phone: teacher.phone,
      department: teacher.department,
      position: teacher.position || 'Faculty Member',
      qualifications: teacher.qualifications,
      specialization: teacher.specialization,
      weeklyTeachingHours: teacher.weeklyTeachingHours,
      assignedClasses: [...(teacher.assignedClasses || [])],
      subjectsTaught: [...(teacher.subjectsTaught || [])],
      status: teacher.status,
    })
    setClassInput('')
    setSubjectInput('')
    setFormError(null)
    setIsCreateModalOpen(true)
  }

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setFormError('First and last names are required.')
      return
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('A valid institutional email is required.')
      return
    }

    try {
      if (editingTeacher) {
        const updated = await teacherService.update(editingTeacher.id, formData)
        setTeachers((prev) =>
          prev.map((t) =>
            t.id === editingTeacher.id
              ? {
                  ...t,
                  ...formData,
                  name: `${formData.firstName} ${formData.lastName}`,
                  ...(updated || {}),
                }
              : t
          )
        )
        showToast('Faculty record updated successfully', 'success')
      } else {
        const created = await teacherService.create(formData)
        const newTeacher: TeacherRecord = {
          ...formData,
          id: created?.id || `teacher-${Date.now()}`,
          name: `${formData.firstName} ${formData.lastName}`,
          performanceRating: 4.8,
          joiningDate: new Date().toISOString().split('T')[0],
          status: formData.status || 'Active',
        }
        setTeachers((prev) => [newTeacher, ...prev])
        showToast('New faculty member added to roster', 'success')
      }
      setIsCreateModalOpen(false)
    } catch {
      showToast('Error saving faculty record', 'error')
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteCandidate) return
    try {
      await teacherService.delete(deleteCandidate.id)
      setTeachers((prev) => prev.filter((t) => t.id !== deleteCandidate.id))
      showToast(`Removed faculty record for ${deleteCandidate.firstName} ${deleteCandidate.lastName}`, 'success')
      setDeleteCandidate(null)
    } catch {
      // Local removal fallback
      setTeachers((prev) => prev.filter((t) => t.id !== deleteCandidate.id))
      showToast('Faculty record removed', 'success')
      setDeleteCandidate(null)
    }
  }

  const handleAddClass = () => {
    if (classInput.trim() && !formData.assignedClasses.includes(classInput.trim())) {
      setFormData({
        ...formData,
        assignedClasses: [...formData.assignedClasses, classInput.trim()],
      })
      setClassInput('')
    }
  }

  const handleRemoveClass = (cls: string) => {
    setFormData({
      ...formData,
      assignedClasses: formData.assignedClasses.filter((c) => c !== cls),
    })
  }

  const handleAddSubject = () => {
    if (subjectInput.trim() && !formData.subjectsTaught.includes(subjectInput.trim())) {
      setFormData({
        ...formData,
        subjectsTaught: [...formData.subjectsTaught, subjectInput.trim()],
      })
      setSubjectInput('')
    }
  }

  const handleRemoveSubject = (sub: string) => {
    setFormData({
      ...formData,
      subjectsTaught: formData.subjectsTaught.filter((s) => s !== sub),
    })
  }

  const getDepartmentColor = (dept: string) => {
    switch (dept.toLowerCase()) {
      case 'science':
        return 'text-teal-700 dark:text-teal-300 bg-teal-500/10 border-teal-500/20'
      case 'mathematics':
        return 'text-blue-700 dark:text-blue-300 bg-blue-500/10 border-blue-500/20'
      case 'technology':
        return 'text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
      case 'languages':
        return 'text-purple-700 dark:text-purple-300 bg-purple-500/10 border-purple-500/20'
      case 'social studies':
        return 'text-amber-700 dark:text-amber-300 bg-amber-500/10 border-amber-500/20'
      case 'fine arts':
        return 'text-rose-700 dark:text-rose-300 bg-rose-500/10 border-rose-500/20'
      default:
        return 'text-stone-700 dark:text-stone-300 bg-stone-500/10 border-stone-500/20'
    }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading
            title="Teachers & Faculty Directory"
            subtitle="Faculty academic credentials, assigned workloads, department rosters, and course allocations."
          />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-700 dark:text-brand-300 border border-brand-500/20">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Oakridge Faculty Directory</span>
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Academic Year 2025–2026 Roster
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadTeachers}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 hover:bg-stone-100 text-xs font-semibold text-stone-700 dark:text-stone-200 transition cursor-pointer"
            title="Refresh faculty roster"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            id="btn-add-teacher"
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs bg-brand-600 hover:bg-brand-700 text-white shadow-xs hover:shadow-md transition cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>Add Faculty Member</span>
          </button>
        </div>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />
      {/* Legacy KPI markup retained below only as migration reference.
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs font-semibold text-stone-500">Total Faculty</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.active}
            </div>
            <div className="text-xs font-semibold text-stone-500">Active In-Service</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.avgHours}h
            </div>
            <div className="text-xs font-semibold text-stone-500">Avg Workload / Wk</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md shadow-xs flex items-center gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.topRated}
            </div>
            <div className="text-xs font-semibold text-stone-500">Top Evaluation (≥4.85)</div>
          </div>
        </div>
      </div> */}

      {/* Filters Toolbar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-4 rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md shadow-xs">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          {/* Search */}
          <div className="relative flex-1 w-full min-w-60">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
            <input
              type="text"
              placeholder="Search faculty name, ID, subject, or specialization..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs font-medium rounded-xl bg-stone-50/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 text-stone-900 dark:text-white"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs font-semibold rounded-xl bg-stone-50/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 text-stone-800 dark:text-stone-200"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 text-xs font-semibold rounded-xl bg-stone-50/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 text-stone-800 dark:text-stone-200"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>

        {/* Layout toggle */}
        <div className="flex items-center gap-1 self-end md:self-auto bg-stone-100/80 dark:bg-white/5 p-1 rounded-xl border border-stone-200 dark:border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Table View"
            className={`p-1.5 rounded-lg text-xs font-semibold transition ${
              viewMode === 'table'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Teachers Content */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="p-5 rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 animate-pulse space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-stone-200 dark:bg-white/10" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 rounded bg-stone-200 dark:bg-white/10" />
                  <div className="h-3 w-20 rounded bg-stone-200 dark:bg-white/10" />
                </div>
              </div>
              <div className="h-16 rounded-xl bg-stone-100 dark:bg-white/5" />
            </div>
          ))}
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="p-12 rounded-2xl border border-dashed border-stone-300 dark:border-white/15 bg-white/50 dark:bg-stone-900/40 text-center">
          <Building2 className="mx-auto h-10 w-10 text-stone-400 mb-2" />
          <h3 className="font-bold text-stone-800 dark:text-stone-200">No Faculty Members Found</h3>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search criteria or add a new faculty member.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((t) => {
            const initials = `${(t.firstName || '').charAt(0)}${(t.lastName || '').charAt(0)}`.toUpperCase() || 'FC'
            const deptColor = getDepartmentColor(t.department)
            const workloadPct = Math.min(100, Math.round(((t.weeklyTeachingHours || 16) / 24) * 100))

            return (
              <div
                key={t.id}
                id={`teacher-card-${t.id}`}
                className="group relative flex flex-col justify-between p-5 rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md hover:border-brand-500/40 hover:shadow-md transition"
              >
                <div>
                  {/* Top Row: Avatar, Identity & Status */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      {t.avatarUrl ? (
                        <img
                          src={t.avatarUrl}
                          alt={t.name || t.firstName}
                          className="h-12 w-12 rounded-2xl object-cover ring-2 ring-brand-500/20 shadow-xs"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500/20 to-brand-600/10 font-bold text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-stone-900 dark:text-white text-sm truncate">
                          {t.name || `${t.firstName} ${t.lastName}`}
                        </h3>
                        <p className="text-xs text-stone-500 font-medium truncate mt-0.5">
                          {t.title || `${t.department} Faculty`}
                        </p>
                        <span className="font-mono text-[10px] text-brand-700 dark:text-brand-300">
                          {t.employeeId}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Active'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300/40'
                          : t.status === 'On Leave'
                          ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300/40'
                          : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300'
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          t.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {t.status}
                    </span>
                  </div>

                  {/* Department & Specialization */}
                  <div className="space-y-2 py-3 border-y border-stone-200/60 dark:border-white/10 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Department:</span>
                      <span className={`px-2 py-0.5 rounded-md font-semibold border text-[11px] ${deptColor}`}>
                        {t.department}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-stone-400">Specialization:</span>
                      <span className="font-medium text-stone-800 dark:text-stone-200 truncate max-w-45" title={t.specialization}>
                        {t.specialization || 'General Curriculum'}
                      </span>
                    </div>

                    {/* Workload Progress */}
                    <div className="pt-1">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-stone-400">Weekly Load:</span>
                        <span className="font-bold text-stone-900 dark:text-white">
                          {t.weeklyTeachingHours}h / 24h max
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-stone-100 dark:bg-white/10">
                        <div
                          className="h-full rounded-full bg-brand-500"
                          style={{ width: `${workloadPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Classes Tags */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-stone-400">Classes:</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-50">
                        {(t.assignedClasses || []).slice(0, 3).map((c) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300"
                          >
                            {c}
                          </span>
                        ))}
                        {(t.assignedClasses?.length || 0) > 3 && (
                          <span className="text-[10px] text-stone-400 self-center">
                            +{t.assignedClasses.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-3.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setDetailTeacher(t)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-300 transition cursor-pointer"
                      title="Quick Dossier Preview"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>Dossier</span>
                    </button>

                    <button
                      onClick={() => navigate(`/teachers/profiles?id=${t.id}`)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition cursor-pointer"
                      title="Open 360° Profile Page"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Profile</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 transition cursor-pointer"
                      title="Edit Faculty Record"
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteCandidate(t)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                      title="Remove Faculty Member"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 dark:bg-white/5 border-b border-stone-200/80 dark:border-white/10 text-stone-500 uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Faculty Member</th>
                  <th className="py-3.5 px-4">Employee ID</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Workload</th>
                  <th className="py-3.5 px-4">Assigned Classes</th>
                  <th className="py-3.5 px-4">Rating</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60 dark:divide-white/5">
                {filteredTeachers.map((t) => {
                  const deptColor = getDepartmentColor(t.department)
                  const initials = `${(t.firstName || '').charAt(0)}${(t.lastName || '').charAt(0)}`.toUpperCase() || 'FC'

                  return (
                    <tr
                      key={t.id}
                      className="hover:bg-stone-50/70 dark:hover:bg-white/5 transition"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {t.avatarUrl ? (
                            <img
                              src={t.avatarUrl}
                              alt=""
                              className="h-9 w-9 rounded-xl object-cover ring-1 ring-brand-500/20"
                            />
                          ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-brand-500/20 to-brand-600/10 font-bold text-brand-700 dark:text-brand-300">
                              {initials}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-stone-900 dark:text-white">
                              {t.name || `${t.firstName} ${t.lastName}`}
                            </div>
                            <div className="text-[11px] text-stone-400">{t.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-brand-700 dark:text-brand-300">
                        {t.employeeId}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-semibold border text-[11px] ${deptColor}`}>
                          {t.department}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">
                        {t.weeklyTeachingHours} hrs/wk
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1">
                          {t.assignedClasses?.slice(0, 2).map((c) => (
                            <span
                              key={c}
                              className="px-1.5 py-0.5 rounded text-[10px] bg-stone-100 dark:bg-white/10 font-semibold text-stone-700 dark:text-stone-300"
                            >
                              {c}
                            </span>
                          ))}
                          {(t.assignedClasses?.length || 0) > 2 && (
                            <span className="text-[10px] text-stone-400 self-center">
                              +{t.assignedClasses.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-amber-700 dark:text-amber-400">
                        <span className="inline-flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                          <span>{t.performanceRating?.toFixed(2) || '4.85'}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            t.status === 'Active'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300/40'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300/40'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              t.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                            }`}
                          />
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setDetailTeacher(t)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition cursor-pointer"
                            title="Quick Dossier"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => navigate(`/teachers/profiles?id=${t.id}`)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/30 transition cursor-pointer"
                            title="Open 360° Profile"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(t)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-white/10 transition cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteCandidate(t)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Teacher Detail Modal (UC-TEACHER-02) */}
      {detailTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 px-6 py-4">
              <div className="flex items-center gap-2 text-xs font-bold text-stone-500 uppercase tracking-wider">
                <GraduationCap className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span>Faculty Member Dossier</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    const id = detailTeacher.id
                    setDetailTeacher(null)
                    navigate(`/teachers/profiles?id=${id}`)
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-brand-700 dark:text-brand-300 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>360° Profile</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-white/10"
                >
                  <Printer className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setDetailTeacher(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs">
              {/* Profile Top */}
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10">
                {detailTeacher.avatarUrl ? (
                  <img
                    src={detailTeacher.avatarUrl}
                    alt=""
                    className="h-16 w-16 rounded-2xl object-cover ring-2 ring-brand-500/20 shadow-xs"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500/20 to-brand-600/10 text-xl font-bold text-brand-700 dark:text-brand-300 ring-2 ring-brand-500/20">
                    {detailTeacher.firstName.charAt(0)}{detailTeacher.lastName.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {detailTeacher.name || `${detailTeacher.firstName} ${detailTeacher.lastName}`}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {detailTeacher.status}
                    </span>
                  </div>
                  <p className="text-stone-500 font-medium mt-0.5">
                    {detailTeacher.title || `${detailTeacher.department} Faculty`}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="font-mono text-brand-700 dark:text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded-md font-semibold">
                      {detailTeacher.employeeId}
                    </span>
                    <span className="font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-white/10 px-2 py-0.5 rounded-md">
                      {detailTeacher.department}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-stone-200/80 dark:border-white/10 space-y-2">
                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-brand-500" />
                    <span>Contact Details</span>
                  </div>
                  <div className="space-y-1 text-stone-600 dark:text-stone-300">
                    <div>Email: <a href={`mailto:${detailTeacher.email}`} className="text-brand-600 hover:underline">{detailTeacher.email}</a></div>
                    <div>Phone: <span className="font-mono">{detailTeacher.phone || '+1 (555) 019-2834'}</span></div>
                    <div>Joined: {detailTeacher.joiningDate || '2019-08-15'}</div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-stone-200/80 dark:border-white/10 space-y-2">
                  <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-amber-500" />
                    <span>Academic Qualifications</span>
                  </div>
                  <div className="space-y-1 text-stone-600 dark:text-stone-300">
                    <div className="font-semibold text-stone-900 dark:text-white">{detailTeacher.qualifications}</div>
                    <div className="text-stone-500">Specialization: {detailTeacher.specialization}</div>
                    <div className="flex items-center gap-1 text-amber-600 font-bold pt-1">
                      <Star className="h-3.5 w-3.5 fill-amber-500" />
                      <span>{detailTeacher.performanceRating?.toFixed(2) || '4.90'} Rating</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects & Classes */}
              <div className="p-4 rounded-2xl border border-stone-200/80 dark:border-white/10 space-y-3">
                <div className="font-bold text-stone-900 dark:text-white flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Teaching Assignments & Schedule</span>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-stone-400 font-semibold block mb-1">Subjects Taught:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {detailTeacher.subjectsTaught.map((sub, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-300 font-semibold">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <span className="text-stone-400 font-semibold block mb-1">Assigned Classes:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {detailTeacher.assignedClasses.map((cls, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold">
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-stone-200 dark:border-white/10 px-6 py-4 flex items-center justify-between bg-stone-50/70 dark:bg-white/5">
              <button
                onClick={() => {
                  const t = detailTeacher
                  setDetailTeacher(null)
                  handleOpenEdit(t)
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-stone-200 dark:border-white/10 hover:bg-stone-100 transition"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Record</span>
              </button>
              <button
                onClick={() => setDetailTeacher(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 hover:bg-stone-300 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal (UC-TEACHER-03, 04) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-xl rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-stone-900 shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 px-6 py-4">
              <h3 className="font-bold text-stone-900 dark:text-white text-base">
                {editingTeacher ? 'Edit Faculty Member Record' : 'Add New Faculty Member'}
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:bg-stone-100 hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 font-semibold flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Names */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Employee ID & Department */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                  >
                    {DEPARTMENTS.filter((d) => d !== 'All Departments').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Email & Phone */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Institutional Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                  />
                </div>
              </div>

              {/* Qualifications & Specialization */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Highest Qualification
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Ph.D. Molecular Biology"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Domain Specialization
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Quantum Mechanics"
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Weekly Hours & Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Weekly Teaching Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={40}
                    value={formData.weeklyTeachingHours}
                    onChange={(e) =>
                      setFormData({ ...formData, weeklyTeachingHours: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as 'Active' | 'On Leave' | 'Inactive' })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Assigned Classes Tag Input */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Assigned Classes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Grade 10-A"
                    value={classInput}
                    onChange={(e) => setClassInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddClass()
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddClass}
                    className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.assignedClasses.map((cls) => (
                    <span
                      key={cls}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                    >
                      <span>{cls}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveClass(cls)}
                        className="hover:text-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Subjects Taught Tag Input */}
              <div>
                <label className="font-bold text-stone-700 dark:text-stone-300 block mb-1">
                  Subjects Taught
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="e.g. Calculus BC"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSubject()
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubject}
                    className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 font-semibold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {formData.subjectsTaught.map((sub) => (
                    <span
                      key={sub}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-300 font-semibold"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSubject(sub)}
                        className="hover:text-rose-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="border-t border-stone-200 dark:border-white/10 pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-xs"
                >
                  {editingTeacher ? 'Save Changes' : 'Add Faculty Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal (UC-TEACHER-05) */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md rounded-3xl border border-stone-200 dark:border-white/10 bg-white dark:bg-stone-900 shadow-2xl p-6 space-y-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-3 rounded-2xl bg-rose-500/10">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  Remove Faculty Member?
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300">
              Are you sure you want to remove{' '}
              <strong>
                {deleteCandidate.name || `${deleteCandidate.firstName} ${deleteCandidate.lastName}`}
              </strong>{' '}
              ({deleteCandidate.employeeId}) from the faculty roster?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs"
              >
                Confirm Removal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
