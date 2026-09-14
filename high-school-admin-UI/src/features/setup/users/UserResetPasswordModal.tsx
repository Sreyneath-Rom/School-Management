import React, { useState } from 'react'
import { X, Key, Copy, Check } from 'lucide-react'
import type { SystemUser } from '@/types/user'
import { getFullName } from '@/types/user'

interface UserResetPasswordModalProps {
  isOpen: boolean
  user: SystemUser | null
  isSubmitting: boolean
  onClose: () => void
  onConfirm: (userId: string, newPassword?: string) => void
}

export const UserResetPasswordModal: React.FC<UserResetPasswordModalProps> = ({
  isOpen,
  user,
  isSubmitting,
  onClose,
  onConfirm,
}) => {
  const [newPassword, setNewPassword] = useState('Password@2026!')
  const [copied, setCopied] = useState(false)

  if (!isOpen || !user) return null

  const handleCopy = () => {
    navigator.clipboard.writeText(newPassword)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800/80 dark:bg-slate-900/95"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Ambient Top Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gradient-to-br from-amber-400/25 via-orange-400/15 to-transparent blur-3xl opacity-70" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 bg-white/60 px-6 py-4.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/25">
              <Key size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Reset User Password
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {getFullName(user)} ({user.id})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative z-10 p-6 space-y-4">
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Generate or assign a temporary login password for this account. The user will be required to update their credentials upon next sign in.
          </p>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Temporary Password
            </label>
            <div className="relative">
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 font-mono text-xs sm:text-sm font-bold text-slate-900 focus:border-amber-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white pr-11"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-white transition cursor-pointer"
                title="Copy password"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-2xl border border-slate-200/80 bg-slate-100/80 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(user.id, newPassword)}
              disabled={isSubmitting || !newPassword.trim()}
              className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Resetting...' : 'Confirm Reset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
