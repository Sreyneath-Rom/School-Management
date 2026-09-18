import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Megaphone, ArrowUpRight } from 'lucide-react'
import Modal from '@/components/common/Modal'
import { FormField, FormTextarea } from '@/components/common/FormField'
import Button from '@/components/common/Button'
import EmptyState from '@/components/common/EmptyState'
import { ListCardSkeleton } from '@/components/common/Skeleton'
import { announcementService } from '@/services/announcementService'
import { useToast } from '@/components/common/ToastProvider'
import { ApiError } from '@/lib/apiClient'
import type { Announcement } from '@/types/announcement'

function relativeTime(iso: string): string {
  const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return new Date(iso).toLocaleDateString()
}

export default function Announcements() {
  const { showToast } = useToast()
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    announcementService
      .list()
      .then((rows) => { if (!cancelled) setItems(rows) })
      .catch(() => { if (!cancelled) showToast('Could not load announcements', 'error') })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [showToast])

  function closeModal() {
    setIsOpen(false)
    setTitle('')
    setBody('')
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !body.trim() || submitting) return
    setSubmitting(true)

    try {
      const created = await announcementService.create({
        title: title.trim(),
        content: body.trim(),
        audience: 'all',
      })
      setItems((prev) => [created, ...prev])
      closeModal()
      showToast('Announcement published', 'success')
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : 'Could not publish announcement',
        'error'
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <ListCardSkeleton rows={3} />

  return (
    <section className="rounded-3xl border border-surface bg-surface-strong p-5 sm:p-6 shadow-xs">
      <div className="mb-4 flex items-center justify-between pb-3 border-b border-surface">
        <div>
          <h2 className="text-base font-bold text-fg">Broadcasts & Notices</h2>
          <p className="text-xs text-fg-muted">Institutional announcements</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 rounded-xl bg-brand-600 px-2.5 py-1.5 text-xs font-bold text-white hover:bg-brand-700 transition cursor-pointer shadow-xs"
        >
          <Plus size={13} />
          <span>Post</span>
        </button>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Published notices will appear here."
          variant="compact"
        />
      ) : (
        <div className="space-y-3">
          {items.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-surface bg-surface p-3.5 transition hover:border-brand-500/30"
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-bold text-fg truncate">{item.title}</p>
                <span className="shrink-0 rounded-full bg-surface-strong px-2 py-0.5 text-[10px] font-bold text-fg-muted border border-surface">
                  {relativeTime(item.createdAt)}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-fg-muted line-clamp-2 leading-relaxed">
                {item.content}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-surface text-center">
        <Link
          to="/communication/announcements"
          className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <span>Open Communication Hub</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title="Post Campus Notice"
        subtitle="Publish instant institutional announcement"
        icon={<Megaphone size={20} />}
        accent="brand"
        footer={
          <>
            <Button variant="outline" onClick={closeModal} disabled={submitting}>
              Cancel
            </Button>
            <Button
              variant="solid"
              type="submit"
              form="announcement-create-form"
              loading={submitting}
            >
              Publish Notice
            </Button>
          </>
        }
      >
        <form id="announcement-create-form" onSubmit={handleCreate} className="space-y-4">
          <FormField
            label="Notice Title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Midterm Examination Schedule Announcement"
          />
          <FormTextarea
            label="Notice Content"
            required
            rows={4}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Provide detailed instructions or notice details..."
          />
        </form>
      </Modal>
    </section>
  )
}