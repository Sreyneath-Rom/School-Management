import React, { useEffect, useState } from 'react'
import { X, BookOpen, Plus, Trash2 } from 'lucide-react'
import type { SubjectItem, CreateSubjectPayload, UpdateSubjectPayload } from '@/services/subjectService'

interface SubjectModalProps {
  isOpen: boolean
  isSubmitting: boolean
  subjectToEdit: SubjectItem | null
  onClose: () => void
  onSubmit: (data: CreateSubjectPayload | UpdateSubjectPayload) => void
}

const DEPARTMENTS = [
  'Mathematics',
  'Science',
  'Languages',
  'Social Studies',
  'Arts',
  'Technology',
  'Physical Education',
]

const CATEGORIES: ('Core' | 'Elective' | 'AP / Advanced')[] = ['Core', 'Elective', 'AP / Advanced']

const GRADE_LEVELS = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  isSubmitting,
  subjectToEdit,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [department, setDepartment] = useState(DEPARTMENTS[0])
  const [category, setCategory] = useState<'Core' | 'Elective' | 'AP / Advanced'>('Core')
  const [credits, setCredits] = useState(3)
  const [weeklyHours, setWeeklyHours] = useState(4)
  const [description, setDescription] = useState('')
  const [gradeLevel, setGradeLevel] = useState('Grade 10')
  const [teachers, setTeachers] = useState<string[]>([])
  const [newTeacherName, setNewTeacherName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (subjectToEdit) {
      setCode(subjectToEdit.code)
      setName(subjectToEdit.name)
      setDepartment(subjectToEdit.department)
      setCategory(subjectToEdit.category || 'Core')
      setCredits(subjectToEdit.credits || 3)
      setWeeklyHours(subjectToEdit.weeklyHours || 4)
      setDescription(subjectToEdit.description || '')
      setGradeLevel(subjectToEdit.gradeLevel || 'Grade 10')
      setTeachers(subjectToEdit.teachers?.map((t) => t.name) || [])
    } else {
      setCode('')
      setName('')
      setDepartment(DEPARTMENTS[0])
      setCategory('Core')
      setCredits(3)
      setWeeklyHours(4)
      setDescription('')
      setGradeLevel('Grade 10')
      setTeachers([])
    }
    setNewTeacherName('')
    setError(null)
  }, [subjectToEdit, isOpen])

  if (!isOpen) return null

  const handleAddTeacher = () => {
    if (!newTeacherName.trim()) return
    setTeachers((prev) => [...prev, newTeacherName.trim()])
    setNewTeacherName('')
  }

  const handleRemoveTeacher = (idx: number) => {
    setTeachers((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !name.trim()) {
      setError('Subject code and subject name are required')
      return
    }

    onSubmit({
      code: code.trim().toUpperCase(),
      name: name.trim(),
      department,
      category,
      credits: Number(credits),
      weeklyHours: Number(weeklyHours),
      description: description.trim(),
      gradeLevel,
      teachers,
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800/80 dark:bg-slate-900/95"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Light in Top-Right Corner */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-gradient-to-br from-indigo-400/20 via-purple-400/15 to-transparent blur-3xl opacity-70" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 bg-white/60 px-6 py-4.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/25">
              <BookOpen size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {subjectToEdit ? 'Edit Subject Details' : 'Add New Subject'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Configure curriculum course parameters & faculty assignments
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {error && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Course Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. MTH-101"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 font-mono text-xs sm:text-sm font-bold uppercase text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Subject Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Advanced Calculus & Algebra"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Credits / Units
                </label>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={credits}
                  onChange={(e) => setCredits(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Hours / Week
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(Number(e.target.value))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Grade Level
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  {GRADE_LEVELS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Course Syllabus / Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Outline learning outcomes, modules, prerequisite courses..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            {/* Teachers */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                Assigned Faculty Teachers
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="Teacher name (e.g. Dr. John Whitfield)"
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-medium text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTeacher()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTeacher}
                  className="inline-flex items-center gap-1 rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 transition cursor-pointer shadow-xs"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              {teachers.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {teachers.map((t, idx) => (
                    <span
                      key={idx}
                      className="flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-300"
                    >
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTeacher(idx)}
                        className="rounded-full p-0.5 text-indigo-400 hover:text-rose-600 transition cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 bg-slate-50/60 px-6 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl border border-slate-200/80 bg-slate-100/80 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !code.trim() || !name.trim()}
              className="rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : subjectToEdit ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
