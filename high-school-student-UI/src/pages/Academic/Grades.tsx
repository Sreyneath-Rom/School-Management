import { useState, useEffect } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  GraduationCap,
  Award,
  BookOpen,
  Search,
  Save,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Printer,
  Sparkles,
  BarChart2,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { academicService, calculateWeightedGrade } from '@/services/academicService'
import type { GradeRecord, StudentProgress } from '@/types/academic'
import { useToast } from '@/components/common/ToastProvider'

export default function GradesPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const isTeacherOrAdmin = user?.role === 'teacher' || user?.role === 'admin'
  const isStudent = user?.role === 'student'

  const currentStudentId = user?.id || '3'

  // Teacher / Admin selectors
  const [selectedClass, setSelectedClass] = useState<string>('Grade 10-A')
  const [selectedSubject, setSelectedSubject] = useState<string>('Mathematics')
  const [activeTab, setActiveTab] = useState<'grades' | 'progress'>('grades')

  // Grades table data
  const [gradeRecords, setGradeRecords] = useState<GradeRecord[]>([])
  const [studentRecords, setStudentRecords] = useState<GradeRecord[]>([])
  const [progressList, setProgressList] = useState<StudentProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const loadData = async () => {
    try {
      setLoading(true)
      if (isStudent) {
        const myGrades = await academicService.getStudentGrades(currentStudentId)
        setStudentRecords(myGrades)
      } else {
        const [allGrades, progress] = await Promise.all([
          academicService.getGrades(selectedClass, selectedSubject),
          academicService.getStudentProgress(selectedClass),
        ])
        setGradeRecords(allGrades)
        setProgressList(progress)
      }
    } catch {
      showToast('Failed to load academic grades', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [selectedClass, selectedSubject, isStudent])

  // Live input update for teacher table
  const handleScoreChange = (
    recordId: string,
    field: 'assignmentScore' | 'quizScore' | 'midtermScore' | 'finalScore',
    value: number
  ) => {
    const clamped = Math.max(0, Math.min(100, isNaN(value) ? 0 : value))
    setGradeRecords((prev) =>
      prev.map((rec) => {
        if (rec.id !== recordId) return rec
        const updated = { ...rec, [field]: clamped }
        const { totalScore, letterGrade, gpa } = calculateWeightedGrade(
          updated.assignmentScore,
          updated.quizScore,
          updated.midtermScore,
          updated.finalScore
        )
        return {
          ...updated,
          totalWeightedScore: totalScore,
          letterGrade,
          gpa,
        }
      })
    )
  }

  const handleRemarkChange = (recordId: string, remarks: string) => {
    setGradeRecords((prev) =>
      prev.map((rec) => (rec.id === recordId ? { ...rec, remarks } : rec))
    )
  }

  const handleSaveAllGrades = async () => {
    try {
      await academicService.saveBatchGrades(gradeRecords)
      showToast('All grades successfully saved and published!', 'success')
      loadData()
    } catch {
      showToast('Error saving grade updates', 'error')
    }
  }

  // Calculate Student GPA & Statistics
  const studentTotalWeightedSum = studentRecords.reduce((sum, r) => sum + r.totalWeightedScore, 0)
  const studentAverageScore = studentRecords.length > 0 ? (studentTotalWeightedSum / studentRecords.length).toFixed(1) : '0.0'
  const studentCumulativeGpa =
    studentRecords.length > 0
      ? (studentRecords.reduce((sum, r) => sum + r.gpa, 0) / studentRecords.length).toFixed(2)
      : '0.00'

  // Teacher Class Statistics
  const classAvg =
    gradeRecords.length > 0
      ? (gradeRecords.reduce((sum, r) => sum + r.totalWeightedScore, 0) / gradeRecords.length).toFixed(1)
      : '0.0'
  const countA = gradeRecords.filter((r) => r.letterGrade === 'A').length
  const countB = gradeRecords.filter((r) => r.letterGrade === 'B').length
  const countC = gradeRecords.filter((r) => r.letterGrade === 'C').length
  const countDF = gradeRecords.filter((r) => r.letterGrade === 'D' || r.letterGrade === 'F').length

  const filteredTeacherRecords = gradeRecords.filter((r) => {
    if (!search.trim()) return true
    const term = search.toLowerCase()
    return r.studentName.toLowerCase().includes(term) || r.studentCode.toLowerCase().includes(term)
  })

  return (
    <div id="grades-page-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title={isStudent ? 'My Academic Grade Report' : 'Grades & Academic Evaluations'}
          subtitle={
            isStudent
              ? 'View official weighted grades, GPA calculation, assessment breakdowns, and teacher remarks.'
              : 'Enter marks, manage evaluation formulas (20% Assignments, 20% Quizzes, 25% Midterm, 35% Final), and monitor student progress.'
          }
        />

        <div className="flex items-center gap-2">
          {isTeacherOrAdmin && (
            <button
              id="save-grades-btn"
              onClick={handleSaveAllGrades}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium text-sm shadow-sm transition"
            >
              <Save className="w-4 h-4" />
              Save All Grades
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-medium hover:bg-slate-50 transition"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Weighting Formula Banner */}
      <div className="glass-sm rounded-2xl p-4 border border-brand-200/70 dark:border-brand-900/60 bg-brand-50/40 dark:bg-brand-950/20 flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-brand-900 dark:text-brand-200">
          <Sparkles className="w-4 h-4 text-brand-600 shrink-0" />
          <span className="font-semibold">Standard High School Assessment Weighting:</span>
          <span>Assignment (20%) + Quiz (20%) + Midterm (25%) + Final (35%) = 100%</span>
        </div>

        <div className="flex items-center gap-3 font-medium text-slate-600 dark:text-slate-300">
          <span>A: 90-100% (4.0)</span>
          <span>B: 80-89% (3.0)</span>
          <span>C: 70-79% (2.0)</span>
          <span>D: 60-69% (1.0)</span>
          <span>F: &lt;60% (0.0)</span>
        </div>
      </div>

      {/* ==================================================== */}
      {/* STUDENT VIEW                                         */}
      {/* ==================================================== */}
      {isStudent ? (
        <div className="space-y-6">
          {/* Student Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Cumulative GPA</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {studentCumulativeGpa} <span className="text-sm font-normal text-slate-400">/ 4.00</span>
              </div>
              <span className="inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                Academic Honor Roll
              </span>
            </div>

            <div className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Overall Weighted Average</span>
                <TrendingUp className="w-4 h-4 text-brand-500" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {studentAverageScore}%
              </div>
              <span className="text-xs text-slate-400 mt-2 block">
                Across {studentRecords.length} enrolled subjects
              </span>
            </div>

            <div className="glass-sm rounded-2xl p-5 border border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center justify-between text-slate-500 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider">Attendance Standing</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                96.5%
              </div>
              <span className="text-xs text-slate-400 mt-2 block">
                Class Grade 10-A • 0 Unexcused Absences
              </span>
            </div>
          </div>

          {/* Student Subject Grades Table */}
          <div className="glass-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
              <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-brand-600" />
                Semester Grade Breakdown
              </h3>
              <span className="text-xs text-slate-400">Term 1 (2026-2027)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/80 dark:border-slate-700/80">
                  <tr>
                    <th className="py-3.5 px-4">Subject</th>
                    <th className="py-3.5 px-4 text-center">Assignment (20%)</th>
                    <th className="py-3.5 px-4 text-center">Quiz (20%)</th>
                    <th className="py-3.5 px-4 text-center">Midterm (25%)</th>
                    <th className="py-3.5 px-4 text-center">Final (35%)</th>
                    <th className="py-3.5 px-4 text-center">Total Score</th>
                    <th className="py-3.5 px-4 text-center">Letter Grade</th>
                    <th className="py-3.5 px-4 text-center">GPA</th>
                    <th className="py-3.5 px-4">Instructor Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                  {studentRecords.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                      <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {r.subjectName}
                      </td>
                      <td className="py-3.5 px-4 text-center">{r.assignmentScore}%</td>
                      <td className="py-3.5 px-4 text-center">{r.quizScore}%</td>
                      <td className="py-3.5 px-4 text-center">{r.midtermScore}%</td>
                      <td className="py-3.5 px-4 text-center">{r.finalScore}%</td>
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-slate-100">
                        {r.totalWeightedScore}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                            r.letterGrade === 'A'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                              : r.letterGrade === 'B'
                              ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                          }`}
                        >
                          {r.letterGrade}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-800 dark:text-slate-200">
                        {r.gpa.toFixed(1)}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 italic max-w-xs truncate">
                        {r.remarks || 'Consistent academic performance.'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ==================================================== */
        /* TEACHER / ADMIN VIEW                                 */
        /* ==================================================== */
        <div className="space-y-6">
          {/* Navigation Tabs (Grade Entry vs Student Progress) */}
          <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('grades')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'grades'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Grade Roster Entry
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                activeTab === 'progress'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Student Progress Analytics
            </button>
          </div>

          {activeTab === 'grades' ? (
            <>
              {/* Class Summary KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Class Average</span>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {classAvg}%
                  </div>
                  <span className="text-[11px] text-slate-400">{selectedClass} • {selectedSubject}</span>
                </div>

                <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Grade 'A' Students</span>
                  <div className="text-2xl font-bold text-emerald-600 mt-1">{countA}</div>
                  <span className="text-[11px] text-slate-400">90% - 100% threshold</span>
                </div>

                <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Grade 'B' Students</span>
                  <div className="text-2xl font-bold text-sky-600 mt-1">{countB}</div>
                  <span className="text-[11px] text-slate-400">80% - 89% threshold</span>
                </div>

                <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
                  <span className="text-xs text-slate-500 block">Needs Support (C/D/F)</span>
                  <div className="text-2xl font-bold text-amber-600 mt-1">{countC + countDF}</div>
                  <span className="text-[11px] text-slate-400">&lt; 80% threshold</span>
                </div>
              </div>

              {/* Class & Subject Selector */}
              <div className="glass-sm rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
                <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <Layers className="w-4 h-4 text-brand-600" />
                    Class:
                  </div>
                  <select
                    id="grade-class-selector"
                    value={selectedClass}
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  >
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 10-B">Grade 10-B</option>
                    <option value="Grade 11-A">Grade 11-A</option>
                  </select>

                  <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 ml-2">
                    <BookOpen className="w-4 h-4 text-brand-600" />
                    Subject:
                  </div>
                  <select
                    id="grade-subject-selector"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Physics">Physics</option>
                    <option value="English Literature">English Literature</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                </div>

                <div className="relative w-full md:w-64">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search student name or ID..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/60"
                  />
                </div>
              </div>

              {/* Editable Grade Matrix Table */}
              <div className="glass-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                      Roster Grade Entries ({filteredTeacherRecords.length} Students)
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Type scores (0 - 100). Total weighted score and letter grade recalculate in real-time.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/80 dark:border-slate-700/80">
                      <tr>
                        <th className="py-3 px-4">Student</th>
                        <th className="py-3 px-3 text-center w-28">Assignment (20%)</th>
                        <th className="py-3 px-3 text-center w-28">Quiz (20%)</th>
                        <th className="py-3 px-3 text-center w-28">Midterm (25%)</th>
                        <th className="py-3 px-3 text-center w-28">Final (35%)</th>
                        <th className="py-3 px-4 text-center">Total (100%)</th>
                        <th className="py-3 px-4 text-center">Letter</th>
                        <th className="py-3 px-4 text-center">GPA</th>
                        <th className="py-3 px-4">Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                      {filteredTeacherRecords.map((rec) => (
                        <tr key={rec.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 dark:text-slate-100">
                              {rec.studentName}
                            </div>
                            <div className="text-[11px] text-slate-400">{rec.studentCode}</div>
                          </td>

                          {/* Assignment Input */}
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={rec.assignmentScore}
                              onChange={(e) =>
                                handleScoreChange(rec.id, 'assignmentScore', Number(e.target.value))
                              }
                              className="w-16 px-2 py-1.5 text-center text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-brand-500"
                            />
                          </td>

                          {/* Quiz Input */}
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={rec.quizScore}
                              onChange={(e) =>
                                handleScoreChange(rec.id, 'quizScore', Number(e.target.value))
                              }
                              className="w-16 px-2 py-1.5 text-center text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-brand-500"
                            />
                          </td>

                          {/* Midterm Input */}
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={rec.midtermScore}
                              onChange={(e) =>
                                handleScoreChange(rec.id, 'midtermScore', Number(e.target.value))
                              }
                              className="w-16 px-2 py-1.5 text-center text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-brand-500"
                            />
                          </td>

                          {/* Final Input */}
                          <td className="py-2.5 px-3 text-center">
                            <input
                              type="number"
                              min={0}
                              max={100}
                              value={rec.finalScore}
                              onChange={(e) =>
                                handleScoreChange(rec.id, 'finalScore', Number(e.target.value))
                              }
                              className="w-16 px-2 py-1.5 text-center text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-1 focus:ring-brand-500"
                            />
                          </td>

                          {/* Computed Total Score */}
                          <td className="py-3 px-4 text-center font-bold text-slate-900 dark:text-slate-100">
                            {rec.totalWeightedScore}%
                          </td>

                          {/* Computed Letter Grade */}
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-xs ${
                                rec.letterGrade === 'A'
                                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                  : rec.letterGrade === 'B'
                                  ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                                  : rec.letterGrade === 'C'
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                                  : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                              }`}
                            >
                              {rec.letterGrade}
                            </span>
                          </td>

                          {/* Computed GPA */}
                          <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                            {rec.gpa.toFixed(1)}
                          </td>

                          {/* Remarks */}
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              placeholder="Add notes..."
                              value={rec.remarks || ''}
                              onChange={(e) => handleRemarkChange(rec.id, e.target.value)}
                              className="w-full px-2.5 py-1 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            /* Student Progress Tab (UC-PROGRESS-01) */
            <div className="glass-sm rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-brand-600" />
                    Student Holistic Academic Progress ({selectedClass})
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Aggregating attendance, homework completion rate, and examination performance.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-[11px] font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200/80 dark:border-slate-700/80">
                    <tr>
                      <th className="py-3 px-4">Student</th>
                      <th className="py-3 px-4 text-center">Attendance</th>
                      <th className="py-3 px-4 text-center">Homework Completion</th>
                      <th className="py-3 px-4 text-center">Assignment Avg</th>
                      <th className="py-3 px-4 text-center">Quiz Avg</th>
                      <th className="py-3 px-4 text-center">Midterm Avg</th>
                      <th className="py-3 px-4 text-center">Final Avg</th>
                      <th className="py-3 px-4 text-center">Overall GPA</th>
                      <th className="py-3 px-4 text-center">Academic Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {progressList.map((prog) => (
                      <tr key={prog.studentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {prog.studentName}
                          </div>
                          <div className="text-[11px] text-slate-400">{prog.studentCode}</div>
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium">
                          {prog.attendanceRate}%
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium">
                          {prog.homeworkCompletionRate}%
                        </td>
                        <td className="py-3.5 px-4 text-center">{prog.assignmentAverage}%</td>
                        <td className="py-3.5 px-4 text-center">{prog.quizAverage}%</td>
                        <td className="py-3.5 px-4 text-center">{prog.midtermAverage}%</td>
                        <td className="py-3.5 px-4 text-center">{prog.finalAverage}%</td>
                        <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-slate-100">
                          {prog.overallGpa.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                              prog.academicTrend === 'improving'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                                : prog.academicTrend === 'stable'
                                ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                                : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                            }`}
                          >
                            {prog.academicTrend === 'improving' && <TrendingUp className="w-3 h-3" />}
                            {prog.academicTrend === 'needs_support' && <AlertTriangle className="w-3 h-3" />}
                            {prog.academicTrend === 'improving'
                              ? 'Excelling'
                              : prog.academicTrend === 'stable'
                              ? 'Steady'
                              : 'Needs Support'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
