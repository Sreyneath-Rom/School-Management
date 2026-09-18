import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import { academicService } from '@/services/academicService'
import type { GradeRecord } from '@/types/academic'

interface SubjectSummary {
  subjectName: string
  subjectId: string
  averageScore: number
  gradeCount: number
}

function buildSubjectSummaries(grades: GradeRecord[]): SubjectSummary[] {
  const bySubject = new Map<string, { name: string; total: number; count: number }>()

  for (const g of grades) {
    const entry = bySubject.get(g.subjectId) ?? { name: g.subjectName, total: 0, count: 0 }
    entry.total += g.totalWeightedScore
    entry.count += 1
    bySubject.set(g.subjectId, entry)
  }

  return Array.from(bySubject.entries())
    .map(([subjectId, v]) => ({
      subjectId,
      subjectName: v.name,
      averageScore: v.count > 0 ? Number((v.total / v.count).toFixed(1)) : 0,
      gradeCount: v.count,
    }))
    .sort((a, b) => b.averageScore - a.averageScore)
}

export default function AcademicPulseWidget() {
  const [grades, setGrades] = useState<GradeRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    academicService
      .getGrades()
      .then((rows) => { if (!cancelled) setGrades(rows) })
      .catch(() => { if (!cancelled) setGrades([]) })
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [])

  const summaries = useMemo(() => buildSubjectSummaries(grades), [grades])

  return (
    <div className="rounded-3xl border border-surface bg-surface-strong p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-fg">
              Curriculum Mastery & Subject Health
            </h2>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success border border-success/20">
              <Sparkles size={10} className="inline -mt-0.5 mr-1" />
              Live
            </span>
          </div>
          <p className="text-xs text-fg-muted">
            Average marks per subject from the gradebook
          </p>
        </div>

        <Link
          to="/academic/grades"
          className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
        >
          <span>All Grades</span>
          <ArrowUpRight size={13} />
        </Link>
      </div>

      {loading ? (
        <p className="py-8 text-center text-xs text-fg-muted">Loading subject statistics…</p>
      ) : summaries.length === 0 ? (
        <p className="py-8 text-center text-xs text-fg-muted">
          No grades recorded yet.
        </p>
      ) : (
        <div className="mt-4 space-y-3.5">
          {summaries.slice(0, 5).map((sub) => (
            <div key={sub.subjectId} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-fg truncate">{sub.subjectName}</span>
                <span className="font-mono text-xs font-extrabold text-fg">
                  {sub.averageScore}/100
                  <span className="ml-2 text-[10px] font-normal text-fg-muted">
                    ({sub.gradeCount})
                  </span>
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    sub.averageScore >= 80
                      ? 'bg-success'
                      : sub.averageScore >= 75
                      ? 'bg-brand-600'
                      : 'bg-warning'
                  }`}
                  style={{ width: `${Math.min(sub.averageScore, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}