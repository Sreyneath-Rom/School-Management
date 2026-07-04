import { NavLink as RouterNavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Settings,
  ShieldCheck,
  BookMarked,
  CalendarDays,
  User,
  BookOpenCheck,
  NotebookText,
  PenLine,
  FileQuestion,
  Award,
  Users2,
  ClipboardCheck,
  FileClock,
  UserCog,
  Megaphone,
  Bell,
  BarChart3,
  FileBarChart,
  UserSquare2,
  FileStack,
  ChevronRight,
  GraduationCap,
} from '../shims/lucide-react'
import type { LucideIcon } from '../shims/lucide-react'
import { navSections } from '../services/mockData'

const iconMap: Record<string, LucideIcon> = {
  Settings,
  ShieldCheck,
  BookMarked,
  CalendarDays,
  User,
  BookOpenCheck,
  NotebookText,
  PenLine,
  FileQuestion,
  Award,
  Users2,
  ClipboardCheck,
  FileClock,
  UserCog,
  Megaphone,
  Bell,
  BarChart3,
  FileBarChart,
  UserSquare2,
  FileStack,
}

function linkClassName({ isActive }: { isActive: boolean }) {
  return (
    'group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ' +
    (isActive
      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
      : 'text-slate-600 hover:bg-white hover:text-slate-900')
  )
}

export default function Sidebar() {
  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-white px-4 py-6 shadow-sm lg:flex">
      <div className="mb-8 flex items-center gap-3 rounded-3xl bg-slate-50 p-4 shadow-sm">
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-white">
          <GraduationCap size={22} />
        </div>
        <div>
          <div className="text-sm font-semibold text-slate-900">Varin High School</div>
          <div className="text-xs text-slate-500">School Management System</div>
        </div>
      </div>

      <nav className="space-y-6 overflow-y-auto pr-1">
        <RouterNavLink to="/dashboard" className={linkClassName}>
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </RouterNavLink>

        {navSections.map((section) => (
          <div key={section.heading} className="space-y-3">
            <div className="px-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              {section.heading}
            </div>
            <div className="space-y-2">
              {section.links.map((link) => {
                const Icon = iconMap[link.icon]
                return (
                  <RouterNavLink to={link.path} className={linkClassName} key={link.label}>
                    {Icon ? <Icon size={18} /> : <span className="inline-flex h-3 w-3 rounded-full bg-slate-300" />}
                    <span>{link.label}</span>
                    <ChevronRight size={15} className="ml-auto text-slate-400 opacity-0 transition group-hover:opacity-100" />
                  </RouterNavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
        <div className="mb-2 flex items-center gap-2 text-slate-800">
          <CalendarDays size={16} />
          <span className="font-semibold">Academic Year</span>
        </div>
        <div className="rounded-2xl bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm">
          2025 - 2026
        </div>
      </div>
    </aside>
  )
}
// navSections are sourced from `src/services/mockData.ts` and rendered above.