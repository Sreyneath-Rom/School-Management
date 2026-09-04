import React, { useState } from 'react'
import {
  Smartphone,
  Tablet,
  Laptop,
  Monitor,
  RotateCw,
  Sliders,
  Grid,
  Sparkles,
  Maximize2,
  Minimize2,
  CheckCircle2,
  LayoutGrid,
  Layers,
  Eye,
  Info,
  Check,
  Zap,
  ShieldCheck,
  Search,
  Users2,
  Calendar,
  Award,
  Bell,
  ArrowRight,
  MousePointerClick,
  Sparkle,
} from 'lucide-react'
import { useResponsive } from '@/hooks/useResponsive'
import {
  ResponsiveScreen,
  ResponsiveGrid,
  ResponsiveStack,
  Show,
  Hide,
  ResponsiveSheet,
  ResponsiveTableContainer,
} from '@/components/layout'
import Button from '@/components/common/Button'

interface DevicePreset {
  id: string
  name: string
  category: 'mobile' | 'tablet' | 'laptop' | 'desktop'
  width: number
  height: number
  icon: typeof Smartphone
  notch?: 'dynamic-island' | 'punch-hole' | 'none'
  dpr?: number
}

const DEVICE_PRESETS: DevicePreset[] = [
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    category: 'mobile',
    width: 393,
    height: 852,
    icon: Smartphone,
    notch: 'dynamic-island',
    dpr: 3,
  },
  {
    id: 'pixel-8',
    name: 'Google Pixel 8',
    category: 'mobile',
    width: 412,
    height: 915,
    icon: Smartphone,
    notch: 'punch-hole',
    dpr: 2.6,
  },
  {
    id: 'galaxy-fold-cover',
    name: 'Galaxy Z Fold (Cover)',
    category: 'mobile',
    width: 344,
    height: 882,
    icon: Smartphone,
    notch: 'punch-hole',
    dpr: 2.5,
  },
  {
    id: 'ipad-air',
    name: 'iPad Air 11"',
    category: 'tablet',
    width: 820,
    height: 1180,
    icon: Tablet,
    notch: 'none',
    dpr: 2,
  },
  {
    id: 'ipad-pro',
    name: 'iPad Pro 12.9"',
    category: 'tablet',
    width: 1024,
    height: 1366,
    icon: Tablet,
    notch: 'none',
    dpr: 2,
  },
  {
    id: 'macbook-air',
    name: 'MacBook Air 13"',
    category: 'laptop',
    width: 1280,
    height: 832,
    icon: Laptop,
    notch: 'none',
    dpr: 2,
  },
  {
    id: 'desktop-hd',
    name: 'Desktop Full HD',
    category: 'desktop',
    width: 1440,
    height: 900,
    icon: Monitor,
    notch: 'none',
    dpr: 1,
  },
]

