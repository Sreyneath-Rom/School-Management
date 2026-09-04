import { useState, useMemo } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  UserCheck,
  Search,
  Download,
  Printer,
  GraduationCap,
  Award,
  BookOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'

interface SubjectGrade {
  code: string
  name: string
  teacher: string
  homeworkAvg: number
  quizAvg: number
  midterm: number
  finalExam: number
  overallPercent: number
  letterGrade: string
  credits: number
  remarks: string
}

interface StudentDossier {
  id: string
  studentCode: string
  firstName: string
  lastName: string
  email: string
  gender: string
  dob: string
  className: string
  gradeLevel: string
  academicYear: string
  term: string
  advisor: string
  parentName: string
  parentPhone: string
  parentEmail: string
  gpa: number
  classRank: number
  totalInClass: number
  attendanceRate: number
  daysPresent: number
  daysAbsent: number
  daysLate: number
  daysExcused: number
  conduct: 'Exceptional' | 'Good' | 'Satisfactory' | 'Needs Improvement'
  activities: string[]
  achievements: string[]
  grades: SubjectGrade[]
}

const MOCK_STUDENTS: StudentDossier[] = [
  {
    id: 's1',
    studentCode: 'STU-1001',
    firstName: 'Emily',
    lastName: 'Watson',
    email: 'emily.watson@student.school.edu',
    gender: 'Female',
    dob: '2008-04-12',
    className: 'Grade 10-A',
    gradeLevel: 'Grade 10',
    academicYear: '2024-2025',
    term: 'Semester 1',
    advisor: 'Dr. Sarah Jenkins',
    parentName: 'Arthur & Eleanor Watson',
    parentPhone: '+1 (555) 234-5678',
    parentEmail: 'a.watson@example.com',
    gpa: 3.92,
    classRank: 2,
    totalInClass: 32,
    attendanceRate: 98.4,
    daysPresent: 62,
    daysAbsent: 0,
    daysLate: 1,
    daysExcused: 1,
    conduct: 'Exceptional',
    activities: ['Debate Society Vice-President', 'Varsity Volleyball', 'STEM Robotics Club'],
    achievements: ['Regional Math Olympiad - 1st Runner Up', 'Principal’s Honor Roll (Q1 & Q2)'],
    grades: [
      {
        code: 'MATH-101',
        name: 'Advanced Mathematics',
        teacher: 'Dr. Sarah Jenkins',
        homeworkAvg: 96,
        quizAvg: 94,
        midterm: 98,
        finalExam: 95,
        overallPercent: 95.8,
        letterGrade: 'A',
        credits: 4,
        remarks: 'Outstanding logical reasoning and consistent homework excellence.',
      },
      {
        code: 'PHYS-102',
        name: 'Physics & Mechanics',
        teacher: 'Prof. David Vance',
        homeworkAvg: 92,
        quizAvg: 90,
        midterm: 94,
        finalExam: 93,
        overallPercent: 92.4,
        letterGrade: 'A',
        credits: 4,
        remarks: 'Active lab contributor; exemplary analytical report writing.',
      },
      {
        code: 'ENG-103',
        name: 'English Literature',
        teacher: 'Ms. Clara Thorne',
        homeworkAvg: 94,
        quizAvg: 88,
        midterm: 91,
        finalExam: 92,
        overallPercent: 91.5,
        letterGrade: 'A-',
        credits: 3,
        remarks: 'Deep critical comprehension of classic literature and clear essays.',
      },
      {
        code: 'CHEM-104',
        name: 'Inorganic Chemistry',
        teacher: 'Dr. Alan Ross',
        homeworkAvg: 90,
        quizAvg: 89,
        midterm: 92,
        finalExam: 88,
        overallPercent: 89.6,
        letterGrade: 'B+',
        credits: 4,
        remarks: 'Diligent student. Demonstrates high safety and precision in practical lab work.',
      },
      {
        code: 'CS-105',
        name: 'Computer Science & Python',
        teacher: 'Mr. Michael Chen',
        homeworkAvg: 99,
        quizAvg: 98,
        midterm: 100,
        finalExam: 98,
        overallPercent: 98.6,
        letterGrade: 'A+',
        credits: 3,
        remarks: 'Flawless algorithmic design and creative program solutions.',
      },
    ],
  },
  {
    id: 's2',
    studentCode: 'STU-1002',
    firstName: 'Alex',
    lastName: 'Rivera',
    email: 'alex.rivera@student.school.edu',
    gender: 'Male',
    dob: '2008-09-21',
    className: 'Grade 10-A',
    gradeLevel: 'Grade 10',
    academicYear: '2024-2025',
    term: 'Semester 1',
    advisor: 'Dr. Sarah Jenkins',
    parentName: 'Carlos Rivera',
    parentPhone: '+1 (555) 345-6789',
    parentEmail: 'c.rivera@example.com',
    gpa: 3.54,
    classRank: 9,
    totalInClass: 32,
    attendanceRate: 94.2,
    daysPresent: 59,
    daysAbsent: 2,
    daysLate: 3,
    daysExcused: 1,
    conduct: 'Good',
    activities: ['School Marching Band (Percussion)', 'Eco-Warriors Club'],
    achievements: ['Science Fair Silver Award 2024'],
    grades: [
      {
        code: 'MATH-101',
        name: 'Advanced Mathematics',
        teacher: 'Dr. Sarah Jenkins',
        homeworkAvg: 85,
        quizAvg: 82,
        midterm: 84,
        finalExam: 86,
        overallPercent: 84.5,
        letterGrade: 'B',
        credits: 4,
        remarks: 'Solid improvement in trigonometric proofs; keep maintaining focus.',
      },
      {
        code: 'PHYS-102',
        name: 'Physics & Mechanics',
        teacher: 'Prof. David Vance',
        homeworkAvg: 88,
        quizAvg: 86,
        midterm: 89,
        finalExam: 90,
        overallPercent: 88.2,
        letterGrade: 'B+',
        credits: 4,
        remarks: 'Strong intuition for physical mechanics and kinematics.',
      },
      {
        code: 'ENG-103',
        name: 'English Literature',
        teacher: 'Ms. Clara Thorne',
        homeworkAvg: 89,
        quizAvg: 84,
        midterm: 87,
        finalExam: 85,
        overallPercent: 86.4,
        letterGrade: 'B',
        credits: 3,
        remarks: 'Thoughtful contributions in seminar discussions.',
      },
      {
        code: 'CHEM-104',
        name: 'Inorganic Chemistry',
        teacher: 'Dr. Alan Ross',
        homeworkAvg: 82,
        quizAvg: 80,
        midterm: 81,
        finalExam: 83,
        overallPercent: 81.6,
        letterGrade: 'B-',
        credits: 4,
        remarks: 'Regular study schedule recommended for organic nomenclature.',
      },
      {
        code: 'CS-105',
        name: 'Computer Science & Python',
        teacher: 'Mr. Michael Chen',
        homeworkAvg: 95,
        quizAvg: 92,
        midterm: 94,
        finalExam: 93,
        overallPercent: 93.6,
        letterGrade: 'A',
        credits: 3,
        remarks: 'Talented problem solver in Python data structures.',
      },
    ],
  },
  {
    id: 's3',
    studentCode: 'STU-1003',
    firstName: 'Marcus',
    lastName: 'Chen',
    email: 'marcus.chen@student.school.edu',
    gender: 'Male',
    dob: '2008-01-15',
    className: 'Grade 10-B',
    gradeLevel: 'Grade 10',
    academicYear: '2024-2025',
    term: 'Semester 1',
    advisor: 'Prof. David Vance',
    parentName: 'Hao & Mei Chen',
    parentPhone: '+1 (555) 456-7890',
    parentEmail: 'm.chen@example.com',
    gpa: 4.00,
    classRank: 1,
    totalInClass: 30,
    attendanceRate: 100,
    daysPresent: 64,
    daysAbsent: 0,
    daysLate: 0,
    daysExcused: 0,
    conduct: 'Exceptional',
    activities: ['Math Olympiad Captain', 'Astronomy Society', 'Peer Tutor'],
    achievements: ['National Merit Scholar Semifinalist', 'State Physics Bowl Winner'],
    grades: [
      {
        code: 'MATH-101',
        name: 'Advanced Mathematics',
        teacher: 'Dr. Sarah Jenkins',
        homeworkAvg: 100,
        quizAvg: 99,
        midterm: 100,
        finalExam: 100,
        overallPercent: 99.7,
        letterGrade: 'A+',
        credits: 4,
        remarks: 'Top-tier mathematical intuition. Regularly helps peers with complex derivations.',
      },
      {
        code: 'PHYS-102',
        name: 'Physics & Mechanics',
        teacher: 'Prof. David Vance',
        homeworkAvg: 98,
        quizAvg: 97,
        midterm: 99,
        finalExam: 98,
        overallPercent: 98.1,
        letterGrade: 'A+',
        credits: 4,
        remarks: 'Extraordinary experimental precision and theoretical clarity.',
      },
      {
        code: 'ENG-103',
        name: 'English Literature',
        teacher: 'Ms. Clara Thorne',
        homeworkAvg: 96,
        quizAvg: 94,
        midterm: 95,
        finalExam: 96,
        overallPercent: 95.3,
        letterGrade: 'A',
        credits: 3,
        remarks: 'Compelling essay styling and expressive linguistic clarity.',
      },
      {
        code: 'CHEM-104',
        name: 'Inorganic Chemistry',
        teacher: 'Dr. Alan Ross',
        homeworkAvg: 97,
        quizAvg: 96,
        midterm: 98,
        finalExam: 97,
        overallPercent: 97.0,
        letterGrade: 'A+',
        credits: 4,
        remarks: 'Mastery over stoichiometric equations and thermodynamics.',
      },
      {
        code: 'CS-105',
        name: 'Computer Science & Python',
        teacher: 'Mr. Michael Chen',
        homeworkAvg: 100,
        quizAvg: 100,
        midterm: 100,
        finalExam: 100,
        overallPercent: 100,
        letterGrade: 'A+',
        credits: 3,
        remarks: 'Outstanding talent. Built custom automated grading tools for classroom use.',
      },
    ],
  },
]

