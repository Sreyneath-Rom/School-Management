import { useState, useMemo } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  LineChart as LineChartIcon,
  Filter,
  Download,
  Printer,
  Search,
  Award,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Users,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'

interface ReportStudentGrade {
  id: string
  studentId: string
  name: string
  class: string
  gradeLevel: string
  assignmentScore: number // 20%
  quizScore: number // 20%
  midtermScore: number // 25%
  finalExamScore: number // 35%
  totalScore: number
  letterGrade: string
  gpa: number
  status: 'Honor Roll' | 'Dean\'s List' | 'Good Standing' | 'Academic Warning'
}

const SAMPLE_STUDENTS: ReportStudentGrade[] = [
  {
    id: '1',
    studentId: 'STU-1001',
    name: 'Emily Watson',
    class: 'Grade 10-A',
    gradeLevel: 'Grade 10',
    assignmentScore: 94,
    quizScore: 92,
    midtermScore: 95,
    finalExamScore: 96,
    totalScore: 94.5,
    letterGrade: 'A',
    gpa: 4.0,
    status: 'Honor Roll',
  },
  {
    id: '2',
    studentId: 'STU-1002',
    name: 'Michael Chen',
    class: 'Grade 10-A',
    gradeLevel: 'Grade 10',
    assignmentScore: 88,
    quizScore: 85,
    midtermScore: 90,
    finalExamScore: 89,
    totalScore: 88.3,
    letterGrade: 'B+',
    gpa: 3.5,
    status: 'Dean\'s List',
  },
  {
    id: '3',
    studentId: 'STU-1003',
    name: 'Sophia Rodriguez',
    class: 'Grade 10-A',
    gradeLevel: 'Grade 10',
    assignmentScore: 98,
    quizScore: 95,
    midtermScore: 97,
    finalExamScore: 98,
    totalScore: 97.2,
    letterGrade: 'A+',
    gpa: 4.0,
    status: 'Honor Roll',
  },
  {
    id: '4',
    studentId: 'STU-1004',
    name: 'James Wilson',
    class: 'Grade 10-B',
    gradeLevel: 'Grade 10',
    assignmentScore: 78,
    quizScore: 74,
    midtermScore: 80,
    finalExamScore: 76,
    totalScore: 77.0,
    letterGrade: 'C+',
    gpa: 2.5,
    status: 'Good Standing',
  },
  {
    id: '5',
    studentId: 'STU-1005',
    name: 'Olivia Martinez',
    class: 'Grade 10-B',
    gradeLevel: 'Grade 10',
    assignmentScore: 85,
    quizScore: 82,
    midtermScore: 88,
    finalExamScore: 86,
    totalScore: 85.5,
    letterGrade: 'B',
    gpa: 3.0,
    status: 'Good Standing',
  },
  {
    id: '6',
    studentId: 'STU-1006',
    name: 'Ethan Brown',
    class: 'Grade 11-A',
    gradeLevel: 'Grade 11',
    assignmentScore: 92,
    quizScore: 90,
    midtermScore: 94,
    finalExamScore: 91,
    totalScore: 91.8,
    letterGrade: 'A',
    gpa: 3.8,
    status: 'Honor Roll',
  },
  {
    id: '7',
    studentId: 'STU-1007',
    name: 'Ava Taylor',
    class: 'Grade 11-A',
    gradeLevel: 'Grade 11',
    assignmentScore: 65,
    quizScore: 58,
    midtermScore: 62,
    finalExamScore: 64,
    totalScore: 62.5,
    letterGrade: 'D',
    gpa: 1.5,
    status: 'Academic Warning',
  },
  {
    id: '8',
    studentId: 'STU-1008',
    name: 'Lucas Garcia',
    class: 'Grade 12-A',
    gradeLevel: 'Grade 12',
    assignmentScore: 96,
    quizScore: 94,
    midtermScore: 96,
    finalExamScore: 98,
    totalScore: 96.3,
    letterGrade: 'A+',
    gpa: 4.0,
    status: 'Honor Roll',
  },
]