export default function ResponsiveScreenStudio() {
  const currentResponsive = useResponsive()

  // Simulator controls
  const [selectedDevice, setSelectedDevice] = useState<DevicePreset>(DEVICE_PRESETS[0])
  const [isLandscape, setIsLandscape] = useState(false)
  const [showFrame, setShowFrame] = useState(true)
  const [showGridOverlay, setShowGridOverlay] = useState(false)
  const [zoomScale, setZoomScale] = useState<number>(0.85)
  const [simulatedPage, setSimulatedPage] = useState<
    'dashboard' | 'students' | 'attendance' | 'grades'
  >('dashboard')

  // Interactive Primitives Playground state
  const [testSheetOpen, setTestSheetOpen] = useState(false)
  const [gridColumns, setGridColumns] = useState<number>(3)
  const [gridGap, setGridGap] = useState<'sm' | 'md' | 'lg'>('md')
  const [stackDirection, setStackDirection] = useState<'row' | 'col'>('row')

  const effectiveWidth = isLandscape ? selectedDevice.height : selectedDevice.width
  const effectiveHeight = isLandscape ? selectedDevice.width : selectedDevice.height

  return (
    <ResponsiveScreen
      title="Responsive Layout System & Screen Studio"
      subtitle="Comprehensive cross-device layout engine, live screen inspector, and fluid responsive viewport previewer for high school administration."
      icon={<Layers className="w-6 h-6" />}
      maxWidth="7xl"
    >
      <div className="space-y-6">
        {/* =========================================================================
            1. LIVE HOST VIEWPORT TELEMETRY BAR
           ========================================================================= */}
        <div className="p-4 sm:p-5 rounded-2xl glass-sm border border-stone-200/70 dark:border-stone-800 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                  Current Host Viewport Telemetry
                </h3>
              </div>
              <div className="mt-1 flex items-baseline gap-3">
                <span className="text-xl sm:text-2xl font-black font-mono text-stone-900 dark:text-stone-100">
                  {currentResponsive.width} × {currentResponsive.height}px
                </span>
                <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30">
                  Breakpoint: {currentResponsive.breakpoint.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex items-center gap-2 flex-wrap text-xs">
              <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 flex items-center gap-1.5">
                <span className="text-stone-400 font-medium">Device Profile:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {currentResponsive.isMobile
                    ? '📱 Mobile Phone'
                    : currentResponsive.isTablet
                    ? '📟 Tablet Device'
                    : '💻 Desktop / Laptop'}
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 flex items-center gap-1.5">
                <span className="text-stone-400 font-medium">Orientation:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {currentResponsive.isPortrait ? 'Portrait' : 'Landscape'}
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 flex items-center gap-1.5">
                <span className="text-stone-400 font-medium">Touch:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {currentResponsive.isTouch ? 'Enabled (Touch)' : 'Mouse / Pointer'}
                </span>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700 flex items-center gap-1.5">
                <span className="text-stone-400 font-medium">DPR:</span>
                <span className="font-bold font-mono text-stone-800 dark:text-stone-200">
                  {currentResponsive.pixelRatio}x
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. INTERACTIVE DEVICE SCREEN SIMULATOR STAGE
           ========================================================================= */}
        <div className="p-4 sm:p-6 rounded-3xl glass-sm border border-stone-200/70 dark:border-stone-800 shadow-md space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-stone-200/60 dark:border-stone-800">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                Live Multi-Device Viewport Stage
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                Test reflow, navigation collapse, card switches, and data density across standardized device viewports.
              </p>
            </div>

            {/* Toolbar Controls */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Orientation Switch */}
              <button
                type="button"
                onClick={() => setIsLandscape((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  isLandscape
                    ? 'bg-brand-500/15 border-brand-500/30 text-brand-700 dark:text-brand-300'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200/70 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200/60'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{isLandscape ? 'Landscape' : 'Portrait'}</span>
              </button>

              {/* Bezel Toggle */}
              <button
                type="button"
                onClick={() => setShowFrame((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showFrame
                    ? 'bg-brand-500/15 border-brand-500/30 text-brand-700 dark:text-brand-300'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200/70 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200/60'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Frame: {showFrame ? 'On' : 'Off'}</span>
              </button>

              {/* Grid Overlay Toggle */}
              <button
                type="button"
                onClick={() => setShowGridOverlay((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
                  showGridOverlay
                    ? 'bg-violet-500/15 border-violet-500/30 text-violet-700 dark:text-violet-300'
                    : 'bg-stone-100 dark:bg-stone-800 border-stone-200/70 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-200/60'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>12-Col Grid</span>
              </button>

              {/* Zoom Scale */}
              <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl border border-stone-200/60 dark:border-stone-700 text-xs">
                {[0.65, 0.85, 1].map((scale) => (
                  <button
                    key={scale}
                    type="button"
                    onClick={() => setZoomScale(scale)}
                    className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition ${
                      zoomScale === scale
                        ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs'
                        : 'text-stone-500 hover:text-stone-800 dark:hover:text-stone-200'
                    }`}
                  >
                    {Math.round(scale * 100)}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Device Presets Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {DEVICE_PRESETS.map((preset) => {
              const Icon = preset.icon
              const isSelected = selectedDevice.id === preset.id
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setSelectedDevice(preset)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-150 shrink-0 ${
                    isSelected
                      ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                      : 'bg-stone-100 dark:bg-stone-800/80 hover:bg-stone-200/70 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 border border-stone-200/60 dark:border-stone-700/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{preset.name}</span>
                  <span
                    className={`text-[10px] font-mono opacity-80 px-1.5 py-0.2 rounded-md ${
                      isSelected ? 'bg-white/20' : 'bg-stone-200/70 dark:bg-stone-900/60'
                    }`}
                  >
                    {preset.width}×{preset.height}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Page Preview Switcher */}
          <div className="flex items-center justify-between gap-2 p-2 bg-stone-100/80 dark:bg-stone-800/50 rounded-2xl border border-stone-200/50 dark:border-stone-700/50">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 pl-2">
              Preview Simulation:
            </span>
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'dashboard', label: 'Dashboard & Metrics' },
                { id: 'students', label: 'Student Directory' },
                { id: 'attendance', label: 'Attendance Roster' },
                { id: 'grades', label: 'Report Cards & Exams' },
              ].map((pg) => (
                <button
                  key={pg.id}
                  type="button"
                  onClick={() => setSimulatedPage(pg.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    simulatedPage === pg.id
                      ? 'bg-white dark:bg-stone-700 text-brand-700 dark:text-brand-300 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                  }`}
                >
                  {pg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Viewport Canvas Stage Area */}
          <div className="relative min-h-[560px] bg-stone-950/90 rounded-3xl p-6 flex items-center justify-center overflow-x-auto overflow-y-hidden border border-stone-800/80 shadow-inner">
            {/* Dimensions Calibration Watermark */}
            <div className="absolute top-3 left-4 text-[11px] font-mono text-stone-500 flex items-center gap-2">
              <span>CANVAS: {effectiveWidth}px width × {effectiveHeight}px height</span>
              <span>•</span>
              <span>SCALE: {Math.round(zoomScale * 100)}%</span>
              <span>•</span>
              <span>TARGET BREAKPOINT: {getSimulatedBreakpoint(effectiveWidth)}</span>
            </div>

            {/* Simulated Device Frame */}
            <div
              style={{
                width: `${effectiveWidth}px`,
                height: `${effectiveHeight}px`,
                transform: `scale(${zoomScale})`,
                transformOrigin: 'center center',
              }}
              className={`relative transition-all duration-300 overflow-hidden flex flex-col ${
                showFrame
                  ? 'bg-stone-900 rounded-[44px] ring-12 ring-stone-800/90 shadow-2xl border-4 border-stone-950'
                  : 'bg-stone-900 rounded-2xl shadow-xl'
              }`}
            >
              {/* Dynamic Island / Notch on mobile */}
              {showFrame && !isLandscape && selectedDevice.notch === 'dynamic-island' && (
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 z-40 h-7 w-28 bg-black rounded-full flex items-center justify-between px-2.5 shadow-md">
                  <div className="w-2.5 h-2.5 rounded-full bg-stone-900" />
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-950" />
                  </div>
                </div>
              )}

              {/* Status Bar */}
              <div className="h-10 bg-white/95 dark:bg-stone-900/95 border-b border-stone-200/50 dark:border-stone-800 px-6 flex items-center justify-between text-[11px] font-semibold text-stone-800 dark:text-stone-200 shrink-0 select-none">
                <span>09:41</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold">5G</span>
                  <div className="w-4 h-2 rounded-xs border border-stone-400 dark:border-stone-500 relative">
                    <div className="absolute inset-0.5 bg-emerald-500 rounded-xs" />
                  </div>
                </div>
              </div>

              {/* Scrollable Viewport Content */}
              <div className="flex-1 bg-stone-50 dark:bg-stone-950 overflow-y-auto p-4 space-y-4 text-stone-900 dark:text-stone-100 relative">
                {/* 12-Col Grid Overlay */}
                {showGridOverlay && (
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-12 gap-2 p-4 z-30 opacity-20">
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-violet-500 border border-violet-600 rounded-xs h-full"
                      />
                    ))}
                  </div>
                )}

                {/* Simulated Screen Body based on selection */}
                {simulatedPage === 'dashboard' && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                          Academic Overview
                        </h4>
                        <p className="text-xs text-stone-500">Term 2 • 2026 Academic Year</p>
                      </div>
                      <span className="p-1.5 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-600">
                        <Award className="w-4 h-4" />
                      </span>
                    </div>

                    {/* Stats Grid inside simulator */}
                    <div
                      className={`grid gap-2.5 ${
                        effectiveWidth < 600
                          ? 'grid-cols-2'
                          : effectiveWidth < 900
                          ? 'grid-cols-3'
                          : 'grid-cols-4'
                      }`}
                    >
                      {[
                        { label: 'Total Enrolled', val: '1,420', change: '+5.4%' },
                        { label: 'Attendance', val: '96.2%', change: '+0.8%' },
                        { label: 'Avg Grade', val: '84.6%', change: '+1.2%' },
                        { label: 'Pending Leaves', val: '4', change: '-2' },
                      ].map((st, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs"
                        >
                          <span className="text-[10px] uppercase font-bold text-stone-400 block truncate">
                            {st.label}
                          </span>
                          <span className="text-base sm:text-lg font-black text-stone-900 dark:text-stone-100 mt-0.5 block">
                            {st.val}
                          </span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            {st.change}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Live Schedule Cards */}
                    <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 shadow-xs space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span>Today's Classes</span>
                        <span className="text-brand-600">View all</span>
                      </div>
                      <div className="space-y-2">
                        {[
                          { time: '08:00 - 09:30', title: 'Grade 10A Mathematics', room: 'Room 204' },
                          { time: '10:00 - 11:30', title: 'Grade 11B Physics Lab', room: 'Lab B' },
                        ].map((c, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/50 dark:border-stone-700/50 flex items-center justify-between gap-2 text-xs"
                          >
                            <div>
                              <p className="font-bold text-stone-800 dark:text-stone-200">
                                {c.title}
                              </p>
                              <p className="text-[11px] text-stone-400">{c.time}</p>
                            </div>
                            <span className="px-2 py-0.5 rounded-md bg-stone-200/70 dark:bg-stone-700 text-[10px] font-semibold text-stone-700 dark:text-stone-300">
                              {c.room}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {simulatedPage === 'students' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm">Student Registry (342 Students)</h4>
                      <span className="text-xs px-2 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-semibold">
                        Grade 10
                      </span>
                    </div>

                    {/* Adaptive List */}
                    <div className="space-y-2">
                      {[
                        { name: 'Rom Sreyneath', id: 'STU-2026-001', gpa: '3.92', status: 'Enrolled' },
                        { name: 'Sokha Chan', id: 'STU-2026-002', gpa: '3.75', status: 'Enrolled' },
                        { name: 'Dara Heng', id: 'STU-2026-003', gpa: '3.88', status: 'Enrolled' },
                      ].map((s, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 flex items-center justify-between gap-3 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold flex items-center justify-center shrink-0">
                              {s.name.substring(0, 2)}
                            </div>
                            <div>
                              <p className="font-bold text-stone-800 dark:text-stone-200">{s.name}</p>
                              <p className="text-[11px] text-stone-400">{s.id}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold font-mono text-stone-800 dark:text-stone-200">
                              GPA {s.gpa}
                            </span>
                            <span className="block text-[10px] text-emerald-600 font-semibold">
                              {s.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {simulatedPage === 'attendance' && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm">Roster: Grade 10-A</h4>
                      <span className="text-xs text-stone-400">August 31, 2026</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl text-[11px] font-bold text-center">
                      <div className="p-1 rounded-lg bg-emerald-600 text-white">28 Present</div>
                      <div className="p-1 rounded-lg bg-amber-500 text-white">2 Late</div>
                      <div className="p-1 rounded-lg bg-rose-600 text-white">1 Absent</div>
                      <div className="p-1 rounded-lg bg-violet-600 text-white">1 Excused</div>
                    </div>

                    <div className="space-y-2">
                      {['Rom Sreyneath', 'Sokha Chan', 'Bona Lim'].map((name, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 flex items-center justify-between gap-2 text-xs"
                        >
                          <span className="font-bold">{name}</span>
                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]"
                            >
                              Present
                            </button>
                            <button
                              type="button"
                              className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-500 text-[10px]"
                            >
                              Late
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {simulatedPage === 'grades' && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-sm">Midterm Examination Marks</h4>
                    <div className="p-3 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 space-y-2 text-xs">
                      {[
                        { subject: 'Advanced Mathematics', score: '94 / 100', grade: 'A' },
                        { subject: 'Physics & Chemistry', score: '88 / 100', grade: 'B+' },
                        { subject: 'English Literature', score: '96 / 100', grade: 'A+' },
                      ].map((sub, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-1 border-b border-stone-100 dark:border-stone-800 last:border-0"
                        >
                          <span className="font-medium text-stone-700 dark:text-stone-300">
                            {sub.subject}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                              {sub.score}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-[10px]">
                              {sub.grade}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Home Bar */}
              {showFrame && !isLandscape && selectedDevice.category === 'mobile' && (
                <div className="h-6 bg-white/95 dark:bg-stone-900/95 flex items-center justify-center shrink-0">
                  <div className="w-32 h-1 rounded-full bg-stone-300 dark:bg-stone-700" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================================
            3. INTERACTIVE RESPONSIVE PRIMITIVES PLAYGROUND
           ========================================================================= */}
        <div className="p-4 sm:p-6 rounded-3xl glass-sm border border-stone-200/70 dark:border-stone-800 shadow-md space-y-6">
          <div className="border-b border-stone-200/60 dark:border-stone-800 pb-3">
            <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-600 dark:text-brand-400" />
              Responsive Layout Primitives Playground
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Test and verify all built-in responsive components: ResponsiveGrid, ResponsiveStack, Show/Hide, and ResponsiveSheet.
            </p>
          </div>

          {/* Primitive 1: ResponsiveGrid Live Test */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <LayoutGrid className="w-4 h-4 text-brand-600" />
                1. ResponsiveGrid Component
              </h3>
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="text-stone-400 font-medium">Columns:</span>
                {[1, 2, 3, 4, 6].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setGridColumns(col)}
                    className={`px-2.5 py-1 rounded-lg font-bold transition ${
                      gridColumns === col
                        ? 'bg-brand-600 text-white'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    {col} Col
                  </button>
                ))}
                <span className="text-stone-400 font-medium ml-2">Gap:</span>
                {(['sm', 'md', 'lg'] as const).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGridGap(g)}
                    className={`px-2.5 py-1 rounded-lg font-bold uppercase transition ${
                      gridGap === g
                        ? 'bg-stone-800 text-white dark:bg-white dark:text-stone-900'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <ResponsiveGrid
              cols={{
                base: 1,
                sm: (Math.min(gridColumns, 2) as any) || 1,
                md: (Math.min(gridColumns, 3) as any) || 2,
                lg: (gridColumns as any) || 3,
                xl: (gridColumns as any) || 4,
              }}
              gap={gridGap}
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-xs flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 flex items-center justify-center font-bold text-sm shrink-0">
                    0{i + 1}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-stone-900 dark:text-stone-100 truncate">
                      Responsive Card {i + 1}
                    </p>
                    <p className="text-[11px] text-stone-400 truncate">
                      Adapts automatically per breakpoint
                    </p>
                  </div>
                </div>
              ))}
            </ResponsiveGrid>
          </div>

          {/* Primitive 2: ResponsiveStack Live Test */}
          <div className="space-y-3 pt-4 border-t border-stone-200/60 dark:border-stone-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-brand-600" />
                2. ResponsiveStack Component
              </h3>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-400 font-medium">Direction:</span>
                <button
                  type="button"
                  onClick={() => setStackDirection('row')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    stackDirection === 'row'
                      ? 'bg-brand-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Row (Horizontal)
                </button>
                <button
                  type="button"
                  onClick={() => setStackDirection('col')}
                  className={`px-3 py-1 rounded-lg font-bold transition ${
                    stackDirection === 'col'
                      ? 'bg-brand-600 text-white'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  Column (Vertical)
                </button>
              </div>
            </div>

            <ResponsiveStack
              direction={{ base: 'col', md: stackDirection }}
              gap="md"
              align="center"
              justify="between"
              className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/70 dark:border-stone-800"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-800 dark:text-stone-200">
                    Stack Header Group
                  </h4>
                  <p className="text-[11px] text-stone-400">Flips to vertical on mobile automatically</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="solidOutline" size="sm">
                  Secondary Action
                </Button>
                <Button variant="solid" size="sm">
                  Primary Action
                </Button>
              </div>
            </ResponsiveStack>
          </div>

          {/* Primitive 3: Show & Hide Declarative Breakpoints */}
          <div className="space-y-3 pt-4 border-t border-stone-200/60 dark:border-stone-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-brand-600" />
              3. Show & Hide Conditional Breakpoint Helpers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-2">
                <p className="font-bold text-stone-800 dark:text-stone-200">
                  Visible on Mobile Devices Only (&lt; 768px):
                </p>
                <Show only="mobile" fallback={<span className="text-stone-400 italic">Hidden on desktop viewports</span>}>
                  <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold">
                    📱 Active: You are currently on a mobile-sized viewport!
                  </div>
                </Show>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 space-y-2">
                <p className="font-bold text-stone-800 dark:text-stone-200">
                  Visible on Desktop Screens Only (≥ 1024px):
                </p>
                <Show only="desktop" fallback={<span className="text-stone-400 italic">Hidden on mobile/tablet viewports</span>}>
                  <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-300 font-bold">
                    💻 Active: You are currently viewing on a full desktop screen!
                  </div>
                </Show>
              </div>
            </div>
          </div>

          {/* Primitive 4: ResponsiveSheet Bottom-Sheet / Modal Demo */}
          <div className="space-y-3 pt-4 border-t border-stone-200/60 dark:border-stone-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 flex items-center gap-1.5">
                  <MousePointerClick className="w-4 h-4 text-brand-600" />
                  4. ResponsiveSheet (Bottom-Sheet on Mobile, Modal on Desktop)
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  Includes pull-down touch gesture dismissal on touch devices and centered dialog on large displays.
                </p>
              </div>

              <Button
                variant="solid"
                size="sm"
                onClick={() => setTestSheetOpen(true)}
              >
                Open Responsive Sheet
              </Button>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. RESPONSIVE DESIGN SPECIFICATIONS & AUDIT RULES
           ========================================================================= */}
        <div className="p-4 sm:p-6 rounded-3xl glass-sm border border-stone-200/70 dark:border-stone-800 shadow-md space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            Responsive Breakpoint Standards & Layout Guidelines
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                bp: 'xs (< 640px) & sm (640px)',
                title: 'Mobile Form Factor',
                rules: [
                  'Full-bleed card lists with single-tap quick action bars',
                  'Bottom sheet drawers with touch drag handles',
                  'Minimum 44×44px touch targets for all primary buttons',
                  'Collapsible search drawer & single-line pills',
                ],
              },
              {
                bp: 'md (768px) & lg (1024px)',
                title: 'Tablet & Laptop Form Factor',
                rules: [
                  'Compact sidebar rail mode with hover popover menus',
                  '2-to-3 column bento grid reflow for analytics & schedules',
                  'Inline search bar with quick ⌘K keyboard shortcut',
                  'Sticky table headers with fluid horizontal scrollbars',
                ],
              },
              {
                bp: 'xl (1280px) & 2xl (1536px+)',
                title: 'Large Desktop & UltraWide',
                rules: [
                  'Max-width container constraints (max-w-7xl) preventing text stretching',
                  'Expanded dual-pane split layouts for rosters & report cards',
                  'Full multi-column data tables with direct in-place editing',
                  'Rich breadcrumbs with deep path copy tools',
                ],
              },
            ].map((guide, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-stone-800 space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-stone-900 dark:text-stone-100">
                    {guide.title}
                  </h3>
                  <span className="font-mono text-[10px] font-bold text-brand-600 dark:text-brand-400">
                    {guide.bp}
                  </span>
                </div>
                <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400">
                  {guide.rules.map((rule, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Demo Sheet Modal instance */}
        <ResponsiveSheet
          isOpen={testSheetOpen}
          onClose={() => setTestSheetOpen(false)}
          title="Adaptive Responsive Sheet"
          description="Drag down on mobile or click backdrop / escape to dismiss."
          footer={
            <>
              <Button
                variant="solidOutline"
                size="sm"
                onClick={() => setTestSheetOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="solid"
                size="sm"
                onClick={() => setTestSheetOpen(false)}
              >
                Save Changes
              </Button>
            </>
          }
        >

          <div className="space-y-4 text-xs text-stone-700 dark:text-stone-300">
            <p>
              This component automatically adapts to the user's viewport:
            </p>
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-900/50 text-brand-800 dark:text-brand-300">
              On screen widths &lt; 768px, it renders as a native-feeling mobile bottom sheet with touch drag-handle gesture dismissal. On desktop screens, it smoothly centers as an accessible glass dialog.
            </div>
            <div className="space-y-2">
              <label className="font-bold block">Test Form Field</label>
              <input
                type="text"
                placeholder="Enter sample text..."
                className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs"
              />
            </div>
          </div>
        </ResponsiveSheet>
      </div>
    </ResponsiveScreen>
  )
}

function getSimulatedBreakpoint(width: number): string {
  if (width >= 1536) return '2XL (≥ 1536px)'
  if (width >= 1280) return 'XL (1280px - 1535px)'
  if (width >= 1024) return 'LG (1024px - 1279px)'
  if (width >= 768) return 'MD (768px - 1023px)'
  if (width >= 640) return 'SM (640px - 767px)'
  return 'XS (< 640px)'
}
