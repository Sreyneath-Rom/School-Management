// src/features/setup/school/StepReview.tsx

import {
  ChartNoAxesCombined,
  CheckCircle2,
  Earth,
  Mail,
  Phone,
  School,
  XCircle,
} from 'lucide-react';

import type { SchoolFormState, GradeScale } from '@/types/school';
import { resolveAssetUrl } from '@/utils/resolveAssetUrl';

interface Props {
  form: SchoolFormState;
  gradingScale: GradeScale[];
  logoUrl: string;
}

export default function StepReview({
  form,
  gradingScale,
  logoUrl,
}: Props) {
  const logoResolved = resolveAssetUrl(logoUrl);

  const passingCount = gradingScale.filter((g) => g.passing).length;
  const failingCount = gradingScale.length - passingCount;

  const highestGpa = gradingScale.length
    ? Math.max(
        ...gradingScale.map((g) => Number(g.point) || 0),
      ).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      {/* =====================================================
          OVERVIEW
      ====================================================== */}
      <div
        className="
          glass-sm
          relative
          overflow-hidden
          rounded-[28px]
          p-5
          sm:p-6
        "
      >
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-orange-400/10 blur-3xl" />

        <div className="relative flex items-start gap-4">
          <div
            className="
              flex h-11 w-11 shrink-0 items-center justify-center
              rounded-2xl
              bg-brand-500/15
              text-brand-600
              shadow-sm
              dark:bg-brand-400/10
              dark:text-brand-300
            "
          >
            <CheckCircle2 size={21} />
          </div>

          <div>
            <h2 className="text-base font-bold text-text-main">
              Review School Configuration
            </h2>

            <p className="mt-1 text-sm leading-5 text-text-main/55">
              Review the information below before saving your school setup.
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          SCHOOL INFORMATION
      ====================================================== */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* School Identity */}
        <ReviewCard
          icon={<School size={18} />}
          title="School Identity"
          iconClass="bg-brand-500/15 text-brand-600 dark:text-brand-300"
        >
          <ReviewRow label="Name" value={form.name} />
          <ReviewRow label="Code" value={form.schoolCode} />
          <ReviewRow label="Motto" value={form.motto} />
          <ReviewRow label="Website" value={form.website} />

          {logoResolved && (
            <div className="flex items-center justify-between gap-4 pt-2">
              <dt className="text-text-main/55">Logo</dt>

              <dd>
                <div
                  className="
                    flex h-12 w-12 items-center justify-center
                    overflow-hidden
                    rounded-xl
                    bg-white/70
                    p-1
                    shadow-sm
                    ring-1 ring-(--glass-outline)
                  "
                >
                  <img
                    src={logoResolved}
                    alt="School logo"
                    className="h-full w-full rounded-lg object-contain"
                  />
                </div>
              </dd>
            </div>
          )}
        </ReviewCard>

        {/* Contact & Academic */}
        <ReviewCard
          icon={<Phone size={18} />}
          title="Contact & Academic"
          iconClass="bg-orange-500/15 text-orange-600 dark:text-orange-300"
        >
          <ReviewRow label="Address" value={form.address} />
          <ReviewRow
            label="Phone"
            value={form.phone}
            icon={<Phone size={12} />}
          />
          <ReviewRow
            label="Email"
            value={form.email}
            icon={<Mail size={12} />}
          />
          <ReviewRow label="Academic Year" value={form.academicYear} />
          <ReviewRow label="Term" value={form.academicTerm} />
        </ReviewCard>
      </div>

      {/* =====================================================
          GRADING SUMMARY
      ====================================================== */}
      <ReviewCard
        icon={<ChartNoAxesCombined size={18} />}
        title="Grading Summary"
        iconClass="bg-brand-500/15 text-brand-600 dark:text-brand-300"
        fullWidth
      >
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard
            label="Levels"
            value={gradingScale.length}
            className="
              glass-sm
              text-text-main/70
            "
          />

          <StatCard
            label="Passing"
            value={passingCount}
            className="
              bg-success/15
              text-success
            "
          />

          <StatCard
            label="Failing"
            value={failingCount}
            className="
              bg-error/15
              text-error
            "
          />

          <StatCard
            label="Highest GPA"
            value={highestGpa}
            className="
              bg-brand-50/80
              text-brand-700
              dark:bg-brand-950/30
              dark:text-brand-300
            "
          />
        </div>

        {/* Grade levels */}
        {gradingScale.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-main/45">
              Grade Scale
            </p>

            <div className="flex flex-wrap gap-2">
              {gradingScale.map((g) => (
                <span
                  key={g.id}
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-xl
                    px-3
                    py-1.5
                    text-xs
                    font-bold
                    shadow-sm
                    ${
                      g.passing
                        ? `
                          bg-success/10
                          text-success
                          ring-1 ring-success/25
                        `
                        : `
                          bg-error/10
                          text-error
                          ring-1 ring-error/25
                        `
                    }
                  `}
                >
                  {g.passing ? (
                    <CheckCircle2 size={12} />
                  ) : (
                    <XCircle size={12} />
                  )}

                  <span>{g.grade}</span>

                  <span className="opacity-60">
                    {g.minScore}–{g.maxScore}
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}
      </ReviewCard>

      {/* =====================================================
          REGIONAL SETTINGS
      ====================================================== */}
      <ReviewCard
        icon={<Earth size={18} />}
        title="Regional Settings"
        iconClass="bg-info/15 text-info"
        fullWidth
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <RegionalItem
            label="Language"
            value={form.language}
          />

          <RegionalItem
            label="Time Zone"
            value={form.timeZone}
          />

          <RegionalItem
            label="Date Format"
            value={form.dateFormat}
          />
        </div>
      </ReviewCard>

      {/* =====================================================
          READY MESSAGE
      ====================================================== */}
      <div
        className="
          relative
          overflow-hidden
          rounded-[22px]
          border
          border-brand-200/60
          bg-brand-50/70
          p-4
          shadow-sm
          backdrop-blur-xl
          dark:border-brand-800/40
          dark:bg-brand-950/30
        "
      >
        <div className="flex items-start gap-3">
          <div
            className="
              flex h-9 w-9 shrink-0 items-center justify-center
              rounded-xl
              bg-brand-500/15
              text-brand-600
              dark:text-brand-300
            "
          >
            <CheckCircle2 size={18} />
          </div>

          <div>
            <p className="text-sm font-bold text-brand-800 dark:text-brand-200">
              Everything looks ready
            </p>

            <p className="mt-0.5 text-xs leading-5 text-brand-700/70 dark:text-brand-300/70">
              All settings have been reviewed. Click “Save Changes” to apply
              your school configuration.
            </p>
          </div>
        </div>

        {/* Gradient accent */}
        <div
          className="
            absolute bottom-0 left-0 right-0 h-0.5
            bg-linear-to-r
            from-brand-500
            via-brand-400
            to-orange-400
            opacity-70
          "
        />
      </div>
    </div>
  );
}

/* =========================================================
   REVIEW CARD
========================================================= */

interface ReviewCardProps {
  icon: React.ReactNode;
  title: string;
  iconClass: string;
  children: React.ReactNode;
  fullWidth?: boolean;
}

function ReviewCard({
  icon,
  title,
  iconClass,
  children,
  fullWidth = false,
}: ReviewCardProps) {
  return (
    <section
      className={`
        glass-sm
        relative
        overflow-hidden
        rounded-3xl
        p-5
        sm:p-6
        ${fullWidth ? 'md:col-span-2' : ''}
      `}
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className={`
            flex h-9 w-9 shrink-0 items-center justify-center
            rounded-xl
            shadow-sm
            ${iconClass}
          `}
        >
          {icon}
        </div>

        <h3 className="text-sm font-bold text-text-main">
          {title}
        </h3>
      </div>

      <dl className="space-y-3">{children}</dl>
    </section>
  );
}

/* =========================================================
   REVIEW ROW
========================================================= */

interface ReviewRowProps {
  label: string;
  value?: string | null;
  icon?: React.ReactNode;
}

function ReviewRow({
  label,
  value,
  icon,
}: ReviewRowProps) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-4
        border-b
        border-(--glass-outline)
        pb-2.5
        last:border-0
      "
    >
      <dt className="flex shrink-0 items-center gap-1.5 text-xs text-text-main/55">
        {icon}
        {label}
      </dt>

      <dd
        className="
          max-w-[65%]
          truncate
          text-right
          text-sm
          font-semibold
          text-text-main
        "
        title={value || '—'}
      >
        {value || '—'}
      </dd>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

interface StatCardProps {
  label: string;
  value: string | number;
  className: string;
}

function StatCard({
  label,
  value,
  className,
}: StatCardProps) {
  return (
    <div
      className={`
        rounded-2xl
        p-4
        text-center
        shadow-sm
        ring-1
        ring-black/5
        dark:ring-white/5
        ${className}
      `}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-60">
        {label}
      </p>

      <p className="mt-1 text-xl font-extrabold">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   REGIONAL ITEM
========================================================= */

interface RegionalItemProps {
  label: string;
  value?: string | null;
}

function RegionalItem({
  label,
  value,
}: RegionalItemProps) {
  return (
    <div
      className="
        rounded-2xl
        glass-sm
        p-4
      "
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-main/45">
        {label}
      </p>

      <p className="mt-1.5 truncate text-sm font-bold text-text-main">
        {value || '—'}
      </p>
    </div>
  );
}