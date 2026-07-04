declare module '*.css'
declare module '*.scss'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'lucide-react' {
  import * as React from 'react'
  export type LucideIcon = React.ComponentType<any>
  export const Menu: LucideIcon
  export const Search: LucideIcon
  export const Bell: LucideIcon
  export const Calendar: LucideIcon
  export const ChevronDown: LucideIcon
  export const LayoutDashboard: LucideIcon
  export const Settings: LucideIcon
  export const ShieldCheck: LucideIcon
  export const BookMarked: LucideIcon
  export const CalendarDays: LucideIcon
  export const User: LucideIcon
  export const BookOpenCheck: LucideIcon
  export const NotebookText: LucideIcon
  export const PenLine: LucideIcon
  export const FileQuestion: LucideIcon
  export const Award: LucideIcon
  export const Users2: LucideIcon
  export const ClipboardCheck: LucideIcon
  export const FileClock: LucideIcon
  export const UserCog: LucideIcon
  export const Megaphone: LucideIcon
  export const BarChart3: LucideIcon
  export const FileBarChart: LucideIcon
  export const UserSquare2: LucideIcon
  export const FileStack: LucideIcon
  export const ChevronRight: LucideIcon
  export const GraduationCap: LucideIcon
  export const CheckCircle2: LucideIcon
  export const ClipboardList: LucideIcon
  export const UserRound: LucideIcon
  export const Users: LucideIcon
  export const BookOpen: LucideIcon
  export const UserCheck: LucideIcon
  export const Flag: LucideIcon
  export const Sparkles: LucideIcon
  export const ArrowUp: LucideIcon
  export const ArrowDown: LucideIcon
  const _default: any
  export default _default
}
