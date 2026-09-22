// src/features/setup/translations/AddLanguageModal.tsx
import React, { useState } from 'react'
import { X, Languages } from 'lucide-react'
import Button from '@/components/common/Button'

interface AddLanguageModalProps {
  isOpen: boolean
  isSubmitting: boolean
  onClose: () => void
  onSubmit: (data: { code: string; name: string }) => void
}

const COMMON_LOCALES = [
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
]

export const AddLanguageModal: React.FC<AddLanguageModalProps> = ({
  isOpen, isSubmitting, onClose, onSubmit,
}) => {
  const [code, setCode] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSelectPreset = (preset: { code: string; name: string }) => {
    setCode(preset.code)
    setName(preset.name)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim() || !name.trim()) {
      setError('Language Code and Name are required')
      return
    }
    onSubmit({ code: code.trim().toLowerCase(), name: name.trim() })
  }

  return (
    <div
      // Flat scrim, no backdrop-blur (glassmorphism artifact).
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* `.glass-strong` supplies bg + radius + neumorphic shadow. The
          old `border border-text-main/15 shadow-2xl` was invisible (border)
          and overriding the neumorphic shadow. */}
      <div
        className="relative w-full max-w-md overflow-hidden rounded-[30px] glass-strong p-6 sm:p-7 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header — shadow seam replaces the invisible border */}
        <div className="flex items-center justify-between pb-4 shadow-[0_1px_0_var(--neu-shadow-dark)]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-sm shadow-brand-600/20">
              <Languages size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-fg">Add Language Locale</h2>
              <p className="text-xs text-fg-muted">Expand system multi-language support</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Semantic error — tinted bg + border is the signal, kept */}
          {error && (
            <div className="rounded-2xl bg-error/10 border border-error/25 p-3 text-xs text-error">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted mb-2">
              Popular Presets
            </label>
            {/* Preset chips: raised by default, press in when selected.
                The active state is a sunken well with brand text — the
                correct neumorphic gesture for a chip-grid selection. */}
            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {COMMON_LOCALES.map((l) => {
                const isSelected = code === l.code
                return (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => handleSelectPreset(l)}
                    className={`rounded-xl p-2 text-[11px] font-bold text-left transition cursor-pointer ${
                      isSelected
                        ? 'text-brand-700 dark:text-brand-300 shadow-sunken'
                        : 'text-fg-muted shadow-emboss hover:shadow-sunken'
                    }`}
                  >
                    <span className="uppercase font-mono block text-[10px] text-fg-muted/70">
                      {l.code}
                    </span>
                    <span className="truncate block">{l.name.split(' ')[0]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted mb-1.5">
                ISO Code *
              </label>
              {/* Inputs inherit the sunken-well look from globals.css */}
              <input
                type="text"
                required
                maxLength={5}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. es, fr, ja"
                className="w-full rounded-2xl px-4 py-2.5 font-mono text-sm text-fg outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-fg-muted mb-1.5">
                Language Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Spanish"
                className="w-full rounded-2xl px-4 py-2.5 text-sm text-fg outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 shadow-[0_-1px_0_var(--neu-shadow-dark)] flex items-center justify-end gap-3">
            <Button variant="glass" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="solid" type="submit" disabled={isSubmitting || !code.trim() || !name.trim()}>
              {isSubmitting ? 'Adding...' : 'Install Locale'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}