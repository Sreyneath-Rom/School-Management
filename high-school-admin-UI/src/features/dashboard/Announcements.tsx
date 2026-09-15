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
    <section className="rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-surface">
        <div>
          <h2 className="text-base font-bold text-color">
            Broadcasts & Notices
          </h2>
          <p className="text-xs text-secondary">
            Institutional announcements
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1 rounded-xl bg-brand-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-brand-700 transition cursor-pointer shadow-xs"
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
            className="rounded-2xl border border-surface bg-surface p-3.5 transition hover:border-brand-500/30"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-bold text-color truncate">
                {item.title}
              </p>
              <span className="shrink-0 rounded-full bg-surface-strong px-2 py-0.5 text-[10px] font-bold text-secondary border border-surface">
                {item.time}
              </span>
            </div>
            <p className="mt-1 text-[11px] text-secondary line-clamp-2 leading-relaxed">
              {item.body}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-surface text-center">
        <Link
          to="/communication/announcements"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
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
            className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-surface bg-surface-strong shadow-2xl animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="relative z-10 flex items-center justify-between border-b border-surface px-6 py-4.5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md">
                  <Megaphone size={20} strokeWidth={2.2} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-color">
                    Post Campus Notice
                  </h3>
                  <p className="text-xs text-secondary mt-0.5">
                    Publish instant institutional announcement
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-secondary transition hover:text-color cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="relative z-10 p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-color mb-1.5">
                  Notice Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Midterm Examination Schedule Announcement"
                  className="w-full rounded-2xl border border-surface bg-surface px-3.5 py-2.5 text-xs sm:text-sm font-medium text-color placeholder-secondary focus:border-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-color mb-1.5">
                  Notice Content <span className="text-error">*</span>
                </label>
                <textarea
                  rows={4}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Provide detailed instructions or notice details..."
                  className="w-full rounded-2xl border border-surface bg-surface p-3.5 text-xs sm:text-sm font-medium text-color placeholder-secondary focus:border-brand-500 focus:outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-surface">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-2xl border border-surface bg-surface px-4 py-2 text-xs font-bold text-secondary hover:text-color transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-brand-600 hover:bg-brand-700 px-5 py-2 text-xs font-bold text-white shadow-md transition cursor-pointer"
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
