import { useState } from 'react'
import { announcements as initialAnnouncements } from '@/services/mockData'
import Button from '@/components/common/Button'
import { X } from 'lucide-react'
import { ListCardSkeleton } from '@/components/common/Skeleton'

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
    <section className="glass rounded-[28px] p-6 text-text-main">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-text-main">Announcements</h2>
          <p className="text-sm text-text-main/70">Latest campus updates and alerts</p>
        </div>
        <Button variant="glass" className="glass-interactive" onClick={() => setIsOpen(true)}>
          Create New
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="glass glass-interactive rounded-3xl p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <p className="font-semibold text-text-main">{item.title}</p>
              <span className="shrink-0 rounded-full bg-brand-500/15 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-700 dark:text-brand-300">
                {item.time}
              </span>
            </div>
            <p className="mt-2 text-sm text-text-main/80">{item.body}</p>
          </div>
        ))}
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-950/40 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            className="glass-strong w-full max-w-md rounded-[28px] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-text-main">New Announcement</h3>
                <p className="text-sm text-text-main/70">Share an update with the campus</p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-1.5 text-text-main/60 hover:bg-brand-500/15 hover:text-text-main transition"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="announcement-title" className="mb-1.5 block text-sm font-semibold text-text-main/80">
                  Title
                </label>
                <input
                  id="announcement-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Early Dismissal Friday"
                  className="glass w-full rounded-2xl px-4 py-2.5 text-sm text-text-main outline-none focus:ring-2 focus:ring-brand-400 placeholder:text-text-main/40"
                  required
                />
              </div>

              <div>
                <label htmlFor="announcement-body" className="mb-1.5 block text-sm font-semibold text-text-main/80">
                  Message
                </label>
                <textarea
                  id="announcement-body"
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Write the announcement details..."
                  rows={4}
                  className="glass w-full resize-none rounded-2xl px-4 py-2.5 text-sm text-text-main outline-none focus:ring-2 focus:ring-brand-400 placeholder:text-text-main/40"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button variant="glass" type="button" onClick={closeModal}>
                  Cancel
                </Button>
                <Button variant="teal" type="submit">
                  Post Announcement
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  )
}