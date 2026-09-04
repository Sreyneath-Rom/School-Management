// src/features/setup/school/GradingSystem.tsx

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  RotateCcw,
  Sparkles,

  Trophy,
  X,
} from 'lucide-react';

import Button from '@/components/common/Button';
import Field from './Field';
import type { GradeScale } from '@/types/school';

interface Props {
  gradingScale: GradeScale[];
  updateGrade: (
    id: string,
    field: keyof GradeScale,
    value: string | number | boolean
  ) => void;
  addGrade: () => void;
  // removeGrade: (id: string) => void;
  resetGradingScale: () => void;
}

export default function GradingSystem({
  gradingScale = [],
  updateGrade,
  // removeGrade,
  resetGradingScale,
}: Props) {
  const safeScale = useMemo(() => (Array.isArray(gradingScale) ? gradingScale : []), [gradingScale]);
  const [previewScore, setPreviewScore] = useState(87);

  const getGradeForScore = (score: number): GradeScale | null => {
    return (
      safeScale.find(
        (item) => item && score >= item.minScore && score <= item.maxScore
      ) ?? null
    );
  };

  const previewGrade = getGradeForScore(previewScore);

  const passingCount = useMemo(
    () => safeScale.filter((item) => item?.passing).length,
    [safeScale]
  );

  const failingCount = safeScale.length - passingCount;

  const highestGpa = useMemo(() => {
    if (!safeScale.length) return 0;

    return Math.max(...safeScale.map((item) => Number(item?.point) || 0));
  }, [safeScale]);

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset the grading scale to the default 5-tier system? This discards any custom grades you have added.'
    );

    if (confirmed) {
      resetGradingScale();
    }
  };

  const getGradeColor = (grade: GradeScale) => {
    if (!grade.passing) {
      return {
        badge:
          'bg-error/10 text-error ring-1 ring-error/40',
        range: 'bg-error',
        soft: 'bg-error/15',
      };
    }

    const point = Number(grade.point);

    if (point >= 3.7) {
      return {
        badge:
          'bg-success/10 text-success ring-1 ring-success/40',
        range: 'bg-success',
        soft: 'bg-success/15',
      };
    }

    if (point >= 3) {
      return {
        badge:
          'bg-info/10 text-info ring-1 ring-info/40',
        range: 'bg-info',
        soft: 'bg-info/15',
      };
    }

    return {
      badge:
        'bg-warning/10 text-warning ring-1 ring-warning/40',
      range: 'bg-warning',
      soft: 'bg-warning/15',
    };
  };

  return (
    <section className="overflow-hidden rounded-[30px] ">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className=" px-5 py-5 sm:px-7 sm:py-6 lg:px-8 ">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between glass-sm rounded-3xl px-5 py-5 sm:px-6">
          <div className="flex items-start gap-4 ">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl glass-sm text-text-main">
              <Trophy size={21} strokeWidth={2.2} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-text-main">
                  Grading System
                </h2>

                <span className="rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider glass-sm text-info">
                  Academic
                </span>
              </div>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-text-main">
                Configure score ranges, GPA points, and passing requirements
                for student results.
              </p>
            </div>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="glass"
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 sm:flex-none"
            >
              <RotateCcw size={15} />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* =========================================================
            OVERVIEW
        ========================================================== */}
        <div className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl glass-sm p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-text-main/55">
                Grade Levels
              </span>

              <div className="h-2 w-2 rounded-full bg-text-main/30" />
            </div>

            <p className="text-2xl font-black tracking-tight text-text-main">
              {gradingScale.length}
            </p>

            <p className="mt-1 text-[11px] text-text-main/55">
              Configured levels
            </p>
          </div>

          <div className="rounded-2xl glass-sm p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-success">
                Passing
              </span>

              <CheckCircle2
                size={15}
                className="text-success"
              />
            </div>

            <p className="text-2xl font-black tracking-tight text-success">
              {passingCount}
            </p>

            <p className="mt-1 text-[11px] text-success/70">
              Passing grades
            </p>
          </div>

          <div className="rounded-2xl glass-sm p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-error">
                Failing
              </span>

              <X size={15} className="text-error" />
            </div>

            <p className="text-2xl font-black tracking-tight text-error">
              {failingCount}
            </p>

            <p className="mt-1 text-[11px] text-error/70">
              Failing grades
            </p>
          </div>

          <div className="rounded-2xl glass-sm p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-info">
                Highest GPA
              </span>

              <Trophy size={15} className="text-info" />
            </div>

            <p className="text-2xl font-black tracking-tight text-info">
              {highestGpa.toFixed(1)}
            </p>

            <p className="mt-1 text-[11px] text-info/70">
              Maximum GPA point
            </p>
          </div>
        </div>

        {/* =========================================================
            SECTION TITLE
        ========================================================== */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-text-main">
              Grade Scale
            </p>

            <p className="mt-1 text-xs text-text-main">
              Define the score range and GPA value for every grade.
            </p>
          </div>

          <span className="hidden text-xs font-medium text-text-main sm:block">
            {gradingScale.length} levels
          </span>
        </div>

        {/* =========================================================
            GRADE CARDS
        ========================================================== */}
        <div className="space-y-4">
          {gradingScale.map((item) => {
            const colors = getGradeColor(item);

            const range =
              Math.max(0, Number(item.maxScore) - Number(item.minScore)) / 100;

            const left = Math.min(
              100,
              Math.max(0, Number(item.minScore))
            );

            const width = Math.min(
              100 - left,
              Math.max(3, range * 100)
            );

            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-3xl glass-sm transition-all duration-200 "
              >
                {/* Card top */}
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${colors.soft} ${item.passing ? 'text-success' : 'text-error'}`}
                    >
                      {item.grade || '?'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-text-main">
                          Grade {item.grade || '—'}
                        </p>

                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${colors.badge}`}
                        >
                          {item.passing ? (
                            <>
                              <Check size={11} />
                              Passing
                            </>
                          ) : (
                            <>
                              <X size={11} />
                              Failing
                            </>
                          )}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-xs text-text-main">
                        {item.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <div className="rounded-xl  px-3 py-2 text-center glass-sm">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-text-main/45">
                        GPA
                      </p>

                      <p className="text-sm font-black text-text-main">
                        {Number(item.point).toFixed(1)}
                      </p>
                    </div>

                    {/* <button
                      type="button"
                      onClick={() => removeGrade(item.id)}
                      disabled={gradingScale.length <= 1}
                      title={
                        gradingScale.length <= 1
                          ? 'At least one grading level is required'
                          : 'Remove grade'
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-text-main/45 transition hover:bg-error hover:text-error disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button> */}
                  </div>
                </div>

                {/* Score range */}
                <div className="px-4 pt-4 sm:px-5">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-text-main/55">
                    <span>0</span>
                    <span>Score Range</span>
                    <span>100</span>
                  </div>

                  <div className="relative h-2 overflow-hidden rounded-full glass-sm">
                    <div
                      className={`absolute top-0 h-full rounded-full ${colors.range}`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-text-main">
                      {item.minScore} points
                    </span>

                    <ArrowRight
                      size={13}
                      className="text-text-main"
                    />

                    <span className="text-xs font-semibold text-text-main">
                      {item.maxScore} points
                    </span>
                  </div>
                </div>

                {/* Form */}
                <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-5">
                  <Field label="Grade">
                    <input
                      value={item.grade}
                      maxLength={3}
                      onChange={(e) =>
                        updateGrade(
                          item.id,
                          'grade',
                          e.target.value.toUpperCase()
                        )
                      }
                      className="h-11 w-full rounded-xl glass-sm px-3 text-sm font-bold text-text-main outline-none transition placeholder:text-text-main/45 focus:border-info/50  focus:ring-4 focus:ring-info/25 "
                    />
                  </Field>

                  <Field label="Minimum Score">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.minScore}
                      onChange={(e) =>
                        updateGrade(
                          item.id,
                          'minScore',
                          Number(e.target.value)
                        )
                      }
                      className="h-11 w-full rounded-xl glass-sm px-3 text-sm font-semibold text-text-main outline-none transition placeholder:text-text-main/45 focus:border-info/50  focus:ring-4 focus:ring-info/25 "
                    />
                  </Field>

                  <Field label="Maximum Score">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.maxScore}
                      onChange={(e) =>
                        updateGrade(
                          item.id,
                          'maxScore',
                          Number(e.target.value)
                        )
                      }
                      className="h-11 w-full rounded-xl glass-sm px-3 text-sm font-semibold text-text-main outline-none transition placeholder:text-text-main/45 focus:border-info/50  focus:ring-4 focus:ring-info/25 "
                    />
                  </Field>

                  <Field label="GPA Point">
                    <input
                      type="number"
                      min={0}
                      step={0.1}
                      value={item.point}
                      onChange={(e) =>
                        updateGrade(
                          item.id,
                          'point',
                          Number(e.target.value)
                        )
                      }
                      className="h-11 w-full rounded-xl glass-sm px-3 text-sm font-semibold text-text-main outline-none transition placeholder:text-text-main/45 focus:border-info/50  focus:ring-4 focus:ring-info/25 "
                    />
                  </Field>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <Field label="Description">
                      <input
                        value={item.description}
                        onChange={(e) =>
                          updateGrade(
                            item.id,
                            'description',
                            e.target.value
                          )
                        }
                        placeholder="Example: Excellent performance"
                        className="h-11 w-full rounded-xl glass-sm px-3 text-sm font-semibold text-text-main outline-none transition placeholder:text-text-main/45 focus:border-info/50  focus:ring-4 focus:ring-info/25"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            );
          })}

          
        </div>

        {/* =========================================================
            GRADE CALCULATOR
        ========================================================== */}
        <div className="mt-7 overflow-hidden rounded-3xl glass-sm text-text-main">
          <div className=" px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl glass-sm">
                <Sparkles size={17} className="text-info" />
              </div>

              <div>
                <p className="text-sm font-bold">
                  Grade Calculator
                </p>

                <p className="mt-1 text-xs text-text-main/45">
                  Enter a sample score to preview how the grading scale
                  converts it.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            {/* Score */}
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-text-main">
                Student Score
              </label>

              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={previewScore}
                  onChange={(e) =>
                    setPreviewScore(
                      Math.min(
                        100,
                        Math.max(0, Number(e.target.value))
                      )
                    )
                  }
                  className="h-12 w-full rounded-3xl px-5 text-2xl font-black  outline-none transition glass-sm text-text-main  focus:ring-4 focus:ring-info/20"
                />

                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-text-main/45">
                  / 100
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={previewScore}
                onChange={(e) =>
                  setPreviewScore(Number(e.target.value))
                }
                className="mt-4 w-full accent-var(--color-info)"
              />
            </div>

            {/* Arrow */}
            <div className="hidden h-12 w-12 items-center justify-center rounded-full glass-sm text-text-main/55 lg:flex">
              <ArrowRight size={20} />
            </div>

            {/* Result */}
            <div className="rounded-3xl glass-sm p-4">
              {previewGrade ? (
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl font-black ${
                      previewGrade.passing
                        ? 'bg-success/15 text-success'
                        : 'bg-error/15 text-error'
                    }`}
                  >
                    {previewGrade.grade}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-text-main">
                        {previewGrade.description || 'Grade result'}
                      </p>

                      {previewGrade.passing ? (
                        <span className="inline-flex items-center gap-1 rounded-full glass-sm px-2 py-1 text-[9px] font-bold text-success">
                          <Check size={10} />
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full glass-sm  px-2 py-1 text-[9px] font-bold text-error">
                          <X size={10} />
                          FAIL
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-text-main/55">
                      GPA Point{' '}
                      <span className="font-bold text-text-main/55">
                        {Number(previewGrade.point).toFixed(1)}
                      </span>
                    </p>

                    <p className="mt-1 text-[10px] text-text-main/55">
                      Range {previewGrade.minScore}–
                      {previewGrade.maxScore}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl glass-sm text-2xl font-black text-text-main">
                    —
                  </div>

                  <div>
                    <p className="text-sm font-bold text-text-main">
                      No matching grade
                    </p>

                    <p className="mt-1 text-xs text-text-main/55">
                      The score does not belong to any configured range.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>   
        </div>


     
      </div>
    </section>
  );
}