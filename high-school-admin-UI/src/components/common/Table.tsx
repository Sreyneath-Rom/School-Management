// src/components/common/Table.tsx
import type { ReactNode } from 'react'

/**
 * Table primitives. Every page defines the same thead/tbody/th/td classes
 * inline — these wrappers exist so the classes live in one file and are
 * easy to change.
 */

type Align = 'left' | 'center' | 'right'

const alignClass: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
}

export function TableContainer({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`glass-sm rounded-2xl overflow-hidden ${className}`}>
      {children}
    </div>
  )
}

export function Table({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className="overflow-x-auto">
      <table className={`w-full text-left text-xs text-fg-muted ${className}`}>
        {children}
      </table>
    </div>
  )
}

export function Thead({ children }: { children: ReactNode }) {
  return (
    // `bg-surface` was a no-op (same color as the container); a shadow
    // seam is the correct neumorphic divider.
    <thead className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted shadow-[0_1px_0_var(--neu-shadow-dark)]">
      {children}
    </thead>
  )
}

export function Tbody({ children }: { children: ReactNode }) {
  return (
    // `--glass-outline` is `transparent` under this theme — row dividers
    // need the shadow-dark token to actually be visible.
    <tbody className="divide-y divide-(--neu-shadow-dark)">
      {children}
    </tbody>
  )
}

export function Tr({
  children,
  hoverable = false,
  className = '',
}: {
  children: ReactNode
  hoverable?: boolean
  className?: string
}) {
  return (
    <tr
      className={`${
        hoverable ? 'hover:shadow-sunken transition' : ''
      } ${className}`}
    >
      {children}
    </tr>
  )
}

export function Th({
  children,
  align = 'left',
  className = '',
}: {
  children: ReactNode
  align?: Align
  className?: string
}) {
  return (
    <th className={`py-3 px-4 font-semibold ${alignClass[align]} ${className}`}>
      {children}
    </th>
  )
}

export function Td({
  children,
  align = 'left',
  className = '',
}: {
  children: ReactNode
  align?: Align
  className?: string
}) {
  return (
    <td className={`py-3.5 px-4 ${alignClass[align]} ${className}`}>
      {children}
    </td>
  )
}