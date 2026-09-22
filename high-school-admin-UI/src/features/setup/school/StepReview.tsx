// src/features/setup/school/StepReview.tsx

import { ChartNoAxesCombined, CheckCircle2, Earth, Mail, Phone, School, XCircle } from 'lucide-react';
import type { SchoolFormState, GradeScale } from '@/types/school';
import { resolveAssetUrl } from '@/utils/resolveAssetUrl';

interface Props {
  form: SchoolFormState;
  gradingScale: GradeScale[];
  logoUrl: string;
}

export default function StepReview({ form, gradingScale = [], logoUrl }: Props) {
  const logoResolved = resolveAssetUrl(logoUrl);
  const safeScale = Array.isArray(gradingScale) ? gradingScale : [];
  const passingCount = safeScale.filter((g) => g?.passing).length;
  const failingCount = safeScale.length - passingCount;

  const highestGpa = safeScale.length
    ? Math.max(...safeScale.map((g) => Number(g?.point) || 0)).toFixed(1)
    : '—';

  return (
    <div className="space-y-6">
      {/* Overview banner */}
      <div className="glass-sm relative overflow-hidden rounded-[28px] p-5 sm:p-6">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-brand-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-40 w-40 rounded-full bg-warning/10 blur-3xl" />

        <div className="relative flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-600 dark:text-brand-300 shadow-sunken">
            <CheckCircle2 size={21} />
          </div>

          <div>
            <h2 className="text-base font-bold text-fg">Review School Configuration</h2>
            <p className="mt-1 text-sm leading-5 text-fg-muted">
              Review the information below before saving your school setup.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
              <dt className="text-fg-muted">Logo</dt>
              <dd>
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl p-1 shadow-sunken">
                  <img src={logoResolved} alt="School logo" className="h-full w-full rounded-lg object-contain" />
                </div>
              </dd>
            </div>
          )}
        </ReviewCard>

        <ReviewCard
          icon={<Phone size={18} />}
          title="Contact & Academic"
          iconClass="bg-warning/15 text-warning"
        >
          <ReviewRow label="Address" value={form.address} />
          <ReviewRow label="Phone" value={form.phone} icon={<Phone size={12} />} />
          <ReviewRow label="Email" value={form.email} icon={<Mail size={12} />} />
          <ReviewRow label="Academic Year" value={form.academicYear} />
          <ReviewRow label="Term" value={form.academicTerm} />
        </ReviewCard>
      </div>

      <ReviewCard
        icon={<ChartNoAxesCombined size={18} />}
        title="Grading Summary"
        iconClass="bg-brand-500/15 text-brand-600 dark:text-brand-300"
        fullWidth
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Levels" value={gradingScale.length} className="text-fg-muted" />
          <StatCard label="Passing" value={passingCount} className="bg-success/15 text-success" />
          <StatCard label="Failing" value={failingCount} className="bg-error/15 text-error" />
          <StatCard label="Highest GPA" value={highestGpa} className="bg-brand-500/15 text-brand-700 dark:text-brand-300" />
        </div>

        {gradingScale.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-fg-muted">
              Grade Scale
            </p>

            <div className="flex flex-wrap gap-2">
              {gradingScale.map((g) => (
                <span
                  key={g.id}
                  className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold ${
                    g.passing
                      ? 'bg-success/15 text-success'
                      : 'bg-error/15 text-error'
                  }`}
                >
                  {g.passing ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                  <span>{g.grade}</span>
                  <span className="opacity-60">{g.minScore}–{g.maxScore}</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </ReviewCard>

      <ReviewCard
        icon={<Earth size={18} />}
        title="Regional Settings"
        iconClass="bg-info/15 text-info"
        fullWidth
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <RegionalItem label="Language" value={form.language} />
          <RegionalItem label="Time Zone" value={form.timeZone} />
          <RegionalItem label="Date Format" value={form.dateFormat} />
        </div>
      </ReviewCard>

      {/* Ready banner — brand-tinted status signal, tinted border kept */}
      <div className="relative overflow-hidden rounded-[22px] border border-brand-500/25 bg-brand-500/15 p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-600 dark:text-brand-300">
            <CheckCircle2 size={18} />
          </div>

          <div>
            <p className="text-sm font-bold text-brand-800 dark:text-brand-200">
              Everything looks ready
            </p>
            <p className="mt-0.5 text-xs leading-5 text-brand-700/80 dark:text-brand-300/80">
              All settings have been reviewed. Click "Save Changes" to apply your school configuration.
            </p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-brand-500 via-brand-400 to-warning opacity-70" />
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

function ReviewCard({ icon, title, iconClass, children, fullWidth = false }: ReviewCardProps) {
  return (
    <section
      className={`glass-sm relative overflow-hidden rounded-3xl p-5 sm:p-6 ${fullWidth ? 'md:col-span-2' : ''}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-sunken ${iconClass}`}>
          {icon}
        </div>
        <h3 className="text-sm font-bold text-fg">{title}</h3>
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

function ReviewRow({ label, value, icon }: ReviewRowProps) {
  return (
    // Row separator → shadow seam (previous border-(--glass-outline)
    // was transparent under this theme). Applied via [&+&]... no — we
    // still want every row except the last to have the seam, so use a
    // shadow that visually sits above the next row instead of a border.
    <div className="flex items-center justify-between gap-4 pb-2.5 shadow-[0_1px_0_var(--neu-shadow-dark)] last:shadow-none">
      <dt className="flex shrink-0 items-center gap-1.5 text-xs text-fg-muted">
        {icon}
        {label}
      </dt>
      <dd
        className="max-w-[65%] truncate text-right text-sm font-semibold text-fg"
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

function StatCard({ label, value, className }: StatCardProps) {
  return (
    // Was `ring-1 ring-black/5` — an off-theme hairline. Sunken well
    // reads as a proper chip under neumorphism.
    <div className={`rounded-2xl p-4 text-center shadow-sunken ${className}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
        {label}
      </p>
      <p className="mt-1 text-xl font-extrabold">{value}</p>
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

function RegionalItem({ label, value }: RegionalItemProps) {
  return (
    <div className="rounded-2xl glass-sm p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
        {label}
      </p>
      <p className="mt-1.5 truncate text-sm font-bold text-fg">
        {value || '—'}
      </p>
    </div>
  );
}