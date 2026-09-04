import { useState, useMemo } from 'react'
import PageHeading from '@/components/common/PageHeading'
import {
  Users,
  Search,
  Download,
  Printer,
  BookOpen,
  Award,
  Clock,
  CheckCircle2,
  TrendingUp,
  GraduationCap,
  Calendar,
  Briefcase,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { useToast } from '@/components/common/ToastProvider'

interface TeacherPerformanceRecord {
  id: string
  empId: string
  name: string
  email: string
  department: 'STEM' | 'Humanities' | 'Languages' | 'Arts & Physical'
  role: string
  assignedClasses: string[]
  assignedSubjects: string[]
  totalStudents: number
  weeklyPeriods: number
  avgStudentGrade: number
  studentPassRate: number
  homeworkCompletionRate: number
  teacherAttendanceRate: number
  rating: number
}

const MOCK_TEACHER_REPORTS: TeacherPerformanceRecord[] = [
  {
    id: 't1',
    empId: 'FAC-201',
    name: 'Dr. Sarah Jenkins',
    email: 's.jenkins@school.edu',
    department: 'STEM',
    role: 'Head of Mathematics',
    assignedClasses: ['Grade 10-A', 'Grade 10-B', 'Grade 12-AP'],
    assignedSubjects: ['Advanced Mathematics', 'AP Calculus BC'],
    totalStudents: 94,
    weeklyPeriods: 24,
    avgStudentGrade: 88.4,
    studentPassRate: 97.8,
    homeworkCompletionRate: 94.5,
    teacherAttendanceRate: 99.2,
    rating: 4.9,
  },
  {
    id: 't2',
    empId: 'FAC-202',
    name: 'Prof. David Vance',
    email: 'd.vance@school.edu',
    department: 'STEM',
    role: 'Senior Physics Instructor',
    assignedClasses: ['Grade 10-A', 'Grade 11-A', 'Grade 11-B'],
    assignedSubjects: ['Physics & Mechanics', 'AP Physics 1'],
    totalStudents: 88,
    weeklyPeriods: 22,
    avgStudentGrade: 86.2,
    studentPassRate: 96.5,
    homeworkCompletionRate: 91.0,
    teacherAttendanceRate: 98.5,
    rating: 4.8,
  },
  {
    id: 't3',
    empId: 'FAC-203',
    name: 'Ms. Clara Thorne',
    email: 'c.thorne@school.edu',
    department: 'Humanities',
    role: 'English Literature Faculty',
    assignedClasses: ['Grade 10-A', 'Grade 10-B', 'Grade 11-A'],
    assignedSubjects: ['English Literature', 'Creative Writing'],
    totalStudents: 92,
    weeklyPeriods: 20,
    avgStudentGrade: 89.1,
    studentPassRate: 98.9,
    homeworkCompletionRate: 95.2,
    teacherAttendanceRate: 100.0,
    rating: 4.9,
  },
  {
    id: 't4',
    empId: 'FAC-204',
    name: 'Dr. Alan Ross',
    email: 'a.ross@school.edu',
    department: 'STEM',
    role: 'Chemistry Faculty Lead',
    assignedClasses: ['Grade 10-A', 'Grade 11-B', 'Grade 12-A'],
    assignedSubjects: ['Inorganic Chemistry', 'Organic Chemistry'],
    totalStudents: 85,
    weeklyPeriods: 22,
    avgStudentGrade: 84.7,
    studentPassRate: 94.1,
    homeworkCompletionRate: 88.6,
    teacherAttendanceRate: 97.4,
    rating: 4.6,
  },
  {
    id: 't5',
    empId: 'FAC-205',
    name: 'Mr. Michael Chen',
    email: 'm.chen@school.edu',
    department: 'STEM',
    role: 'Computer Science Instructor',
    assignedClasses: ['Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 12-CS'],
    assignedSubjects: ['Computer Science & Python', 'AP Computer Science A'],
    totalStudents: 110,
    weeklyPeriods: 26,
    avgStudentGrade: 92.5,
    studentPassRate: 99.1,
    homeworkCompletionRate: 96.8,
    teacherAttendanceRate: 99.0,
    rating: 5.0,
  },
]

export default function TeacherReport() {
  const { addToast } = useToast()
  const [departmentFilter, setDepartmentFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedTeacherId, setSelectedTeacherId] = useState<string | null>(MOCK_TEACHER_REPORTS[0].id)

  const filteredTeachers = useMemo(() => {
    return MOCK_TEACHER_REPORTS.filter((t) => {
      const matchDept = departmentFilter === 'all' || t.department === departmentFilter
      const matchSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.empId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.assignedSubjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      return matchDept && matchSearch
    })
  }, [departmentFilter, searchQuery])

  const selectedTeacher = useMemo(() => {
    return MOCK_TEACHER_REPORTS.find((t) => t.id === selectedTeacherId) || filteredTeachers[0] || null
  }, [selectedTeacherId, filteredTeachers])

  // Faculty-wide statistics
  const totalFaculty = MOCK_TEACHER_REPORTS.length
  const avgWorkload = (
    MOCK_TEACHER_REPORTS.reduce((acc, t) => acc + t.weeklyPeriods, 0) / totalFaculty
  ).toFixed(1)
  const avgFacultyAttendance = (
    MOCK_TEACHER_REPORTS.reduce((acc, t) => acc + t.teacherAttendanceRate, 0) / totalFaculty
  ).toFixed(1)
  const avgClassScore = (
    MOCK_TEACHER_REPORTS.reduce((acc, t) => acc + t.avgStudentGrade, 0) / totalFaculty
  ).toFixed(1)

  const handlePrint = () => {
    window.print()
  }

  const handleExportCSV = () => {
    const headers = [
      'Emp ID',
      'Teacher Name',
      'Department',
      'Role',
      'Assigned Classes',
      'Assigned Subjects',
      'Weekly Periods',
      'Total Students',
      'Class Grade Avg',
      'Student Pass Rate',
      'Attendance Rate',
      'Faculty Rating',
    ]

    const rows = filteredTeachers.map((t) => [
      t.empId,
      `"${t.name}"`,
      t.department,
      `"${t.role}"`,
      `"${t.assignedClasses.join(', ')}"`,
      `"${t.assignedSubjects.join(', ')}"`,
      t.weeklyPeriods,
      t.totalStudents,
      `${t.avgStudentGrade}%`,
      `${t.studentPassRate}%`,
      `${t.teacherAttendanceRate}%`,
      t.rating,
    ])

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Teacher_Performance_Report_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    addToast('success', `Exported ${filteredTeachers.length} teacher performance records.`)
  }

  return (
    <div className="space-y-6 pb-12 print:p-0">
      {/* Header Bar */}
      <div className="print:hidden flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeading
          title="Teacher Performance & Workload Report"
          subtitle="Faculty instructional assignments, weekly period allocations, class academic outcomes, and attendance reliability."
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
            Print Faculty Audit
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-600" />
            Active Teaching Faculty
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {totalFaculty}
            </span>
            <span className="text-xs text-slate-400">instructors</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">100% Fully Staffed</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-500" />
            Avg Workload / Week
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {avgWorkload}
            </span>
            <span className="text-xs text-slate-400">teaching periods</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Optimal load (standard: 20-26)</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Faculty Attendance Rate
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {avgFacultyAttendance}%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Punctual bell compliance</span>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-500" />
            Student Outcome Average
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
              {avgClassScore}%
            </span>
            <span className="text-xs text-slate-400">composite</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">+2.4% vs last semester</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="print:hidden flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Department:</span>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Departments</option>
            <option value="STEM">STEM (Math & Sciences)</option>
            <option value="Humanities">Humanities & Social Sciences</option>
            <option value="Languages">Languages & Literature</option>
          </select>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search faculty name, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* Faculty Table & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Teacher Roster Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              Instructor Workload & Metrics
            </h3>
            <span className="text-xs text-slate-400">{filteredTeachers.length} instructors</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold">
                  <th className="py-3 px-4">Faculty Member</th>
                  <th className="py-3 px-3 text-center">Periods/Wk</th>
                  <th className="py-3 px-3 text-center">Students</th>
                  <th className="py-3 px-3 text-center">Avg Grade</th>
                  <th className="py-3 px-3 text-center">Pass Rate</th>
                  <th className="py-3 px-3 text-center">Attendance</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredTeachers.map((teacher) => {
                  const isSelected = selectedTeacher?.id === teacher.id
                  return (
                    <tr
                      key={teacher.id}
                      onClick={() => setSelectedTeacherId(teacher.id)}
                      className={`cursor-pointer transition ${
                        isSelected
                          ? 'bg-brand-50/50 dark:bg-brand-950/20'
                          : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-slate-100">{teacher.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {teacher.empId} • {teacher.department}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-medium">
                        {teacher.weeklyPeriods}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-medium">
                        {teacher.totalStudents}
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800 dark:text-slate-200">
                        {teacher.avgStudentGrade}%
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {teacher.studentPassRate}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-center font-mono text-slate-600 dark:text-slate-300">
                        {teacher.teacherAttendanceRate}%
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="text-brand-600 font-medium inline-flex items-center gap-0.5 hover:underline">
                          View <ChevronRight className="w-3 h-3" />
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Detailed Selected Teacher Dossier */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-6">
          {selectedTeacher ? (
            <>
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {selectedTeacher.name.split(' ').map((n) => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                    {selectedTeacher.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {selectedTeacher.role} • {selectedTeacher.empId}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Assigned Subjects & Curriculum
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTeacher.assignedSubjects.map((sub, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {sub}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Classes Under Instruction
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTeacher.assignedClasses.map((cls, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-xl text-xs font-medium bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Key Evaluation Ratios
                </h5>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Homework Submission Rate:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {selectedTeacher.homeworkCompletionRate}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Class Cumulative GPA Avg:</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {(selectedTeacher.avgStudentGrade / 25).toFixed(2)} / 4.00
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500">Student Satisfaction Rating:</span>
                    <span className="font-bold text-amber-600 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      {selectedTeacher.rating} / 5.0
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Faculty Punctuality Rate:</span>
                    <span className="font-bold text-emerald-600">
                      {selectedTeacher.teacherAttendanceRate}%
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-xs text-slate-400">
              Select a faculty member to inspect details.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