export default function GradeReport() {
  const { showToast } = useToast()

  // Filter States (UC-REPORT-01: academic year, term, class, student)
  const [academicYear, setAcademicYear] = useState('2025 - 2026')
  const [term, setTerm] = useState('Semester 1')
  const [gradeLevel, setGradeLevel] = useState('All')
  const [selectedClass, setSelectedClass] = useState('All')
  const [selectedSubject, setSelectedSubject] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Filtered dataset
  const filteredStudents = useMemo(() => {
    return SAMPLE_STUDENTS.filter((s) => {
      const matchGrade = gradeLevel === 'All' || s.gradeLevel === gradeLevel
      const matchClass = selectedClass === 'All' || s.class === selectedClass
      const matchSearch =
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentId.toLowerCase().includes(searchQuery.toLowerCase())
      return matchGrade && matchClass && matchSearch
    })
  }, [gradeLevel, selectedClass, searchQuery])

  // Calculated Statistics
  const totalStudents = filteredStudents.length
  const avgGpa = totalStudents
    ? (filteredStudents.reduce((acc, s) => acc + s.gpa, 0) / totalStudents).toFixed(2)
    : '0.00'
  const avgTotalScore = totalStudents
    ? (filteredStudents.reduce((acc, s) => acc + s.totalScore, 0) / totalStudents).toFixed(1)
    : '0.0'
  const passCount = filteredStudents.filter((s) => s.totalScore >= 60).length
  const passRate = totalStudents ? Math.round((passCount / totalStudents) * 100) : 100

  // Grade Brackets count
  const gradeBrackets = {
    A: filteredStudents.filter((s) => s.letterGrade.startsWith('A')).length,
    B: filteredStudents.filter((s) => s.letterGrade.startsWith('B')).length,
    C: filteredStudents.filter((s) => s.letterGrade.startsWith('C')).length,
    D: filteredStudents.filter((s) => s.letterGrade.startsWith('D')).length,
    F: filteredStudents.filter((s) => s.letterGrade.startsWith('F')).length,
  }

  const handleExportCSV = () => {
    const headers = ['Student ID', 'Full Name', 'Class', 'Assignments (20%)', 'Quizzes (20%)', 'Midterm (25%)', 'Final (35%)', 'Total Score', 'Letter Grade', 'GPA', 'Academic Standing']
    const rows = filteredStudents.map((s) => [
      s.studentId,
      `"${s.name}"`,
      s.class,
      s.assignmentScore,
      s.quizScore,
      s.midtermScore,
      s.finalExamScore,
      s.totalScore,
      s.letterGrade,
      s.gpa,
      s.status,
    ])

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `Academic_Report_${academicYear.replace(/\s+/g, '_')}_${term.replace(/\s+/g, '_')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    showToast('Academic report exported to CSV successfully', 'success')
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-6 pb-12 print:p-0 print:m-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <PageHeading
          title="Academic Performance Report"
          subtitle="Comprehensive institutional academic report cross-referencing GPAs, grade distributions, and weighted evaluation components (UC-REPORT-01)."
        />
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 transition shadow-2xs"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium shadow-xs transition"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Parameters Ribbon */}
      <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
          <Filter className="w-4 h-4 text-brand-600" />
          <span>Report Scope & Filters</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Academic Year</label>
            <select
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="2025 - 2026">2025 - 2026</option>
              <option value="2024 - 2025">2024 - 2025</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Academic Term</label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="Semester 1">Semester 1</option>
              <option value="Semester 2">Semester 2</option>
              <option value="Annual Cumulative">Annual Cumulative</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Grade Level</label>
            <select
              value={gradeLevel}
              onChange={(e) => {
                setGradeLevel(e.target.value)
                setSelectedClass('All')
              }}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="All">All Grade Levels</option>
              <option value="Grade 10">Grade 10 (Sophomore)</option>
              <option value="Grade 11">Grade 11 (Junior)</option>
              <option value="Grade 12">Grade 12 (Senior)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Class Section</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="All">All Classes</option>
              <option value="Grade 10-A">Grade 10-A</option>
              <option value="Grade 10-B">Grade 10-B</option>
              <option value="Grade 11-A">Grade 11-A</option>
              <option value="Grade 12-A">Grade 12-A</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            >
              <option value="All">All Subjects (Overall GPA)</option>
              <option value="Biology">Advanced Biology</option>
              <option value="Calculus">Calculus BC</option>
              <option value="History">Modern World History</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Average Cumulative GPA</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avgGpa}</span>
            <span className="text-xs text-slate-400 font-medium">/ 4.0 Scale</span>
          </div>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">Standard Weighted Evaluation</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Average Total Score</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{avgTotalScore}%</span>
            <span className="text-xs text-emerald-600 font-medium">Grade B+</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Assignments + Quizzes + Exams</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Institutional Pass Rate</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{passRate}%</span>
            <span className="text-xs text-slate-400 font-medium">({passCount}/{totalStudents})</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Passing threshold: &ge; 60%</p>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Honor Roll Candidates</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-violet-600 dark:text-violet-400">
              {filteredStudents.filter((s) => s.status === 'Honor Roll').length}
            </span>
            <span className="text-xs text-slate-400 font-medium">Students</span>
          </div>
          <p className="text-[11px] text-violet-600 font-medium mt-1">GPA &ge; 3.8 Distinction</p>
        </div>
      </div>

      {/* Grade Bracket Distribution & Weighted Engine Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Grade Distribution Bar */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Grade Distribution Brackets
            </h3>
            <span className="text-xs text-slate-400">Total: {totalStudents} Enrolled</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Grade A (90 - 100%)', count: gradeBrackets.A, color: 'bg-emerald-500', barColor: 'bg-emerald-500' },
              { label: 'Grade B (80 - 89%)', count: gradeBrackets.B, color: 'bg-blue-500', barColor: 'bg-blue-500' },
              { label: 'Grade C (70 - 79%)', count: gradeBrackets.C, color: 'bg-amber-500', barColor: 'bg-amber-500' },
              { label: 'Grade D (60 - 69%)', count: gradeBrackets.D, color: 'bg-orange-500', barColor: 'bg-orange-500' },
              { label: 'Grade F (< 60%)', count: gradeBrackets.F, color: 'bg-rose-500', barColor: 'bg-rose-500' },
            ].map((br) => {
              const pct = totalStudents ? Math.round((br.count / totalStudents) * 100) : 0
              return (
                <div key={br.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-slate-600 dark:text-slate-300">{br.label}</span>
                    <span className="text-slate-500">{br.count} students ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className={`h-full ${br.barColor} transition-all duration-300`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weighted Formula Summary Card */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-600" />
            Evaluation Weights
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            High school standardized grading weights applied across active semesters (BR-11):
          </p>

          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Homework & Assignments</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">20%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Quizzes & Unit Checks</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">20%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Midterm Examination</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">25%</span>
            </div>
            <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className="font-medium text-slate-700 dark:text-slate-300">Final Term Examination</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">35%</span>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-xs font-bold text-brand-600">
            <span>Cumulative Total</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* Student Academic Roster Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Student Academic Roster
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              {filteredStudents.length} Records
            </span>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search student or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                <th className="py-3 px-4 font-semibold">Student</th>
                <th className="py-3 px-3 font-semibold">Class</th>
                <th className="py-3 px-3 font-semibold text-center">HW (20%)</th>
                <th className="py-3 px-3 font-semibold text-center">Quiz (20%)</th>
                <th className="py-3 px-3 font-semibold text-center">Midterm (25%)</th>
                <th className="py-3 px-3 font-semibold text-center">Final (35%)</th>
                <th className="py-3 px-3 font-semibold text-center">Total Score</th>
                <th className="py-3 px-3 font-semibold text-center">Grade</th>
                <th className="py-3 px-3 font-semibold text-center">GPA</th>
                <th className="py-3 px-4 font-semibold">Academic Standing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                    <div>{s.name}</div>
                    <span className="text-[10px] text-slate-400 font-mono">{s.studentId}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{s.class}</td>
                  <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">{s.assignmentScore}</td>
                  <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">{s.quizScore}</td>
                  <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">{s.midtermScore}</td>
                  <td className="py-3 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">{s.finalExamScore}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {s.totalScore}%
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[11px] bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300">
                      {s.letterGrade}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-slate-100 font-mono">
                    {s.gpa.toFixed(1)}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        s.status === 'Honor Roll'
                          ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                          : s.status === 'Dean\'s List'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : s.status === 'Academic Warning'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
