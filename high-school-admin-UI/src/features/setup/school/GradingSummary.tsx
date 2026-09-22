// src/features/setup/school/GradingSummary.tsx

import { CheckCircle2, Trophy, XCircle } from 'lucide-react';
import type { GradeScale } from '@/types/school';

export default function GradingSummary({
  gradingScale = [],
}: {
  gradingScale?: GradeScale[];
}) {
  const safeScale = Array.isArray(gradingScale) ? gradingScale : [];
  const passingCount = safeScale.filter((item) => item?.passing).length;
  const failingCount = safeScale.length - passingCount;

  return (
    <section className="glass-sm relative overflow-hidden rounded-[28px] p-5 text-fg">
      <div className="pointer-events-none absolute -right-16 -top-20 h-36 w-36 rounded-full bg-brand-400/10 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-brand-600 dark:text-brand-300 shadow-sunken">
              <Trophy size={17} />
            </div>

            <div>
              <p className="text-sm font-bold text-fg">Grading Summary</p>
              <p className="text-[10px] text-fg-muted">
                {gradingScale.length} grading levels
              </p>
            </div>
          </div>

          {gradingScale.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[10px] font-bold text-success">
                <CheckCircle2 size={11} />
                {passingCount}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-error/15 px-2 py-1 text-[10px] font-bold text-error">
                <XCircle size={11} />
                {failingCount}
              </span>
            </div>
          )}
        </div>

        {gradingScale.length > 0 ? (
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {gradingScale.map((item) => (
              // Each grade chip: raised by default, hover-lifts. The
              // pass/fail tint carries the semantics — kept.
              <div
                key={item.id}
                className={`group relative overflow-hidden rounded-xl p-2.5 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                  item.passing
                    ? 'bg-success/15'
                    : 'bg-error/15'
                } shadow-emboss`}
              >
                <p className={`text-lg font-black ${item.passing ? 'text-success' : 'text-error'}`}>
                  {item.grade}
                </p>
                <p className="mt-0.5 text-[9px] font-medium text-fg-muted">
                  {item.minScore}–{item.maxScore}
                </p>
                <p className="mt-1 text-[9px] font-semibold text-fg-muted/80">
                  GPA {Number(item.point).toFixed(1)}
                </p>

                <div
                  className={`absolute bottom-0 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full opacity-60 ${
                    item.passing ? 'bg-success' : 'bg-error'
                  }`}
                />
              </div>
            ))}
          </div>
        ) : (
          // Empty state: dashed border tinted against the shadow pair so
          // it's actually visible. Previously `border-(--glass-outline)`
          // which is `transparent` under neumorphism — hence invisible.
          <div className="mt-5 rounded-2xl border border-dashed border-(--neu-shadow-dark) px-4 py-6 text-center">
            <Trophy size={22} className="mx-auto text-fg-muted/60" />
            <p className="mt-2 text-xs font-semibold text-fg-muted">
              No grading scale configured
            </p>
            <p className="mt-1 text-[10px] text-fg-muted/80">
              Add grading levels to see the summary here.
            </p>
          </div>
        )}

        <p className="mt-4 text-xs leading-5 text-fg-muted">
          These grading rules will be used when converting
          student scores into letter grades and GPA points.
        </p>
      </div>
    </section>
  );
}