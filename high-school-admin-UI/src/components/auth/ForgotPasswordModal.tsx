// src/components/auth/ForgotPasswordModal.tsx
import { useEffect, useState } from 'react'
import { Mail, CheckCircle2, AlertCircle, Building2, Phone, Clock } from 'lucide-react'
import Modal from '@/components/common/Modal'
import { FormField } from '@/components/common/FormField'
import Button from '@/components/common/Button'
import { authService } from '@/services/authService'
import { ApiError } from '@/lib/apiClient'

interface Props {
  isOpen: boolean
  onClose: () => void
  roleName: string
  defaultIdentifier?: string
}

export default function ForgotPasswordModal({
  isOpen,
  onClose,
  roleName,
  defaultIdentifier = '',
}: Props) {
  const [identifier, setIdentifier] = useState(defaultIdentifier)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Reset transient state on close so a fresh open doesn't show a stale
  // success/error from a previous attempt.
  useEffect(() => {
    if (!isOpen) {
      setIsSubmitted(false)
      setIsLoading(false)
      setError('')
      setSuccessMessage('')
    }
  }, [isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!identifier.trim()) {
      setError('Please enter your email address or school ID.')
      return
    }
    setError('')
    setIsLoading(true)

    try {
      const response = await authService.forgotPassword(identifier.trim())
      setSuccessMessage(
        response.message ||
          'Password recovery instructions have been dispatched to your registered contact or assigned school advisor.'
      )
      setIsSubmitted(true)
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Unable to send password recovery request. Please contact the school administrator directly.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleFinalClose = () => {
    setIdentifier('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleFinalClose}
      accent="warning"
      size="lg"
      title={isSubmitted ? undefined : `Reset ${roleName} Password`}
      icon={
        !isSubmitted ? (
          <Mail size={20} className="text-warning" />
        ) : undefined
      }
      footer={
        isSubmitted ? (
          <Button variant="solid" onClick={handleFinalClose} className="w-full">
            Back to Sign In
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={handleFinalClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              id="submit-forgot-password-btn"
              variant="solid"
              type="submit"
              form="forgot-password-form"
              loading={isLoading}
            >
              Send Recovery Link
            </Button>
          </>
        )
      }
    >
      {!isSubmitted ? (
        <form id="forgot-password-form" onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-fg-muted leading-relaxed">
            Enter your registered school email address or School ID
            (e.g. ADM-xxx, TCH-xxx, STU-xxx). We will verify your account and
            initiate the secure password reset flow.
          </p>

          {/* Semantic error alert — kept tinted so it stays legible and
              signal-clear. The tinted border is intentional here, not a
              surface border. */}
          {error && (
            <div className="p-3.5 bg-error/15 border border-error/30 rounded-xl flex items-center gap-2.5 text-xs text-error">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* FormField's inner <input> picks up the global sunken-well
              styling from globals.css automatically. */}
          <FormField
            id="forgot-password-identifier-input"
            label="Email or School ID"
            icon={<Mail size={16} />}
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="user@varinhigh.edu.kh or STU-2026-089"
            autoFocus
          />

          {/* Sunken well — previously `bg-surface border border-surface`,
              which was invisible because both axes resolved to the page
              background under this theme. */}
          <div className="p-3.5 rounded-2xl shadow-sunken text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-fg">
              <Building2 size={15} className="text-brand-600 dark:text-brand-400" />
              School Administrator Support Contact
            </div>
            <div className="space-y-1 text-[11px] text-fg-muted">
              <p className="flex items-center gap-1.5">
                <Mail size={12} />
                it-support@varinhigh.edu.kh
              </p>
              <p className="flex items-center gap-1.5">
                <Phone size={12} />
                +855 (0) 23 888 999 • Administration Wing, Room 102
              </p>
              <p className="flex items-center gap-1.5">
                <Clock size={12} />
                Office Hours: Monday – Friday, 7:30 AM – 5:00 PM
              </p>
            </div>
          </div>
        </form>
      ) : (
        <div className="text-center py-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-success/15 border border-success/30 flex items-center justify-center text-success mb-4">
            <CheckCircle2 size={32} />
          </div>

          <h3 className="text-xl font-bold text-fg">Request Received</h3>
          <p className="text-sm text-fg-muted mt-2 leading-relaxed">
            {successMessage}
          </p>

          {/* Sunken well — same fix as above. */}
          <div className="mt-4 p-3 rounded-xl shadow-sunken text-xs text-fg-muted">
            Identifier submitted:{' '}
            <strong className="text-fg font-mono">{identifier}</strong>
          </div>
        </div>
      )}
    </Modal>
  )
}