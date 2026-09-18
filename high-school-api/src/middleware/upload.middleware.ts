import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { env } from '@/config/env'
import { ApiError } from '@/utils/ApiError'

/**
 * Map each MIME we're willing to accept to the single extension we'll write to
 * disk. Do NOT use `path.extname(file.originalname)` — the client controls
 * that string and can smuggle in anything from `.php` to a path separator.
 */
const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
}

/**
 * Ensure the upload root exists. `mkdir` with `recursive: true` is idempotent
 * and never throws on EEXIST, so this is safe to run on every process boot —
 * no `if (!existsSync)` check-then-act race window.
 */
function ensureUploadDir(): string {
  const abs = path.resolve(env.UPLOAD_PATH)
  fs.mkdirSync(abs, { recursive: true })
  return abs
}

const uploadRoot = ensureUploadDir()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadRoot),
  filename: (_req, file, cb) => {
    const ext = MIME_TO_EXT[file.mimetype] ?? '.bin'
    // randomUUID is collision-free across workers and processes. Do not use
    // Date.now() + Math.random() — that has a real collision window under
    // concurrent uploads.
    cb(null, `${randomUUID()}${ext}`)
  },
})

export const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_UPLOAD_MB * 1024 * 1024,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!(file.mimetype in MIME_TO_EXT)) {
      return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`))
    }
    cb(null, true)
  },
})

/**
 * NOTE — magic-byte validation is still required.
 *
 * `file.mimetype` is a claim made by the client. A `.exe` uploaded with a
 * Content-Type of application/pdf passes `fileFilter` unchanged. After multer
 * writes the file, run `file-type` (or `magic`) against the first few KB and
 * reject if the detected type disagrees with the extension. Wire that into
 * the route consuming `upload.single(...)`, or into a dedicated
 * `validateUploadedFile` middleware.
 *
 * ClamAV scanning is also a README production-checklist item — files that
 * become downloadable by other users (lesson materials, homework submissions)
 * need it before this ships to real students.
 *
 * DEPLOYMENT: disk storage means uploads live on the container's filesystem.
 * Under Kubernetes or any multi-replica setup, a file uploaded to pod A is
 * invisible to pod B. Move to S3-compatible object storage before scaling
 * horizontally.
 */