/**
 * Valid file types for upload
 */
const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const VALID_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Check if file is a valid image
 */
export const isValidImage = (file: File): boolean => {
  return VALID_IMAGE_TYPES.includes(file.type);
};

/**
 * Check if file is a valid document
 */
export const isValidDocument = (file: File): boolean => {
  return VALID_DOCUMENT_TYPES.includes(file.type);
};

/**
 * Check if file size is valid
 */
export const isValidFileSize = (file: File, maxSize = MAX_FILE_SIZE): boolean => {
  return file.size <= maxSize;
};

/**
 * Get file extension
 */
export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || '';
};

/**
 * Get file size in MB
 */
export const getFileSizeInMB = (file: File): number => {
  return file.size / (1024 * 1024);
};

/**
 * Convert file to base64
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Validate file upload
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
      error: 'Invalid image format. Allowed: JPEG, PNG, GIF, WebP',
    };
  }

  if (type === 'document' && !isValidDocument(file)) {
    return {
      valid: false,
      error: 'Invalid document format. Allowed: PDF, Word, Excel',
    };
  }

  if (!isValidFileSize(file, maxSize)) {
    return {
      valid: false,
      error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit`,
    };
  }

  return { valid: true };
};

/**
 * Download file
 */
export const downloadFile = (data: string, filename: string, type = 'text/plain'): void => {
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
 * Create blob from URL
 */
export const urlToBlob = async (url: string): Promise<Blob> => {
  const response = await fetch(url);
  return response.blob();
};

/**
 * Compress image
 */
export const compressImage = (
  file: File,
  quality = 0.8,
  maxWidth = 1920,
  maxHeight = 1080
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Failed to compress image'));
          },
          file.type,
          quality
        );
      };
      img.onerror = () => reject(new Error('Failed to load image'));
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
  });
};
