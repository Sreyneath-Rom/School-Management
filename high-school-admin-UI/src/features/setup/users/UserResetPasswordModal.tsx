// src/features/setup/users/UserResetPasswordModal.tsx
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
  isOpen, user, isSubmitting, onClose, onConfirm,
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
      // Flat scrim — dropped backdrop-blur-md (a glassmorphism artifact).
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* `.glass-strong` supplies bg + radius + neumorphic shadow. The
          old `border border-white/80 bg-white/95 backdrop-blur-2xl
          shadow-2xl` was the full glassmorphism stack. */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[28px] glass-strong animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Ambient amber/warning tint — kept, it's a warning accent */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-linear-to-br from-amber-400/25 via-orange-400/15 to-transparent blur-3xl opacity-60" />

        {/* Header — shadow seam replaces invisible border */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4.5 shadow-[0_1px_0_var(--neu-shadow-dark)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-amber-500/25">
              <Key size={20} strokeWidth={2.2} />
            </div>
            <div>
              <h2 className="text-base font-bold text-fg">Reset User Password</h2>
              <p className="text-xs text-fg-muted mt-0.5">
                {getFullName(user)} ({user.id})
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition hover:text-fg hover:shadow-sunken cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="relative z-10 p-6 space-y-4">
          <p className="text-xs sm:text-sm text-fg-muted leading-relaxed">
            Generate or assign a temporary login password for this account. The user will be required to update their credentials upon next sign in.
          </p>

          <div>
            <label className="block text-xs font-bold text-fg mb-1.5">
              Temporary Password
            </label>
            <div className="relative">
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl px-4 py-2.5 font-mono text-xs sm:text-sm font-bold text-fg pr-11 focus:outline-none focus:ring-2 focus:ring-warning/50"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-xl p-1.5 text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
                title="Copy password"
              >
                {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-4 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="glass-sm glass-interactive rounded-2xl px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onConfirm(user.id, newPassword)}
              disabled={isSubmitting || !newPassword.trim()}
              className="rounded-2xl bg-linear-to-r from-amber-500 to-orange-500 px-5 py-2 text-xs font-bold text-white shadow-md shadow-amber-500/25 hover:from-amber-600 hover:to-orange-600 transition cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? 'Resetting...' : 'Confirm Reset'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}