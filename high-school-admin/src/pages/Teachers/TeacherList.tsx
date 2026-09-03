import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  GraduationCap,
  Plus,
  Search,
  Mail,
  Phone,
  BookOpen,
  Award,
  Edit3,
  Trash2,
  Eye,
  X,
  Loader2,
  AlertCircle,
  Briefcase,
  Clock,
  CheckCircle2,
  Star,
  Layers,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import {
  teacherService,
  type TeacherRecord,
  type CreateTeacherPayload,
  type UpdateTeacherPayload,
} from '@/services/teacherService'

export default function TeacherList() {
  const { showToast } = useToast()
  const [teachers, setTeachers] = useState<TeacherRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalData, setViewModalData] = useState<TeacherRecord | null>(null)
  const [editModalData, setEditModalData] = useState<TeacherRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<TeacherRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Forms
  const [formData, setFormData] = useState<CreateTeacherPayload>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Science',
    position: 'Faculty Member',
    qualification: "Master's Degree",
    specialization: 'Molecular Biology',
    experienceYears: 4,
    weeklyTeachingHours: 18,
    subjects: ['Biology'],
    assignedClasses: ['Grade 10-A'],
  })

  const [editForm, setEditForm] = useState<UpdateTeacherPayload>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: 'Science',
    position: 'Faculty Member',
    qualification: "Master's Degree",
    specialization: '',
    experienceYears: 4,
    weeklyTeachingHours: 18,
    status: 'active',
  })

  const loadTeachers = async () => {
    try {
      setLoading(true)
      const data = await teacherService.list()
      setTeachers(data)
    } catch (err: any) {
      showToast(err?.message || 'Failed to load teachers', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTeachers()
  }, [])

  // UC-TEACHER-03: Create
  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      showToast('Please provide first name, last name, and institutional email', 'error')
      return
    }

    try {
      setSubmitting(true)
      await teacherService.create(formData)
      showToast(`Teacher "${formData.firstName} ${formData.lastName}" registered successfully`, 'success')
      setCreateModalOpen(false)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        department: 'Science',
        position: 'Faculty Member',
        qualification: "Master's Degree",
        specialization: '',
        experienceYears: 3,
        weeklyTeachingHours: 18,
        subjects: ['General Studies'],
        assignedClasses: [],
      })
      await loadTeachers()
    } catch (err: any) {
      showToast(err?.message || 'Failed to create teacher record', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-TEACHER-04: Edit
  const openEditModal = (t: TeacherRecord) => {
    setEditModalData(t)
    setEditForm({
      firstName: t.firstName,
      lastName: t.lastName,
      email: t.email,
      phone: t.phone,
      department: t.department,
      position: t.position,
      qualification: t.qualification,
      specialization: t.specialization,
      experienceYears: t.experienceYears,
      weeklyTeachingHours: t.weeklyTeachingHours,
      status: t.status,
    })
  }

  const handleUpdateTeacher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editModalData) return
    if (!editForm.firstName?.trim() || !editForm.lastName?.trim() || !editForm.email?.trim()) {
      showToast('Please provide name and email', 'error')
      return
    }

    try {
      setSubmitting(true)
      await teacherService.update(editModalData.id, editForm)
      showToast(`Teacher record updated successfully`, 'success')
      setEditModalData(null)
      await loadTeachers()
    } catch (err: any) {
      showToast(err?.message || 'Failed to update teacher record', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-TEACHER-05: Delete
  const handleDeleteTeacher = async () => {
    if (!deleteTarget) return
    try {
      setSubmitting(true)
      await teacherService.delete(deleteTarget.id)
      showToast(`Teacher "${deleteTarget.firstName} ${deleteTarget.lastName}" removed successfully`, 'success')
      setDeleteTarget(null)
      await loadTeachers()
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete teacher', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const departments = Array.from(new Set(teachers.map((t) => t.department))).filter(Boolean)

  const filteredTeachers = teachers.filter((t) => {
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase()
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDept = departmentFilter === 'All' || t.department === departmentFilter
    return matchesSearch && matchesDept
  })

  return (
    <div id="teachers-page" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Faculty & Teachers"
          description="Manage academic faculty personnel, department assignments, qualifications, and teaching loads."
        />
        <button
          id="btn-create-teacher"
          onClick={() => setCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium shadow-xs transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Faculty Member</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            id="input-search-teachers"
            type="text"
            placeholder="Search by name, ID, department, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-xs text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            id="filter-dept-all"
            onClick={() => setDepartmentFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              departmentFilter === 'All'
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 ring-1 ring-brand-200 dark:ring-brand-800'
                : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            All Departments
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              id={`filter-dept-${dept.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                departmentFilter === dept
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 ring-1 ring-brand-200 dark:ring-brand-800'
                : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* UC-TEACHER-01: Teachers Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-surface-400">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <p className="text-xs font-medium">Loading faculty roster...</p>
        </div>
      ) : filteredTeachers.length === 0 ? (
        <div className="py-16 text-center bg-surface-50 dark:bg-surface-900/40 rounded-2xl border border-dashed border-surface-200 dark:border-surface-800 p-8">
          <GraduationCap className="w-10 h-10 mx-auto text-surface-400 mb-3" />
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">No Faculty Found</h3>
          <p className="text-xs text-surface-500 mt-1 max-w-sm mx-auto">
            No instructors match the search or department filter. Register a new teacher to assign classes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTeachers.map((teacher) => (
            <div
              key={teacher.id}
              id={`teacher-card-${teacher.id}`}
              className="relative bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header Profile Info */}
                <div className="flex items-start gap-3.5 mb-3">
                  <img
                    src={teacher.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop'}
                    alt={`${teacher.firstName} ${teacher.lastName}`}
                    className="w-12 h-12 rounded-xl object-cover ring-1 ring-surface-200 dark:ring-surface-700 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 tracking-tight truncate">
                        {teacher.firstName} {teacher.lastName}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          teacher.status === 'active'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/60'
                        }`}
                      >
                        {teacher.status}
                      </span>
                    </div>
                    <p className="text-xs text-surface-500 truncate">{teacher.position} • {teacher.department}</p>
                    <p className="text-[11px] font-mono text-brand-600 dark:text-brand-400 mt-0.5">{teacher.teacherId}</p>
                  </div>
                </div>

                {/* Contact & Qualifications Box */}
                <div className="p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl space-y-1.5 text-xs text-surface-600 dark:text-surface-400 border border-surface-100 dark:border-surface-800">
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                    <span className="truncate">{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Award className="w-3.5 h-3.5 text-surface-400 shrink-0" />
                    <span className="truncate">{teacher.qualification}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-surface-200/50 dark:border-surface-700/50">
                    <span className="flex items-center gap-1.5 text-surface-500">
                      <Clock className="w-3.5 h-3.5 text-surface-400" /> Teaching Load:
                    </span>
                    <span className="font-semibold text-surface-800 dark:text-surface-200">
                      {teacher.weeklyTeachingHours} hrs/wk
                    </span>
                  </div>
                </div>

                {/* Classes & Subjects */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {teacher.assignedClasses.map((cls) => (
                    <span
                      key={cls}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300"
                    >
                      {cls}
                    </span>
                  ))}
                  {teacher.subjects.map((sub) => (
                    <span
                      key={sub}
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200/50"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons: Split CRUD operations */}
              <div className="mt-5 pt-3 border-t border-surface-100 dark:border-surface-700 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {/* UC-TEACHER-02: View Details */}
                  <button
                    id={`btn-view-teacher-${teacher.id}`}
                    onClick={() => setViewModalData(teacher)}
                    title="View Details"
                    className="p-2 rounded-lg text-surface-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* UC-TEACHER-04: Edit */}
                  <button
                    id={`btn-edit-teacher-${teacher.id}`}
                    onClick={() => openEditModal(teacher)}
                    title="Edit Teacher Record"
                    className="p-2 rounded-lg text-surface-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {/* UC-TEACHER-05: Delete */}
                  <button
                    id={`btn-delete-teacher-${teacher.id}`}
                    onClick={() => setDeleteTarget(teacher)}
                    title="Delete Teacher"
                    className="p-2 rounded-lg text-surface-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-md border border-amber-200/60">
                  <Star className="w-3 h-3 fill-current" />
                  {teacher.performanceRating || 4.8}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* UC-TEACHER-02: View Details Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-teacher-details"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/30">
              <div className="flex items-center gap-3">
                <img
                  src={viewModalData.avatarUrl}
                  alt={viewModalData.firstName}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-surface-200 dark:ring-surface-700"
                />
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
                    {viewModalData.firstName} {viewModalData.lastName}
                  </h3>
                  <p className="text-xs text-surface-500">
                    {viewModalData.teacherId} • {viewModalData.position}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewModalData(null)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800 text-xs">
                <div>
                  <span className="text-surface-400">Department:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.department}</p>
                </div>
                <div>
                  <span className="text-surface-400">Status:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5 capitalize">{viewModalData.status}</p>
                </div>
                <div>
                  <span className="text-surface-400">Email Address:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.email}</p>
                </div>
                <div>
                  <span className="text-surface-400">Phone Contact:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.phone}</p>
                </div>
                <div>
                  <span className="text-surface-400">Highest Degree:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.qualification}</p>
                </div>
                <div>
                  <span className="text-surface-400">Specialization:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.specialization || 'General Science'}</p>
                </div>
                <div>
                  <span className="text-surface-400">Experience:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.experienceYears} Years</p>
                </div>
                <div>
                  <span className="text-surface-400">Weekly Teaching:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.weeklyTeachingHours} Hours/Week</p>
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-surface-900 dark:text-surface-100 mb-1.5">Assigned Class Sections</h5>
                <div className="flex flex-wrap gap-2">
                  {viewModalData.assignedClasses.map((cls) => (
                    <span key={cls} className="px-2.5 py-1 rounded-lg text-xs bg-surface-100 dark:bg-surface-700 text-surface-800 dark:text-surface-200 font-medium">
                      {cls}
                    </span>
                  ))}
                  {viewModalData.assignedClasses.length === 0 && (
                    <span className="text-xs text-surface-400 italic">No assigned classes</span>
                  )}
                </div>
              </div>

              <div>
                <h5 className="text-xs font-bold text-surface-900 dark:text-surface-100 mb-1.5">Subjects Taught</h5>
                <div className="flex flex-wrap gap-2">
                  {viewModalData.subjects.map((sub) => (
                    <span key={sub} className="px-2.5 py-1 rounded-lg text-xs bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 font-medium border border-brand-200 dark:border-brand-800">
                      {sub}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface-50/50 dark:bg-surface-900/30 border-t border-surface-200 dark:border-surface-700 flex justify-end">
              <button
                onClick={() => setViewModalData(null)}
                className="px-4 py-2 text-xs font-semibold bg-surface-200 dark:bg-surface-700 text-surface-800 dark:text-surface-200 rounded-xl hover:bg-surface-300 dark:hover:bg-surface-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UC-TEACHER-03: Create Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-create-teacher"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Register Faculty Member</h3>
                  <p className="text-xs text-surface-500">Add teacher credentials to institutional registry</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTeacher} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    First Name *
                  </label>
                  <input
                    id="input-create-teacher-first-name"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="input-create-teacher-last-name"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Institutional Email *
                  </label>
                  <input
                    id="input-create-teacher-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="input-create-teacher-phone"
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Department
                  </label>
                  <select
                    id="select-create-teacher-department"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Languages">Languages</option>
                    <option value="Arts">Arts</option>
                    <option value="Physical Education">Physical Education</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Position Title
                  </label>
                  <input
                    id="input-create-teacher-position"
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Degree Qualification
                  </label>
                  <input
                    id="input-create-teacher-qualification"
                    type="text"
                    placeholder="M.Sc. Mathematics, Ph.D..."
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Weekly Teaching Hours
                  </label>
                  <input
                    id="input-create-teacher-hours"
                    type="number"
                    min={4}
                    max={40}
                    value={formData.weeklyTeachingHours}
                    onChange={(e) => setFormData({ ...formData, weeklyTeachingHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-surface-200 dark:border-surface-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-create-teacher"
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Faculty</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UC-TEACHER-04: Edit Modal */}
      {editModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-edit-teacher"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Edit Faculty Profile</h3>
                  <p className="text-xs text-surface-500">Update academic workload or contact info</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalData(null)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTeacher} className="p-5 space-y-3.5 text-xs max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    First Name *
                  </label>
                  <input
                    id="input-edit-teacher-first-name"
                    type="text"
                    value={editForm.firstName}
                    onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Last Name *
                  </label>
                  <input
                    id="input-edit-teacher-last-name"
                    type="text"
                    value={editForm.lastName}
                    onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Institutional Email *
                  </label>
                  <input
                    id="input-edit-teacher-email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Status
                  </label>
                  <select
                    id="select-edit-teacher-status"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="active">Active</option>
                    <option value="on-leave">On Leave</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Department
                  </label>
                  <select
                    id="select-edit-teacher-department"
                    value={editForm.department}
                    onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Languages">Languages</option>
                    <option value="Arts">Arts</option>
                    <option value="Physical Education">Physical Education</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1">
                    Weekly Teaching Hours
                  </label>
                  <input
                    id="input-edit-teacher-hours"
                    type="number"
                    min={4}
                    max={40}
                    value={editForm.weeklyTeachingHours}
                    onChange={(e) => setEditForm({ ...editForm, weeklyTeachingHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-surface-200 dark:border-surface-700 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalData(null)}
                  className="px-4 py-2 font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-edit-teacher"
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UC-TEACHER-05: Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-delete-teacher"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
              Remove Faculty Member?
            </h3>
            <p className="text-xs text-surface-500 mt-2">
              Are you sure you want to remove <strong className="text-surface-800 dark:text-surface-200">"{deleteTarget.firstName} {deleteTarget.lastName}"</strong>?
              {deleteTarget.assignedClasses.length > 0 ? (
                <span className="block mt-2 font-bold text-rose-600 dark:text-rose-400">
                  Notice: This faculty member is currently assigned as homeroom advisor to {deleteTarget.assignedClasses.join(', ')}. Please reassign active classes first.
                </span>
              ) : (
                ' This action will detach all associated timetable slots.'
              )}
            </p>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-xs font-semibold text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl"
              >
                Cancel
              </button>
              <button
                id="btn-confirm-delete-teacher"
                onClick={handleDeleteTeacher}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Removal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
