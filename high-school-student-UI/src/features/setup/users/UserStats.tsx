// src/features/setup/users/UserStats.tsx
import React from 'react'
import { Users, Shield, GraduationCap, School } from 'lucide-react'
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

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
            <Users size={20} />
          </div>
          <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
            Directory
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Total Registered Users</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{total}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-500/15 text-teal-600 dark:text-teal-300">
            <Shield size={20} />
          </div>
          <span className="rounded-full bg-teal-500/10 px-2.5 py-0.5 text-xs font-semibold text-teal-600 dark:text-teal-300">
            Staff
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Admins & Leadership</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{admins}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sky-600 dark:text-sky-300">
            <School size={20} />
          </div>
          <span className="rounded-full bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-600 dark:text-sky-300">
            Faculty
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Teachers & Instructors</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{teachers}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
            <GraduationCap size={20} />
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
            {inactive} Inactive
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Enrolled Students & Mazers</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{students}</p>
      </div>
    </div>
  )
}
