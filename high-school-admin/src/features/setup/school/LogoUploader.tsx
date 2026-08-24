// src/features/setup/school/LogoUploader.tsx

import { useRef, useState } from 'react';

import {
  Camera,
  CheckCircle2,
  ImageIcon,
  Trash2,
  Upload,
} from 'lucide-react';

import Button from '@/components/common/Button';
import { resolveAssetUrl } from '@/utils/resolveAssetUrl';

interface Props {
  logoUrl: string;
  onUpload: (file: File) => Promise<void>;
  onRemove: () => Promise<void>;
}

export default function LogoUploader({
  logoUrl,
  onUpload,
  onRemove,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Basic client-side validation
    const allowedTypes = [
      'image/png',
      'image/jpeg',
      'image/webp',
    ];

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
    <section
      className="
        overflow-hidden
        rounded-[28px]
        border
        border-slate-200/70
        bg-white/80
        shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)]
        backdrop-blur-xl
        dark:border-slate-800/80
        dark:bg-slate-950/70
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div
        className="
          border-b
          border-slate-200/70
          px-5
          py-5
          dark:border-slate-800
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-slate-950
              text-white
              shadow-lg
              shadow-slate-950/10
              dark:bg-white
              dark:text-slate-950
            "
          >
            <ImageIcon size={18} strokeWidth={2.2} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2
                className="
                  text-sm
                  font-bold
                  tracking-tight
                  text-slate-950
                  dark:text-white
                "
              >
                School Logo
              </h2>

              {resolvedUrl && (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-emerald-50
                    px-2
                    py-1
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-emerald-700
                    dark:bg-emerald-950/30
                    dark:text-emerald-300
                  "
                >
                  <CheckCircle2 size={10} />
                  Uploaded
                </span>
              )}
            </div>

            <p
              className="
                mt-1
                text-xs
                leading-5
                text-slate-500
                dark:text-slate-400
              "
            >
              Add your school brand image for reports and student records.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}
      <div className="p-5">
        <div
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-dashed
            border-slate-300
            bg-slate-50/70
            p-6
            text-center
            transition
            dark:border-slate-700
            dark:bg-slate-900/50
          "
        >
          {/* Decorative glow */}
          <div
            className="
              pointer-events-none
              absolute
              -right-10
              -top-10
              h-28
              w-28
              rounded-full
              bg-brand-400/10
              blur-3xl
            "
          />

          <div className="relative">
            {/* =================================================
                LOGO PREVIEW
            ================================================== */}
            <div
              className="
                mx-auto
                flex
                h-28
                w-28
                items-center
                justify-center
                overflow-hidden
                rounded-3xl
                border
                border-slate-200
                bg-white
                shadow-[0_12px_30px_-15px_rgba(15,23,42,0.35)]
                dark:border-slate-700
                dark:bg-slate-950
              "
            >
              {resolvedUrl ? (
                <img
                  src={resolvedUrl}
                  alt="School logo preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Camera
                    size={28}
                    className="text-slate-300 dark:text-slate-600"
                  />

                  <span
                    className="
                      mt-2
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-wider
                      text-slate-400
                    "
                  >
                    No Logo
                  </span>
                </div>
              )}
            </div>

            {/* =================================================
                INFO
            ================================================== */}
            <div className="mt-5">
              <p
                className="
                  text-sm
                  font-bold
                  text-slate-950
                  dark:text-white
                "
              >
                {resolvedUrl ? 'School brand image' : 'Upload school logo'}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-slate-500
                  dark:text-slate-400
                "
              >
                PNG, JPG or WEBP
                <span className="mx-1.5 text-slate-300">·</span>
                Maximum 5MB
              </p>
            </div>

            {/* =================================================
                FILE INPUT
            ================================================== */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* =================================================
                ACTIONS
            ================================================== */}
            <div className="mt-5 flex gap-2">
              <Button
                variant="solid"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="
                  flex
                  flex-1
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                "
              >
                <Upload size={15} />

                {isUploading ? 'Uploading...' : 'Upload Logo'}
              </Button>

              <Button
                variant="glass"
                onClick={onRemove}
                disabled={!logoUrl || isUploading}
                title={
                  !logoUrl
                    ? 'No logo to remove'
                    : 'Remove school logo'
                }
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  p-0
                  text-slate-500
                  hover:bg-rose-50
                  hover:text-rose-600
                  dark:hover:bg-rose-950/30
                  dark:hover:text-rose-400
                "
              >
                <Trash2 size={15} />
              </Button>
            </div>
          </div>
        </div>

        {/* =====================================================
            FOOTER NOTE
        ====================================================== */}
        <div
          className="
            mt-4
            flex
            items-center
            gap-2
            rounded-xl
            border
            border-blue-100
            bg-blue-50/50
            px-3
            py-2.5
            text-[11px]
            text-blue-700
            dark:border-blue-900/40
            dark:bg-blue-950/20
            dark:text-blue-300
          "
        >
          <ImageIcon size={13} className="shrink-0" />

          <span>
            Recommended: use a square image for the best result.
          </span>
        </div>
      </div>
    </section>
  );
}