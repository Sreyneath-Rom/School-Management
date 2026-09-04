import React, { useState, useRef } from 'react'
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

export default function FileUploadZone({
  id = 'file-upload-zone',
  maxSizeMB = 25,
  value,
  onChange,
  disabled = false,
  label = 'Attach File / Document',
  helperText = 'Supports PDF, DOCX, ZIP, PNG, JPG up to 25MB (UC-FILE-01)',
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<UploadedFileInfo | null>(() => {
    if (value) {
      return {
        name: value,
        size: 1024 * 512, // approx dummy size
        type: 'application/pdf',
      }
    }
    return null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateAndProcessFile = (file: File) => {
    setError(null)

    // Check size (< 25MB per UC-FILE-01)
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      setError(`File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds maximum allowed ${maxSizeMB}MB limit.`)
      return
    }

    // Check extension / MIME
    const extension = '.' + file.name.split('.').pop()?.toLowerCase()
    const isExtensionAllowed = DEFAULT_ALLOWED_EXTENSIONS.includes(extension)
    const isMimeAllowed = DEFAULT_ALLOWED_TYPES.includes(file.type) || isExtensionAllowed

    if (!isMimeAllowed) {
      setError(`File format "${extension}" is not supported. Please upload PDF, DOCX, ZIP, PNG, or JPG.`)
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

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (disabled) return

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndProcessFile(e.dataTransfer.files[0])
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndProcessFile(e.target.files[0])
    }
  }

  const handleRemove = () => {
    setCurrentFile(null)
    setError(null)
    onChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
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
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
            isDragging
              ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/20'
              : 'border-slate-200 dark:border-slate-700 hover:border-brand-400 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-800/70'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="p-2.5 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400">
            <UploadCloud className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-slate-800 dark:text-slate-200">
              <span className="text-brand-600 dark:text-brand-400 underline decoration-1 underline-offset-2">
                Click to browse
              </span>{' '}
              or drag & drop your file
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{helperText}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400">
              <File className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                {currentFile.name}
              </p>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span>{formatFileSize(currentFile.size)}</span>
                <span>•</span>
                <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 font-medium">
                  <CheckCircle2 className="w-3 h-3" /> Ready
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            title="Remove attachment"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 dark:text-rose-400 mt-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
