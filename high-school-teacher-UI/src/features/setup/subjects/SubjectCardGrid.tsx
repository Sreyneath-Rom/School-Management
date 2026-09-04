// src/features/setup/subjects/SubjectCardGrid.tsx
import React from 'react'
import { Edit2, Trash2, BookOpen, Clock, Award, ChevronRight, User } from 'lucide-react'
import type { SubjectItem } from '@/services/subjectService'

interface SubjectCardGridProps {
  subjects: SubjectItem[]
  onSelect: (subject: SubjectItem) => void
  onEdit: (subject: SubjectItem) => void
  onDelete: (id: string) => void
}

const DEPT_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  Mathematics: {
    bg: 'bg-indigo-500/10 hover:border-indigo-500/40',
    text: 'text-indigo-400',
    badge: 'bg-indigo-500/20 text-indigo-300',
  },
  Science: {
    bg: 'bg-emerald-500/10 hover:border-emerald-500/40',
    text: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
  Languages: {
    bg: 'bg-amber-500/10 hover:border-amber-500/40',
    text: 'text-amber-400',
    badge: 'bg-amber-500/20 text-amber-300',
  },
  'Social Studies': {
    bg: 'bg-rose-500/10 hover:border-rose-500/40',
    text: 'text-rose-400',
    badge: 'bg-rose-500/20 text-rose-300',
  },
  Arts: {
    bg: 'bg-fuchsia-500/10 hover:border-fuchsia-500/40',
    text: 'text-fuchsia-400',
    badge: 'bg-fuchsia-500/20 text-fuchsia-300',
  },
  Technology: {
    bg: 'bg-cyan-500/10 hover:border-cyan-500/40',
    text: 'text-cyan-400',
    badge: 'bg-cyan-500/20 text-cyan-300',
  },
}

export const SubjectCardGrid: React.FC<SubjectCardGridProps> = ({
  subjects,
  onSelect,
  onEdit,
  onDelete,
}) => {
  if (subjects.length === 0) {
    return (
      <div className="rounded-[28px] glass-sm p-12 text-center text-text-main/50 border border-text-main/10">
        <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
        <p className="font-semibold text-text-main">No Subjects Found</p>
        <p className="text-xs">Try adjusting your search filters or click "Add Subject" above.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => {
        const theme =
          DEPT_COLORS[subject.department] || {
            bg: 'bg-brand-500/10 hover:border-brand-500/40',
            text: 'text-brand-400',
            badge: 'bg-brand-500/20 text-brand-300',
          }

        return (
          <div
            key={subject.id}
            onClick={() => onSelect(subject)}
            className={`group relative flex flex-col justify-between rounded-[26px] p-5 transition-all cursor-pointer border border-text-main/10 glass-sm hover:shadow-lg ${theme.bg}`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-xl bg-text-main/10 px-2.5 py-1 text-xs font-mono font-bold text-text-main">
                  {subject.code}
                </span>

                <div
                  className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onEdit(subject)}
                    className="rounded-lg p-1.5 text-text-main/50 hover:bg-brand-500/10 hover:text-brand-600 transition"
                    title="Edit Subject"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete subject "${subject.name}"?`)) onDelete(subject.id)
                    }}
                    className="rounded-lg p-1.5 text-text-main/50 hover:bg-error/10 hover:text-error transition"
                    title="Delete Subject"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-text-main">{subject.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${theme.badge}`}>
                    {subject.department}
                  </span>
                  <span className="rounded-full bg-text-main/10 px-2 py-0.5 text-[10px] font-medium text-text-main/70">
                    {subject.category}
                  </span>
                </div>
                {subject.description && (
                  <p className="mt-2 text-xs text-text-main/60 line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-text-main/10">
              <div className="grid grid-cols-2 gap-2 text-xs text-text-main/60 mb-3">
                <div className="flex items-center gap-1.5">
                  <Award size={13} className="text-text-main/40" />
                  <span>{subject.credits || 1} Credits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-text-main/40" />
                  <span>{subject.weeklyHours || 3}h / week</span>
                </div>
              </div>

              {subject.teachers && subject.teachers.length > 0 && (
                <div className="flex items-center justify-between text-xs text-text-main/70 pt-2 border-t border-text-main/5">
                  <div className="flex items-center gap-1.5 truncate">
                    <User size={13} className="text-text-main/40 shrink-0" />
                    <span className="truncate">{subject.teachers[0].name}</span>
                  </div>
                  <ChevronRight size={14} className="text-text-main/40 group-hover:translate-x-0.5 transition" />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
