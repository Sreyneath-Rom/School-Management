// src/features/setup/school/LogoUploader.tsx
import { useRef, useState } from 'react';
import { Camera, Upload, Trash2, ImageIcon } from 'lucide-react';
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
    if (file) {
      setIsUploading(true);
      await onUpload(file);
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const resolvedUrl = resolveAssetUrl(logoUrl);

  return (
    <section className="rounded-[28px] glass-sm p-5">
      <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
        <ImageIcon size={17} className="text-brand-600 dark:text-brand-400" />
        School Logo
      </div>
      <div className="mt-5 rounded-2xl border border-dashed border-brand-300/60 bg-slate-50/60 p-5 text-center dark:border-slate-700 dark:bg-slate-950/50">
        {resolvedUrl ? (
          <img src={resolvedUrl} alt="School logo preview" className="mx-auto h-24 w-24 rounded-2xl object-cover shadow-md" />
        ) : (
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-sm dark:bg-slate-900">
            <Camera size={28} />
          </div>
        )}
        <p className="mt-4 text-sm font-semibold text-slate-900 dark:text-white">Brand image</p>
        <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">PNG, JPG or WEBP · maximum 5MB</p>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <div className="mt-5 flex gap-2">
          <Button
            variant="solid"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex flex-1 items-center justify-center gap-2"
          >
            <Upload size={15} />
            {isUploading ? 'Uploading...' : 'Upload'}
          </Button>
          <Button
            variant="glass"
            onClick={onRemove}
            disabled={!logoUrl || isUploading}
            className="flex items-center justify-center gap-2"
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>
    </section>
  );
}