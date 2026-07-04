import React from 'react'
import { NavLink } from 'react-router-dom'

export default function SidebarItem({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? 'block px-4 py-2 font-semibold text-slate-900' : 'block px-4 py-2 text-slate-600') }>
      {children}
    </NavLink>
  )
}
