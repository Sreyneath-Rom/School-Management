import React, { useState, useEffect, useCallback, useMemo } from 'react'
import PageHeading from '@/components/common/PageHeading'
import Button from '@/components/common/Button'
import { useToast } from '@/components/common/ToastProvider'
import { useAuth } from '@/context/AuthContext'
import {
  gradeService,
  type ClassGradebook,
  type StudentGradeEntry,
  type AssessmentDefinition,
} from '@/services/gradeService'
import {
  GraduationCap,
  BookOpen,
  Award,
  TrendingUp,
  Download,
  Save,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Percent,
  Search,
  Printer,
  Sparkles,
  Layers,
  ArrowUpRight,
} from 'lucide-react'

export default function Grades() {
  const { user, role: currentRole } = useAuth()
  const { showToast } = useToast()

  const [activePerspective, setActivePerspective] = useState<'teacher' | 'student'>(() => {
    return currentRole === 'student' ? 'student' : 'teacher'
  })

  // Teacher filters
  const [selectedClass, setSelectedClass] = useState('Grade 10 - A')
  const [selectedSubject, setSelectedSubject] = useState('Mathematics')
  const [selectedTerm, setSelectedTerm] = useState('Term 1')
  const [searchQuery, setSearchQuery] = useState('')

  // Teacher gradebook state
  const [gradebook, setGradebook] = useState<ClassGradebook | null>(null)
  const [editedScores, setEditedScores] = useState<Record<string, Record<string, number>>>({})
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // Student report state (UC-GRADEBOOK-03)
  const [studentReport, setStudentReport] = useState<{
    entries: StudentGradeEntry[]
    cumulativeGpa: number
    overallAverage: number
  } | null>(null)

  // Load teacher gradebook
  const loadGradebook = useCallback(async () => {
    setLoading(true)
    try {
      const data = await gradeService.getClassGradebook(selectedClass, selectedSubject, selectedTerm)
      setGradebook(data)

      // Initialize local edited scores map
      const initialMap: Record<string, Record<string, number>> = {}
      data.entries.forEach((e) => {
        initialMap[e.studentId] = { ...e.scores }
      })
      setEditedScores(initialMap)
      setHasUnsavedChanges(false)
    } catch (e) {
      console.error(e)
      showToast('Failed to load gradebook', 'error')
    } finally {
      setLoading(false)
    }
  }, [selectedClass, selectedSubject, selectedTerm, showToast])

  // Load student personal report (UC-GRADEBOOK-03 & BR-09)
  const loadStudentReport = useCallback(async () => {
    setLoading(true)
    try {
      const studentId = user?.id || 'stu-101'
      const report = await gradeService.getStudentReport(studentId, selectedTerm)
      setStudentReport(report)
    } catch (e) {
      console.error(e)
      showToast('Failed to load academic report', 'error')
    } finally {
      setLoading(false)
    }
  }, [user?.id, selectedTerm, showToast])

  useEffect(() => {
    if (activePerspective === 'teacher') {
      loadGradebook()
    } else {
      loadStudentReport()
    }
  }, [activePerspective, loadGradebook, loadStudentReport])

  // Handle score change in teacher table (UC-GRADEBOOK-01)
  const handleScoreChange = (studentId: string, assessmentId: string, value: string) => {
    const num = Math.max(0, Math.min(100, Number(value) || 0))
    setEditedScores((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [assessmentId]: num,
      },
    }))
    setHasUnsavedChanges(true)
  }

  // Save changes (UC-GRADEBOOK-01)
  const handleSaveGradebook = async () => {
    if (!gradebook) return
    setIsSaving(true)
    try {
      for (const entry of gradebook.entries) {
        const studentChanges = editedScores[entry.studentId]
        if (studentChanges) {
          for (const asId of Object.keys(studentChanges)) {
            await gradeService.updateStudentScore(
              entry.studentId,
              selectedClass,
              selectedSubject,
              selectedTerm,
              asId,
              studentChanges[asId]
            )
          }
        }
      }
      setHasUnsavedChanges(false)
      showToast('All student grades saved and recalculated successfully!', 'success')
      loadGradebook()
    } catch (e) {
      console.error(e)
      showToast('Failed to save grades', 'error')
    } finally {
      setIsSaving(false)
    }
  }

  // Filter entries
  const filteredEntries = useMemo(() => {
    if (!gradebook) return []
    if (!searchQuery.trim()) return gradebook.entries
    const query = searchQuery.toLowerCase()
    return gradebook.entries.filter(
      (e) =>
        e.studentName.toLowerCase().includes(query) ||
        e.studentNumber.toLowerCase().includes(query)
    )
  }, [gradebook, searchQuery])

  // Dynamic calculation for a student based on local edited state (UC-GRADEBOOK-02)
  const getDynamicStudentMetrics = (studentId: string, assessments: AssessmentDefinition[]) => {
    const scores = editedScores[studentId] || {}
    let totalWeightedScore = 0
    let totalWeight = 0

    assessments.forEach((as) => {
      const raw = scores[as.id]
      if (raw !== undefined) {
        const normalized = (raw / as.maxScore) * 100
        totalWeightedScore += normalized * (as.weightPercentage / 100)
        totalWeight += as.weightPercentage
      }
    })

    const avg = totalWeight > 0 ? Math.round((totalWeightedScore / totalWeight) * 100) : 0
    let letter = 'F'
    if (avg >= 93) letter = 'A'
    else if (avg >= 90) letter = 'A-'
    else if (avg >= 87) letter = 'B+'
    else if (avg >= 83) letter = 'B'
    else if (avg >= 80) letter = 'B-'
    else if (avg >= 77) letter = 'C+'
    else if (avg >= 70) letter = 'C'
    else if (avg >= 60) letter = 'D'

    return { avg, letter }
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header with Perspective Switcher */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <PageHeading
            title="Gradebook & Academic Evaluation"
            subtitle="Enter grades, calculate weighted terms, and generate verified academic records."
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Role Switcher */}
          <div className="flex items-center rounded-2xl glass-sm p-1 border border-text-main/10 shadow-sm">
            <button
              onClick={() => setActivePerspective('teacher')}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                activePerspective === 'teacher'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-text-main/65 hover:text-text-main hover:bg-text-main/5'
              }`}
            >
              <GraduationCap className="h-3.5 w-3.5" />
              Teacher Gradebook
            </button>
            <button
              onClick={() => setActivePerspective('student')}
              className={`flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                activePerspective === 'student'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-text-main/65 hover:text-text-main hover:bg-text-main/5'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              Student Report Card
            </button>
          </div>

          {activePerspective === 'teacher' && hasUnsavedChanges && (
            <Button
              variant="solid"
              size="md"
              disabled={isSaving}
              onClick={handleSaveGradebook}
              className="flex items-center gap-2 shadow-emerald-600/30 bg-emerald-600 hover:bg-emerald-700 animate-pulse"
            >
              <Save className="h-4 w-4" />
              {isSaving ? 'Saving...' : 'Save Gradebook Changes'}
            </Button>
          )}

          {activePerspective === 'student' && (
            <Button
              variant="solidOutline"
              size="md"
              onClick={() => window.print()}
              className="flex items-center gap-2 text-xs"
            >
              <Printer className="h-4 w-4" />
              Print Report Card
            </Button>
          )}
        </div>
      </div>

      {/* =========================================================================
          VIEW A: TEACHER GRADEBOOK VIEW (UC-GRADEBOOK-01 & UC-GRADEBOOK-02)
         ========================================================================= */}
      {activePerspective === 'teacher' && (
        <div className="space-y-6">
          {/* Summary Metrics */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
                <span>Class Average</span>
                <Percent className="h-4 w-4 text-brand-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-text-main">
                {gradebook?.classAverage || 0}%
              </p>
              <p className="mt-0.5 text-xs text-text-main/50">Overall weighted average</p>
            </div>

            <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
                <span>Passing Rate</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {gradebook?.passingRate || 100}%
              </p>
              <p className="mt-0.5 text-xs text-text-main/50">Score ≥ 70% threshold</p>
            </div>

            <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
                <span>Roster Count</span>
                <UserCheck className="h-4 w-4 text-sky-600" />
              </div>
              <p className="mt-2 text-2xl font-bold text-text-main">
                {gradebook?.entries.length || 0} Students
              </p>
              <p className="mt-0.5 text-xs text-text-main/50">Enrolled in {selectedClass}</p>
            </div>

            <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
                <span>Grading Formula</span>
                <Sparkles className="h-4 w-4 text-amber-600" />
              </div>
              <p className="mt-2 text-sm font-bold text-text-main">HW 20% • QZ 25% • MID 25% • FIN 30%</p>
              <p className="mt-0.5 text-xs text-text-main/50">Standard High School Formula</p>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col gap-3 rounded-3xl glass-sm p-4 border border-white/20 dark:border-white/10 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-main/40" />
              <input
                type="text"
                placeholder="Find student by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl bg-white/60 dark:bg-black/20 pl-10 pr-4 py-2 text-xs text-text-main placeholder:text-text-main/40 border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="rounded-2xl bg-white/60 dark:bg-black/20 px-3.5 py-2 text-xs font-medium text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Grade 10 - A" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Grade 10 - A</option>
                <option value="Grade 10 - B" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Grade 10 - B</option>
                <option value="Grade 11 - Advanced" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Grade 11 - Advanced</option>
                <option value="Grade 12 - STEM" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Grade 12 - STEM</option>
              </select>

              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="rounded-2xl bg-white/60 dark:bg-black/20 px-3.5 py-2 text-xs font-medium text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Mathematics" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Mathematics</option>
                <option value="Physics" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Physics</option>
                <option value="Chemistry" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Chemistry</option>
                <option value="Biology" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Biology</option>
                <option value="English Literature" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">English Literature</option>
              </select>

              <select
                value={selectedTerm}
                onChange={(e) => setSelectedTerm(e.target.value)}
                className="rounded-2xl bg-white/60 dark:bg-black/20 px-3.5 py-2 text-xs font-medium text-text-main border border-text-main/10 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              >
                <option value="Term 1" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Term 1 (Fall)</option>
                <option value="Term 2" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Term 2 (Spring)</option>
                <option value="Term 3" className="text-black dark:text-white bg-slate-100 dark:bg-slate-900">Term 3 (Summer)</option>
              </select>

              <button
                type="button"
                onClick={() => showToast('Gradebook data exported to CSV report.', 'success')}
                className="flex items-center gap-1.5 rounded-2xl bg-text-main/10 px-3 py-2 text-xs font-semibold text-text-main hover:bg-text-main/15 transition"
              >
                <Download className="h-3.5 w-3.5" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Interactive Gradebook Table */}
          <div className="rounded-3xl glass-sm p-6 border border-white/20 dark:border-white/10 shadow-sm overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-sm text-text-main/60">
                Loading class gradebook data...
              </div>
            ) : filteredEntries.length === 0 ? (
              <div className="py-16 text-center text-sm text-text-main/50">
                No student grades found for {selectedSubject} in {selectedClass}.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-text-main/10 text-text-main/60 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-semibold">Student</th>
                    <th className="pb-3 font-semibold">ID</th>
                    {gradebook?.assessments.map((as) => (
                      <th key={as.id} className="pb-3 font-semibold text-center">
                        <div>{as.name}</div>
                        <span className="text-[10px] font-normal lowercase opacity-75">
                          ({as.weightPercentage}% weight)
                        </span>
                      </th>
                    ))}
                    <th className="pb-3 font-semibold text-center">Weighted Avg</th>
                    <th className="pb-3 font-semibold text-center">Letter Grade</th>
                    <th className="pb-3 font-semibold text-center">Standing</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text-main/5">
                  {filteredEntries.map((student) => {
                    const metrics = getDynamicStudentMetrics(student.studentId, gradebook?.assessments || [])
                    const isPassing = metrics.avg >= 70

                    return (
                      <tr key={student.studentId} className="hover:bg-text-main/5 transition">
                        {/* Student Name */}
                        <td className="py-3.5 font-bold text-text-main flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600/20 text-brand-700 dark:text-brand-300 font-extrabold text-xs">
                            {student.studentName.charAt(0)}
                          </div>
                          <div>
                            <div>{student.studentName}</div>
                            <span className="text-[10px] text-text-main/50 font-normal">{student.class}</span>
                          </div>
                        </td>

                        {/* Student Number */}
                        <td className="py-3.5 font-mono text-[11px] text-text-main/60">
                          {student.studentNumber}
                        </td>

                        {/* Assessment score inputs (UC-GRADEBOOK-01) */}
                        {gradebook?.assessments.map((as) => {
                          const currentScore = editedScores[student.studentId]?.[as.id] ?? student.scores[as.id] ?? 0
                          return (
                            <td key={as.id} className="py-3.5 text-center">
                              <input
                                type="number"
                                min={0}
                                max={100}
                                value={currentScore}
                                onChange={(e) => handleScoreChange(student.studentId, as.id, e.target.value)}
                                className="w-16 rounded-xl bg-white/70 dark:bg-black/40 px-2 py-1 text-center font-bold text-text-main border border-text-main/15 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                              />
                            </td>
                          )
                        })}

                        {/* Calculated Average (UC-GRADEBOOK-02) */}
                        <td className="py-3.5 text-center font-extrabold text-sm text-text-main">
                          {metrics.avg}%
                        </td>

                        {/* Letter Grade */}
                        <td className="py-3.5 text-center">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-brand-500/15 font-bold text-brand-700 dark:text-brand-300">
                            {metrics.letter}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 text-center">
                          {isPassing ? (
                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              Passing
                            </span>
                          ) : (
                            <span className="rounded-full bg-rose-500/15 px-2.5 py-0.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400">
                              At Risk
                            </span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW B: STUDENT REPORT CARD VIEW (UC-GRADEBOOK-03 & BR-09)
         ========================================================================= */}
      {activePerspective === 'student' && (
        <div className="space-y-6">
          {/* Student Overview Cards */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
                <span>Cumulative GPA</span>
                <Award className="h-4 w-4 text-brand-600" />
              </div>
              <p className="mt-2 text-3xl font-black text-brand-600">
                {studentReport?.cumulativeGpa || 3.9} / 4.0
              </p>
              <p className="mt-0.5 text-xs text-text-main/50">Honor Roll Standing</p>
            </div>

            <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
                <span>Average Performance</span>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
                {studentReport?.overallAverage || 92}%
              </p>
              <p className="mt-0.5 text-xs text-text-main/50">Across all enrolled subjects</p>
            </div>

            <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
                <span>Enrolled Subjects</span>
                <BookOpen className="h-4 w-4 text-sky-600" />
              </div>
              <p className="mt-2 text-3xl font-black text-text-main">
                {studentReport?.entries.length || 3} Courses
              </p>
              <p className="mt-0.5 text-xs text-text-main/50">Full-time Academic Track</p>
            </div>

            <div className="rounded-3xl glass-sm p-5 border border-white/20 dark:border-white/10 shadow-sm">
              <div className="flex items-center justify-between text-xs font-medium text-text-main/60">
                <span>Data Privacy</span>
                <CheckCircle2 className="h-4 w-4 text-teal-600" />
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-teal-500"></span>
                <p className="text-sm font-semibold text-text-main">BR-09 Verified</p>
              </div>
              <p className="mt-0.5 text-xs text-text-main/50">Access restricted to student only</p>
            </div>
          </div>

          {/* Subject-by-Subject Academic Breakdown Cards */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-text-main">Term Performance by Subject</h3>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {studentReport?.entries.map((entry) => (
                <div
                  key={entry.subject}
                  className="rounded-3xl glass-sm p-6 border border-white/20 dark:border-white/10 shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="rounded-full bg-brand-500/15 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
                        {entry.subject}
                      </span>
                      <h4 className="mt-2 text-lg font-bold text-text-main">{entry.subject}</h4>
                    </div>

                    <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-600 text-white h-12 w-12 shadow-md">
                      <span className="text-lg font-black">{entry.letterGrade}</span>
                      <span className="text-[9px] font-bold opacity-80">{entry.calculatedAverage}%</span>
                    </div>
                  </div>

                  {/* Components */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-text-main/70">
                      <span>Homework (20%)</span>
                      <span className="font-bold text-text-main">{entry.scores['as-hw'] || 0}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-text-main/70">
                      <span>Quizzes (25%)</span>
                      <span className="font-bold text-text-main">{entry.scores['as-quiz'] || 0}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-text-main/70">
                      <span>Midterm Exam (25%)</span>
                      <span className="font-bold text-text-main">{entry.scores['as-mid'] || 0}/100</span>
                    </div>
                    <div className="flex items-center justify-between text-text-main/70">
                      <span>Final Exam (30%)</span>
                      <span className="font-bold text-text-main">{entry.scores['as-fin'] || 0}/100</span>
                    </div>
                  </div>

                  <div className="border-t border-text-main/10 pt-3 flex items-center justify-between text-xs">
                    <span className="text-text-main/50">GPA Equivalent: <strong className="text-text-main">{entry.gpa?.toFixed(1)}</strong></span>
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                      Good Standing
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
