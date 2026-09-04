// src/features/setup/subjects/SubjectDetailDrawer.tsx
import React from 'react'
import { X, Award, Clock, GraduationCap, Edit2, Trash2 } from 'lucide-react'
import type { SubjectItem } from '@/services/subjectService'
import Button from '@/components/common/Button'

interface SubjectDetailDrawerProps {
  subject: SubjectItem | null
  isOpen: boolean
  onClose: () => void
  onEdit: (subject: SubjectItem) => void
  onDelete: (id: string) => void
}

export const SubjectDetailDrawer: React.FC<SubjectDetailDrawerProps> = ({
  subject,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}) => {
  if (!isOpen || !subject) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-md glass-strong p-6 sm:p-7 shadow-2xl border-l border-text-main/15 flex flex-col justify-between overflow-y-auto">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-text-main/10">
              <div>
                <span className="rounded-md bg-brand-500/15 px-2 py-0.5 font-mono text-xs font-bold text-brand-600 dark:text-brand-300">
                  {subject.code}
                </span>
                <h2 className="mt-2 text-xl font-bold text-text-main">{subject.name}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 hover:text-text-main transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Department & Status */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-text-main/10 px-3 py-1 text-xs font-semibold text-text-main">
                {subject.department}
              </span>
              <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600 dark:text-brand-300">
                {subject.category}
              </span>
              <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-semibold">
                Active Curriculum
              </span>
            </div>

            {/* Description */}
            <div className="mt-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/50">
                Course Description
              </h4>
              <p className="mt-2 text-sm text-text-main/80 leading-relaxed">
                {subject.description || 'No detailed syllabus summary provided yet for this course.'}
              </p>
            </div>

            {/* Specs Grid */}
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-2xl glass-sm p-4 border border-text-main/10">
                <div className="flex items-center gap-2 text-text-main/50 text-xs mb-1">
                  <Award size={14} /> Credits
                </div>
                <p className="text-lg font-bold text-text-main">{subject.credits || 1} Unit(s)</p>
              </div>

              <div className="rounded-2xl glass-sm p-4 border border-text-main/10">
                <div className="flex items-center gap-2 text-text-main/50 text-xs mb-1">
                  <Clock size={14} /> Workload
                </div>
                <p className="text-lg font-bold text-text-main">{subject.weeklyHours || 3}h / Week</p>
              </div>
            </div>

            {/* Teaching Staff */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/50 mb-3">
                Assigned Faculty Staff ({subject.teachers?.length || 0})
              </h4>
              <div className="space-y-2">
                {subject.teachers && subject.teachers.length > 0 ? (
                  subject.teachers.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-2xl bg-text-main/5 p-3 border border-text-main/10"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-xs font-bold text-white">
                          {t.label || t.name[0]}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-text-main">{t.name}</p>
                          <p className="text-[10px] text-text-main/50 font-mono">{t.id}</p>
                        </div>
                      </div>
                      <span className="rounded-md bg-text-main/10 px-2 py-0.5 text-[10px] text-text-main/70">
                        Instructor
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-text-main/40 italic">No teachers currently assigned.</p>
                )}
              </div>
            </div>

            {/* Grade Level */}
            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-text-main/50 mb-2">
                Target Grade Level
              </h4>
              <div className="flex flex-wrap gap-1.5">
                <span className="flex items-center gap-1 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300 px-3 py-1 text-xs font-medium">
                  <GraduationCap size={13} /> {subject.gradeLevel || 'Grade 10'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 pt-4 border-t border-text-main/10 flex items-center justify-between gap-3">
            <Button
              variant="solidOutline"
              onClick={() => {
                if (confirm(`Delete subject "${subject.name}"?`)) {
                  onDelete(subject.id)
                  onClose()
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-error border-error/30 hover:bg-error/10"
            >
              <Trash2 size={14} /> Delete
            </Button>
            <Button
              variant="solid"
              onClick={() => {
                onEdit(subject)
                onClose()
              }}
              className="inline-flex items-center gap-1.5 text-xs"
            >
              <Edit2 size={14} /> Edit Subject
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
