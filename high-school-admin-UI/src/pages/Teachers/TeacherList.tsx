// src/pages/Teachers/TeacherList.tsx
import { useEffect, useMemo, useState } from 'react'
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
} from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'
import { useToast } from '@/components/common/ToastProvider'
import {
  teacherService,
  type TeacherRecord,
  type CreateTeacherPayload,
} from '@/services/teacherService'

const DEPARTMENTS = [
  'All Departments',
  'Science',
  'Mathematics',
  'Social Studies',
  'Languages',
  'Technology',
  'Fine Arts',
]

const STATUSES = ['All', 'Active', 'On Leave', 'Inactive']

export default function TeacherList() {
  const { showToast } = useToast()
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
      showToast('Failed to load faculty directory', 'error')
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
      const q = search.toLowerCase()
      const matchesSearch =
        !q ||
        t.firstName.toLowerCase().includes(q) ||
        t.lastName.toLowerCase().includes(q) ||
        t.email.toLowerCase().includes(q) ||
        t.employeeId.toLowerCase().includes(q) ||
        t.specialization.toLowerCase().includes(q)

      const matchesDept =
        selectedDept === 'All Departments' || t.department === selectedDept

      const matchesStatus =
        selectedStatus === 'All' || t.status === selectedStatus

      return matchesSearch && matchesDept && matchesStatus
    })
  }, [teachers, search, selectedDept, selectedStatus])

  // Stats calculation
  const stats = useMemo(() => {
    const total = teachers.length
    const active = teachers.filter((t) => t.status === 'Active').length
    const avgHours =
      total > 0
        ? Math.round(
            teachers.reduce((acc, t) => acc + (t.weeklyTeachingHours || 0), 0) /
              total
          )
        : 0
    const topRated = teachers.filter((t) => (t.performanceRating || 0) >= 4.85).length
    return { total, active, avgHours, topRated }
  }, [teachers])

  // Reset form
  const resetForm = () => {
    setFormData({
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
    setClassInput('')
    setSubjectInput('')
    setFormError(null)
    setEditingTeacher(null)
  }

  // Open Create Modal (UC-TEACHER-03)
  const handleOpenCreate = () => {
    resetForm()
    setIsCreateModalOpen(true)
  }

  // Open Edit Modal (UC-TEACHER-04)
  const handleOpenEdit = (t: TeacherRecord) => {
    setEditingTeacher(t)
    setFormData({
      employeeId: t.employeeId,
      firstName: t.firstName,
      lastName: t.lastName,
      email: t.email,
      phone: t.phone,
      department: t.department,
      position: t.position || 'Faculty Member',
      qualifications: t.qualifications,
      specialization: t.specialization,
      weeklyTeachingHours: t.weeklyTeachingHours,
      assignedClasses: [...(t.assignedClasses || [])],
      subjectsTaught: [...(t.subjectsTaught || [])],
      status: t.status,
    })
    setClassInput('')
    setSubjectInput('')
    setFormError(null)
    setIsCreateModalOpen(true)
  }

  // Save (Create or Edit)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    // Preconditions & Validation (400 Bad Request prevention)
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      setFormError('Please fill in all mandatory fields: First Name, Last Name, and Email.')
      return
    }

    try {
      if (editingTeacher) {
        // UC-TEACHER-04: Edit Teacher
        const updated = await teacherService.update(editingTeacher.id, formData)
        setTeachers((prev) => prev.map((t) => (t.id === updated.id ? updated : t)))
        if (detailTeacher?.id === updated.id) setDetailTeacher(updated)
        showToast(`Teacher "${updated.name || updated.firstName}" updated successfully.`, 'success')
      } else {
        // UC-TEACHER-03: Create Teacher
        const created = await teacherService.create(formData)
        setTeachers((prev) => [created, ...prev])
        showToast(`Teacher "${created.name || created.firstName}" created successfully.`, 'success')
      }
      setIsCreateModalOpen(false)
      resetForm()
    } catch (err: any) {
      setFormError(err?.message || 'Operation failed. Please verify input data.')
      showToast(err?.message || 'Action rejected', 'error')
    }
  }

  // Delete Handler (UC-TEACHER-05) with 409 Conflict check
  const handleDelete = async () => {
    if (!deleteCandidate) return

    // Precondition check: If teacher has active assigned classes, prevent deletion
    if (deleteCandidate.assignedClasses && deleteCandidate.assignedClasses.length > 0) {
      showToast(
        `Conflict (409): Cannot delete "${deleteCandidate.name}": has ${deleteCandidate.assignedClasses.length} assigned class(es). Reassign classes before deleting.`,
        'error'
      )
      setDeleteCandidate(null)
      return
    }

    try {
      await teacherService.delete(deleteCandidate.id)
      setTeachers((prev) => prev.filter((t) => t.id !== deleteCandidate.id))
      if (detailTeacher?.id === deleteCandidate.id) setDetailTeacher(null)
      showToast(`Teacher "${deleteCandidate.name}" removed from faculty roster.`, 'success')
      setDeleteCandidate(null)
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete teacher record.', 'error')
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

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Split CRUD Use Case badges */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <PageHeading
            title="Teachers & Faculty Management"
            subtitle="Academic staff records, qualifications, teaching workloads, and course allocations"
          />
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800/40">
              <ShieldCheck size={12} /> Standard: Split CRUD Use Cases
            </span>
            <span className="text-xs text-stone-500 font-mono">
              [UC-TEACHER-01 to 05] • RBAC: teachers.view | create | edit | delete
            </span>
          </div>
        </div>

        <button
          id="btn-add-teacher"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow transition"
        >
          <Plus size={16} />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <Users size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.total}
            </div>
            <div className="text-xs font-medium text-stone-500">Total Faculty</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.active}
            </div>
            <div className="text-xs font-medium text-stone-500">Active Status</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.avgHours}h
            </div>
            <div className="text-xs font-medium text-stone-500">Avg Weekly Hours</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400">
            <Sparkles size={20} />
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900 dark:text-white">
              {stats.topRated}
            </div>
            <div className="text-xs font-medium text-stone-500">High Evaluation (≥4.85)</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (UC-TEACHER-01) */}
      <div className="p-4 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 flex-col sm:flex-row items-center gap-3 w-full">
          <div className="relative w-full sm:w-80">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              placeholder="Search by name, ID, email, specialty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-sm rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 text-xs font-medium rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full sm:w-36 px-3 py-2 text-xs font-medium rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>
        </div>

        {/* Layout toggle */}
        <div className="flex items-center gap-1 self-end md:self-auto bg-stone-100 dark:bg-white/5 p-1 rounded-xl border border-stone-200 dark:border-white/10">
          <button
            onClick={() => setViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded-lg text-xs font-medium transition ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewMode('table')}
            title="Table View"
            className={`p-1.5 rounded-lg text-xs font-medium transition ${
              viewMode === 'table'
                ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-xs'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Teachers Content (UC-TEACHER-01) */}
      {isLoading ? (
        <div className="p-12 text-center text-stone-400 font-medium animate-pulse">
          Loading faculty records...
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="p-12 rounded-2xl glass-sm border border-stone-200 dark:border-white/10 text-center">
          <Building2 size={36} className="mx-auto text-stone-300 mb-2" />
          <p className="font-semibold text-stone-700 dark:text-stone-300">
            No faculty members found
          </p>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search filters or add a new faculty member.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((t) => (
            <div
              key={t.id}
              className="p-5 rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        t.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          t.name || t.firstName
                        )}&background=3b82f6&color=fff`
                      }
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-brand-500/20"
                    />
                    <div>
                      <h3 className="font-bold text-stone-900 dark:text-white text-base leading-tight">
                        {t.name || `${t.firstName} ${t.lastName}`}
                      </h3>
                      <p className="text-xs text-stone-500 font-medium mt-0.5">
                        {t.title || `${t.department} Faculty`}
                      </p>
                      <span className="text-[10px] font-mono text-stone-400">
                        {t.employeeId}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      t.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-300/40'
                        : t.status === 'On Leave'
                        ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-300/40'
                        : 'bg-stone-100 text-stone-600 dark:bg-white/10 dark:text-stone-300'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>

                <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="text-stone-400">Department:</span>
                    <span className="font-semibold">{t.department}</span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="text-stone-400">Specialization:</span>
                    <span className="font-medium truncate max-w-[180px]" title={t.specialization}>
                      {t.specialization || 'General Education'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="text-stone-400">Workload:</span>
                    <span className="font-bold text-brand-600 dark:text-brand-400">
                      {t.weeklyTeachingHours} hrs / week
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="text-stone-400">Classes:</span>
                    <span className="font-medium">
                      {t.assignedClasses?.length || 0} assigned
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (UC-TEACHER-02, 04, 05) */}
              <div className="pt-3.5 flex items-center justify-between gap-2">
                <button
                  onClick={() => setDetailTeacher(t)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/40 dark:hover:text-brand-400 transition"
                  title="View Faculty Dossier (UC-TEACHER-02)"
                >
                  <Eye size={13} />
                  <span>Dossier</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEdit(t)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-brand-600 hover:bg-stone-100 dark:hover:bg-white/10 transition"
                    title="Edit Teacher (UC-TEACHER-04)"
                  >
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(t)}
                    className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                    title="Delete Teacher (UC-TEACHER-05)"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="rounded-2xl glass-sm border border-stone-200/80 dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/70 dark:bg-white/5 border-b border-stone-200/80 dark:border-white/10 text-stone-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-4">Employee ID</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Workload</th>
                  <th className="py-3 px-4">Assigned Classes</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/60 dark:divide-white/5">
                {filteredTeachers.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            t.avatarUrl ||
                            `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              t.name || t.firstName
                            )}&background=3b82f6&color=fff`
                          }
                          alt=""
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-bold text-stone-900 dark:text-white">
                            {t.name || `${t.firstName} ${t.lastName}`}
                          </div>
                          <div className="text-[11px] text-stone-400">{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-500">
                      {t.employeeId}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-700 dark:text-stone-300">
                      {t.department}
                    </td>
                    <td className="py-3 px-4 font-bold text-brand-600 dark:text-brand-400">
                      {t.weeklyTeachingHours} hrs/wk
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {t.assignedClasses?.slice(0, 2).map((c) => (
                          <span
                            key={c}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-stone-100 dark:bg-white/10 font-medium"
                          >
                            {c}
                          </span>
                        ))}
                        {(t.assignedClasses?.length || 0) > 2 && (
                          <span className="text-[10px] text-stone-400">
                            +{t.assignedClasses.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-800 dark:text-stone-200">
                      ★ {t.performanceRating?.toFixed(2) || '4.80'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          t.status === 'Active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailTeacher(t)}
                          className="p-1 rounded-lg text-stone-500 hover:text-brand-600 hover:bg-stone-100 dark:hover:bg-white/10"
                          title="View Details"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(t)}
                          className="p-1 rounded-lg text-stone-500 hover:text-brand-600 hover:bg-stone-100 dark:hover:bg-white/10"
                          title="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteCandidate(t)}
                          className="p-1 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: VIEW TEACHER DETAILS (UC-TEACHER-02) */}
      {/* ========================================================= */}
      {detailTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-xl rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={
                    detailTeacher.avatarUrl ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      detailTeacher.name || detailTeacher.firstName
                    )}&background=3b82f6&color=fff`
                  }
                  alt=""
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                      {detailTeacher.name ||
                        `${detailTeacher.firstName} ${detailTeacher.lastName}`}
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                      {detailTeacher.status}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500">{detailTeacher.title}</p>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-brand-600 dark:text-brand-400">
                    <span>ID: {detailTeacher.employeeId}</span>
                    <span>•</span>
                    <span>Joined: {detailTeacher.joiningDate}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDetailTeacher(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Use Case & Permission Badge */}
            <div className="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-between text-xs">
              <span className="font-semibold text-brand-700 dark:text-brand-300">
                Use Case: UC-TEACHER-02 (View Teacher Details)
              </span>
              <span className="font-mono text-[11px] text-brand-600 dark:text-brand-400">
                Permission: teachers.view
              </span>
            </div>

            {/* Dossier Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400 flex items-center gap-1">
                  <Mail size={12} /> Contact Email
                </span>
                <span className="font-semibold text-stone-800 dark:text-stone-200 break-all">
                  {detailTeacher.email}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400 flex items-center gap-1">
                  <Phone size={12} /> Phone Number
                </span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {detailTeacher.phone || 'Not provided'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400 flex items-center gap-1">
                  <Building2 size={12} /> Department & Role
                </span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {detailTeacher.department} ({detailTeacher.position})
                </span>
              </div>

              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 space-y-1">
                <span className="text-stone-400 flex items-center gap-1">
                  <Award size={12} /> Performance Rating
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400">
                  ★ {detailTeacher.performanceRating?.toFixed(2) || '4.85'} / 5.00
                </span>
              </div>
            </div>

            {/* Academic Qualifications & Specialization */}
            <div className="space-y-2 text-xs">
              <div className="p-3 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/60 dark:border-white/10">
                <div className="flex items-center gap-1.5 font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  <GraduationCap size={14} className="text-brand-500" />
                  <span>Academic Qualifications & Specialization</span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 font-medium">
                  {detailTeacher.qualifications}
                </p>
                <p className="text-stone-400 mt-1">
                  Focus: {detailTeacher.specialization || 'Broad Secondary Curriculum'}
                </p>
              </div>
            </div>

            {/* Assigned Classes & Subjects */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Assigned Classes ({detailTeacher.assignedClasses?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {detailTeacher.assignedClasses?.length ? (
                    detailTeacher.assignedClasses.map((cls) => (
                      <span
                        key={cls}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800/40"
                      >
                        {cls}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-400 italic">None assigned</span>
                  )}
                </div>
              </div>

              <div>
                <span className="font-semibold text-stone-700 dark:text-stone-300 block mb-1.5">
                  Subjects Taught ({detailTeacher.subjectsTaught?.length || 0}):
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {detailTeacher.subjectsTaught?.length ? (
                    detailTeacher.subjectsTaught.map((sub) => (
                      <span
                        key={sub}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                      >
                        {sub}
                      </span>
                    ))
                  ) : (
                    <span className="text-stone-400 italic">None registered</span>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-200/60 dark:border-white/10">
              <button
                onClick={() => {
                  const t = detailTeacher
                  setDetailTeacher(null)
                  handleOpenEdit(t)
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200 transition"
              >
                Edit Record
              </button>
              <button
                onClick={() => setDetailTeacher(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CREATE / EDIT TEACHER (UC-TEACHER-03 & 04) */}
      {/* ========================================================= */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/60 dark:border-white/10">
              <div>
                <h3 className="text-base font-bold text-stone-900 dark:text-white">
                  {editingTeacher ? 'Edit Faculty Record' : 'Register New Faculty Member'}
                </h3>
                <span className="text-xs text-brand-600 dark:text-brand-400 font-mono">
                  {editingTeacher
                    ? 'UC-TEACHER-04 (Edit Teacher) • teachers.edit'
                    : 'UC-TEACHER-03 (Create Teacher) • teachers.create'}
                </span>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mt-3 p-3 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40 text-xs flex items-center gap-2">
                <AlertTriangle size={14} className="shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-3.5 mt-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Eleanor"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="e.g. Vance"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) =>
                      setFormData({ ...formData, employeeId: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
                    placeholder="Auto-generated if empty"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Workload (Weekly Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="40"
                    value={formData.weeklyTeachingHours}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        weeklyTeachingHours: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="teacher@oakridge.edu"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {DEPARTMENTS.filter((d) => d !== 'All Departments').map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as any,
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Academic Qualifications
                </label>
                <input
                  type="text"
                  value={formData.qualifications}
                  onChange={(e) =>
                    setFormData({ ...formData, qualifications: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. M.Sc. in Applied Physics (Columbia University)"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Teaching Specialization
                </label>
                <input
                  type="text"
                  value={formData.specialization}
                  onChange={(e) =>
                    setFormData({ ...formData, specialization: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="e.g. Advanced Thermodynamics, Robotics, AP Prep"
                />
              </div>

              {/* Tag Adders for Assigned Classes & Subjects */}
              <div className="space-y-2 pt-2 border-t border-stone-200/50 dark:border-white/10">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Assigned Classes
                  </label>
                  <div className="flex gap-2 mb-1.5">
                    <input
                      type="text"
                      value={classInput}
                      onChange={(e) => setClassInput(e.target.value)}
                      placeholder="e.g. Grade 10-A"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddClass}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-white/10 dark:hover:bg-white/20 font-semibold text-xs"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.assignedClasses.map((cls) => (
                      <span
                        key={cls}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200 dark:border-brand-800/40"
                      >
                        {cls}
                        <button
                          type="button"
                          onClick={() => handleRemoveClass(cls)}
                          className="hover:text-rose-500"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Subjects Taught
                  </label>
                  <div className="flex gap-2 mb-1.5">
                    <input
                      type="text"
                      value={subjectInput}
                      onChange={(e) => setSubjectInput(e.target.value)}
                      placeholder="e.g. Advanced Biology"
                      className="flex-1 px-3 py-1.5 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubject}
                      className="px-3 py-1.5 rounded-xl bg-stone-200 hover:bg-stone-300 dark:bg-white/10 dark:hover:bg-white/20 font-semibold text-xs"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.subjectsTaught.map((sub) => (
                      <span
                        key={sub}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                      >
                        {sub}
                        <button
                          type="button"
                          onClick={() => handleRemoveSubject(sub)}
                          className="hover:text-rose-500"
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-800 dark:text-stone-200 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white transition shadow-sm"
                >
                  {editingTeacher ? 'Save Changes' : 'Create Teacher'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: DELETE CONFIRMATION (UC-TEACHER-05) */}
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
                  Delete Faculty Record
                </h3>
                <span className="text-xs text-rose-600 font-mono">
                  UC-TEACHER-05 • teachers.delete
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
              Are you sure you want to permanently remove{' '}
              <span className="font-bold text-stone-900 dark:text-white">
                "{deleteCandidate.name || deleteCandidate.firstName}"
              </span>{' '}
              ({deleteCandidate.employeeId}) from the faculty directory?
            </p>

            {deleteCandidate.assignedClasses?.length > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-800 dark:text-amber-300">
                <span className="font-bold block mb-0.5">Precondition Warning (409 Conflict):</span>
                This teacher is currently assigned to {deleteCandidate.assignedClasses.length} active classes ({deleteCandidate.assignedClasses.join(', ')}). Deletion will be rejected by the server until reassigned.
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
