// src/features/setup/school/GradingSystem.tsx

import { useMemo, useState } from 'react';
import { ArrowRight, Check, CheckCircle2, RotateCcw, Sparkles, Trophy, X } from 'lucide-react';

import Button from '@/components/common/Button';
import Field from './Field';
import type { GradeScale } from '@/types/school';

interface Props {
  gradingScale: GradeScale[];
  updateGrade: (id: string, field: keyof GradeScale, value: string | number | boolean) => void;
  addGrade: () => void;
  resetGradingScale: () => void;
}

export default function GradingSystem({
  gradingScale = [], updateGrade, resetGradingScale,
}: Props) {
  const safeScale = useMemo(() => (Array.isArray(gradingScale) ? gradingScale : []), [gradingScale]);
  const [previewScore, setPreviewScore] = useState(87);

  const getGradeForScore = (score: number): GradeScale | null => {
    return (
      safeScale.find((item) => item && score >= item.minScore && score <= item.maxScore) ?? null
    );
  };

  const previewGrade = getGradeForScore(previewScore);
  const passingCount = useMemo(() => safeScale.filter((item) => item?.passing).length, [safeScale]);
  const failingCount = safeScale.length - passingCount;

  const highestGpa = useMemo(() => {
    if (!safeScale.length) return 0;
    return Math.max(...safeScale.map((item) => Number(item?.point) || 0));
  }, [safeScale]);

  const handleReset = () => {
    const confirmed = window.confirm(
      'Reset the grading scale to the default 5-tier system? This discards any custom grades you have added.'
    );
    if (confirmed) resetGradingScale();
  };

  const getGradeColor = (grade: GradeScale) => {
    if (!grade.passing) {
      return { badge: 'bg-error/15 text-error', range: 'bg-error', soft: 'bg-error/15' };
    }
    const point = Number(grade.point);
    if (point >= 3.7) return { badge: 'bg-success/15 text-success', range: 'bg-success', soft: 'bg-success/15' };
    if (point >= 3)   return { badge: 'bg-info/15 text-info',       range: 'bg-info',    soft: 'bg-info/15' };
    return               { badge: 'bg-warning/15 text-warning',     range: 'bg-warning', soft: 'bg-warning/15' };
  };

  return (
    <section className="overflow-hidden rounded-[30px]">
      {/* Header block */}
      <div className="px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between glass-sm rounded-3xl px-5 py-5 sm:px-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-fg shadow-sunken">
              <Trophy size={21} strokeWidth={2.2} />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-fg">Grading System</h2>
                <span className="rounded-full bg-info/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-info">
                  Academic
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-fg-muted">
                Configure score ranges, GPA points, and passing requirements for student results.
              </p>
            </div>
          </div>

          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="glass"
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 glass-interactive sm:flex-none"
            >
              <RotateCcw size={15} />
              Reset
            </Button>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-7">
        {/* Overview stat row */}
        <div className="mb-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <div className="rounded-2xl p-4 glass-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-fg-muted">Grade Levels</span>
              <div className="h-2 w-2 rounded-full bg-fg-muted/40" />
            </div>
            <p className="text-2xl font-black tracking-tight text-fg">{gradingScale.length}</p>
            <p className="mt-1 text-[11px] text-fg-muted">Configured levels</p>
          </div>

          <div className="rounded-2xl p-4 glass-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-success">Passing</span>
              <CheckCircle2 size={15} className="text-success" />
            </div>
            <p className="text-2xl font-black tracking-tight text-success">{passingCount}</p>
            <p className="mt-1 text-[11px] text-success/80">Passing grades</p>
          </div>

          <div className="rounded-2xl p-4 glass-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-error">Failing</span>
              <X size={15} className="text-error" />
            </div>
            <p className="text-2xl font-black tracking-tight text-error">{failingCount}</p>
            <p className="mt-1 text-[11px] text-error/80">Failing grades</p>
          </div>

          <div className="rounded-2xl p-4 glass-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold text-info">Highest GPA</span>
              <Trophy size={15} className="text-info" />
            </div>
            <p className="text-2xl font-black tracking-tight text-info">{highestGpa.toFixed(1)}</p>
            <p className="mt-1 text-[11px] text-info/80">Maximum GPA point</p>
          </div>
        </div>

        {/* Section title */}
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-fg">Grade Scale</p>
            <p className="mt-1 text-xs text-fg-muted">
              Define the score range and GPA value for every grade.
            </p>
          </div>
          <span className="hidden text-xs font-medium text-fg-muted sm:block">
            {gradingScale.length} levels
          </span>
        </div>

        <div className="space-y-4">
          {gradingScale.map((item) => {
            const colors = getGradeColor(item);
            const range = Math.max(0, Number(item.maxScore) - Number(item.minScore)) / 100;
            const left = Math.min(100, Math.max(0, Number(item.minScore)));
            const width = Math.min(100 - left, Math.max(3, range * 100));

            return (
              <div
                key={item.id}
                className="group overflow-hidden rounded-3xl glass-sm transition-all duration-200"
              >
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-lg font-black ${colors.soft} ${
                        item.passing ? 'text-success' : 'text-error'
                      }`}
                    >
                      {item.grade || '?'}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-bold text-fg">Grade {item.grade || '—'}</p>
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${colors.badge}`}>
                          {item.passing ? (<><Check size={11} />Passing</>) : (<><X size={11} />Failing</>)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-fg-muted">
                        {item.description || 'No description'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:justify-end">
                    <div className="rounded-xl px-3 py-2 text-center shadow-sunken">
                      <p className="text-[9px] font-semibold uppercase tracking-wider text-fg-muted">
                        GPA
                      </p>
                      <p className="text-sm font-black text-fg">
                        {Number(item.point).toFixed(1)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Score range bar — track is a sunken well, the filled
                    segment is the semantic color. */}
                <div className="px-4 pt-4 sm:px-5">
                  <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-fg-muted">
                    <span>0</span>
                    <span>Score Range</span>
                    <span>100</span>
                  </div>

                  <div className="relative h-2 overflow-hidden rounded-full shadow-sunken">
                    <div
                      className={`absolute top-0 h-full rounded-full ${colors.range}`}
                      style={{ left: `${left}%`, width: `${width}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-semibold text-fg">{item.minScore} points</span>
                    <ArrowRight size={13} className="text-fg-muted" />
                    <span className="text-xs font-semibold text-fg">{item.maxScore} points</span>
                  </div>
                </div>

                {/* Edit form — inputs inherit the sunken-well look from
                    globals. Focus ring uses info hue as a section-specific
                    accent, kept from the original. */}
                <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:px-5">
                  <Field label="Grade">
                    <input
                      value={item.grade}
                      maxLength={3}
                      onChange={(e) => updateGrade(item.id, 'grade', e.target.value.toUpperCase())}
                      className="h-11 w-full rounded-xl px-3 text-sm font-bold text-fg outline-none transition placeholder:text-fg-muted/70 focus:ring-2 focus:ring-info/40"
                    />
                  </Field>

                  <Field label="Minimum Score">
                    <input
                      type="number" min={0} max={100}
                      value={item.minScore}
                      onChange={(e) => updateGrade(item.id, 'minScore', Number(e.target.value))}
                      className="h-11 w-full rounded-xl px-3 text-sm font-semibold text-fg outline-none transition placeholder:text-fg-muted/70 focus:ring-2 focus:ring-info/40"
                    />
                  </Field>

                  <Field label="Maximum Score">
                    <input
                      type="number" min={0} max={100}
                      value={item.maxScore}
                      onChange={(e) => updateGrade(item.id, 'maxScore', Number(e.target.value))}
                      className="h-11 w-full rounded-xl px-3 text-sm font-semibold text-fg outline-none transition placeholder:text-fg-muted/70 focus:ring-2 focus:ring-info/40"
                    />
                  </Field>

                  <Field label="GPA Point">
                    <input
                      type="number" min={0} step={0.1}
                      value={item.point}
                      onChange={(e) => updateGrade(item.id, 'point', Number(e.target.value))}
                      className="h-11 w-full rounded-xl px-3 text-sm font-semibold text-fg outline-none transition placeholder:text-fg-muted/70 focus:ring-2 focus:ring-info/40"
                    />
                  </Field>

                  <div className="sm:col-span-2 lg:col-span-3">
                    <Field label="Description">
                      <input
                        value={item.description}
                        onChange={(e) => updateGrade(item.id, 'description', e.target.value)}
                        placeholder="Example: Excellent performance"
                        className="h-11 w-full rounded-xl px-3 text-sm font-semibold text-fg outline-none transition placeholder:text-fg-muted/70 focus:ring-2 focus:ring-info/40"
                      />
                    </Field>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Grade Calculator */}
        <div className="mt-7 overflow-hidden rounded-3xl glass-sm text-fg">
          <div className="px-5 py-5 sm:px-6">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl shadow-sunken">
                <Sparkles size={17} className="text-info" />
              </div>
              <div>
                <p className="text-sm font-bold text-fg">Grade Calculator</p>
                <p className="mt-1 text-xs text-fg-muted">
                  Enter a sample score to preview how the grading scale converts it.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
                Student Score
              </label>

              <div className="relative">
                <input
                  type="number" min={0} max={100}
                  value={previewScore}
                  onChange={(e) => setPreviewScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                  className="h-12 w-full rounded-3xl px-5 text-2xl font-black outline-none transition text-fg focus:ring-2 focus:ring-info/40"
                />
                <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-xs font-bold text-fg-muted">
                  / 100
                </span>
              </div>

              {/* Fixed: `accent-var(--color-info)` isn't valid Tailwind.
                  The correct form is `accent-[color:var(--color-info)]`
                  (arbitrary value with explicit type hint) or an inline
                  style. Using the arbitrary-value form here. */}
              <input
                type="range" min={0} max={100}
                value={previewScore}
                onChange={(e) => setPreviewScore(Number(e.target.value))}
                className="mt-4 w-full accent-(--color-info)"
              />
            </div>

            <div className="hidden h-12 w-12 items-center justify-center rounded-full text-fg-muted shadow-sunken lg:flex">
              <ArrowRight size={20} />
            </div>

            <div className="rounded-3xl glass-sm p-4">
              {previewGrade ? (
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl font-black ${
                      previewGrade.passing ? 'bg-success/15 text-success' : 'bg-error/15 text-error'
                    }`}
                  >
                    {previewGrade.grade}
                  </div>

                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-bold text-fg">
                        {previewGrade.description || 'Grade result'}
                      </p>
                      {previewGrade.passing ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-1 text-[9px] font-bold text-success">
                          <Check size={10} />PASS
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-error/15 px-2 py-1 text-[9px] font-bold text-error">
                          <X size={10} />FAIL
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-fg-muted">
                      GPA Point <span className="font-bold text-fg">{Number(previewGrade.point).toFixed(1)}</span>
                    </p>
                    <p className="mt-1 text-[10px] text-fg-muted">
                      Range {previewGrade.minScore}–{previewGrade.maxScore}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl text-2xl font-black text-fg shadow-sunken">
                    —
                  </div>
                  <div>
                    <p className="text-sm font-bold text-fg">No matching grade</p>
                    <p className="mt-1 text-xs text-fg-muted">
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