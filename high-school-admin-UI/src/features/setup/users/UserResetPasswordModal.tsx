// src/features/setup/users/UserResetPasswordModal.tsx
import React, { useState } from 'react'
import { X, Key, Copy, Check } from 'lucide-react'
import Button from '@/components/common/Button'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-[30px] glass-strong p-6 sm:p-7 shadow-2xl border border-text-main/15">
        <div className="flex items-center justify-between pb-4 border-b border-text-main/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-500 shadow-md">
              <Key size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">Reset User Password</h2>
              <p className="text-xs text-text-main/55">{getFullName(user)} ({user.id})</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 hover:text-text-main transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-5 space-y-4">
          <p className="text-xs text-text-main/70 leading-relaxed">
            Generate or assign a temporary login password for this account. The user will be requested to update their credentials on next sign in.
          </p>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
              Temporary Password
            </label>
            <div className="relative">
              <input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 font-mono text-sm text-text-main outline-none transition focus:border-brand-500 pr-10"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-text-main/50 hover:bg-text-main/10 hover:text-text-main transition cursor-pointer"
                title="Copy password"
              >
                {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-text-main/10 flex items-center justify-end gap-3">
            <Button variant="glass" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="solid"
              type="button"
              onClick={() => onConfirm(user.id, newPassword)}
              disabled={isSubmitting || !newPassword.trim()}
            >
              {isSubmitting ? 'Resetting...' : 'Confirm Reset'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
