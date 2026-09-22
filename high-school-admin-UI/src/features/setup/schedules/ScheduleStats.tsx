// src/features/setup/schedules/ScheduleStats.tsx
import React from 'react'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
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

  const cards: StatCard[] = [
    { id: 'scheduled-periods', label: 'Scheduled Class Periods',  value: totalPeriods.toString(),   delta: '-', deltaDirection: 'neutral', deltaLabel: 'weekly',     icon: 'Calendar', tint: 'blue' },
    { id: 'class-cohorts',     label: 'Enrolled Class Cohorts',   value: uniqueClasses.toString(),  delta: '-', deltaDirection: 'neutral', deltaLabel: 'active',     icon: 'Clock',    tint: 'violet' },
    { id: 'allocated-rooms',   label: 'Allocated Rooms & Labs',   value: uniqueRooms.toString(),    delta: '-', deltaDirection: 'neutral', deltaLabel: 'facilities', icon: 'MapPin',   tint: 'green' },
    { id: 'teaching-staff',    label: 'Active Teaching Staff',    value: uniqueTeachers.toString(), delta: '-', deltaDirection: 'neutral', deltaLabel: 'faculty',    icon: 'Users',    tint: 'amber' },
  ]

  return <StatsGrid cards={cards} columns={4} />

  /* The commented-out inline grid was fully glassmorphic; StatsGrid's
     converted neumorphic cards replace it entirely. Left as-is (commented). */
}