import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { env } from '@/config/env'
import { ApiError } from '@/utils/ApiError'

const MIME_TO_EXT: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
}

function ensureDir(subdir?: string): string {
  const abs = subdir
    ? path.resolve(env.UPLOAD_PATH, subdir)
    : path.resolve(env.UPLOAD_PATH)
  fs.mkdirSync(abs, { recursive: true })
  return abs
}

function buildFilter() {
  return (_req: unknown, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (!(file.mimetype in MIME_TO_EXT)) {
      return cb(ApiError.badRequest(`Unsupported file type: ${file.mimetype}`))
    }
    cb(null, true)
  }
}

const defaultUploadRoot = ensureDir()

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, defaultUploadRoot),
  filename: (_req, file, cb) => {
    const ext = MIME_TO_EXT[file.mimetype] ?? '.bin'
    cb(null, `${randomUUID()}${ext}`)
  },
})

export const upload = multer({
  storage,
  limits: {
    fileSize: env.MAX_UPLOAD_MB * 1024 * 1024,
    files: 1,
  },
  fileFilter: buildFilter(),
})

/**
 * Variant that writes to `${UPLOAD_PATH}/<subdir>`. Used by school logo
 * uploads, which are served statically from `/uploads/logos`. Do NOT use
 * for user content — those must go through an authenticated route, not
 * static.
 */
export function uploadTo(subdir: string) {
  const root = ensureDir(subdir)
  return multer({
    storage: multer.diskStorage({
      destination: (_req, _file, cb) => cb(null, root),
      filename: (_req, file, cb) => {
        const ext = MIME_TO_EXT[file.mimetype] ?? '.bin'
        cb(null, `${randomUUID()}${ext}`)
      },
    }),
    limits: {
      fileSize: env.MAX_UPLOAD_MB * 1024 * 1024,
      files: 1,
    },
    fileFilter: buildFilter(),
  })
}