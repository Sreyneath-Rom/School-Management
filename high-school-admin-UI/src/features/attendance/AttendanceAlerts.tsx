// src/features/attendance/AttendanceAlerts.tsx
import { useState } from 'react'
import { attendanceAlerts as initialAlerts } from '@/services/attendanceMockData'
import Button from '@/components/common/Button'
import { X } from 'lucide-react'

export default function AttendanceAlerts() {
  const [items, setItems] = useState(initialAlerts)
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  function closeModal() {
    setIsOpen(false)
    setTitle('')
    setBody('')
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim()) return

    setItems([
      { id: `alert-${Date.now()}`, title: title.trim(), body: body.trim(), time: 'Just now' },
      ...items,
    ])
    closeModal()
  }

  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-fg">Attendance Alerts</h2>
          <p className="text-sm text-fg-muted">Flags that need admin review</p>
        </div>
        <Button variant="solid" onClick={() => setIsOpen(true)}>
          Flag New
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl glass-sm p-6 transition-all duration-300 ease-out hover:shadow-(--glass-strong-shadow)"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-fg">{item.title}</p>
              <span className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-fg-muted shadow-sunken">
                {item.time}
              </span>
            </div>
            <p className="mt-2 text-sm text-fg-muted">{item.body}</p>
          </div>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 animate-[fadeIn_0.18s_ease-out]"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-[28px] glass-strong p-6 animate-[popIn_0.18s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-fg">New Attendance Alert</h3>
                <p className="text-sm text-fg-muted">Flag a pattern for admin follow-up</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1.5 text-fg-muted transition hover:text-fg hover:shadow-sunken"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="alert-title" className="mb-1.5 block text-sm font-semibold text-fg">
                  Title
                </label>
                <input
                  id="alert-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Grade 9-C Chronic Tardiness"
                  className="w-full rounded-2xl px-4 py-2.5 text-sm text-fg outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="alert-body" className="mb-1.5 block text-sm font-semibold text-fg">
                  Details
                </label>
                <textarea
                  id="alert-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Describe the pattern or concern..."
                  rows={4}
                  className="w-full resize-none rounded-2xl px-4 py-2.5 text-sm text-fg outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="glass" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="solid" type="submit">
                  Save Alert
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  )
}