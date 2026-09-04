// src/features/setup/school/LogoUploader.tsx

import { useRef, useState } from 'react';
import { Camera, CheckCircle2, ImageIcon, Trash2, Upload } from 'lucide-react';
import Button from '@/components/common/Button';
import { resolveAssetUrl } from '@/utils/resolveAssetUrl';

interface Props {
  logoUrl: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
}

export default function LogoUploader({ logoUrl, onUpload, onRemove }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      window.alert('Please upload a PNG, JPG, or WEBP image.');
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      window.alert('The image must be smaller than 5MB.');
      e.target.value = '';
      return;
    }

    try {
      setIsUploading(true);
      await onUpload(file);
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const resolvedUrl = resolveAssetUrl(logoUrl);

  return (
    <section className="glass-sm relative overflow-hidden rounded-[28px]">
      <div className="border-b border-(--glass-outline) px-5 py-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:bg-brand-400/10 dark:text-brand-300">
            <ImageIcon size={18} strokeWidth={2.2} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-sm font-bold tracking-tight text-text-main">
                School Logo
              </h2>

              {resolvedUrl && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-success">
                  <CheckCircle2 size={10} />
                  Uploaded
                </span>
              )}
            </div>

            <p className="mt-1 text-xs leading-5 text-text-main/65">
              Add your school brand image for reports and student records.
            </p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="glass-strong relative overflow-hidden rounded-2xl p-6 text-center">
          <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-400/10 blur-3xl" />

          <div className="relative">
            <div className="glass-sm mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-3xl p-1">
              {resolvedUrl ? (
                <img src={resolvedUrl} alt="School logo preview" className="h-full w-full rounded-2xl object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Camera size={28} className="text-text-main/45" />
                  <span className="mt-2 text-[9px] font-semibold uppercase tracking-wider text-text-main/55">
                    No Logo
                  </span>
                </div>
              )}
            </div>

            <div className="mt-5">
              <p className="text-sm font-bold text-text-main">
                {resolvedUrl ? 'School brand image' : 'Upload school logo'}
              </p>
              <p className="mt-1 text-xs text-text-main/55">
                PNG, JPG or WEBP <span className="mx-1.5 text-text-main/30">·</span> Max 5MB
              </p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="mt-5 flex gap-2">
              <Button
                variant="solid"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 text-white hover:bg-brand-700"
              >
                <Upload size={15} />
                {isUploading ? 'Uploading...' : 'Upload Logo'}
              </Button>

              <Button
                variant="glass"
                onClick={onRemove}
                disabled={!logoUrl || isUploading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl p-0 text-text-main/55 hover:bg-error/15 hover:text-error"
              >
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-500/20 bg-brand-500/10 px-3 py-2.5 text-[11px] text-brand-800 dark:text-brand-200">
          <ImageIcon size={13} className="shrink-0" />
          <span>Recommended: use a square image for the best result.</span>
        </div>
      </div>
    </section>
  );
}