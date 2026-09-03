import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  School,
  Plus,
  Search,
  Users,
  DoorOpen,
  BookOpen,
  Layers,
  Edit3,
  CalendarDays,
  Eye,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import { Link } from 'react-router-dom'
import {
  classesService,
  type ClassRecord,
  type CreateClassPayload,
  type UpdateClassPayload,
} from '@/services/classesService'
import { gradeLevelService, type GradeLevelRecord } from '@/services/gradeLevelService'
import { teacherService, type TeacherRecord } from '@/services/teacherService'

export default function Classes() {
  const { showToast } = useToast()
  const [classes, setClasses] = useState<ClassRecord[]>([])
  const [gradeLevels, setGradeLevels] = useState<GradeLevelRecord[]>([])
  const [teachers, setTeachers] = useState<TeacherRecord[]>([])
  const [loading, setLoading] = useState(true)

  // Filtering
  const [searchTerm, setSearchTerm] = useState('')
  const [gradeFilter, setGradeFilter] = useState('All')

  // Modals
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [viewModalData, setViewModalData] = useState<ClassRecord | null>(null)
  const [editModalData, setEditModalData] = useState<ClassRecord | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ClassRecord | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Forms
  const [formData, setFormData] = useState<CreateClassPayload>({
    name: '',
    gradeLevel: 'Grade 10',
    section: 'A',
    room: 'Room 101',
    classTeacher: 'Dr. John Whitfield',
    maxCapacity: 35,
    subjectsCount: 7,
    schedulePeriod: '08:00 - 15:30',
    description: '',
  })

  const [editForm, setEditForm] = useState<UpdateClassPayload>({
    name: '',
    gradeLevel: 'Grade 10',
    section: 'A',
    room: 'Room 101',
    classTeacher: 'Dr. John Whitfield',
    maxCapacity: 35,
    subjectsCount: 7,
    schedulePeriod: '08:00 - 15:30',
    status: 'Active',
    description: '',
  })

  const loadData = async () => {
    try {
      setLoading(true)
      const [classList, gradesList, teacherList] = await Promise.all([
        classesService.list(),
        gradeLevelService.list(),
        teacherService.list(),
      ])
      setClasses(classList)
      setGradeLevels(gradesList)
      setTeachers(teacherList)

      if (gradesList.length > 0) {
        setFormData((prev) => ({ ...prev, gradeLevel: gradesList[0].name }))
      }
      if (teacherList.length > 0) {
        setFormData((prev) => ({
          ...prev,
          classTeacher: `${teacherList[0].firstName} ${teacherList[0].lastName}`,
        }))
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to load class records', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // UC-CLASS-03: Create Class
  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.room.trim()) {
      showToast('Please provide a class name and room number', 'error')
      return
    }

    try {
      setSubmitting(true)
      await classesService.create(formData)
      showToast(`Class "${formData.name}" created successfully`, 'success')
      setCreateModalOpen(false)
      setFormData({
        name: '',
        gradeLevel: gradeLevels[0]?.name || 'Grade 10',
        section: 'A',
        room: 'Room 101',
        classTeacher: teachers[0] ? `${teachers[0].firstName} ${teachers[0].lastName}` : 'Staff Member',
        maxCapacity: 35,
        subjectsCount: 7,
        schedulePeriod: '08:00 - 15:30',
        description: '',
      })
      const updatedList = await classesService.list()
      setClasses(updatedList)
    } catch (err: any) {
      showToast(err?.message || 'Failed to create class', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-CLASS-04: Edit Class
  const openEditModal = (cls: ClassRecord) => {
    setEditModalData(cls)
    setEditForm({
      name: cls.name,
      gradeLevel: cls.gradeLevel,
      section: cls.section,
      room: cls.room,
      classTeacher: cls.classTeacher,
      maxCapacity: cls.maxCapacity,
      subjectsCount: cls.subjectsCount,
      schedulePeriod: cls.schedulePeriod,
      status: cls.status || 'Active',
      description: cls.description || '',
    })
  }

  const handleUpdateClass = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editModalData) return
    if (!editForm.name?.trim() || !editForm.room?.trim()) {
      showToast('Please provide class name and room', 'error')
      return
    }

    try {
      setSubmitting(true)
      await classesService.update(editModalData.id, editForm)
      showToast(`Class "${editForm.name}" updated successfully`, 'success')
      setEditModalData(null)
      const updatedList = await classesService.list()
      setClasses(updatedList)
    } catch (err: any) {
      showToast(err?.message || 'Failed to update class', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // UC-CLASS-05: Delete Class
  const handleDeleteClass = async () => {
    if (!deleteTarget) return
    try {
      setSubmitting(true)
      await classesService.delete(deleteTarget.id)
      showToast(`Class "${deleteTarget.name}" deleted successfully`, 'success')
      setDeleteTarget(null)
      const updatedList = await classesService.list()
      setClasses(updatedList)
    } catch (err: any) {
      showToast(err?.message || 'Failed to delete class', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const filteredClasses = classes.filter((cls) => {
    const matchesSearch =
      cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classTeacher.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesGrade = gradeFilter === 'All' || cls.gradeLevel === gradeFilter
    return matchesSearch && matchesGrade
  })

  return (
    <div id="classes-page" className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Class Sections"
          description="Manage academic class sections, homeroom teachers, enrolled capacities, and room assignments."
        />
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <Link
            to="/schedule"
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-surface-700 dark:text-surface-300 bg-surface-100 hover:bg-surface-200 dark:bg-surface-800 dark:hover:bg-surface-700 transition"
          >
            <CalendarDays className="w-4 h-4 text-surface-500" />
            <span>Master Timetable</span>
          </Link>
          <button
            id="btn-create-class"
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium shadow-xs transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Class</span>
          </button>
        </div>
      </div>

      {/* Search & Grade Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            id="input-search-classes"
            type="text"
            placeholder="Search class name, room, or teacher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-surface-0 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-xs text-surface-900 dark:text-surface-100 placeholder-surface-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            id="filter-grade-all"
            onClick={() => setGradeFilter('All')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              gradeFilter === 'All'
                ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 ring-1 ring-brand-200 dark:ring-brand-800'
                : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800'
            }`}
          >
            All Grades
          </button>
          {gradeLevels.map((gl) => (
            <button
              key={gl.id}
              id={`filter-grade-${gl.numericLevel}`}
              onClick={() => setGradeFilter(gl.name)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                gradeFilter === gl.name
                  ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300 ring-1 ring-brand-200 dark:ring-brand-800'
                  : 'text-surface-500 hover:text-surface-900 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              {gl.name}
            </button>
          ))}
        </div>
      </div>

      {/* UC-CLASS-01: Classes Cards Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-surface-400">
          <Loader2 className="w-6 h-6 animate-spin text-brand-500" />
          <p className="text-xs font-medium">Loading classes...</p>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="py-16 text-center bg-surface-50 dark:bg-surface-900/40 rounded-2xl border border-dashed border-surface-200 dark:border-surface-800 p-8">
          <School className="w-10 h-10 mx-auto text-surface-400 mb-3" />
          <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">No Classes Found</h3>
          <p className="text-xs text-surface-500 mt-1 max-w-sm mx-auto">
            No class sections match the current filters. Add a new class to begin assigning schedules and students.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const occupancyRate = Math.round((cls.studentCount / (cls.maxCapacity || 1)) * 100)
            const isFull = cls.studentCount >= cls.maxCapacity

            return (
              <div
                key={cls.id}
                id={`class-card-${cls.id}`}
                className="relative bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600 rounded-2xl p-5 shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/40">
                      {cls.gradeLevel} • Sec {cls.section}
                    </span>

                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        isFull
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      }`}
                    >
                      {cls.studentCount}/{cls.maxCapacity} Enrolled
                    </span>
                  </div>

                  {/* Title & Teacher */}
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100 tracking-tight">
                    {cls.name}
                  </h3>
                  <p className="text-xs text-surface-600 dark:text-surface-300 font-medium mt-1">
                    Advisor: <span className="text-surface-900 dark:text-surface-100 font-semibold">{cls.classTeacher}</span>
                  </p>

                  {/* Capacity Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-surface-500">
                      <span>Occupancy</span>
                      <span className="font-semibold text-surface-700 dark:text-surface-300">{occupancyRate}%</span>
                    </div>
                    <div className="w-full bg-surface-100 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 rounded-full ${
                          occupancyRate >= 95 ? 'bg-rose-500' : occupancyRate >= 80 ? 'bg-amber-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Class Info Box */}
                  <div className="grid grid-cols-2 gap-2 mt-4 p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800 text-xs">
                    <div className="flex items-center gap-1.5 text-surface-600 dark:text-surface-400">
                      <DoorOpen className="w-3.5 h-3.5 text-surface-400" />
                      <span>{cls.room}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-surface-600 dark:text-surface-400">
                      <BookOpen className="w-3.5 h-3.5 text-surface-400" />
                      <span>{cls.subjectsCount} Subjects</span>
                    </div>
                    <div className="col-span-2 flex items-center gap-1.5 text-[11px] text-surface-500 pt-1 border-t border-surface-200/50 dark:border-surface-700/50">
                      <CalendarDays className="w-3.5 h-3.5 text-surface-400" />
                      <span>Period: {cls.schedulePeriod}</span>
                    </div>
                  </div>
                </div>

                {/* Split CRUD Actions */}
                <div className="mt-5 pt-3 border-t border-surface-100 dark:border-surface-700 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {/* UC-CLASS-02: View Details */}
                    <button
                      id={`btn-view-class-${cls.id}`}
                      onClick={() => setViewModalData(cls)}
                      title="View Details"
                      className="p-2 rounded-lg text-surface-500 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-950/40 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* UC-CLASS-04: Edit */}
                    <button
                      id={`btn-edit-class-${cls.id}`}
                      onClick={() => openEditModal(cls)}
                      title="Edit Class"
                      className="p-2 rounded-lg text-surface-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* UC-CLASS-05: Delete */}
                    <button
                      id={`btn-delete-class-${cls.id}`}
                      onClick={() => setDeleteTarget(cls)}
                      title="Delete Class"
                      className="p-2 rounded-lg text-surface-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to={`/students?class=${encodeURIComponent(cls.name)}`}
                    className="text-xs font-semibold px-3 py-1.5 bg-surface-100 hover:bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-300 dark:hover:bg-surface-600 rounded-lg transition-all"
                  >
                    Roster
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* UC-CLASS-02: View Details Modal */}
      {viewModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-class-details"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-900/30">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <School className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Class Section Dossier</h3>
                  <p className="text-xs text-surface-500">Identifier: {viewModalData.id}</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-lg font-bold text-surface-900 dark:text-surface-100">{viewModalData.name}</h4>
                  <p className="text-xs text-surface-500">
                    {viewModalData.gradeLevel} • Section {viewModalData.section}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  {viewModalData.status || 'Active'}
                </span>
              </div>

              {viewModalData.description && (
                <p className="text-xs text-surface-600 dark:text-surface-300 p-3 bg-surface-50 dark:bg-surface-900/40 rounded-xl border border-surface-100 dark:border-surface-800">
                  {viewModalData.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-3 p-3.5 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800 text-xs">
                <div>
                  <span className="text-surface-400">Homeroom Advisor:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.classTeacher}</p>
                </div>
                <div>
                  <span className="text-surface-400">Assigned Classroom:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.room}</p>
                </div>
                <div>
                  <span className="text-surface-400">Daily Timing:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.schedulePeriod}</p>
                </div>
                <div>
                  <span className="text-surface-400">Core Curriculum:</span>
                  <p className="font-semibold text-surface-800 dark:text-surface-200 mt-0.5">{viewModalData.subjectsCount} subjects</p>
                </div>
              </div>

              <div className="p-3 bg-surface-50 dark:bg-surface-900/50 rounded-xl border border-surface-100 dark:border-surface-800 text-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-surface-500">Cohort Occupancy:</span>
                  <span className="font-bold text-surface-900 dark:text-surface-100">
                    {viewModalData.studentCount} of {viewModalData.maxCapacity} seats filled
                  </span>
                </div>
                <div className="w-full bg-surface-200 dark:bg-surface-700 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full"
                    style={{ width: `${Math.min(Math.round((viewModalData.studentCount / (viewModalData.maxCapacity || 1)) * 100), 100)}%` }}
                  />
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

      {/* UC-CLASS-03: Create Class Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-create-class"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-400">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Create Class Section</h3>
                  <p className="text-xs text-surface-500">Provision a new academic homeroom</p>
                </div>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClass} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Class Name *
                </label>
                <input
                  id="input-create-class-name"
                  type="text"
                  placeholder="e.g. Grade 10-C"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Grade Level *
                  </label>
                  <select
                    id="select-create-class-grade"
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  >
                    {gradeLevels.map((gl) => (
                      <option key={gl.id} value={gl.name}>
                        {gl.name}
                      </option>
                    ))}
                    {gradeLevels.length === 0 && (
                      <>
                        <option value="Grade 9">Grade 9</option>
                        <option value="Grade 10">Grade 10</option>
                        <option value="Grade 11">Grade 11</option>
                        <option value="Grade 12">Grade 12</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Section Code *
                  </label>
                  <input
                    id="input-create-class-section"
                    type="text"
                    placeholder="A, B, C..."
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Room Number *
                  </label>
                  <input
                    id="input-create-class-room"
                    type="text"
                    placeholder="e.g. Room 105"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Max Capacity *
                  </label>
                  <input
                    id="input-create-class-capacity"
                    type="number"
                    min={10}
                    max={60}
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Homeroom Class Teacher *
                </label>
                <select
                  id="select-create-class-teacher"
                  value={formData.classTeacher}
                  onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={`${t.firstName} ${t.lastName}`}>
                      {t.firstName} {t.lastName} ({t.department})
                    </option>
                  ))}
                  {teachers.length === 0 && (
                    <option value="Dr. John Whitfield">Dr. John Whitfield</option>
                  )}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Daily Period Schedule
                </label>
                <input
                  id="input-create-class-schedule"
                  type="text"
                  placeholder="08:00 - 15:30"
                  value={formData.schedulePeriod}
                  onChange={(e) => setFormData({ ...formData, schedulePeriod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                />
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
                  id="btn-submit-create-class"
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-4 py-2 font-semibold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create Class</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UC-CLASS-04: Edit Class Modal */}
      {editModalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-edit-class"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between p-5 border-b border-surface-200 dark:border-surface-700">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">Edit Class Section</h3>
                  <p className="text-xs text-surface-500">Update room, teacher, or capacity limits</p>
                </div>
              </div>
              <button
                onClick={() => setEditModalData(null)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateClass} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Class Name *
                </label>
                <input
                  id="input-edit-class-name"
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Room Number *
                  </label>
                  <input
                    id="input-edit-class-room"
                    type="text"
                    value={editForm.room}
                    onChange={(e) => setEditForm({ ...editForm, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Max Capacity *
                  </label>
                  <input
                    id="input-edit-class-capacity"
                    type="number"
                    min={10}
                    max={60}
                    value={editForm.maxCapacity}
                    onChange={(e) => setEditForm({ ...editForm, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                  Homeroom Teacher *
                </label>
                <select
                  id="select-edit-class-teacher"
                  value={editForm.classTeacher}
                  onChange={(e) => setEditForm({ ...editForm, classTeacher: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                >
                  {teachers.map((t) => (
                    <option key={t.id} value={`${t.firstName} ${t.lastName}`}>
                      {t.firstName} {t.lastName} ({t.department})
                    </option>
                  ))}
                  {teachers.length === 0 && (
                    <option value={editForm.classTeacher}>{editForm.classTeacher}</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Daily Schedule
                  </label>
                  <input
                    id="input-edit-class-schedule"
                    type="text"
                    value={editForm.schedulePeriod}
                    onChange={(e) => setEditForm({ ...editForm, schedulePeriod: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-surface-700 dark:text-surface-300 mb-1.5">
                    Status
                  </label>
                  <select
                    id="select-edit-class-status"
                    value={editForm.status}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl border border-surface-300 dark:border-surface-600 bg-surface-0 dark:bg-surface-900 text-surface-900 dark:text-surface-100 text-xs font-medium focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
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
                  id="btn-submit-edit-class"
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

      {/* UC-CLASS-05: Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            id="modal-delete-class"
            className="bg-surface-0 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6 text-center animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-surface-900 dark:text-surface-100">
              Delete Class Section?
            </h3>
            <p className="text-xs text-surface-500 mt-2">
              Are you sure you want to delete <strong className="text-surface-800 dark:text-surface-200">"{deleteTarget.name}"</strong>?
              {deleteTarget.studentCount > 0 ? (
                <span className="block mt-2 font-bold text-rose-600 dark:text-rose-400">
                  Notice: This class has {deleteTarget.studentCount} currently enrolled students. You must reassign students to another section before deletion.
                </span>
              ) : (
                ' This action is permanent and removes associated room bookings.'
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
                id="btn-confirm-delete-class"
                onClick={handleDeleteClass}
                disabled={submitting}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition-all disabled:opacity-50"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
