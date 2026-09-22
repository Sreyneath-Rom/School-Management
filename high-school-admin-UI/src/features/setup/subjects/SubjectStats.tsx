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
    safeSubjects.flatMap((s) =>
      s && s.teachers
        ? s.teachers.map((t) => t && (t.id || t.name)).filter(Boolean)
        : []
    )
  ).size

  const cards: StatCard[] = [
    { id: 'total-subjects',        label: 'Total Subjects Offered',   value: total.toString(),         delta: '-', deltaDirection: 'neutral', deltaLabel: 'active',   icon: 'BookOpen',  tint: 'blue' },
    { id: 'academic-departments',  label: 'Academic Departments',     value: departments.toString(),   delta: '-', deltaDirection: 'neutral', deltaLabel: 'academic', icon: 'Layers',    tint: 'violet' },
    { id: 'curriculum-units',      label: 'Total Curriculum Units',   value: totalCredits.toString(),  delta: '-', deltaDirection: 'neutral', deltaLabel: 'credits',  icon: 'Award',     tint: 'amber' },
    { id: 'instructors',           label: 'Instructors Teaching',     value: totalTeachers.toString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'staff',    icon: 'UserCheck', tint: 'green' },
  ]

  return <StatsGrid cards={cards} columns={4} />
}