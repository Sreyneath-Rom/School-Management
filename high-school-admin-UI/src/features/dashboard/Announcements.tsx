import { useState } from 'react'
import { announcements as initialAnnouncements } from '@/services/mockData'
import { Plus, Megaphone, X, ArrowUpRight } from 'lucide-react'
import { ListCardSkeleton } from '@/components/common/Skeleton'
import { Link } from 'react-router-dom'

interface AnnouncementsProps {
  loading?: boolean
}

export default function Announcements({ loading }: AnnouncementsProps = {}) {
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

  if (loading) {
    return <ListCardSkeleton rows={3} />
  }

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Broadcasts & Notices
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Institutional announcements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 rounded-xl bg-teal-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-teal-700 transition cursor-pointer shadow-xs"
          >
            <Plus size={13} />
            <span>Post</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {items.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition hover:border-teal-500/30 dark:border-slate-800/80 dark:bg-slate-800/40"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {item.title}
              </p>
              <span className="shrink-0 rounded-full bg-slate-200/60 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                {item.time}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-center">
        <Link
          to="/communication/announcements"
          className="inline-flex items-center gap-1 text-xs font-bold text-teal-600 hover:text-teal-700 dark:text-teal-400"
        >
          <span>Open Communication Hub</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {/* New Notice Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-md p-4 animate-in fade-in duration-200"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeModal()
          }}
        >
          <div
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800/80 dark:bg-slate-900/95"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Soft Ambient Light Glow */}
            <div className="pointer-events-none absolute -right-8 -top-8 h-36 w-36 rounded-full bg-gradient-to-br from-teal-400/20 via-emerald-400/15 to-transparent blur-3xl opacity-70" />

            <div className="relative z-10 flex items-center justify-between border-b border-slate-100 bg-white/60 px-6 py-4.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-md shadow-teal-500/25">
                  <Megaphone size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Post Campus Notice
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Publish instant institutional announcement
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="relative z-10 p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Notice Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination Schedule Announcement"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Notice Content <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Provide detailed instructions or notice details..."
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-teal-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-slate-200/80 bg-slate-100/80 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-teal-500/25 hover:from-teal-700 hover:to-emerald-700 transition cursor-pointer"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}
