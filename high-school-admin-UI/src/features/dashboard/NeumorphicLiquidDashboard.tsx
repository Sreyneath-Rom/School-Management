import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserPlus,
  Users,
  GraduationCap,
  BarChart3,
  CheckCircle2,
  Circle,
  ExternalLink,
  Zap,
  Clock,
  Sparkles,
  Heart,
  ChevronDown,
  Monitor,
  FileText,
  User,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

// Wave sparkline helper component
function WaveSparkline({ color }: { color: string }) {
  return (
    <svg className="w-16 h-6 overflow-visible" viewBox="0 0 60 20" fill="none">
      <path
        d="M 2 14 C 12 18, 18 4, 30 10 C 42 16, 48 4, 58 8"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function NeumorphicLiquidDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Display user's name or fallback to Sreyneath from reference design
  const userName = user?.firstName || 'Sreyneath'

  // Time & date state
  const [selectedSemester, setSelectedSemester] = useState('This Semester')
  const [semesterDropdownOpen, setSemesterDropdownOpen] = useState(false)
  const [activeDate, setActiveDate] = useState(23)
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number | null>(null)

  // Interactive task list
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Check student submissions',
      category: 'Academic',
      time: 'Today 10:00 AM',
      color: '#3b82f6',
      completed: true,
    },
    {
      id: 2,
      title: 'Prepare class materials',
      category: 'Teaching',
      time: 'Today 02:00 PM',
      color: '#f97316',
      completed: false,
    },
    {
      id: 3,
      title: 'Update attendance',
      category: 'Academic',
      time: 'Today 04:00 PM',
      color: '#06b6d4',
      completed: false,
    },
    {
      id: 4,
      title: 'Generate monthly report',
      category: 'Reports',
      time: 'Tomorrow 09:00 AM',
      color: '#a855f7',
      completed: false,
    },
  ])

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  // Spline chart coordinates across Jan - Aug
  const chartData = [
    { month: 'Jan', passed: 45, failed: 35, x: 20 },
    { month: 'Feb', passed: 58, failed: 48, x: 90 },
    { month: 'Mar', passed: 56, failed: 38, x: 160 },
    { month: 'Apr', passed: 72, failed: 49, x: 230 },
    { month: 'May', passed: 90, failed: 38, x: 300 },
    { month: 'Jun', passed: 80, failed: 36, x: 370 },
    { month: 'Jul', passed: 85, failed: 40, x: 440 },
    { month: 'Aug', passed: 92, failed: 38, x: 510 },
  ]

  // Spline paths for chart
  // Smooth cubic bezier curves matching the screenshot
  const passedPath = `M 20 145 C 55 120, 70 125, 90 120 C 125 115, 140 135, 160 130 C 190 125, 210 85, 230 85 C 265 85, 280 45, 300 45 C 330 45, 350 70, 370 70 C 400 70, 420 58, 440 58 C 470 58, 490 40, 510 40`
  const passedAreaPath = `${passedPath} L 510 200 L 20 200 Z`
  const failedPath = `M 20 162 C 55 140, 70 145, 90 140 C 125 135, 140 165, 160 160 C 190 155, 210 135, 230 135 C 265 135, 280 160, 300 160 C 330 160, 350 165, 370 165 C 400 165, 420 155, 440 155 C 470 155, 490 162, 510 162`

  return (
    <div className="space-y-6 pb-8">
      {/* =========================================================
          1. GREETING HERO SECTION
          ========================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-1">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
            Good Morning,
          </p>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-800 dark:text-white flex items-center gap-2 mt-0.5">
            <span>{userName}</span>
            <span className="text-2xl sm:text-3xl filter drop-shadow-[0_2px_4px_rgba(245,158,11,0.4)] animate-bounce inline-block">
              ☀️
            </span>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-1">
            Keep going! You're doing great.
          </p>
        </div>

        {/* Date capsule pill from screenshot */}
        <div className="self-start sm:self-auto">
          <div className="neu-raised-pill px-4 py-2 flex items-center gap-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-default">
            <CalendarIcon size={15} className="text-blue-500 shrink-0" />
            <span>Tue, Sep 23, 2026</span>
          </div>
        </div>
      </div>

      {/* =========================================================
          2. TOP ROW: 4 STAT CARDS
          ========================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Students */}
        <div className="neu-glass-card p-5 group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="neu-icon-well h-12 w-12 flex items-center justify-center bg-blue-500/15 text-blue-600 dark:text-blue-400 shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.25)]">
              <User size={20} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Students
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5 tracking-tight">
              428
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-200/40 dark:border-slate-700/40">
            <span className="inline-flex items-center text-xs font-bold text-emerald-500 dark:text-emerald-400">
              ↑ 12%
            </span>
            <WaveSparkline color="#3b82f6" />
          </div>
        </div>

        {/* Card 2: Total Teachers */}
        <div className="neu-glass-card p-5 group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="neu-icon-well h-12 w-12 flex items-center justify-center bg-orange-500/15 text-orange-600 dark:text-orange-400 shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.25)]">
              <User size={20} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Teachers
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5 tracking-tight">
              32
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-200/40 dark:border-slate-700/40">
            <span className="inline-flex items-center text-xs font-bold text-emerald-500 dark:text-emerald-400">
              ↑ 6%
            </span>
            <WaveSparkline color="#f97316" />
          </div>
        </div>

        {/* Card 3: Total Classes */}
        <div className="neu-glass-card p-5 group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="neu-icon-well h-12 w-12 flex items-center justify-center bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
              <Monitor size={20} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Total Classes
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5 tracking-tight">
              18
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-200/40 dark:border-slate-700/40">
            <span className="inline-flex items-center text-xs font-bold text-emerald-500 dark:text-emerald-400">
              ↑ 9%
            </span>
            <WaveSparkline color="#06b6d4" />
          </div>
        </div>

        {/* Card 4: Attendance Rate */}
        <div className="neu-glass-card p-5 group hover:-translate-y-1 transition-all duration-300">
          <div className="flex items-center gap-3">
            <div className="neu-icon-well h-12 w-12 flex items-center justify-center bg-purple-500/15 text-purple-600 dark:text-purple-400 shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.25)]">
              <FileText size={20} className="stroke-[2.5]" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Attendance Rate
            </p>
            <p className="text-2xl font-black text-slate-800 dark:text-white mt-0.5 tracking-tight">
              96%
            </p>
          </div>
          <div className="mt-3 pt-2 flex items-center justify-between border-t border-slate-200/40 dark:border-slate-700/40">
            <span className="inline-flex items-center text-xs font-bold text-emerald-500 dark:text-emerald-400">
              ↑ 2%
            </span>
            <WaveSparkline color="#a855f7" />
          </div>
        </div>
      </div>

      {/* =========================================================
          3. MAIN CONTENT: 2-COLUMN GRID (LEFT 65%, RIGHT 35%)
          ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* -------------------------------------------------------
            LEFT COLUMN (lg:col-span-8)
            ------------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card: Student Performance */}
          <div className="neu-glass-card p-6">
            {/* Header: Title + Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="neu-circle-disc h-8 w-8 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <BarChart3 size={16} />
                </div>
                <h2 className="text-base font-bold text-slate-800 dark:text-white">
                  Student Performance
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Semester filter dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSemesterDropdownOpen(!semesterDropdownOpen)}
                    className="neu-raised-pill px-3 py-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 flex items-center gap-1.5 cursor-pointer hover:text-blue-600"
                  >
                    <span>{selectedSemester}</span>
                    <ChevronDown size={13} className="text-slate-400" />
                  </button>

                  {semesterDropdownOpen && (
                    <div className="dropdown-surface absolute right-0 mt-2 w-38 p-1.5 z-30">
                      {['This Semester', 'Semester 1', 'Full Year 2026'].map((sem) => (
                        <button
                          key={sem}
                          type="button"
                          onClick={() => {
                            setSelectedSemester(sem)
                            setSemesterDropdownOpen(false)
                          }}
                          className={`w-full text-left px-3 py-1.5 text-xs rounded-lg font-semibold transition cursor-pointer ${
                            selectedSemester === sem
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {sem}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Legend dots */}
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
                    Passed <span className="text-slate-800 dark:text-white">87%</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <span className="h-2.5 w-2.5 rounded-full bg-orange-400 shadow-[0_0_6px_rgba(251,146,60,0.6)]" />
                    Failed <span className="text-slate-800 dark:text-white">13%</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Chart Area + Embedded Circular Gauge */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Spline Area Chart (md:col-span-9) */}
              <div className="md:col-span-9 relative">
                <div className="h-56 w-full">
                  <svg
                    viewBox="0 0 540 220"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="cyanFillGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#06b6d4" floodOpacity="0.4" />
                      </filter>
                    </defs>

                    {/* Dotted horizontal grid lines */}
                    {[40, 80, 120, 160, 200].map((y, idx) => (
                      <g key={y}>
                        <text
                          x="0"
                          y={y + 3}
                          fontSize="9"
                          fill="currentColor"
                          className="text-slate-400 font-semibold"
                        >
                          {100 - idx * 25}
                        </text>
                        <line
                          x1="18"
                          y1={y}
                          x2="530"
                          y2={y}
                          stroke="currentColor"
                          strokeDasharray="3 3"
                          className="text-slate-300/40 dark:text-slate-700/40"
                          strokeWidth="1"
                        />
                      </g>
                    ))}

                    {/* Cyan Passed Area gradient */}
                    <path d={passedAreaPath} fill="url(#cyanFillGradient)" />

                    {/* Orange Failed Spline line */}
                    <path
                      d={failedPath}
                      fill="none"
                      stroke="#fb923c"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />

                    {/* Cyan Passed Spline line */}
                    <path
                      d={passedPath}
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="3"
                      strokeLinecap="round"
                      filter="url(#glowEffect)"
                    />

                    {/* Interactive dots along the curve */}
                    {chartData.map((d, index) => (
                      <g
                        key={d.month}
                        onMouseEnter={() => setHoveredMonthIndex(index)}
                        onMouseLeave={() => setHoveredMonthIndex(null)}
                        className="cursor-pointer"
                      >
                        {/* Passed node (cyan) */}
                        <circle
                          cx={d.x}
                          cy={200 - d.passed * 1.6}
                          r={hoveredMonthIndex === index ? '5.5' : '4'}
                          fill="#ffffff"
                          stroke="#06b6d4"
                          strokeWidth="2.5"
                          className="transition-all duration-150"
                        />

                        {/* Failed node (orange) */}
                        <circle
                          cx={d.x}
                          cy={200 - d.failed * 1.6}
                          r={hoveredMonthIndex === index ? '5' : '3.5'}
                          fill="#ffffff"
                          stroke="#fb923c"
                          strokeWidth="2"
                          className="transition-all duration-150"
                        />

                        {/* Month text on X-axis */}
                        <text
                          x={d.x}
                          y="218"
                          textAnchor="middle"
                          fontSize="10"
                          fontWeight="bold"
                          fill="currentColor"
                          className={
                            hoveredMonthIndex === index
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-slate-400'
                          }
                        >
                          {d.month}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>

                {/* Hover Tooltip */}
                {hoveredMonthIndex !== null && (
                  <div
                    className="absolute -top-3 neu-raised-pill px-2.5 py-1 text-[11px] font-bold text-slate-800 dark:text-white pointer-events-none transform -translate-x-1/2 z-20"
                    style={{
                      left: `${(chartData[hoveredMonthIndex].x / 540) * 100}%`,
                    }}
                  >
                    <span>{chartData[hoveredMonthIndex].month}: </span>
                    <span className="text-cyan-500">{chartData[hoveredMonthIndex].passed}%</span> /{' '}
                    <span className="text-orange-500">{chartData[hoveredMonthIndex].failed}%</span>
                  </div>
                )}
              </div>

              {/* Embedded Circular Gauge (md:col-span-3) */}
              <div className="md:col-span-3 flex flex-col items-center justify-center p-3 text-center border-t md:border-t-0 md:border-l border-slate-200/40 dark:border-slate-700/40">
                <div className="relative h-28 w-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="text-slate-200/50 dark:text-slate-700/40"
                      strokeWidth="9"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#donutGradient)"
                      strokeWidth="9"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - 0.87)}
                      strokeLinecap="round"
                      fill="transparent"
                      className="drop-shadow-[0_2px_6px_rgba(6,182,212,0.4)]"
                    />
                    <defs>
                      <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                      87%
                    </span>
                  </div>
                </div>
                <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">
                  Overall Pass Rate
                </p>
              </div>
            </div>
          </div>

          {/* Sub-grid: Quick Actions & Recent Activities */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ⚡ Quick Actions Card */}
            <div className="neu-glass-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="neu-circle-disc h-7 w-7 flex items-center justify-center text-amber-500">
                  <Zap size={14} className="fill-amber-500" />
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Quick Actions
                </h3>
              </div>

              {/* 4 Tactile Squircles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* 1. Add Student */}
                <button
                  type="button"
                  onClick={() => navigate('/students')}
                  className="neu-squircle-action p-3 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
                >
                  <div className="neu-icon-well h-10 w-10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition">
                    <UserPlus size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    Add Student
                  </span>
                </button>

                {/* 2. Add Teacher */}
                <button
                  type="button"
                  onClick={() => navigate('/teachers')}
                  className="neu-squircle-action p-3 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
                >
                  <div className="neu-icon-well h-10 w-10 flex items-center justify-center text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition">
                    <Users size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    Add Teacher
                  </span>
                </button>

                {/* 3. Create Class */}
                <button
                  type="button"
                  onClick={() => navigate('/academic/classes')}
                  className="neu-squircle-action p-3 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
                >
                  <div className="neu-icon-well h-10 w-10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition">
                    <GraduationCap size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    Create Class
                  </span>
                </button>

                {/* 4. View Reports */}
                <button
                  type="button"
                  onClick={() => navigate('/reports')}
                  className="neu-squircle-action p-3 flex flex-col items-center justify-center gap-2 text-center group cursor-pointer"
                >
                  <div className="neu-icon-well h-10 w-10 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition">
                    <BarChart3 size={18} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200">
                    View Reports
                  </span>
                </button>
              </div>
            </div>

            {/* Recent Activities Card */}
            <div className="neu-glass-card p-5">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <div className="neu-circle-disc h-7 w-7 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Clock size={14} />
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                    Recent Activities
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/system/activity')}
                  className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>View All</span>
                  <ChevronRight size={12} />
                </button>
              </div>

              {/* 4 Activities List */}
              <div className="space-y-3">
                {/* 1 */}
                <div className="flex items-center gap-3">
                  <div className="neu-circle-disc h-8 w-8 flex items-center justify-center font-bold text-xs text-blue-600 dark:text-blue-300 bg-blue-500/10 shrink-0">
                    S
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>New student registered</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Sok Vannak • 2 hours ago
                    </p>
                  </div>
                </div>

                {/* 2 */}
                <div className="flex items-center gap-3">
                  <div className="neu-circle-disc h-8 w-8 flex items-center justify-center font-bold text-xs text-cyan-600 dark:text-cyan-300 bg-cyan-500/10 shrink-0">
                    T
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>Class updated</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Grade 10A • 4 hours ago
                    </p>
                  </div>
                </div>

                {/* 3 */}
                <div className="flex items-center gap-3">
                  <div className="neu-circle-disc h-8 w-8 flex items-center justify-center font-bold text-xs text-purple-600 dark:text-purple-300 bg-purple-500/10 shrink-0">
                    A
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>Attendance marked</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Grade 12B • 5 hours ago
                    </p>
                  </div>
                </div>

                {/* 4 */}
                <div className="flex items-center gap-3">
                  <div className="neu-circle-disc h-8 w-8 flex items-center justify-center font-bold text-xs text-slate-600 dark:text-slate-400 bg-slate-500/10 shrink-0">
                    R
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>New report generated</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Monthly Report • 1 day ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------------------------------------------------------
            RIGHT COLUMN (lg:col-span-4)
            ------------------------------------------------------- */}
        <div className="lg:col-span-4 space-y-6">
          {/* Card: Calendar */}
          <div className="neu-glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="neu-circle-disc h-7 w-7 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <CalendarIcon size={14} />
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Calendar
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/calendar')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Month & Switcher */}
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-black text-slate-800 dark:text-white">
                September 2026
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="neu-circle-disc h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Previous month"
                >
                  <ChevronLeft size={13} />
                </button>
                <button
                  type="button"
                  className="neu-circle-disc h-6 w-6 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
                  title="Next month"
                >
                  <ChevronRight size={13} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div
                  key={day}
                  className="text-[10px] font-bold text-slate-400 uppercase py-1"
                >
                  {day}
                </div>
              ))}

              {/* September 2026 dates (starts on Tuesday = 2 blank days) */}
              <div className="h-7 w-7" />
              <div className="h-7 w-7" />
              {[...Array(30)].map((_, i) => {
                const dayNum = i + 1
                const isActive = dayNum === activeDate
                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => setActiveDate(dayNum)}
                    className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.6)] scale-105 font-black'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {dayNum}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Card: Recent Tasks */}
          <div className="neu-glass-card p-5">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <div className="neu-circle-disc h-7 w-7 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <CheckCircle2 size={14} />
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
                  Recent Tasks
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate('/academic/homework')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>View All</span>
                <ChevronRight size={12} />
              </button>
            </div>

            {/* Tasks list */}
            <div className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className="flex items-center gap-3 group cursor-pointer"
                >
                  <div
                    className="neu-circle-disc h-7 w-7 flex items-center justify-center shrink-0 transition"
                    style={{
                      borderColor: task.completed ? task.color : undefined,
                    }}
                  >
                    {task.completed ? (
                      <span
                        className="h-3 w-3 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]"
                        style={{ backgroundColor: task.color }}
                      />
                    ) : (
                      <span
                        className="h-2 w-2 rounded-full opacity-60"
                        style={{ backgroundColor: task.color }}
                      />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className={`text-xs font-bold text-slate-800 dark:text-slate-200 transition ${
                        task.completed ? 'line-through opacity-60' : ''
                      }`}
                    >
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {task.category} • {task.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Inspirational Liquid Glass Banner */}
          <div className="neu-glass-card relative overflow-hidden h-38 p-6 flex flex-col justify-between group">
            {/* Background image if present, with iridescent gradients */}
            <div className="absolute inset-0 pointer-events-none">
              <img
                src="/assets/images/liquid_glass_banner.jpg"
                alt="Liquid Glass Ambient"
                className="h-full w-full object-cover opacity-85 dark:opacity-60 scale-105 group-hover:scale-100 transition-transform duration-700"
                onError={(e) => {
                  // Fallback beautiful liquid iridescent gradient if file isn't loaded
                  e.currentTarget.style.display = 'none'
                }}
              />
              <div className="absolute inset-0 bg-linear-to-tr from-blue-500/30 via-purple-500/20 to-pink-500/30 backdrop-blur-[2px]" />
            </div>

            {/* Elegant Italic Cursive Quote */}
            <div className="relative z-10 max-w-[85%]">
              <p className="font-serif italic text-lg sm:text-xl font-bold tracking-wide text-blue-900 dark:text-white drop-shadow-[0_1px_3px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] leading-tight">
                Education builds a brighter future
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-1.5 text-blue-600 dark:text-blue-300">
              <Heart size={16} className="fill-blue-500/30 text-blue-600 drop-shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
