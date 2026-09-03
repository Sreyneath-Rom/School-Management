import type { ReactNode } from 'react'
export interface ResponsiveTableContainerProps { children: ReactNode; className?: string }
export function ResponsiveTableContainer({ children, className = '' }: ResponsiveTableContainerProps) { return <div className={`w-full overflow-x-auto ${className}`}>{children}</div> }
