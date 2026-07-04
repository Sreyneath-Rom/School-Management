import React from 'react'

export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-slate-200 bg-white p-4">{children}</div>
}
