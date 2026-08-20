// src/features/setup/school/GradingSystem.tsx

import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Plus,
  RotateCcw,
  Sparkles,
  Trash2,
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
  removeGrade: (id: string) => void;
  resetGradingScale: () => void;
}

export default function GradingSystem({
  gradingScale,
  updateGrade,
  addGrade,
  removeGrade,
  resetGradingScale,
}: Props) {
  const [previewScore, setPreviewScore] = useState(87);

  const getGradeForScore = (score: number): GradeScale | null => {
    return (
      gradingScale.find(
        (item) => score >= item.minScore && score <= item.maxScore
      ) ?? null
    );
  };

  const previewGrade = getGradeForScore(previewScore);

  const passingCount = useMemo(
    () => gradingScale.filter((item) => item.passing).length,
    [gradingScale]
  );

  const failingCount = gradingScale.length - passingCount;

  const highestGpa = useMemo(() => {
    if (!gradingScale.length) return 0;

    return Math.max(...gradingScale.map((item) => Number(item.point) || 0));
  }, [gradingScale]);

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
          'bg-rose-50 text-rose-600 ring-1 ring-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:ring-rose-900',
        range: 'bg-rose-500',
        soft: 'bg-rose-50/70 dark:bg-rose-950/20',
      };
    }

    const point = Number(grade.point);

    if (point >= 3.7) {
      return {
        badge:
          'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:ring-emerald-900',
        range: 'bg-emerald-500',
        soft: 'bg-emerald-50/70 dark:bg-emerald-950/20',
      };
    }

    if (point >= 3) {
      return {
        badge:
          'bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/30 dark:text-blue-300 dark:ring-blue-900',
        range: 'bg-blue-500',
        soft: 'bg-blue-50/70 dark:bg-blue-950/20',
      };
    }

    return {
      badge:
        'bg-amber-50 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:ring-amber-900',
      range: 'bg-amber-500',
      soft: 'bg-amber-50/70 dark:bg-amber-950/20',
    };
  };

  return (
    <section className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-white/80 shadow-[0_20px_70px_-35px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/70">
      {/* =========================================================
          HEADER
      ========================================================== */}
      <div className="border-b border-slate-200/70 px-5 py-5 sm:px-7 dark:border-slate-800">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg shadow-slate-950/10 dark:bg-white dark:text-slate-950">
              <Trophy size={21} strokeWidth={2.2} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-slate-950 dark:text-white">
                  Grading System
                </h2>

                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                  Academic
                </span>
              </div>

              <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-500 dark:text-slate-400">
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

            <Button
              variant="glass"
              onClick={addGrade}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-white hover:bg-slate-800 sm:flex-none dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Plus size={15} />
              Add Grade
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* =========================================================
            OVERVIEW
        ========================================================== */}
        <div className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800 dark:bg-slate-900/50">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">
                Grade Levels
              </span>

              <div className="h-2 w-2 rounded-full bg-slate-400" />
            </div>

            <p className="text-2xl font-black tracking-tight text-slate-950 dark:text-white">
              {gradingScale.length}
            </p>

            <p className="mt-1 text-[11px] text-slate-500">
              Configured levels
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                Passing
              </span>

              <CheckCircle2
                size={15}
                className="text-emerald-500"
              />
            </div>

            <p className="text-2xl font-black tracking-tight text-emerald-700 dark:text-emerald-300">
              {passingCount}
            </p>

            <p className="mt-1 text-[11px] text-emerald-600/70 dark:text-emerald-400/70">
              Passing grades
            </p>
          </div>

          <div className="rounded-2xl border border-rose-100 bg-rose-50/70 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">
                Failing
              </span>

              <X size={15} className="text-rose-500" />
            </div>

            <p className="text-2xl font-black tracking-tight text-rose-700 dark:text-rose-300">
              {failingCount}
            </p>

            <p className="mt-1 text-[11px] text-rose-600/70 dark:text-rose-400/70">
              Failing grades
            </p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/50 dark:bg-blue-950/20">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-400">
                Highest GPA
              </span>

              <Trophy size={15} className="text-blue-500" />
            </div>

            <p className="text-2xl font-black tracking-tight text-blue-700 dark:text-blue-300">
              {highestGpa.toFixed(1)}
            </p>

            <p className="mt-1 text-[11px] text-blue-600/70 dark:text-blue-400/70">
              Maximum GPA point
            </p>
          </div>
        </div>

        {/* =========================================================
            SECTION TITLE
        ========================================================== */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-white">
              Grade Scale
            </p>

            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Define the score range and GPA value for every grade.
            </p>
          </div>

          <span className="hidden text-xs font-medium text-slate-400 sm:block">
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
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-[0_14px_40px_-25px_rgba(15,23,42,0.45)] dark:border-slate-800 dark:bg-slate-900/60 dark:hover:border-slate-700"
              >
                {/* Card top */}
                <div className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${colors.soft} ${item.passing ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}
                    >
                      {item.grade || '?'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-slate-950 dark:text-white">
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

                      <p className="mt-1 truncate text-xs text-slate-500 dark:text-slate-400">
                        {item.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <div className="rounded-xl bg-slate-50 px-3 py-2 text-center dark:bg-slate-800">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-slate-400">
                        GPA
                      </p>

                      <p className="text-sm font-black text-slate-950 dark:text-white">
                        {Number(item.point).toFixed(1)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeGrade(item.id)}
                      disabled={gradingScale.length <= 1}
                      title={
                        gradingScale.length <= 1
                          ? 'At least one grading level is required'
                          : 'Remove grade'
                      }
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30 dark:hover:bg-rose-950/30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Score range */}
                <div className="px-4 pt-4 sm:px-5">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                    <span>0</span>
                    <span>Score Range</span>
                    <span>100</span>
                  </div>

                  <div className="relative h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div
                      className={`absolute top-0 h-full rounded-full ${colors.range}`}
                      style={{
                        left: `${left}%`,
                        width: `${width}%`,
                      }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {item.minScore} points
                    </span>

                    <ArrowRight
                      size={13}
                      className="text-slate-300"
                    />

                    <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
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
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm font-bold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800"
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
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800"
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
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800"
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
                      className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800"
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
                        className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800"
                      />
                    </Field>
                  </div>

                  <div className="flex items-end sm:col-span-2 lg:col-span-1">
                    <button
                      type="button"
                      onClick={() =>
                        updateGrade(
                          item.id,
                          'passing',
                          !item.passing
                        )
                      }
                      className={`flex h-11 w-full items-center justify-center gap-2 rounded-xl border px-4 text-xs font-bold transition ${
                        item.passing
                          ? 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300'
                          : 'border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300'
                      }`}
                    >
                      {item.passing ? (
                        <>
                          <CheckCircle2 size={15} />
                          Passing Grade
                        </>
                      ) : (
                        <>
                          <X size={15} />
                          Failing Grade
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {!gradingScale.length && (
            <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                <Trophy size={20} />
              </div>

              <p className="mt-4 text-sm font-bold text-slate-900 dark:text-white">
                No grading levels
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Add a grading level to start configuring your grading system.
              </p>

              <button
                type="button"
                onClick={addGrade}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950"
              >
                <Plus size={14} />
                Add First Grade
              </button>
            </div>
          )}
        </div>

        {/* =========================================================
            GRADE CALCULATOR
        ========================================================== */}
        <div className="mt-7 overflow-hidden rounded-3xl bg-slate-950 text-white shadow-[0_20px_60px_-30px_rgba(15,23,42,0.8)]">
          <div className="border-b border-white/10 px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                <Sparkles size={17} className="text-blue-300" />
              </div>

              <div>
                <p className="text-sm font-bold">
                  Grade Calculator
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Enter a sample score to preview how the grading scale
                  converts it.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            {/* Score */}
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
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
                  className="h-16 w-full rounded-2xl border border-white/10 bg-white/[0.07] px-5 text-2xl font-black text-white outline-none transition focus:border-blue-400 focus:bg-white/10 focus:ring-4 focus:ring-blue-400/10"
                />

                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
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
                className="mt-4 w-full accent-blue-500"
              />
            </div>

            {/* Arrow */}
            <div className="hidden h-12 w-12 items-center justify-center rounded-full bg-white/5 text-slate-500 lg:flex">
              <ArrowRight size={20} />
            </div>

            {/* Result */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              {previewGrade ? (
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-2xl font-black ${
                      previewGrade.passing
                        ? 'bg-emerald-400/15 text-emerald-300'
                        : 'bg-rose-400/15 text-rose-300'
                    }`}
                  >
                    {previewGrade.grade}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-white">
                        {previewGrade.description || 'Grade result'}
                      </p>

                      {previewGrade.passing ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-1 text-[9px] font-bold text-emerald-300">
                          <Check size={10} />
                          PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-400/10 px-2 py-1 text-[9px] font-bold text-rose-300">
                          <X size={10} />
                          FAIL
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-xs text-slate-400">
                      GPA Point{' '}
                      <span className="font-bold text-slate-200">
                        {Number(previewGrade.point).toFixed(1)}
                      </span>
                    </p>

                    <p className="mt-1 text-[10px] text-slate-500">
                      Range {previewGrade.minScore}–
                      {previewGrade.maxScore}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-2xl font-black text-slate-500">
                    —
                  </div>

                  <div>
                    <p className="text-sm font-bold text-slate-300">
                      No matching grade
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      The score does not belong to any configured range.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================
            FOOTER INFO
        ========================================================== */}
        <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-3 text-xs text-blue-700 sm:flex-row sm:items-center sm:justify-between dark:border-blue-900/40 dark:bg-blue-950/20 dark:text-blue-300">
          <div className="flex items-center gap-2">
            <Sparkles size={14} />
            <span>
              Changes are reflected immediately in the grade preview.
            </span>
          </div>

          <span className="font-semibold">
            {gradingScale.length} grading levels configured
          </span>
        </div>
      </div>
    </section>
  );
}