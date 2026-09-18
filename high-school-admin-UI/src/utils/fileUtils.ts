/**
 * File type and size rules — aligned with the backend's
 * `upload.middleware.ts`.
 *
 * A file that passes these checks is not guaranteed to be accepted by the
 * server (the MIME is client-declared and can be spoofed), but a file that
 * fails these checks will definitely be rejected — so catching them here
 * gives the user a faster, clearer error.
 */

const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const;

const VALID_DOCUMENT_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // pptx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
] as const;

/**
 * Matches the backend's MAX_UPLOAD_MB default of 10. If your `.env` sets
 * a different value, expose it as `VITE_MAX_UPLOAD_MB` and read it here —
 * otherwise the two can drift and the frontend will accept files the
 * backend rejects.
 */
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Check whether a file's MIME type is an accepted image format.
 */
export const isValidImage = (file: File): boolean =>
  (VALID_IMAGE_TYPES as readonly string[]).includes(file.type);

/**
 * Check whether a file's MIME type is an accepted document format.
 */
export const isValidDocument = (file: File): boolean =>
  (VALID_DOCUMENT_TYPES as readonly string[]).includes(file.type);

/**
 * Check whether a file's size is within the limit.
 */
export const isValidFileSize = (
  file: File,
  maxSize = MAX_FILE_SIZE
): boolean => file.size <= maxSize;

/**
 * Get the lowercase extension from a filename, without the dot.
 * Returns an empty string when there's no extension.
 */
export const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot === -1 || lastDot === filename.length - 1) return '';
  return filename.slice(lastDot + 1).toLowerCase();
};

/**
 * File size in megabytes, to two decimals.
 */
export const getFileSizeInMB = (file: File): number =>
  Math.round((file.size / (1024 * 1024)) * 100) / 100;

/**
 * Read a file as a data URL (`data:image/png;base64,...`).
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () =>
      reject(reader.error ?? new Error('Failed to read file'));
  });
};

/**
 * Validate a file against the backend's rules.
 *
 * Returns `{ valid: true }` when the file should be accepted by the server,
 * or `{ valid: false, error }` with a message ready to display.
 */
export const validateFileUpload = (
  file: File,
  type: 'image' | 'document',
  maxSize = MAX_FILE_SIZE
): { valid: boolean; error?: string } => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (type === 'image' && !isValidImage(file)) {
    return {
      valid: false,
      error: 'Invalid image format. Allowed: JPEG, PNG, WebP',
    };
  }

  if (type === 'document' && !isValidDocument(file)) {
    return {
      valid: false,
      error: 'Invalid document format. Allowed: PDF, Word, PowerPoint, Excel',
    };
  }

  if (!isValidFileSize(file, maxSize)) {
    return {
      valid: false,
      error: `File size exceeds the ${maxSize / (1024 * 1024)} MB limit`,
    };
  }

  return { valid: true };
};

/**
 * Trigger a browser download of a string as a file.
 */
export const downloadFile = (
  data: string,
  filename: string,
  type = 'text/plain'
): void => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * Fetch a URL and return its contents as a Blob.
 */
export const urlToBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.blob();
};

/**
 * Resize and re-encode an image client-side.
 *
 * Uses `createImageBitmap` when available — it decodes off the main thread
 * and handles EXIF orientation. Falls back to `Image` + `canvas` for older
 * browsers.
 */
export const compressImage = async (
  file: File,
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1080
): Promise<Blob> => {
  const bitmap = await loadImageBitmap(file);
  const { width, height } = fitWithin(
    bitmap.width,
    bitmap.height,
    maxWidth,
    maxHeight
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get 2D canvas context');
  ctx.drawImage(bitmap, 0, 0, width, height);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to compress image'));
      },
      file.type,
      quality
    );
  });
};

async function loadImageBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if (typeof createImageBitmap === 'function') {
    return createImageBitmap(file);
  }
  // Fallback for environments without createImageBitmap.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
}

function fitWithin(
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}