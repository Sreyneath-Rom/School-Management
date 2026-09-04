import { useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  GraduationCap,
  Plus,
  Search,
  Users,
  BookOpen,
  Award,
  Edit3,
  Trash2,
  X,
  AlertCircle,
  TrendingUp,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'

export interface GradeLevel {
  id: string
  code: string // e.g. "G-10"
  name: string // e.g. "Grade 10"
  alias: string // e.g. "Sophomore"
  levelOrder: number // e.g. 10
  minPassingScore: number // e.g. 60
  headCoordinator: string
  totalClasses: number
  enrolledStudents: number
  maxCapacity: number
  averageGpa: number
  status: 'Active' | 'Archived'
  description: string
}

const INITIAL_GRADE_LEVELS: GradeLevel[] = [
  {
    id: 'gl-7',
    code: 'G-07',
    name: 'Grade 7 (ថ្នាក់ទី ៧)',
    alias: 'Lower Secondary Yr 1',
    levelOrder: 7,
    minPassingScore: 50,
    headCoordinator: 'Sokha Chea',
    totalClasses: 4,
    enrolledStudents: 142,
    maxCapacity: 160,
    averageGpa: 3.28,
    status: 'Active',
    description: 'First year of Lower Secondary (MoEYS). Focuses on Khmer Literature, Mathematics, Integrated Science, Social Studies, English/French, and Life Skills.',
  },
  {
    id: 'gl-8',
    code: 'G-08',
    name: 'Grade 8 (ថ្នាក់ទី ៨)',
    alias: 'Lower Secondary Yr 2',
    levelOrder: 8,
    minPassingScore: 50,
    headCoordinator: 'Rithy Chan',
    totalClasses: 4,
    enrolledStudents: 138,
    maxCapacity: 160,
    averageGpa: 3.32,
    status: 'Active',
    description: 'Second year of Lower Secondary (MoEYS). Expands on algebra, world & Cambodian geography, general biology, and physical chemistry foundations.',
  },
  {
    id: 'gl-9',
    code: 'G-09',
    name: 'Grade 9 (ថ្នាក់ទី ៩)',
    alias: 'Dip. 9 Graduation Year',
    levelOrder: 9,
    minPassingScore: 50,
    headCoordinator: 'Vannak Yin',
    totalClasses: 4,
    enrolledStudents: 135,
    maxCapacity: 150,
    averageGpa: 3.40,
    status: 'Active',
    description: 'Lower Secondary completion year culminating in the National Lower Secondary School Diploma Examination (ប្រឡងសញ្ញាបត្រមធ្យមសិក្សាបឋមភូមិ - Dip. 9).',
  },
  {
    id: 'gl-10',
    code: 'G-10',
    name: 'Grade 10 (ថ្នាក់ទី ១០)',
    alias: 'Upper Secondary Foundation',
    levelOrder: 10,
    minPassingScore: 50,
    headCoordinator: 'Dr. John Whitfield',
    totalClasses: 4,
    enrolledStudents: 130,
    maxCapacity: 140,
    averageGpa: 3.48,
    status: 'Active',
    description: 'Upper Secondary foundation year introducing specialized sciences (Physics, Chemistry, Biology, Earth Science), advanced math, history, and ICT before stream selection.',
  },
  {
    id: 'gl-11',
    code: 'G-11',
    name: 'Grade 11 (ថ្នាក់ទី ១១)',
    alias: 'Science & Social Streams',
    levelOrder: 11,
    minPassingScore: 50,
    headCoordinator: 'Dr. Vicheth Keo',
    totalClasses: 4,
    enrolledStudents: 125,
    maxCapacity: 140,
    averageGpa: 3.55,
    status: 'Active',
    description: 'Upper Secondary specialization year divided into Science Track (ថ្នាក់វិទ្យាសាស្ត្រ) and Social Science Track (ថ្នាក់វិទ្យាសាស្ត្រសង្គម).',
  },
  {
    id: 'gl-12',
    code: 'G-12',
    name: 'Grade 12 (ថ្នាក់ទី ១២)',
    alias: 'Bac II National Exam Year',
    levelOrder: 12,
    minPassingScore: 50,
    headCoordinator: 'Elena Vance',
    totalClasses: 4,
    enrolledStudents: 120,
    maxCapacity: 130,
    averageGpa: 3.68,
    status: 'Active',
    description: 'Final secondary school year culminating in the National High School Baccalaureate Examination (ប្រឡងសញ្ញាបត្រមធ្យមសិក្សាទុតិយភូមិ - Bac II) for higher education entrance.',
  },
]

export default function GradeLevels() {
  const { showToast } = useToast()
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>(INITIAL_GRADE_LEVELS)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Archived'>('All')

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingGradeLevel, setEditingGradeLevel] = useState<GradeLevel | null>(null)
  const [deleteCandidate, setDeleteCandidate] = useState<GradeLevel | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    alias: '',
    levelOrder: 9,
    minPassingScore: 60,
    headCoordinator: '',
    maxCapacity: 140,
    description: '',
    status: 'Active' as 'Active' | 'Archived',
  })

  const resetForm = () => {
    setFormData({
      code: '',
      name: '',
      alias: '',
      levelOrder: 9,
      minPassingScore: 60,
      headCoordinator: '',
      maxCapacity: 140,
      description: '',
      status: 'Active',
    })
    setEditingGradeLevel(null)
  }

  const handleOpenCreate = () => {
    resetForm()
    setIsCreateModalOpen(true)
  }

  const handleOpenEdit = (gl: GradeLevel) => {
    setEditingGradeLevel(gl)
    setFormData({
      code: gl.code,
      name: gl.name,
      alias: gl.alias,
      levelOrder: gl.levelOrder,
      minPassingScore: gl.minPassingScore,
      headCoordinator: gl.headCoordinator,
      maxCapacity: gl.maxCapacity,
      description: gl.description,
      status: gl.status,
    })
    setIsCreateModalOpen(true)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.code.trim()) {
      showToast('Please provide both a grade code and name', 'error')
      return
    }

    if (editingGradeLevel) {
      // Update
      setGradeLevels((prev) =>
        prev.map((g) =>
          g.id === editingGradeLevel.id
            ? {
                ...g,
                ...formData,
              }
            : g
        )
      )
      showToast(`Grade level "${formData.name}" updated successfully`, 'success')
    } else {
      // Create
      const newGradeLevel: GradeLevel = {
        id: `gl-${Date.now()}`,
        ...formData,
        totalClasses: 0,
        enrolledStudents: 0,
        averageGpa: 3.0,
      }
      setGradeLevels((prev) => [...prev, newGradeLevel].sort((a, b) => a.levelOrder - b.levelOrder))
      showToast(`Grade level "${formData.name}" added to academic structure`, 'success')
    }

    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleDelete = () => {
    if (!deleteCandidate) return

    // Precondition check: dependency rules
    if (deleteCandidate.enrolledStudents > 0 || deleteCandidate.totalClasses > 0) {
      showToast(
        `Cannot delete "${deleteCandidate.name}": has ${deleteCandidate.totalClasses} active classes and ${deleteCandidate.enrolledStudents} students. Deactivate or reassign first.`,
        'error'
      )
      setDeleteCandidate(null)
      return
    }

    setGradeLevels((prev) => prev.filter((g) => g.id !== deleteCandidate.id))
    showToast(`Grade level "${deleteCandidate.name}" removed successfully`, 'success')
    setDeleteCandidate(null)
  }

  const filteredGrades = gradeLevels.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      g.headCoordinator.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'All' || g.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Total summary statistics
  const totalStudents = gradeLevels.reduce((acc, curr) => acc + curr.enrolledStudents, 0)
  const totalClasses = gradeLevels.reduce((acc, curr) => acc + curr.totalClasses, 0)
  const avgSystemGpa = (
    gradeLevels.reduce((acc, curr) => acc + curr.averageGpa, 0) / (gradeLevels.length || 1)
  ).toFixed(2)

  return (
    <div className="space-y-6 pb-12">
      {/* Page Heading with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Grade / Level Management"
          subtitle="Manage academic tiers, grade hierarchies, passing benchmarks, and class enrollment quotas (UC-GRADE-01 / BR-11)."
        />
        <button
          id="btn-create-grade-level"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Add Grade Level
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Levels</span>
            <span className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
              <GraduationCap className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{gradeLevels.length}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Active Academic Tiers</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Enrolled</span>
            <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <Users className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalStudents}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Across All Grade Levels</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Class Sections</span>
            <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400">
              <BookOpen className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{totalClasses}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Assigned Academic Classes</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Average GPA</span>
            <span className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400">
              <Award className="w-5 h-5" />
            </span>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avgSystemGpa}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Cumulative Institutional GPA</p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search grade level, coordinator, alias..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500">Status:</span>
          {(['All', 'Active', 'Archived'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                statusFilter === st
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Grade Levels Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredGrades.map((gl) => {
          const capacityPercent = Math.min(100, Math.round((gl.enrolledStudents / gl.maxCapacity) * 100))
          return (
            <div
              key={gl.id}
              id={`grade-card-${gl.id}`}
              className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-brand-500/40 transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {gl.code}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {gl.name}
                    </h3>
                    <span className="text-xs font-medium text-slate-400">({gl.alias})</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {gl.description}
                  </p>
                </div>

                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                      gl.status === 'Active'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {gl.status}
                  </span>
                  <button
                    onClick={() => handleOpenEdit(gl)}
                    title="Edit Grade Level"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteCandidate(gl)}
                    title="Delete Grade Level"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <span className="text-[11px] text-slate-400 block">Classes</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {gl.totalClasses} sections
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Pass Threshold</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {gl.minPassingScore}%
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Average GPA</span>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {gl.averageGpa.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Enrollment Capacity Bar */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-500 font-medium">
                    Enrollment: {gl.enrolledStudents} / {gl.maxCapacity} students
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {capacityPercent}% capacity
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      capacityPercent > 90
                        ? 'bg-rose-500'
                        : capacityPercent > 75
                        ? 'bg-amber-500'
                        : 'bg-brand-600'
                    }`}
                    style={{ width: `${capacityPercent}%` }}
                  />
                </div>
              </div>

              {/* Coordinator Footer */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                <span>Head Coordinator: <strong className="text-slate-700 dark:text-slate-300">{gl.headCoordinator}</strong></span>
                <span>Order: Level {gl.levelOrder}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal: Create or Edit Grade Level */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-2 rounded-xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
                  <GraduationCap className="w-5 h-5" />
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {editingGradeLevel ? 'Edit Grade / Level' : 'Create Grade / Level'}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsCreateModalOpen(false)
                  resetForm()
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Level Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. G-10"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Level Order (1-12) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={12}
                    value={formData.levelOrder}
                    onChange={(e) => setFormData({ ...formData, levelOrder: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Grade Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grade 10"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Alias / Tier Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sophomore"
                    value={formData.alias}
                    onChange={(e) => setFormData({ ...formData, alias: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Pass Score Cutoff (%)
                  </label>
                  <input
                    type="number"
                    min={40}
                    max={100}
                    value={formData.minPassingScore}
                    onChange={(e) => setFormData({ ...formData, minPassingScore: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Max Student Capacity
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Head Coordinator / Dean
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. John Whitfield"
                  value={formData.headCoordinator}
                  onChange={(e) => setFormData({ ...formData, headCoordinator: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Description / Curriculum Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Describe academic focus, required subjects, or tracks..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="Active">Active</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateModalOpen(false)
                    resetForm()
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-xs transition"
                >
                  {editingGradeLevel ? 'Save Changes' : 'Create Level'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2.5 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400">
                <AlertCircle className="w-6 h-6" />
              </span>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-slate-100">
                  Delete Grade Level?
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Are you sure you want to remove <strong>{deleteCandidate.name}</strong>?
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              Dependency check: Grade levels with active classes or enrolled students cannot be deleted per business rules (UC-GRADE-01 / BR-11).
            </p>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition"
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
