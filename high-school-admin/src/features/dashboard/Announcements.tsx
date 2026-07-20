import { useState } from 'react'
import { announcements as initialAnnouncements } from '@/services/mockData'
import Button from '@/components/common/Button'
import { X } from 'lucide-react'

export default function Announcements() {
  const [items, setItems] = useState(initialAnnouncements)
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
      { id: `announcement-${Date.now()}`, title: title.trim(), body: body.trim(), time: 'Just now' },
      ...items,
    ])
    closeModal()
  }

  return (
    <section className="rounded-[28px] glass-sm p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Announcements</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Latest campus updates and alerts</p>
        </div>
        <Button variant="solid" className="text-slate-300 hover:bg-slate-700" onClick={() => setIsOpen(true)}>
          Create New
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl glass-sm p-6 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:bg-slate-50/60 hover:shadow-[0_16px_35px_-15px_rgba(15,23,42,0.2)]"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
              <span className="shrink-0 rounded-full bg-slate-900/5 dark:bg-white/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-slate-500 dark:text-slate-400">{item.time}</span>
            </div>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{item.body}</p>
          </div>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 animate-[fadeIn_0.18s_ease-out]"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-[28px] glass-sm bg-white/90 dark:bg-stone-900/90 p-6 shadow-[0_30px_70px_-20px_rgba(15,23,42,0.35)] animate-[popIn_0.18s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">New Announcement</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Share an update with the campus</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1.5 text-slate-500 dark:text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:text-slate-200"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="announcement-title" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Title
                </label>
                <input
                  id="announcement-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Early Dismissal Friday"
                  className="w-full rounded-2xl border border-slate-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/60 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>

              <div>
                <label htmlFor="announcement-body" className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Message
                </label>
                <textarea
                  id="announcement-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write the announcement details..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-slate-200 dark:border-stone-700 bg-white/70 dark:bg-stone-800/60 px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="glass" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="solid" type="submit">
                  Post Announcement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.95) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </section>
  )
}