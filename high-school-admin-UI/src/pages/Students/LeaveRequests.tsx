// src/pages/Students/LeaveRequests.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Calendar, Clock, CheckCircle2, XCircle, Search, FileText,
  Plus, Check, X, Eye, RefreshCw, Info,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { leaveRequestService } from '@/services/leaveRequestService'
import type { LeaveRequest } from '@/types/leaveRequest'

type StatusTab = 'All' | 'PENDING' | 'APPROVED' | 'REJECTED'

/* Neumorphic hairline seams — the same pair globals.css exposes as
   `theme-divider` (bottom) plus its mirror (top). */
const SEAM_B = 'shadow-[0_1px_0_var(--neu-shadow-dark)]'
const SEAM_T = 'shadow-[0_-1px_0_var(--neu-shadow-dark)]'

function initials(value: string): string {
  const parts = value.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function daysBetween(start: string, end: string): number {
  const s = new Date(start).getTime()
  const e = new Date(end).getTime()
  if (Number.isNaN(s) || Number.isNaN(e)) return 0
  return Math.max(1, Math.round((e - s) / 86400000) + 1)
}

// Inputs inherit the sunken-well look from globals.css (.neu-inset).
// Only layout and focus ring are set inline.
const inputBase =
  'w-full px-3 py-2 rounded-xl text-xs text-fg focus:outline-none focus:ring-2 focus:ring-brand-500'
const labelBase = 'block font-semibold text-fg-muted mb-1'

export default function LeaveRequests() {
  const { showToast } = useToast()

  const [requests, setRequests] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState<StatusTab>('All')
  const [selected, setSelected] = useState<LeaveRequest | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)

  const [newForm, setNewForm] = useState({
    studentId: '',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
    reason: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const list = await leaveRequestService.list()
      setRequests(Array.isArray(list) ? list : [])
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)))
      setRequests([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = useMemo(() => {
    return requests.filter((r) => {
      if (tab !== 'All' && r.status !== tab) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        return (
          r.studentId.toLowerCase().includes(q) ||
          (r.reason ?? '').toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [requests, tab, search])

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === 'PENDING').length
    const approved = requests.filter((r) => r.status === 'APPROVED').length
    const rejected = requests.filter((r) => r.status === 'REJECTED').length
    return { pending, approved, rejected, total: requests.length }
  }, [requests])

  const kpiCards: StatCard[] = [
    { id: 'pending',  label: 'Pending',  value: String(stats.pending),  delta: '-', deltaDirection: 'neutral', deltaLabel: 'awaiting review', icon: 'Clock',        tint: 'amber' },
    { id: 'approved', label: 'Approved', value: String(stats.approved), delta: '-', deltaDirection: 'neutral', deltaLabel: 'this term',       icon: 'CheckCircle2', tint: 'green' },
    { id: 'rejected', label: 'Rejected', value: String(stats.rejected), delta: '-', deltaDirection: 'neutral', deltaLabel: 'declined',        icon: 'XCircle',      tint: 'red' },
    { id: 'total',    label: 'Total',    value: String(stats.total),    delta: '-', deltaDirection: 'neutral', deltaLabel: 'submitted',       icon: 'FileText',     tint: 'violet' },
  ]

  const handleApprove = async (id: string) => {
    setBusyId(id)
    try {
      await leaveRequestService.review(id, { status: 'APPROVED' })
      showToast('Leave request approved', 'success')
      setDetailOpen(false)
      setSelected(null)
      await load()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to approve'
      showToast(msg, 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async (id: string) => {
    setBusyId(id)
    try {
      await leaveRequestService.review(id, { status: 'REJECTED' })
      showToast('Leave request rejected', 'info')
      setDetailOpen(false)
      setSelected(null)
      await load()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to reject'
      showToast(msg, 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newForm.studentId.trim() || !newForm.reason.trim()) {
      showToast('Student ID and reason are required', 'error')
      return
    }
    if (new Date(newForm.startDate) > new Date(newForm.endDate)) {
      showToast('Start date must not be after end date', 'error')
      return
    }

    setSubmitting(true)
    try {
      await leaveRequestService.createForStudent({
        studentId: newForm.studentId.trim(),
        startDate: newForm.startDate,
        endDate: newForm.endDate,
        reason: newForm.reason.trim(),
      })
      showToast('Leave request recorded', 'success')
      setNewOpen(false)
      setNewForm({
        studentId: '',
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
        reason: '',
      })
      await load()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unable to save'
      showToast(msg, 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Student Leave Requests"
          subtitle="Review and track student absence applications."
        />
        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setNewOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl theme-button-primary text-xs font-semibold"
          >
            <Plus size={16} />
            <span>Record Request</span>
          </button>
        </div>
      </div>

      {/* Info banner — semantic info signal */}
      <div className="rounded-2xl border border-info/30 bg-info/10 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-fg-muted">
          Requests are loaded from <code className="font-mono">/leaves</code>. Rows
          show raw student IDs — a directory join is not yet available.
        </p>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl glass-sm">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['All', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                tab === t
                  ? 'bg-brand-600 text-white shadow-sunken'
                  : 'text-fg-muted hover:text-fg hover:shadow-sunken'
              }`}
            >
              {t === 'All' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-fg-muted z-10 pointer-events-none" />
          <input
            type="text"
            placeholder="Search student ID or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl text-xs text-fg placeholder:text-fg-muted/70 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {/* Table container */}
      <div className="rounded-2xl glass-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-fg-muted text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading leave requests...
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-error">Couldn't load requests</p>
            <p className="mt-1 text-xs text-fg-muted">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-fg-muted text-sm">
            {requests.length === 0
              ? 'No leave requests yet.'
              : 'No requests match the current filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className={`${SEAM_B} text-[11px] font-semibold uppercase tracking-wider text-fg-muted`}>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Period</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--neu-shadow-dark) text-xs text-fg">
                {filtered.map((req) => {
                  const days = daysBetween(req.startDate, req.endDate)
                  return (
                    <tr
                      key={req.id}
                      className="hover:shadow-sunken transition-shadow"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white bg-linear-to-tr from-brand-600 to-brand-400 shrink-0">
                            {initials(req.studentId)}
                          </div>
                          <div className="font-mono text-[11px] text-fg-muted">
                            {req.studentId}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-fg flex items-center gap-1.5">
                          <Calendar size={12} className="text-fg-muted" />
                          {req.startDate}
                          {req.startDate !== req.endDate && ` → ${req.endDate}`}
                        </div>
                        <div className="text-[11px] text-fg-muted">
                          {days} {days === 1 ? 'day' : 'days'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-fg-muted">
                          {req.reason || '—'}
                        </p>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                            req.status === 'APPROVED'
                              ? 'bg-success/15 text-success'
                              : req.status === 'PENDING'
                                ? 'bg-warning/15 text-warning'
                                : 'bg-error/15 text-error'
                          }`}
                        >
                          {req.status === 'APPROVED' && <CheckCircle2 size={12} />}
                          {req.status === 'PENDING' && <Clock size={12} />}
                          {req.status === 'REJECTED' && <XCircle size={12} />}
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => {
                              setSelected(req)
                              setDetailOpen(true)
                            }}
                            className="p-1.5 rounded-lg text-fg-muted hover:text-brand-600 hover:shadow-sunken transition cursor-pointer"
                            aria-label="Inspect request"
                          >
                            <Eye size={15} />
                          </button>
                          {req.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(req.id)}
                                disabled={busyId === req.id}
                                aria-label="Approve request"
                                className="p-1.5 rounded-lg bg-success/15 hover:bg-success/25 text-success transition disabled:opacity-50 cursor-pointer"
                              >
                                <Check size={15} />
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                disabled={busyId === req.id}
                                aria-label="Reject request"
                                className="p-1.5 rounded-lg bg-error/15 hover:bg-error/25 text-error transition disabled:opacity-50 cursor-pointer"
                              >
                                <X size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {detailOpen && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay backdrop-blur-sm animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setDetailOpen(false)
              setSelected(null)
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl glass-strong p-6 space-y-4 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className={`flex items-center justify-between pb-3 ${SEAM_B}`}>
              <h3 className="text-base font-bold text-fg flex items-center gap-2">
                <FileText size={18} className="text-brand-600 dark:text-brand-400" />
                Leave Application
              </h3>
              <button
                onClick={() => {
                  setDetailOpen(false)
                  setSelected(null)
                }}
                aria-label="Close"
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl shadow-sunken">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-black text-white bg-linear-to-tr from-brand-600 to-brand-400">
                  {initials(selected.studentId)}
                </div>
                <div className="font-mono text-[11px] text-fg-muted">
                  {selected.studentId}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-fg-muted block text-[11px]">Start</span>
                  <span className="font-semibold text-fg">{selected.startDate}</span>
                </div>
                <div>
                  <span className="text-fg-muted block text-[11px]">End</span>
                  <span className="font-semibold text-fg">{selected.endDate}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl shadow-sunken">
                <div className="text-fg-muted text-[11px] mb-1">Reason</div>
                <div className="text-fg">{selected.reason || '—'}</div>
              </div>
            </div>

            <div className={`flex items-center justify-end gap-2 pt-3 ${SEAM_T}`}>
              {selected.status === 'PENDING' ? (
                <>
                  {/* Reject: tinted surface, no border — matches the
                      semantic fill used by the row-level action button. */}
                  <button
                    onClick={() => handleReject(selected.id)}
                    disabled={busyId === selected.id}
                    className="px-3.5 py-1.5 rounded-xl bg-error/15 hover:bg-error/25 text-error text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selected.id)}
                    disabled={busyId === selected.id}
                    className="px-4 py-1.5 rounded-xl bg-success hover:opacity-90 text-white text-xs font-semibold transition disabled:opacity-50 cursor-pointer"
                  >
                    Approve
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setDetailOpen(false)
                    setSelected(null)
                  }}
                  className="glass-sm glass-interactive px-4 py-2 rounded-xl text-fg text-xs font-semibold"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create modal */}
      {newOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay backdrop-blur-sm animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setNewOpen(false) }}
        >
          <div className="w-full max-w-md rounded-2xl glass-strong p-6 space-y-4 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className={`flex items-center justify-between pb-3 ${SEAM_B}`}>
              <h3 className="text-base font-bold text-fg flex items-center gap-2">
                <Plus size={18} className="text-brand-600 dark:text-brand-400" />
                Record Leave Request
              </h3>
              <button
                onClick={() => setNewOpen(false)}
                aria-label="Close"
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className={labelBase}>Student ID *</label>
                <input
                  type="text"
                  required
                  value={newForm.studentId}
                  onChange={(e) => setNewForm({ ...newForm, studentId: e.target.value })}
                  placeholder="student id"
                  className={`${inputBase} font-mono`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelBase}>Start date *</label>
                  <input
                    type="date"
                    required
                    value={newForm.startDate}
                    onChange={(e) => setNewForm({ ...newForm, startDate: e.target.value })}
                    className={inputBase}
                  />
                </div>
                <div>
                  <label className={labelBase}>End date *</label>
                  <input
                    type="date"
                    required
                    value={newForm.endDate}
                    onChange={(e) => setNewForm({ ...newForm, endDate: e.target.value })}
                    className={inputBase}
                  />
                </div>
              </div>

              <div>
                <label className={labelBase}>Reason *</label>
                <textarea
                  rows={3}
                  required
                  value={newForm.reason}
                  onChange={(e) => setNewForm({ ...newForm, reason: e.target.value })}
                  className={inputBase}
                />
              </div>

              <div className={`flex items-center justify-end gap-2 pt-3 ${SEAM_T}`}>
                <button
                  type="button"
                  onClick={() => setNewOpen(false)}
                  className="glass-sm glass-interactive px-4 py-2 rounded-xl text-fg-muted hover:text-fg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl theme-button-primary font-semibold disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <RefreshCw size={13} className="animate-spin" />}
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}