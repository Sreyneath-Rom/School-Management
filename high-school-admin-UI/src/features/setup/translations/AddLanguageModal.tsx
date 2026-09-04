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
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
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

    onSubmit({
      code: code.trim().toLowerCase(),
      name: name.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-[30px] glass-strong p-6 sm:p-7 shadow-2xl border border-text-main/15">
        <div className="flex items-center justify-between pb-4 border-b border-text-main/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <Languages size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">Add Language Locale</h2>
              <p className="text-xs text-text-main/55">Expand system multi-language support</p>
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

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-2xl bg-error/10 border border-error/20 p-3 text-xs text-error">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-2">
              Popular Presets
            </label>
            <div className="grid grid-cols-3 gap-1.5 max-h-36 overflow-y-auto pr-1">
              {COMMON_LOCALES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => handleSelectPreset(l)}
                  className={`rounded-xl p-2 text-[11px] font-bold text-left transition cursor-pointer border ${
                    code === l.code
                      ? 'bg-brand-500/20 border-brand-500 text-brand-400'
                      : 'bg-text-main/5 border-text-main/10 text-text-main/70 hover:border-text-main/20'
                  }`}
                >
                  <span className="uppercase font-mono block text-[10px] text-text-main/40">{l.code}</span>
                  <span className="truncate block">{l.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                ISO Code *
              </label>
              <input
                type="text"
                required
                maxLength={5}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. es, fr, ja"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 font-mono text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Language Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Spanish"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-text-main/10 flex items-center justify-end gap-3">
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
