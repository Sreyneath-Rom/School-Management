import React from 'react'

export default function Button({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="rounded-md bg-sky-600 px-4 py-2 text-white hover:bg-sky-700">
      {children}
    </button>
  )
}
