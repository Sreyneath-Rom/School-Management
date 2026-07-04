import React from 'react'

type Props = { size?: number; className?: string }
const Icon = ({ size = 16 }: Props) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1" />
  </svg>
)

export type LucideIcon = React.ComponentType<Props>

export const Menu: LucideIcon = Icon
export const Search: LucideIcon = Icon
export const Bell: LucideIcon = Icon
export const Calendar: LucideIcon = Icon
export const ChevronDown: LucideIcon = Icon
export const LayoutDashboard: LucideIcon = Icon
export const Settings: LucideIcon = Icon
export const ShieldCheck: LucideIcon = Icon
export const BookMarked: LucideIcon = Icon
export const CalendarDays: LucideIcon = Icon
export const User: LucideIcon = Icon
export const BookOpenCheck: LucideIcon = Icon
export const NotebookText: LucideIcon = Icon
export const PenLine: LucideIcon = Icon
export const FileQuestion: LucideIcon = Icon
export const Award: LucideIcon = Icon
export const Users2: LucideIcon = Icon
export const ClipboardCheck: LucideIcon = Icon
export const FileClock: LucideIcon = Icon
export const UserCog: LucideIcon = Icon
export const Megaphone: LucideIcon = Icon
export const BarChart3: LucideIcon = Icon
export const FileBarChart: LucideIcon = Icon
export const UserSquare2: LucideIcon = Icon
export const FileStack: LucideIcon = Icon
export const ChevronRight: LucideIcon = Icon
export const GraduationCap: LucideIcon = Icon
export const CheckCircle2: LucideIcon = Icon
export const ClipboardList: LucideIcon = Icon
export const UserRound: LucideIcon = Icon
export const Users: LucideIcon = Icon
export const BookOpen: LucideIcon = Icon
export const Layers: LucideIcon = Icon
export const UserCheck: LucideIcon = Icon
export const Flag: LucideIcon = Icon
export const Sparkles: LucideIcon = Icon
export const Download: LucideIcon = Icon
export const Plus: LucideIcon = Icon
export const SlidersHorizontal: LucideIcon = Icon
export const Pencil: LucideIcon = Icon
export const Eye: LucideIcon = Icon
export const Trash2: LucideIcon = Icon
export const ArrowUp: LucideIcon = Icon
export const ArrowDown: LucideIcon = Icon

export default Icon
