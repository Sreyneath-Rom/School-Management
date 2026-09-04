// src/features/setup/subjects/SubjectTable.tsx
import React from 'react'
import { Edit2, Trash2, BookOpen } from 'lucide-react'
import type { SubjectItem } from '@/services/subjectService'

interface SubjectTableProps {
  subjects: SubjectItem[]
  onEdit: (subject: SubjectItem) => void
  onDelete: (id: string) => void
  onViewDetails?: (subject: SubjectItem) => void
}

export const SubjectTable: React.FC<SubjectTableProps> = ({
  subjects,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  if (subjects.length === 0) {
    return (
      <div className="rounded-[28px] glass-sm p-12 text-center text-text-main/50 border border-text-main/10">
        <BookOpen size={36} className="mx-auto mb-3 opacity-40" />
        <p className="font-semibold text-text-main">No Subjects Found</p>
        <p className="text-xs">Try adjusting your filters or create a new subject unit.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[26px] glass-sm border border-text-main/10">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-text-main/5 border-b border-text-main/10 text-xs font-bold uppercase tracking-wider text-text-main/60">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Subject Name</th>
              <th className="px-6 py-4">Department</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-center">Credits</th>
              <th className="px-6 py-4 text-center">Weekly Hrs</th>
              <th className="px-6 py-4">Grade Level</th>
              <th className="px-6 py-4">Faculty</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-text-main/5">
            {subjects.map((s) => (
              <tr
                key={s.id}
                onClick={() => onViewDetails?.(s)}
                className="hover:bg-text-main/5 transition cursor-pointer"
              >
                <td className="px-6 py-4 font-mono font-bold text-xs text-brand-600 dark:text-brand-400">
                  {s.code}
                </td>
                <td className="px-6 py-4">
                  <p className="font-bold text-text-main text-sm">{s.name}</p>
                  <p className="text-xs text-text-main/50 line-clamp-1">{s.description}</p>
                </td>
                <td className="px-6 py-4 font-medium text-text-main/80">{s.department}</td>
                <td className="px-6 py-4">
                  <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
                    {s.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center font-bold text-text-main">{s.credits}</td>
                <td className="px-6 py-4 text-center text-text-main/70">{s.weeklyHours}h</td>
                <td className="px-6 py-4 text-xs text-text-main/60">{s.gradeLevel}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center -space-x-1.5">
                    {s.teachers && s.teachers.length > 0 ? (
                      s.teachers.map((t, idx) => (
                        <div
                          key={t.id || idx}
                          title={t.name}
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-600 text-[10px] font-bold text-white ring-2 ring-background shadow-xs"
                        >
                          {t.label || t.name.substring(0, 2).toUpperCase()}
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-text-main/40 italic">—</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onEdit(s)}
                      className="rounded-lg p-1.5 text-text-main/50 hover:bg-brand-500/10 hover:text-brand-600 transition"
                      title="Edit Subject"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete "${s.name}"?`)) onDelete(s.id)
                      }}
                      className="rounded-lg p-1.5 text-text-main/50 hover:bg-error/10 hover:text-error transition"
                      title="Delete Subject"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
