// src/features/setup/schedules/ScheduleStats.tsx
import React from 'react'
import { Calendar, Clock, MapPin } from 'lucide-react'
import type { ScheduleSlot } from '@/services/scheduleService'

interface ScheduleStatsProps {
  slots?: ScheduleSlot[]
}

export const ScheduleStats: React.FC<ScheduleStatsProps> = ({ slots = [] }) => {
  const safeSlots = Array.isArray(slots) ? slots : []
  const totalPeriods = safeSlots.length
  const uniqueRooms = new Set(safeSlots.map((s) => s && s.room).filter(Boolean)).size
  const uniqueClasses = new Set(safeSlots.map((s) => s && s.className).filter(Boolean)).size
  const uniqueTeachers = new Set(safeSlots.map((s) => s && s.teacherName).filter(Boolean)).size

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300">
            <Calendar size={20} />
          </div>
          <span className="rounded-full bg-brand-500/10 px-2.5 py-0.5 text-xs font-semibold text-brand-600 dark:text-brand-300">
            Weekly
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Scheduled Class Periods</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{totalPeriods}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-600 dark:text-violet-300">
            <Clock size={20} />
          </div>
          <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-600 dark:text-violet-300">
            Active
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Enrolled Class Cohorts</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{uniqueClasses}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-300">
            <MapPin size={20} />
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-300">
            Facilities
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Allocated Rooms & Labs</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{uniqueRooms}</p>
      </div>

      <div className="rounded-[26px] glass-sm p-5 border border-text-main/10 transition-all hover:shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-300">
            <Clock size={20} />
          </div>
          <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-300">
            Faculty
          </span>
        </div>
        <p className="mt-4 text-xs font-medium text-text-main/60">Active Teaching Staff</p>
        <p className="mt-1 text-2xl font-bold tracking-tight text-text-main">{uniqueTeachers}</p>
      </div>
    </div>
  )
}
