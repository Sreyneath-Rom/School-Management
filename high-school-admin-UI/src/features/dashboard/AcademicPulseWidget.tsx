import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Sparkles,
  Award,
  AlertCircle,
  TrendingUp,
  Clock,
  ArrowUpRight,
  BookOpen,
  Filter,
} from 'lucide-react'

interface SubjectPerformance {
  subject: string
  code: string
  averageScore: number
  passingRate: number
  topGrade: string
  trend: '+2.4%' | '+1.1%' | '-0.8%' | '+3.5%' | '+0.4%'
}

const subjectsData: SubjectPerformance[] = [
  { subject: 'Mathematics (គណិតវិទ្យា)', code: 'MATH-12', averageScore: 78.4, passingRate: 91, topGrade: 'A (24%)', trend: '+2.4%' },
  { subject: 'Khmer Literature (អក្សរសាស្ត្រខ្មែរ)', code: 'KHM-12', averageScore: 84.1, passingRate: 98, topGrade: 'A (38%)', trend: '+1.1%' },
  { subject: 'Physics (រូបវិទ្យា)', code: 'PHY-12', averageScore: 72.8, passingRate: 86, topGrade: 'B+ (29%)', trend: '-0.8%' },
  { subject: 'Chemistry (គីមីវិទ្យា)', code: 'CHEM-12', averageScore: 76.5, passingRate: 89, topGrade: 'A (21%)', trend: '+3.5%' },
  { subject: 'English Language', code: 'ENG-12', averageScore: 81.2, passingRate: 95, topGrade: 'A (32%)', trend: '+0.4%' },
]

export default function AcademicPulseWidget() {
  const [selectedTerm, setSelectedTerm] = useState<'Term 1' | 'Term 2'>('Term 2')

  return (
    <div className="rounded-3xl border border-surface bg-surface-strong p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-surface">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-color">
              Curriculum Mastery & Subject Health
            </h2>
            <span className="rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success border border-success/20">
              MoEYS Benchmark
            </span>
          </div>
          <p className="text-xs text-secondary">
            Real-time average marks across core Grade 10-12 disciplines
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex rounded-xl bg-surface p-0.5 text-xs font-semibold border border-surface">
            <button
              type="button"
              onClick={() => setSelectedTerm('Term 1')}
              className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                selectedTerm === 'Term 1'
                  ? 'bg-surface-strong text-color shadow-xs font-bold'
                  : 'text-secondary hover:text-color'
              }`}
            >
              Term I
            </button>
            <button
              type="button"
              onClick={() => setSelectedTerm('Term 2')}
              className={`rounded-lg px-2.5 py-1 transition cursor-pointer ${
                selectedTerm === 'Term 2'
                  ? 'bg-surface-strong text-color shadow-xs font-bold'
                  : 'text-secondary hover:text-color'
              }`}
            >
              Term II (Live)
            </button>
          </div>

          <Link
            to="/academic/grades"
            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 dark:text-brand-400"
          >
            <span>All Grades</span>
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      {/* Progress Bars & Insights */}
      <div className="mt-4 space-y-3.5">
        {subjectsData.map((sub) => {
          const scorePercent = sub.averageScore
          return (
            <div key={sub.code} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-color truncate">
                    {sub.subject}
                  </span>
                  <span className="rounded bg-surface px-1.5 py-0.5 text-[10px] font-mono text-secondary border border-surface">
                    {sub.code}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs font-extrabold text-color">
                    {sub.averageScore}/100
                  </span>
                  <span className="text-[11px] font-semibold text-success">
                    {sub.trend}
                  </span>
                </div>
              </div>

              {/* Multi-layered progress indicator */}
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-surface">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    scorePercent >= 80
                      ? 'bg-success'
                      : scorePercent >= 75
                      ? 'bg-brand-600'
                      : 'bg-warning'
                  }`}
                  style={{ width: `${scorePercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-secondary">
                <span>Passing Rate: {sub.passingRate}%</span>
                <span>Honor Roll: {sub.topGrade}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
