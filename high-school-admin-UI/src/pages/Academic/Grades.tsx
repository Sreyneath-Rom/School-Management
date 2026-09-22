// src/pages/Academic/Grades.tsx
import { useState, useEffect, useCallback } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Award, BookOpen, Search, Save, TrendingUp, AlertCircle,
  Layers, Printer, RotateCcw,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService } from '@/services/academicService'
import type { GradeRecord, StudentProgress } from '@/types/academic'
import { useToast } from '@/components/common/ToastProvider'
import StatsGrid from '@/components/cards/StatsGrid'
import type { StatCard } from '@/types'
import { classService, type ClassRecord } from '@/services/classService'

interface DraftEdit {
  score: string
  comment: string
}

export default function GradesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  const [selectedClass, setSelectedClass] = useState<string>('')
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'grades' | 'progress'>('grades')

  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>([])
  const [studentRecords, setStudentRecords] = useState<GradeRecord[]>([])
  const [progressList, setProgressList] = useState<StudentProgress[]>([])
  const [apiClasses, setApiClasses] = useState<ClassRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  const [drafts, setDrafts] = useState<Record<string, DraftEdit>>({})

  const loadClasses = useCallback(async () => {
    if (isStudent) return
    try {
      const classes = await classService.list()
      setApiClasses(Array.isArray(classes) ? classes : [])
      if (classes.length > 0 && !selectedClass) setSelectedClass(classes[0].name)
    } catch {
      setApiClasses([])
    }
  }, [isStudent, selectedClass])

  useEffect(() => { loadClasses() }, [loadClasses])

  const loadData = useCallback(async () => {
    setLoading(true)
    setDrafts({})
    try {
      if (isStudent) {
        const mine = await academicService.getMyGrades()
        setStudentRecords(mine)
      } else {
        const [grades, progress] = await Promise.all([
          academicService.getAllGrades({
            classId: apiClasses.find((c) => c.name === selectedClass)?.id,
            subjectId: undefined,
          }),
          selectedClass
            ? academicService.getStudentProgress(apiClasses.find((c) => c.name === selectedClass)?.id)
            : Promise.resolve([]),
        ])
        setGradeRecords(grades)
        setProgressList(progress)
      }
    } catch {
      showToast('Failed to load academic grades', 'error')
      setGradeRecords([]); setStudentRecords([]); setProgressList([])
    } finally {
      setLoading(false)
    }
  }, [isStudent, selectedClass, apiClasses, showToast])

  useEffect(() => { loadData() }, [loadData])

  const handleScoreChange = (recordId: string, raw: string) => {
    setDrafts((prev) => ({
      ...prev,
      [recordId]: { score: raw, comment: prev[recordId]?.comment ?? getOriginalComment(recordId) },
    }))
  }

  const handleCommentChange = (recordId: string, comment: string) => {
    setDrafts((prev) => ({
      ...prev,
      [recordId]: { score: prev[recordId]?.score ?? String(getOriginalScore(recordId)), comment },
    }))
  }

  const getOriginalScore = (recordId: string): number =>
    gradeRecords.find((r) => r.id === recordId)?.score ?? 0
  const getOriginalComment = (recordId: string): string =>
    gradeRecords.find((r) => r.id === recordId)?.comment ?? ''

  const hasUnsavedChanges = Object.keys(drafts).length > 0

  const handleSaveAll = async () => {
    if (saving || !hasUnsavedChanges) return
    setSaving(true)
    try {
      const payload = Object.entries(drafts)
        .map(([id, draft]) => {
          const record = gradeRecords.find((r) => r.id === id)
          if (!record) return null
          const score = Number(draft.score)
          if (Number.isNaN(score) || score < 0 || score > record.maxScore) {
            showToast(`Invalid score for ${record.studentName}`, 'error')
            return null
          }
          return {
            studentId: record.studentId,
            subjectId: record.subjectId,
            period: record.period,
            periodLabel: record.periodLabel,
            score,
            maxScore: record.maxScore,
            comment: draft.comment || undefined,
          }
        })
        .filter((x): x is NonNullable<typeof x> => x !== null)

      if (payload.length === 0) { setSaving(false); return }

      const results = await academicService.saveBatchGrades(payload)
      const failures = results.filter((r) => !r.ok)
      if (failures.length > 0) {
        showToast(
          `${failures.length} of ${results.length} grade${results.length === 1 ? '' : 's'} failed to save`,
          'error'
        )
      } else {
        showToast(`Saved ${results.length} grade${results.length === 1 ? '' : 's'}`, 'success')
      }
      await loadData()
    } catch {
      showToast('Error saving grade updates', 'error')
    } finally {
      setSaving(false)
    }
  }

  const displayScore = (r: GradeRecord) =>
    drafts[r.id]?.score !== undefined ? drafts[r.id].score : String(r.score)
  const displayComment = (r: GradeRecord) =>
    drafts[r.id]?.comment !== undefined ? drafts[r.id].comment : r.comment

  const classAverage = gradeRecords.length > 0
    ? (gradeRecords.reduce((sum, r) => sum + r.percentage, 0) / gradeRecords.length).toFixed(1)
    : '0.0'
  const countA = gradeRecords.filter((r) => r.letterGrade === 'A').length
  const countB = gradeRecords.filter((r) => r.letterGrade === 'B').length
  const countDF = gradeRecords.filter((r) => r.letterGrade === 'D' || r.letterGrade === 'F').length

  const studentAverage = studentRecords.length > 0
    ? (studentRecords.reduce((sum, r) => sum + r.percentage, 0) / studentRecords.length).toFixed(1)
    : '0.0'
  const studentGpa = studentRecords.length > 0
    ? (studentRecords.reduce((sum, r) => sum + r.gpa, 0) / studentRecords.length).toFixed(2)
    : '0.00'

  const filteredTeacherRecords = gradeRecords.filter((r) => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return r.studentName.toLowerCase().includes(term) || r.studentCode.toLowerCase().includes(term)
  })

  const kpiCards: StatCard[] = isStudent
    ? [
        { id: 'gpa',      label: 'Cumulative GPA',  value: `${studentGpa} / 4.00`, delta: '-', deltaDirection: 'neutral', deltaLabel: 'academic standing',      icon: 'Award',        tint: 'amber' },
        { id: 'avg',      label: 'Average Score',   value: `${studentAverage}%`,   delta: '-', deltaDirection: 'neutral', deltaLabel: `${studentRecords.length} graded periods`, icon: 'TrendingUp', tint: 'blue' },
        { id: 'subjects', label: 'Subjects Graded', value: String(new Set(studentRecords.map((r) => r.subjectId)).size), delta: '-', deltaDirection: 'neutral', deltaLabel: 'this session', icon: 'BookOpen', tint: 'green' },
      ]
    : [
        { id: 'class-avg',     label: 'Class Average',   value: `${classAverage}%`, delta: '-', deltaDirection: 'neutral', deltaLabel: selectedClass || 'all classes', icon: 'TrendingUp',  tint: 'blue' },
        { id: 'grade-a',       label: "Grade 'A'",        value: String(countA),    delta: '-', deltaDirection: 'neutral', deltaLabel: '90% - 100%',                    icon: 'Award',       tint: 'green' },
        { id: 'grade-b',       label: "Grade 'B'",        value: String(countB),    delta: '-', deltaDirection: 'neutral', deltaLabel: '80% - 89%',                     icon: 'BookOpen',    tint: 'sky' },
        { id: 'needs-support', label: 'Needs Support',   value: String(countDF),   delta: '-', deltaDirection: 'neutral', deltaLabel: 'below 70%',                     icon: 'AlertCircle', tint: 'amber' },
      ]

  return (
    <div id="grades-page-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title={isStudent ? 'My Academic Grade Report' : 'Grades & Academic Evaluations'}
          subtitle={
            isStudent
              ? 'Official scores, GPA, and teacher remarks by subject and period.'
              : 'Enter period scores, monitor class performance, and review student academic progress.'
          }
        />

        <div className="flex items-center gap-2">
          {isTeacherOrAdmin && (
            <button
              id="save-grades-btn"
              onClick={handleSaveAll}
              disabled={loading || saving || !hasUnsavedChanges}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm shadow-brand-600/20 transition disabled:cursor-not-allowed disabled:opacity-45 cursor-pointer"
            >
              <Save className={`w-4 h-4 ${saving ? 'animate-pulse' : ''}`} />
              {saving
                ? 'Saving...'
                : hasUnsavedChanges
                  ? `Save ${Object.keys(drafts).length} Change${Object.keys(drafts).length === 1 ? '' : 's'}`
                  : 'All Changes Saved'}
            </button>
          )}

          <button
            type="button"
            onClick={loadData}
            disabled={loading || saving}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl glass-sm glass-interactive text-fg-muted hover:text-fg text-sm font-medium disabled:cursor-not-allowed disabled:opacity-45"
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl glass-sm glass-interactive text-fg-muted hover:text-fg text-sm font-medium"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
        </div>
      </div>

      <StatsGrid cards={kpiCards} columns={isStudent ? 3 : 4} />

      {isStudent ? (
        <StudentView records={studentRecords} loading={loading} />
      ) : (
        <TeacherView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          loading={loading}
          classes={apiClasses}
          selectedClass={selectedClass}
          onClassChange={setSelectedClass}
          search={search}
          onSearchChange={setSearch}
          records={filteredTeacherRecords}
          progress={progressList}
          displayScore={displayScore}
          displayComment={displayComment}
          onScoreChange={handleScoreChange}
          onCommentChange={handleCommentChange}
          drafts={drafts}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Student view
// ---------------------------------------------------------------------------

function StudentView({ records, loading }: { records: GradeRecord[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="glass-sm rounded-2xl p-10 text-center text-sm text-fg-muted">
        Loading your grade report...
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="glass-sm rounded-2xl p-10 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
        <p className="text-sm font-semibold text-fg">No grades published yet</p>
        <p className="mt-1 text-xs text-fg-muted">
          Your subject results will appear here once a teacher records them.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-sm rounded-2xl overflow-hidden">
      <div className="p-4 shadow-[0_1px_0_var(--neu-shadow-dark)] flex items-center justify-between">
        <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Grade Report
        </h3>
        <span className="text-xs text-fg-muted">
          {records.length} record{records.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-fg-muted">
          <thead className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted shadow-[0_1px_0_var(--neu-shadow-dark)]">
            <tr>
              <th className="py-3.5 px-4">Subject</th>
              <th className="py-3.5 px-4">Period</th>
              <th className="py-3.5 px-4 text-center">Score</th>
              <th className="py-3.5 px-4 text-center">Percentage</th>
              <th className="py-3.5 px-4 text-center">Letter</th>
              <th className="py-3.5 px-4 text-center">GPA</th>
              <th className="py-3.5 px-4">Comment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--neu-shadow-dark)">
            {records.map((r) => (
              <tr key={r.id} className="hover:shadow-sunken transition-shadow">
                <td className="py-3.5 px-4 font-semibold text-fg">{r.subjectName || '—'}</td>
                <td className="py-3.5 px-4">
                  <span className="text-[11px] font-medium text-fg-muted">{r.periodLabel} ({r.period})</span>
                </td>
                <td className="py-3.5 px-4 text-center font-mono">{r.score} / {r.maxScore}</td>
                <td className="py-3.5 px-4 text-center font-bold text-fg">{r.percentage}%</td>
                <td className="py-3.5 px-4 text-center"><GradeBadge grade={r.letterGrade} /></td>
                <td className="py-3.5 px-4 text-center font-semibold">{r.gpa.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-fg-muted italic max-w-xs truncate">{r.comment || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Teacher view
// ---------------------------------------------------------------------------

function TeacherView({
  activeTab, setActiveTab, loading, classes, selectedClass, onClassChange,
  search, onSearchChange, records, progress, displayScore, displayComment,
  onScoreChange, onCommentChange, drafts,
}: {
  activeTab: 'grades' | 'progress'
  setActiveTab: (t: 'grades' | 'progress') => void
  loading: boolean
  classes: ClassRecord[]
  selectedClass: string
  onClassChange: (name: string) => void
  search: string
  onSearchChange: (s: string) => void
  records: GradeRecord[]
  progress: StudentProgress[]
  displayScore: (r: GradeRecord) => string
  displayComment: (r: GradeRecord) => string
  onScoreChange: (id: string, value: string) => void
  onCommentChange: (id: string, value: string) => void
  drafts: Record<string, DraftEdit>
}) {
  return (
    <div className="space-y-6">
      {/* Tabs — sunken tray, active segment brand-filled */}
      <div className="flex items-center gap-2 pb-2 shadow-[0_1px_0_var(--neu-shadow-dark)]">
        <button
          onClick={() => setActiveTab('grades')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'grades'
              ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
              : 'text-fg-muted hover:text-fg shadow-sunken'
          }`}
        >
          Grade Roster
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
            activeTab === 'progress'
              ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/20'
              : 'text-fg-muted hover:text-fg shadow-sunken'
          }`}
        >
          Student Progress
        </button>
      </div>

      {activeTab === 'grades' ? (
        <>
          <div className="glass-sm rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2.5 w-full md:w-auto">
              <Layers className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span className="text-xs font-semibold text-fg-muted">Class:</span>
              <select
                value={selectedClass}
                onChange={(e) => onClassChange(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl text-fg font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 cursor-pointer"
              >
                {classes.length === 0 && <option value="">No classes</option>}
                {classes.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
              </select>
            </div>

            <div className="relative w-full md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted z-10" />
              <input
                type="text"
                placeholder="Search student..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {loading && (
            <div className="rounded-xl bg-brand-500/10 border border-brand-500/25 px-4 py-3 text-xs text-brand-700 dark:text-brand-300">
              Loading the selected class gradebook...
            </div>
          )}

          {!loading && records.length === 0 && (
            <div className="glass-sm rounded-2xl p-10 text-center">
              <AlertCircle className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
              <p className="text-sm font-semibold text-fg">No grade records found</p>
              <p className="mt-1 text-xs text-fg-muted">
                {selectedClass
                  ? 'No grades recorded for this class yet.'
                  : 'Select a class to see its gradebook.'}
              </p>
            </div>
          )}

          {records.length > 0 && (
            <div className="glass-sm rounded-2xl overflow-hidden">
              <div className="p-4 shadow-[0_1px_0_var(--neu-shadow-dark)]">
                <h3 className="font-semibold text-sm text-fg">Roster ({records.length} records)</h3>
                <p className="text-xs text-fg-muted mt-0.5">
                  Type a score between 0 and the maximum. Changes are saved together.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-fg-muted">
                  <thead className="text-[11px] font-semibold uppercase tracking-wider shadow-[0_1px_0_var(--neu-shadow-dark)]">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4">Subject</th>
                      <th className="py-3 px-4 text-center">Period</th>
                      <th className="py-3 px-3 text-center w-32">Score</th>
                      <th className="py-3 px-4 text-center">%</th>
                      <th className="py-3 px-4 text-center">Letter</th>
                      <th className="py-3 px-4 text-center">GPA</th>
                      <th className="py-3 px-4">Comment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-(--neu-shadow-dark)">
                    {records.map((rec) => {
                      const draft = drafts[rec.id]
                      const draftScore = Number(draft?.score ?? rec.score)
                      const previewPct =
                        rec.maxScore > 0 && !Number.isNaN(draftScore)
                          ? Number(((draftScore / rec.maxScore) * 100).toFixed(1))
                          : rec.percentage

                      return (
                        <tr key={rec.id} className={draft ? 'bg-brand-500/5' : ''}>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-fg">{rec.studentName}</div>
                            <div className="text-[11px] text-fg-muted">{rec.studentCode}</div>
                          </td>
                          <td className="py-3 px-4 text-fg">{rec.subjectName}</td>
                          <td className="py-3 px-4 text-center text-[11px]">{rec.periodLabel}</td>
                          <td className="py-2.5 px-3 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                min={0}
                                max={rec.maxScore}
                                step={0.5}
                                value={displayScore(rec)}
                                onChange={(e) => onScoreChange(rec.id, e.target.value)}
                                className="w-16 px-2 py-1.5 text-center text-xs font-semibold rounded-lg text-fg focus:ring-2 focus:ring-brand-500"
                              />
                              <span className="text-[10px] text-fg-muted">/ {rec.maxScore}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center font-bold text-fg">{previewPct}%</td>
                          <td className="py-3 px-4 text-center"><GradeBadge grade={rec.letterGrade} /></td>
                          <td className="py-3 px-4 text-center font-semibold">{rec.gpa.toFixed(2)}</td>
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              placeholder="Add note..."
                              value={displayComment(rec)}
                              onChange={(e) => onCommentChange(rec.id, e.target.value)}
                              className="w-full px-2.5 py-1 text-xs rounded-lg text-fg focus:ring-2 focus:ring-brand-500"
                            />
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <ProgressView progress={progress} loading={loading} />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Progress view
// ---------------------------------------------------------------------------

function ProgressView({ progress, loading }: { progress: StudentProgress[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="glass-sm rounded-2xl p-10 text-center text-sm text-fg-muted">
        Loading progress analytics...
      </div>
    )
  }

  if (progress.length === 0) {
    return (
      <div className="glass-sm rounded-2xl p-10 text-center">
        <TrendingUp className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
        <p className="text-sm font-semibold text-fg">No progress data available</p>
        <p className="mt-1 text-xs text-fg-muted">
          Select a class with recorded grades to see aggregate progress.
        </p>
      </div>
    )
  }

  return (
    <div className="glass-sm rounded-2xl overflow-hidden">
      <div className="p-4 shadow-[0_1px_0_var(--neu-shadow-dark)]">
        <h3 className="font-semibold text-sm text-fg flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-brand-600 dark:text-brand-400" />
          Student Progress ({progress.length})
        </h3>
        <p className="text-xs text-fg-muted mt-0.5">Aggregated from recorded grade records only.</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-fg-muted">
          <thead className="text-[11px] font-semibold uppercase tracking-wider shadow-[0_1px_0_var(--neu-shadow-dark)]">
            <tr>
              <th className="py-3 px-4">Student</th>
              <th className="py-3 px-4">Class</th>
              <th className="py-3 px-4 text-center">Average</th>
              <th className="py-3 px-4 text-center">Overall GPA</th>
              <th className="py-3 px-4 text-center">Records</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-(--neu-shadow-dark)">
            {progress.map((p) => (
              <tr key={p.studentId} className="hover:shadow-sunken transition-shadow">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-fg">{p.studentName}</div>
                  <div className="text-[11px] text-fg-muted">{p.studentCode}</div>
                </td>
                <td className="py-3.5 px-4 text-fg">{p.className || '—'}</td>
                <td className="py-3.5 px-4 text-center font-bold text-fg">{p.periodAveragePercentage}%</td>
                <td className="py-3.5 px-4 text-center font-semibold">{p.overallGpa.toFixed(2)}</td>
                <td className="py-3.5 px-4 text-center text-fg-muted">{p.gradeRecordCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Grade badge — semantic tints, kept
// ---------------------------------------------------------------------------

function GradeBadge({ grade }: { grade: 'A' | 'B' | 'C' | 'D' | 'F' }) {
  const classes =
    grade === 'A' ? 'bg-success/15 text-success'
    : grade === 'B' ? 'bg-info/15 text-info'
    : grade === 'C' ? 'bg-warning/15 text-warning'
    : 'bg-error/15 text-error'

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${classes}`}>
      {grade}
    </span>
  )
}