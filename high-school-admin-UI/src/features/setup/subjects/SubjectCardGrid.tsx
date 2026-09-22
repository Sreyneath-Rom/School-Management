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

/* Department accent color, used as a per-card tint badge on top of the
   neumorphic surface. This is data-driven color, not surface chrome, so
   the tint stays saturated. The `hover:border-*` variants are gone —
   card borders were invisible under this theme anyway. */
const DEPT_COLORS: Record<string, { bg: string; text: string; badge: string }> = {
  Mathematics:      { bg: 'bg-indigo-500/10',  text: 'text-indigo-700 dark:text-indigo-300',   badge: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-200' },
  Science:          { bg: 'bg-emerald-500/10', text: 'text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-200' },
  Languages:        { bg: 'bg-amber-500/10',   text: 'text-amber-700 dark:text-amber-300',     badge: 'bg-amber-500/20 text-amber-800 dark:text-amber-200' },
  'Social Studies': { bg: 'bg-rose-500/10',    text: 'text-rose-700 dark:text-rose-300',       badge: 'bg-rose-500/20 text-rose-800 dark:text-rose-200' },
  Arts:             { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-700 dark:text-fuchsia-300', badge: 'bg-fuchsia-500/20 text-fuchsia-800 dark:text-fuchsia-200' },
  Technology:       { bg: 'bg-cyan-500/10',    text: 'text-cyan-700 dark:text-cyan-300',       badge: 'bg-cyan-500/20 text-cyan-800 dark:text-cyan-200' },
}

export const SubjectCardGrid: React.FC<SubjectCardGridProps> = ({
  subjects, onSelect, onEdit, onDelete,
}) => {
  if (subjects.length === 0) {
    // Empty state: `.glass-sm` alone, no invisible border.
    return (
      <div className="rounded-[28px] glass-sm p-12 text-center text-fg-muted">
        <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
        <p className="font-semibold text-fg">No Subjects Found</p>
        <p className="text-xs">Try adjusting your search filters or click "Add Subject" above.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {subjects.map((subject) => {
        const theme =
          DEPT_COLORS[subject.department] || {
            bg: 'bg-brand-500/10',
            text: 'text-brand-700 dark:text-brand-300',
            badge: 'bg-brand-500/20 text-brand-800 dark:text-brand-200',
          }

        return (
          <div
            key={subject.id}
            onClick={() => onSelect(subject)}
            // Was `glass-sm border border-text-main/10 hover:shadow-lg
            // ${theme.bg}` — the border was invisible; the `hover:shadow-lg`
            // was a foreign elevation system. Card is now a raised
            // neumorphic surface that overlays a dept tint, with the
            // neumorphic lift on hover.
            className={`group relative flex flex-col justify-between rounded-[26px] p-5 transition-all cursor-pointer glass-sm glass-interactive ${theme.bg}`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="rounded-xl px-2.5 py-1 text-xs font-mono font-bold text-fg shadow-sunken">
                  {subject.code}
                </span>

                <div
                  className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onEdit(subject)}
                    className="rounded-lg p-1.5 text-fg-muted hover:text-brand-600 dark:hover:text-brand-400 hover:shadow-sunken transition"
                    title="Edit Subject"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Delete subject "${subject.name}"?`)) onDelete(subject.id)
                    }}
                    className="rounded-lg p-1.5 text-fg-muted hover:text-error hover:shadow-sunken transition"
                    title="Delete Subject"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <h3 className="text-base font-bold text-fg">{subject.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {/* Dept chip: tinted signal — kept */}
                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${theme.badge}`}>
                    {subject.department}
                  </span>
                  {/* Category chip: neutral, sunken */}
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-medium text-fg-muted shadow-sunken">
                    {subject.category}
                  </span>
                </div>
                {subject.description && (
                  <p className="mt-2 text-xs text-fg-muted line-clamp-2 leading-relaxed">
                    {subject.description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
              <div className="grid grid-cols-2 gap-2 text-xs text-fg-muted mb-3">
                <div className="flex items-center gap-1.5">
                  <Award size={13} className="text-fg-muted/70" />
                  <span>{subject.credits || 1} Credits</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-fg-muted/70" />
                  <span>{subject.weeklyHours || 3}h / week</span>
                </div>
              </div>

              {subject.teachers && subject.teachers.length > 0 && (
                <div className="flex items-center justify-between text-xs text-fg-muted pt-2 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
                  <div className="flex items-center gap-1.5 truncate">
                    <User size={13} className="text-fg-muted/70 shrink-0" />
                    <span className="truncate">{subject.teachers[0].name}</span>
                  </div>
                  <ChevronRight size={14} className="text-fg-muted/70 group-hover:translate-x-0.5 transition" />
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}