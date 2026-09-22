// src/features/setup/users/UserStats.tsx
import React from 'react'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import type { SystemUser } from '@/types/user'

interface UserStatsProps {
  users?: SystemUser[]
}

export const UserStats: React.FC<UserStatsProps> = ({ users = [] }) => {
  const safeUsers = Array.isArray(users) ? users : []
  const total = safeUsers.length
  const admins = safeUsers.filter((u) => u && u.role === 'admin').length
  const teachers = safeUsers.filter((u) => u && u.role === 'teacher').length
  const students = safeUsers.filter((u) => u && (u.role === 'student' || u.role === 'mazer')).length
  const inactive = safeUsers.filter((u) => u && u.status === 'inactive').length

  const cards: StatCard[] = [
    { id: 'registered-users', label: 'Total Registered Users',       value: total.toString(),     delta: '-',                deltaDirection: 'neutral', deltaLabel: 'directory', icon: 'Users',         tint: 'blue' },
    { id: 'administrators',   label: 'Admins & Leadership',          value: admins.toString(),    delta: '-',                deltaDirection: 'neutral', deltaLabel: 'staff',     icon: 'Shield',        tint: 'green' },
    { id: 'teachers',         label: 'Teachers & Instructors',       value: teachers.toString(),  delta: '-',                deltaDirection: 'neutral', deltaLabel: 'faculty',   icon: 'School',        tint: 'sky' },
    { id: 'students',         label: 'Enrolled Students & Mazers',   value: students.toString(),  delta: inactive.toString(), deltaDirection: 'neutral', deltaLabel: 'inactive',  icon: 'GraduationCap', tint: 'amber' },
  ]

  return <StatsGrid cards={cards} columns={4} />
}