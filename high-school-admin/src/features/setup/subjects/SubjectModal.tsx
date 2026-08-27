// src/features/setup/subjects/SubjectModal.tsx
import React, { useEffect, useState } from 'react'
import { X, BookOpen, Plus, Trash2 } from 'lucide-react'
import Button from '@/components/common/Button'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[30px] glass-strong p-6 sm:p-7 shadow-2xl border border-text-main/15">
        <div className="flex items-center justify-between pb-4 border-b border-text-main/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">
                {subjectToEdit ? 'Edit Subject' : 'Add New Subject'}
              </h2>
              <p className="text-xs text-text-main/55">Configure curriculum course parameters</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 hover:text-text-main transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-2xl bg-error/10 border border-error/20 p-3 text-xs text-error">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Course Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. MTH-101"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 font-mono text-sm uppercase text-text-main outline-none transition focus:border-brand-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Subject Title *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Advanced Calculus & Algebra"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-3 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d} className="bg-slate-800 text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-3 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-slate-800 text-white">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Credits / Units
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Hours / Week
              </label>
              <input
                type="number"
                min={1}
                max={20}
                value={weeklyHours}
                onChange={(e) => setWeeklyHours(Number(e.target.value))}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Grade Level
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-3 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              >
                {GRADE_LEVELS.map((g) => (
                  <option key={g} value={g} className="bg-slate-800 text-white">
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
              Course Syllabus / Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline learning outcomes, modules, prerequisite courses..."
              className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
            />
          </div>

          {/* Teachers */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-2">
              Assigned Faculty Teachers
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTeacherName}
                onChange={(e) => setNewTeacherName(e.target.value)}
                placeholder="Teacher name (e.g. Dr. John Whitfield)"
                className="flex-1 rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2 text-sm text-text-main outline-none transition focus:border-brand-500"
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
                className="inline-flex items-center gap-1 rounded-2xl bg-text-main/10 px-4 py-2 text-xs font-bold text-text-main hover:bg-text-main/15 transition cursor-pointer"
              >
                <Plus size={14} /> Add
              </button>
            </div>

            {teachers.length > 0 && (
              <div className="mt-2.5 flex flex-wrap gap-2">
                {teachers.map((t, idx) => (
                  <span
                    key={idx}
                    className="flex items-center gap-1.5 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-300"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => handleRemoveTeacher(idx)}
                      className="rounded p-0.5 hover:text-error transition"
                    >
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-text-main/10 flex items-center justify-end gap-3">
            <Button variant="glass" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="solid" type="submit" disabled={isSubmitting || !code.trim() || !name.trim()}>
              {isSubmitting ? 'Saving...' : subjectToEdit ? 'Update Subject' : 'Create Subject'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