export default function StudentReport() {
  const { addToast } = useToast()
  const [selectedStudentId, setSelectedStudentId] = useState<string>(MOCK_STUDENTS[0].id)
  const [selectedClass, setSelectedClass] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const currentStudent = useMemo(() => {
    return MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0]
  }, [selectedStudentId])

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((s) => {
      const matchClass = selectedClass === 'all' || s.className === selectedClass
      const matchSearch =
        `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchQuery.toLowerCase())
      return matchClass && matchSearch
    })
  }, [selectedClass, searchQuery])

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const s = currentStudent
    const headers = ['Student ID', 'Name', 'Class', 'GPA', 'Rank', 'Attendance Rate', 'Subject Code', 'Subject', 'Final Grade', 'Letter Grade', 'Remarks']
    const rows = s.grades.map((g) => [
      s.studentCode,
      `"${s.firstName} ${s.lastName}"`,
      `"${s.className}"`,
      s.gpa,
      `${s.classRank}/${s.totalInClass}`,
      `${s.attendanceRate}%`,
      g.code,
      `"${g.name}"`,
      `${g.overallPercent}%`,
      g.letterGrade,
      `"${g.remarks}"`,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Student_Report_${s.studentCode}_${s.firstName}_${s.lastName}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addToast('success', `Exported full report for ${s.firstName} ${s.lastName}`)
  }

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Header section (hidden during print) */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Individual Student Report Dossier"
          subtitle="Comprehensive academic transcript, behavioral standing, attendance history, and teacher remarks."
        />
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-medium hover:bg-slate-50 transition shadow-2xs"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-medium shadow-xs transition"
          >
            <Printer className="w-4 h-4" />
            Print Official Report Card
          </button>
        </div>
      </div>

      {/* Filter and Student Selector Bar (hidden during print) */}
      <div className="print:hidden flex flex-col md:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Class:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
            >
              <option value="all">All Classes</option>
              <option value="Grade 10-A">Grade 10-A</option>
              <option value="Grade 10-B">Grade 10-B</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Select Student:</span>
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="text-xs font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            >
              {filteredStudents.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.studentCode} — {s.firstName} {s.lastName} ({s.className})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search student or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Main Student Dossier & Report Card Sheet */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8 print:border-none print:shadow-none print:p-0">
        {/* Printable Official Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-indigo-700 text-white flex items-center justify-center font-black text-2xl shadow-md shrink-0">
              {currentStudent.firstName[0]}
              {currentStudent.lastName[0]}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                  {currentStudent.firstName} {currentStudent.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Active • Enrolled
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                <span>Student ID: <strong className="text-slate-700 dark:text-slate-300 font-mono">{currentStudent.studentCode}</strong></span>
                <span>•</span>
                <span>Class: <strong className="text-slate-700 dark:text-slate-300">{currentStudent.className}</strong></span>
                <span>•</span>
                <span>Academic Year: <strong className="text-slate-700 dark:text-slate-300">{currentStudent.academicYear}</strong></span>
                <span>•</span>
                <span>Advisor: <strong className="text-slate-700 dark:text-slate-300">{currentStudent.advisor}</strong></span>
              </p>
            </div>
          </div>

          <div className="text-right sm:border-l sm:border-slate-200 dark:sm:border-slate-800 sm:pl-6 text-xs text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300">St. Jude Metropolitan High School</p>
            <p>Official Academic Evaluation Transcript</p>
            <p className="text-[11px] text-slate-400">Issued on: {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        {/* High-Level Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-brand-600" />
              Cumulative GPA
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                {currentStudent.gpa.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400">/ 4.00 scale</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Summa Cum Laude Track</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              Class Ranking
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">
                #{currentStudent.classRank}
              </span>
              <span className="text-xs text-slate-400">of {currentStudent.totalInClass} students</span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Top 5th Percentile</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Attendance Rate
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {currentStudent.attendanceRate}%
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              {currentStudent.daysPresent} present • {currentStudent.daysLate} tardy
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-500" />
              Conduct Standing
            </span>
            <div className="flex items-baseline gap-1.5 mt-2">
              <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">
                {currentStudent.conduct}
              </span>
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Zero disciplinary notices</span>
          </div>
        </div>

        {/* Academic Course Breakdown Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              Subject Evaluation Breakdown
            </h3>
            <span className="text-xs text-slate-400">Term: {currentStudent.term}</span>
          </div>

          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Subject & Teacher</th>
                  <th className="py-3 px-3 text-center">HW (20%)</th>
                  <th className="py-3 px-3 text-center">Quiz (20%)</th>
                  <th className="py-3 px-3 text-center">Midterm (25%)</th>
                  <th className="py-3 px-3 text-center">Final (35%)</th>
                  <th className="py-3 px-3 text-center">Overall</th>
                  <th className="py-3 px-3 text-center">Grade</th>
                  <th className="py-3 px-4">Teacher Evaluation Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {currentStudent.grades.map((g) => (
                  <tr key={g.code} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{g.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{g.code} • {g.teacher}</div>
                    </td>
                    <td className="py-3.5 px-3 text-center font-mono">{g.homeworkAvg}%</td>
                    <td className="py-3.5 px-3 text-center font-mono">{g.quizAvg}%</td>
                    <td className="py-3.5 px-3 text-center font-mono">{g.midterm}%</td>
                    <td className="py-3.5 px-3 text-center font-mono">{g.finalExam}%</td>
                    <td className="py-3.5 px-3 text-center font-bold text-slate-900 dark:text-slate-100 font-mono">
                      {g.overallPercent}%
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full font-extrabold text-[11px] ${
                          g.letterGrade.startsWith('A')
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : g.letterGrade.startsWith('B')
                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                            : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                        }`}
                      >
                        {g.letterGrade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-xs italic">
                      "{g.remarks}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activities, Extracurriculars & Honors */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              Honors & Academic Awards
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {currentStudent.achievements.map((item, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brand-600" />
              Extracurricular Activities & Leadership
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
              {currentStudent.activities.map((act, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{act}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Parent & Contact Information */}
        <div className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Primary Guardian: </span>
            <span className="text-slate-600 dark:text-slate-400">{currentStudent.parentName}</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span className="flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              {currentStudent.parentPhone}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5" />
              {currentStudent.parentEmail}
            </span>
          </div>
        </div>

        {/* Signature & School Verification Box (Visible for Official Printing) */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-3 gap-6 text-center text-xs">
          <div>
            <div className="border-b border-slate-300 dark:border-slate-700 h-10 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Dr. Sarah Jenkins</p>
            <p className="text-[11px] text-slate-400">Class Homeroom Advisor</p>
          </div>
          <div>
            <div className="border-b border-slate-300 dark:border-slate-700 h-10 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">Dr. Robert Sterling</p>
            <p className="text-[11px] text-slate-400">Principal & Head of School</p>
          </div>
          <div>
            <div className="border-b border-slate-300 dark:border-slate-700 h-10 mb-2" />
            <p className="font-semibold text-slate-700 dark:text-slate-300">{new Date().toLocaleDateString()}</p>
            <p className="text-[11px] text-slate-400">Official Registrar Stamp & Seal</p>
          </div>
        </div>
      </div>
    </div>
  )
}
