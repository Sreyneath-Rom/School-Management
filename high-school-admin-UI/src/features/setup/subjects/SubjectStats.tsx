// src/features/setup/subjects/SubjectStats.tsx
import React from 'react'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import type { SubjectItem } from '@/services/subjectService'

interface SubjectStatsProps {
  subjects?: SubjectItem[]
}

export const SubjectStats: React.FC<SubjectStatsProps> = ({ subjects = [] }) => {
  const safeSubjects = Array.isArray(subjects) ? subjects : []
  const total = safeSubjects.length
  const departments = new Set(safeSubjects.map((s) => s && s.department).filter(Boolean)).size
  const totalCredits = safeSubjects.reduce((acc, s) => acc + ((s && s.credits) || 0), 0)
  const totalTeachers = new Set(
    safeSubjects.flatMap((s) => (s && s.teachers ? s.teachers.map((t) => t && (t.id || t.name)).filter(Boolean) : []))
  ).size

  const cards: StatCard[] = [
    { id: 'total-subjects', label: 'Total Subjects Offered', value: total.toString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'active', icon: 'BookOpen', tint: 'blue' },
    { id: 'academic-departments', label: 'Academic Departments', value: departments.toString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'academic', icon: 'Layers', tint: 'violet' },
    { id: 'curriculum-units', label: 'Total Curriculum Units', value: totalCredits.toString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'credits', icon: 'Award', tint: 'amber' },
    { id: 'instructors', label: 'Instructors Teaching', value: totalTeachers.toString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'staff', icon: 'UserCheck', tint: 'green' },
  ]

  return <StatsGrid cards={cards} columns={4} />
  /* return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
            <BookOpen size={20} />
          </div>
          <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
            Active
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Total Subjects Offered</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{total}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-300">
            <Layers size={20} />
          </div>
          <span className="rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-600 dark:text-indigo-300">
            Academic
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Academic Departments</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{departments}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <Award size={20} />
          </div>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-300">
            Credits
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Total Curriculum Units</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{totalCredits}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
            <UserCheck size={20} />
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
            Staff
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Instructors Teaching</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{totalTeachers}</p>
      </div>
    </div>
  ) */
}
