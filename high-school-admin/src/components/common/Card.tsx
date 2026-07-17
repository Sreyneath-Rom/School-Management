import React from 'react'

export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-[28px] glass-sm p-6">{children}</div>
}