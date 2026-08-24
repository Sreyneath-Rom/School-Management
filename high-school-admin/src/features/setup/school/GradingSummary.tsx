// src/features/setup/school/GradingSummary.tsx

import { CheckCircle2, Trophy, XCircle } from 'lucide-react';

import type { GradeScale } from '@/types/school';

export default function GradingSummary({
  gradingScale,
}: {
  gradingScale: GradeScale[];
}) {
  const passingCount = gradingScale.filter(
    (item) => item.passing,
  ).length;

  const failingCount =
    gradingScale.length - passingCount;

  return (
    <section
      className="
        glass-sm
        relative
        overflow-hidden
        rounded-[28px]
        p-5
        text-slate-900
        dark:text-slate-200
      "
    >
      {/* Ambient glow */}
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-20
          h-36
          w-36
          rounded-full
          bg-brand-400/10
          blur-3xl
        "
      />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-xl
                bg-brand-500/10
                text-brand-600
                shadow-sm
                dark:bg-brand-400/10
                dark:text-brand-300
              "
            >
              <Trophy size={17} />
            </div>

            <div>
              <p className="text-sm font-bold">
                Grading Summary
              </p>

              <p className="text-[10px] text-slate-400 dark:text-slate-500">
                {gradingScale.length} grading levels
              </p>
            </div>
          </div>

          {/* Pass / fail count */}
          {gradingScale.length > 0 && (
            <div className="flex items-center gap-2">
              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-emerald-500/10
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  text-emerald-600
                  dark:text-emerald-400
                "
              >
                <CheckCircle2 size={11} />
                {passingCount}
              </span>

              <span
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-red-500/10
                  px-2
                  py-1
                  text-[10px]
                  font-bold
                  text-red-600
                  dark:text-red-400
                "
              >
                <XCircle size={11} />
                {failingCount}
              </span>
            </div>
          )}
        </div>

        {/* Grading levels */}
        {gradingScale.length > 0 ? (
          <div
            className="
              mt-5
              grid
              grid-cols-3
              gap-2
              sm:grid-cols-5
            "
          >
            {gradingScale.map((item) => (
              <div
                key={item.id}
                className={`
                  group
                  relative
                  overflow-hidden
                  rounded-xl
                  border
                  p-2.5
                  text-center
                  transition-all
                  duration-200
                  hover:-translate-y-0.5
                  ${
                    item.passing
                      ? `
                        border-emerald-200/50
                        bg-emerald-500/10
                        dark:border-emerald-800/30
                        dark:bg-emerald-500/10
                      `
                      : `
                        border-red-200/50
                        bg-red-500/10
                        dark:border-red-800/30
                        dark:bg-red-500/10
                      `
                  }
                `}
              >
                {/* Grade */}
                <p
                  className={`
                    text-lg
                    font-black
                    ${
                      item.passing
                        ? 'text-emerald-600 dark:text-emerald-300'
                        : 'text-red-600 dark:text-red-300'
                    }
                  `}
                >
                  {item.grade}
                </p>

                {/* Score range */}
                <p className="mt-0.5 text-[9px] font-medium text-slate-500 dark:text-slate-400">
                  {item.minScore}–{item.maxScore}
                </p>

                {/* GPA */}
                <p className="mt-1 text-[9px] font-semibold text-slate-400 dark:text-slate-500">
                  GPA {Number(item.point).toFixed(1)}
                </p>

                {/* Bottom accent */}
                <div
                  className={`
                    absolute
                    bottom-0
                    left-1/2
                    h-0.5
                    w-8
                    -translate-x-1/2
                    rounded-full
                    opacity-60
                    ${
                      item.passing
                        ? 'bg-emerald-500'
                        : 'bg-red-500'
                    }
                  `}
                />
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div
            className="
              mt-5
              rounded-2xl
              border
              border-dashed
              border-slate-300/70
              bg-slate-50/40
              px-4
              py-6
              text-center
              dark:border-slate-700
              dark:bg-slate-900/30
            "
          >
            <Trophy
              size={22}
              className="mx-auto text-slate-300 dark:text-slate-600"
            />

            <p className="mt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              No grading scale configured
            </p>

            <p className="mt-1 text-[10px] text-slate-400 dark:text-slate-500">
              Add grading levels to see the summary here.
            </p>
          </div>
        )}

        {/* Description */}
        <p
          className="
            mt-4
            text-xs
            leading-5
            text-slate-500
            dark:text-slate-400
          "
        >
          These grading rules will be used when converting
          student scores into letter grades and GPA points.
        </p>
      </div>
    </section>
  );
}