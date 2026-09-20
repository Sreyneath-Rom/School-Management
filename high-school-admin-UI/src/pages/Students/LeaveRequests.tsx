// src/pages/Students/LeaveRequests.tsx
import { useCallback, useEffect, useMemo, useState } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  FileText,
  Plus,
  Check,
  X,
  Eye,
  RefreshCw,
  Info,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { leaveRequestService } from '@/services/leaveRequestService'
import type { LeaveRequest } from '@/types/leaveRequest'

// STRIPPED: LeaveRequest has no studentName, studentCode, attachmentUrl,
// reviewNote. Rows display the raw studentId. Review payload accepts only
// the fields the backend defines — no note is sent.

type StatusTab = 'All' | 'PENDING' | 'APPROVED' | 'REJECTED'

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

  useEffect(() => {
    load()
  }, [load])

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
    { id: 'pending', label: 'Pending', value: String(stats.pending), delta: '-', deltaDirection: 'neutral', deltaLabel: 'awaiting review', icon: 'Clock', tint: 'amber' },
    { id: 'approved', label: 'Approved', value: String(stats.approved), delta: '-', deltaDirection: 'neutral', deltaLabel: 'this term', icon: 'CheckCircle2', tint: 'green' },
    { id: 'rejected', label: 'Rejected', value: String(stats.rejected), delta: '-', deltaDirection: 'neutral', deltaLabel: 'declined', icon: 'XCircle', tint: 'red' },
    { id: 'total', label: 'Total', value: String(stats.total), delta: '-', deltaDirection: 'neutral', deltaLabel: 'submitted', icon: 'FileText', tint: 'violet' },
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
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-surface bg-surface text-color text-xs font-semibold hover:bg-surface-strong transition disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setNewOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition"
          >
            <Plus size={16} />
            <span>Record Request</span>
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-info/30 bg-info/5 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-secondary">
          Requests are loaded from <code className="font-mono">/leaves</code>. Rows
          show raw student IDs — a directory join is not yet available.
        </p>
      </div>

      <StatsGrid cards={kpiCards} columns={4} />

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl glass-sm border border-surface">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['All', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                tab === t
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-secondary hover:bg-surface'
              }`}
            >
              {t === 'All' ? 'All' : t.charAt(0) + t.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search size={15} className="absolute left-3 top-2.5 text-secondary" />
          <input
            type="text"
            placeholder="Search student ID or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-surface rounded-xl text-xs text-color placeholder:text-secondary focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="rounded-2xl glass-sm border border-surface overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-16 text-center text-secondary text-sm">
            <RefreshCw size={16} className="inline animate-spin mr-2" />
            Loading leave requests...
          </div>
        ) : error ? (
          <div className="py-16 text-center">
            <p className="text-sm font-bold text-error">Couldn't load requests</p>
            <p className="mt-1 text-xs text-secondary">{error.message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-secondary text-sm">
            {requests.length === 0
              ? 'No leave requests yet.'
              : 'No requests match the current filters.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface bg-surface/50 text-[11px] font-semibold uppercase tracking-wider text-secondary">
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Period</th>
                  <th className="py-3.5 px-4">Reason</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface text-xs text-color">
                {filtered.map((req) => {
                  const days = daysBetween(req.startDate, req.endDate)
                  return (
                    <tr key={req.id} className="hover:bg-surface/40 transition">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-black text-white bg-linear-to-tr from-brand-600 to-brand-400 shrink-0">
                            {initials(req.studentId)}
                          </div>
                          <div className="font-mono text-[11px] text-secondary">
                            {req.studentId}
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-color flex items-center gap-1.5">
                          <Calendar size={12} className="text-secondary" />
                          {req.startDate}
                          {req.startDate !== req.endDate && ` → ${req.endDate}`}
                        </div>
                        <div className="text-[11px] text-secondary">
                          {days} {days === 1 ? 'day' : 'days'}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 max-w-xs">
                        <p className="line-clamp-2 text-secondary">
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
                            className="p-1.5 rounded-lg hover:bg-surface text-secondary hover:text-brand-600 transition"
                          >
                            <Eye size={15} />
                          </button>
                          {req.status === 'PENDING' && (
                            <>
                              <button
                                onClick={() => handleApprove(req.id)}
                                disabled={busyId === req.id}
                                className="p-1.5 rounded-lg bg-success/10 hover:bg-success/20 text-success transition disabled:opacity-50"
                              >
                                <Check size={15} />
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                disabled={busyId === req.id}
                                className="p-1.5 rounded-lg bg-error/10 hover:bg-error/20 text-error transition disabled:opacity-50"
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

      {detailOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface pb-3">
              <h3 className="text-base font-bold text-color flex items-center gap-2">
                <FileText size={18} className="text-brand-500" />
                Leave Application
              </h3>
              <button
                onClick={() => {
                  setDetailOpen(false)
                  setSelected(null)
                }}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-surface">
                <div className="w-11 h-11 rounded-full flex items-center justify-center text-xs font-black text-white bg-linear-to-tr from-brand-600 to-brand-400">
                  {initials(selected.studentId)}
                </div>
                <div className="font-mono text-[11px] text-secondary">
                  {selected.studentId}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-secondary block text-[11px]">Start</span>
                  <span className="font-semibold text-color">{selected.startDate}</span>
                </div>
                <div>
                  <span className="text-secondary block text-[11px]">End</span>
                  <span className="font-semibold text-color">{selected.endDate}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface">
                <div className="text-secondary text-[11px] mb-1">Reason</div>
                <div className="text-color">{selected.reason || '—'}</div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface">
              {selected.status === 'PENDING' ? (
                <>
                  <button
                    onClick={() => handleReject(selected.id)}
                    disabled={busyId === selected.id}
                    className="px-3.5 py-1.5 rounded-xl border border-error/40 text-error hover:bg-error/10 text-xs font-semibold transition disabled:opacity-50"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selected.id)}
                    disabled={busyId === selected.id}
                    className="px-4 py-1.5 rounded-xl bg-success hover:opacity-90 text-white text-xs font-semibold shadow-sm transition disabled:opacity-50"
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
                  className="px-4 py-2 rounded-xl bg-surface text-color text-xs font-semibold hover:bg-surface-strong"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {newOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-surface p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-surface pb-3">
              <h3 className="text-base font-bold text-color flex items-center gap-2">
                <Plus size={18} className="text-brand-500" />
                Record Leave Request
              </h3>
              <button
                onClick={() => setNewOpen(false)}
                className="p-1 rounded-lg text-secondary hover:text-color"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-secondary mb-1">
                  Student ID *
                </label>
                <input
                  type="text"
                  required
                  value={newForm.studentId}
                  onChange={(e) => setNewForm({ ...newForm, studentId: e.target.value })}
                  placeholder="student id"
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color font-mono focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-secondary mb-1">
                    Start date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newForm.startDate}
                    onChange={(e) => setNewForm({ ...newForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-secondary mb-1">
                    End date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newForm.endDate}
                    onChange={(e) => setNewForm({ ...newForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-secondary mb-1">
                  Reason *
                </label>
                <textarea
                  rows={3}
                  required
                  value={newForm.reason}
                  onChange={(e) => setNewForm({ ...newForm, reason: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-surface border border-surface text-color focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-surface">
                <button
                  type="button"
                  onClick={() => setNewOpen(false)}
                  className="px-4 py-2 rounded-xl border border-surface text-secondary text-xs font-semibold hover:bg-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20 disabled:opacity-50"
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