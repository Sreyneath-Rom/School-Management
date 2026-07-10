import React from 'react'

export default function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg glass p-4">{children}</div>
}
