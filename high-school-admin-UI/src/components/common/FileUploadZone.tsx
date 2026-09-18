// src/components/common/FileUploadZone.tsx
import { useRef, useState, type ChangeEvent, type DragEvent } from 'react'
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from 'lucide-react'

export interface UploadedFileInfo {
  name: string
  size: number
  type: string
  url?: string
}

interface FileUploadZoneProps {
  id?: string
  accept?: string
  maxSizeMB?: number
  value?: string | null
  onChange: (fileInfo: UploadedFileInfo | null) => void
  disabled?: boolean
  label?: string
  helperText?: string
}

const DEFAULT_ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
  'application/x-zip-compressed',
  'image/png',
  'image/jpeg',
  'image/jpg',
]

const DEFAULT_ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.zip', '.png', '.jpg', '.jpeg']

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export default function FileUploadZone({
  id = 'file-upload-zone',
  maxSizeMB = 25,
  value,
  onChange,
  disabled = false,
  label = 'Attach File / Document',
  helperText = `Supports PDF, DOCX, ZIP, PNG, JPG up to ${maxSizeMB}MB`,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<UploadedFileInfo | null>(() =>
    value ? { name: value, size: 0, type: '' } : null
  )
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndProcess = (file: File) => {
    setError(null)

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(
        `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the ${maxSizeMB}MB limit.`
      )
      return
    }

    const extension = `.${file.name.split('.').pop()?.toLowerCase() ?? ''}`
    const allowed =
      DEFAULT_ALLOWED_EXTENSIONS.includes(extension) ||
      DEFAULT_ALLOWED_TYPES.includes(file.type)

    if (!allowed) {
      setError(
        `File format "${extension}" is not supported. Please upload PDF, DOCX, ZIP, PNG, or JPG.`
      )
      return
    }

    const info: UploadedFileInfo = {
      name: file.name,
      size: file.size,
      type: file.type,
      url: URL.createObjectURL(file),
    }
    setCurrentFile(info)
    onChange(info)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return
    const file = e.dataTransfer.files?.[0]
    if (file) validateAndProcess(file)
  }

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) validateAndProcess(file)
  }

  const handleRemove = () => {
    setCurrentFile(null)
    setError(null)
    onChange(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-xs font-semibold text-fg">
          {label}
        </label>
      )}

      <input
        ref={fileInputRef}
        type="file"
        id={id}
        accept={DEFAULT_ALLOWED_EXTENSIONS.join(',')}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />

      {!currentFile ? (
        <div
          role="button"
          tabIndex={disabled ? -1 : 0}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              if (!disabled) fileInputRef.current?.click()
            }
          }}
          className={`relative border-2 border-dashed rounded-2xl p-4 text-center transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-brand-500 bg-brand-500/10'
              : 'border-surface bg-surface hover:border-brand-400 hover:bg-surface-strong'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="p-2.5 rounded-full bg-surface-strong text-brand-600 dark:text-brand-400">
            <UploadCloud size={20} />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-fg">
              <span className="text-brand-600 dark:text-brand-400 underline decoration-1 underline-offset-2">
                Click to browse
              </span>{' '}
              or drag & drop your file
            </p>
            <p className="text-[11px] text-fg-muted">{helperText}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-2xl border border-surface bg-surface-strong">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-success/15 text-success">
              <File size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-fg truncate">
                {currentFile.name}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-fg-muted">
                {currentFile.size > 0 && <span>{formatFileSize(currentFile.size)}</span>}
                {currentFile.size > 0 && <span>•</span>}
                <span className="text-success flex items-center gap-0.5 font-medium">
                  <CheckCircle2 size={12} /> Ready
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            aria-label="Remove attachment"
            className="p-1.5 rounded-lg text-fg-muted hover:text-error hover:bg-surface transition cursor-pointer"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-error mt-1">
          <AlertCircle size={14} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}