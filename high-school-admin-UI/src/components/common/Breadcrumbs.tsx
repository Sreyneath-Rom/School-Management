import React, { useState, useRef, useEffect, useMemo } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Home,
  ArrowLeft,
  Copy,
  Check,
  MoreHorizontal,
  FolderOpen,
} from 'lucide-react'
import { useTranslations } from '@/i18n'
import { useAuth } from '@/hooks/useAuth'

// ============================================================================
// TYPES & CONFIGURATION
// ============================================================================

export interface BreadcrumbItem {
  label: string
  path?: string
  isCurrent?: boolean
  icon?: React.ComponentType<{ size?: number; className?: string }>
}

interface SegmentConfig {
  key: string
  fallback: string
  parentPath?: string
  defaultChildPath?: string
}

// Map path segments to their i18n translation keys and default fallback labels
const SEGMENT_CONFIGS: Record<string, SegmentConfig> = {
  // Main Sections
  dashboard: { key: 'sidebar.dashboard', fallback: 'Dashboard' },
  setup: { key: 'sidebar.setup', fallback: 'Setup', defaultChildPath: '/setup/school' },
  academic: { key: 'sidebar.academic', fallback: 'Academic', defaultChildPath: '/academic/classes' },
  students: { key: 'sidebar.students', fallback: 'Students', defaultChildPath: '/students' },
  teachers: { key: 'sidebar.teachers', fallback: 'Teachers', defaultChildPath: '/teachers' },
  communication: { key: 'sidebar.communication', fallback: 'Communication', defaultChildPath: '/communication/announcements' },
  reports: { key: 'sidebar.reports', fallback: 'Reports', defaultChildPath: '/reports/attendance' },
  fees: { key: 'sidebar.fees', fallback: 'Finance & Fees', defaultChildPath: '/fees/structures' },
  library: { key: 'sidebar.library', fallback: 'Library', defaultChildPath: '/library/books' },
  calendar: { key: 'sidebar.calendar', fallback: 'Calendar', defaultChildPath: '/calendar' },
  messages: { key: 'sidebar.messages', fallback: 'Messages', defaultChildPath: '/messages' },
  system: { key: 'sidebar.system', fallback: 'System', defaultChildPath: '/system/logs' },
  parent: { key: 'sidebar.children', fallback: 'Parent Portal', defaultChildPath: '/parent/dashboard' },
  children: { key: 'sidebar.myChildren', fallback: 'My Children', defaultChildPath: '/parent/children' },

  // Setup sub-items
  school: { key: 'sidebar.schoolSetup', fallback: 'School Information' },
  'academic-years': { key: 'sidebar.academicYears', fallback: 'Academic Years' },
  terms: { key: 'sidebar.terms', fallback: 'Terms' },
  subjects: { key: 'sidebar.subjects', fallback: 'Subjects' },
  rooms: { key: 'sidebar.rooms', fallback: 'Rooms' },
  roles: { key: 'sidebar.rolesPermissions', fallback: 'Roles & Permissions' },
  users: { key: 'sidebar.users', fallback: 'Users' },
  translations: { key: 'sidebar.translations', fallback: 'Translations' },

  // Academic sub-items
  classes: { key: 'sidebar.classes', fallback: 'Classes' },
  'class-subjects': { key: 'sidebar.classSubjects', fallback: 'Class Subjects' },
  lessons: { key: 'sidebar.lessons', fallback: 'Lessons' },
  homework: { key: 'sidebar.homework', fallback: 'Homework' },
  quizzes: { key: 'sidebar.quizTests', fallback: 'Quizzes' },
  grades: { key: 'sidebar.grades', fallback: 'Grades' },
  exams: { key: 'sidebar.exams', fallback: 'Exams', defaultChildPath: '/academic/exams' },
  'exam-schedules': { key: 'sidebar.examSchedules', fallback: 'Exam Schedules' },
  'mark-entry': { key: 'sidebar.markEntry', fallback: 'Mark Entry' },
  'report-cards': { key: 'sidebar.reportCards', fallback: 'Report Cards' },

  // Exam actions
  create: { key: 'breadcrumb.createExam', fallback: 'Create' },
  edit: { key: 'breadcrumb.editExam', fallback: 'Edit' },
  marks: { key: 'breadcrumb.marksEntry', fallback: 'Mark Entry' },

  // Fees sub-items
  structures: { key: 'sidebar.feeStructures', fallback: 'Fee Structures' },
  invoices: { key: 'sidebar.invoices', fallback: 'Invoices' },
  payments: { key: 'sidebar.payments', fallback: 'Payments' },
  history: { key: 'sidebar.paymentHistory', fallback: 'Payment History' },

  // Library sub-items
  books: { key: 'sidebar.books', fallback: 'Books' },
  categories: { key: 'sidebar.libraryCategories', fallback: 'Categories' },
  borrow: { key: 'sidebar.borrow', fallback: 'Borrowing' },
  returns: { key: 'sidebar.returns', fallback: 'Returns' },
  overdue: { key: 'sidebar.overdueBooks', fallback: 'Overdue Books' },

  // Calendar sub-items
  events: { key: 'sidebar.calendarEvents', fallback: 'Events' },
  holidays: { key: 'sidebar.calendarHolidays', fallback: 'Holidays' },

  // Student sub-items
  profiles: { key: 'sidebar.studentProfiles', fallback: 'Profiles' },
  attendance: { key: 'sidebar.attendance', fallback: 'Attendance' },
  'leave-requests': { key: 'sidebar.leaveRequests', fallback: 'Leave Requests' },

  // Teacher sub-items
  assignments: { key: 'sidebar.teacherAssignments', fallback: 'Teacher Assignments' },

  // Communication sub-items
  announcements: { key: 'sidebar.announcements', fallback: 'Announcements' },
  notifications: { key: 'sidebar.notifications', fallback: 'Notifications' },

  // Report sub-items
  'attendance-report': { key: 'sidebar.attendanceReport', fallback: 'Attendance Report' },
  'grade-report': { key: 'sidebar.gradeReport', fallback: 'Academic Performance' },
  'student-report': { key: 'sidebar.studentReport', fallback: 'Student Report' },
  'teacher-report': { key: 'sidebar.teacherReport', fallback: 'Teacher Report' },
  'finance-report': { key: 'sidebar.financeReport', fallback: 'Finance Report' },
  'library-report': { key: 'sidebar.libraryReport', fallback: 'Library Report' },

  // System sub-items
  logs: { key: 'sidebar.auditLogs', fallback: 'Audit Logs' },
  activity: { key: 'sidebar.activityLogs', fallback: 'Activity Logs' },
  'system-settings': { key: 'sidebar.systemSettings', fallback: 'System Settings' },
  'responsive-studio': { key: 'sidebar.responsiveStudio', fallback: 'Responsive Screen Studio' },
  screens: { key: 'sidebar.responsiveStudio', fallback: 'Responsive Screen Studio' },

  // User Profile & Settings
  profile: { key: 'header.myProfile', fallback: 'My Profile' },
  settings: { key: 'header.settings', fallback: 'Settings' },
}

// Human readable string helper for dynamic IDs and kebab-case
function formatSegmentLabel(segment: string): string {
  if (!segment) return ''
  // If it looks like an ID (e.g. s1, STU-101, 1234, etc.)
  if (/^[a-zA-Z0-9_-]{8,}$/.test(segment) || /^(id|stu|tch|par|cls|ex|bk|inv)-/i.test(segment)) {
    return `#${segment}`
  }
  return segment
    .split(/[-_]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export interface BreadcrumbsProps {
  className?: string
  showBackButton?: boolean
  showCopyLink?: boolean
  customItems?: BreadcrumbItem[]
}

export default function Breadcrumbs({
  className = '',
  showBackButton = true,
  showCopyLink = true,
  customItems,
}: BreadcrumbsProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useTranslations()
  const { role } = useAuth()
  const [copied, setCopied] = useState(false)
  const [collapsedOpen, setCollapsedOpen] = useState(false)
  const dropdownRef = useRef<HTMLLIElement>(null)

  // Determine root dashboard path according to user role
  const homePath = useMemo(() => {
    switch (role) {
      case 'teacher':
        return '/teacher/dashboard'
      case 'student':
        return '/student/dashboard'
      case 'parent':
        return '/parent/dashboard'
      default:
        return '/dashboard'
    }
  }, [role])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCollapsedOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Auto-generate items based on pathname if customItems is not provided
  const items = useMemo<BreadcrumbItem[]>(() => {
    if (customItems && customItems.length > 0) {
      return customItems
    }

    const pathname = location.pathname
    const segments = pathname.split('/').filter(Boolean)

    // Base "Home / Dashboard" breadcrumb
    const homeItem: BreadcrumbItem = {
      label: t('breadcrumb.home') || 'Home',
      path: homePath,
      icon: Home,
      isCurrent: pathname === homePath || pathname === '/',
    }

    if (pathname === '/' || pathname === homePath) {
      return [{ ...homeItem, isCurrent: true }]
    }

    const breadcrumbs: BreadcrumbItem[] = [homeItem]
    let accumulatedPath = ''

    // Filter out role prefixes if they are just namespaces (e.g. /teacher/, /student/, /parent/)
    // but keep track of the full path for accurate links
    const isRolePrefix = (seg: string, idx: number) => {
      return idx === 0 && ['teacher', 'student', 'parent'].includes(seg)
    }

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      accumulatedPath += `/${segment}`

      // Skip the role namespace token from showing as a duplicate "Teacher" / "Student"
      // segment unless it is the only segment (e.g. /parent/dashboard)
      if (isRolePrefix(segment, i) && segments.length > 1) {
        if (segments[i + 1] === 'dashboard') {
          // Skip if following is dashboard since Home already covers it
          continue
        }
        continue
      }

      if (segment === 'dashboard' && i > 0) {
        // Skip duplicate dashboard
        continue
      }

      const isLast = i === segments.length - 1
      const config = SEGMENT_CONFIGS[segment.toLowerCase()]

      let label = ''
      if (config?.key) {
        label = t(config.key as never) || config.fallback
      } else {
        label = formatSegmentLabel(segment)
      }

      // Contextual tweaks for special dynamic segments
      const prevSegment = i > 0 ? segments[i - 1].toLowerCase() : ''
      if (segment === 'create') {
        if (prevSegment === 'events') {
          label = t('breadcrumb.createEvent') || 'Create Event'
        } else if (prevSegment === 'exams') {
          label = t('breadcrumb.createExam') || 'Create Exam'
        }
      } else if (segment === 'edit') {
        if (prevSegment === 'events') {
          label = t('breadcrumb.editEvent') || 'Edit Event'
        } else if (prevSegment === 'exams') {
          label = t('breadcrumb.editExam') || 'Edit Exam'
        }
      } else if (segment === 'marks') {
        label = t('breadcrumb.marksEntry') || 'Mark Entry'
      } else if (prevSegment === 'children' && !config) {
        label = `${t('breadcrumb.childDetails') || 'Child Details'} (${segment})`
      } else if (prevSegment === 'messages' && !config) {
        label = `${t('breadcrumb.conversation') || 'Conversation'} (${segment})`
      }

      // If this is a category parent route with a default child (e.g., /setup or /academic),
      // link directly to its primary child path
      const resolvedPath = isLast
        ? undefined
        : (config?.defaultChildPath && accumulatedPath === `/${segment}`
            ? config.defaultChildPath
            : accumulatedPath)

      breadcrumbs.push({
        label,
        path: resolvedPath,
        isCurrent: isLast,
      })
    }

    return breadcrumbs
  }, [location.pathname, customItems, homePath, t])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback if clipboard API is restricted
      const input = document.createElement('input')
      input.value = window.location.href
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // If there's only 1 item and it's the home page, render a compact status trail
  const isSingleHome = items.length <= 1

  // Handle collapsible items for responsive mobile view
  const shouldCollapse = items.length > 3
  const firstItem = items[0]
  const lastItem = items[items.length - 1]
  const middleItems = shouldCollapse ? items.slice(1, -1) : []

  return (
    <nav
      id="app-breadcrumb-navigation"
      aria-label="Breadcrumb"
      className={`mb-4 sm:mb-6 flex flex-wrap items-center justify-between gap-2 sm:gap-3 rounded-2xl glass-sm px-3.5 sm:px-4 py-2 sm:py-2.5 transition-all text-xs sm:text-sm ${className}`}
    >
      {/* LEFT: Breadcrumb items trail */}
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {/* Back Button (if not on root dashboard) */}
        {showBackButton && !isSingleHome && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={t('breadcrumb.back') || 'Go back'}
            title={t('breadcrumb.back') || 'Back'}
            className="mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100 hover:text-stone-900 active:scale-95 transition dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
          >
            <ArrowLeft size={15} />
          </button>
        )}

        <ol className="flex min-w-0 items-center gap-1 sm:gap-1.5 list-none p-0 m-0">
          {/* Normal rendering for short trails */}
          {!shouldCollapse ? (
            items.map((item, index) => {
              const isLast = index === items.length - 1
              const Icon = item.icon

              return (
                <li
                  key={`${item.label}-${index}`}
                  className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap min-w-0"
                >
                  {index > 0 && (
                    <ChevronRight
                      size={13}
                      className="shrink-0 text-stone-400 dark:text-stone-600"
                      aria-hidden="true"
                    />
                  )}

                  {isLast ? (
                    <span
                      aria-current="page"
                      className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[200px] sm:max-w-[320px] md:max-w-none"
                    >
                      {Icon && <Icon size={14} className="shrink-0 text-brand-600 dark:text-brand-400" />}
                      <span className="truncate">{item.label}</span>
                    </span>
                  ) : item.path ? (
                    <Link
                      to={item.path}
                      className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-stone-500 hover:bg-stone-100 hover:text-brand-600 transition dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-brand-400"
                    >
                      {Icon && <Icon size={14} className="shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 px-1.5 py-0.5 text-stone-500 dark:text-stone-400">
                      {Icon && <Icon size={14} className="shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </span>
                  )}
                </li>
              )
            })
          ) : (
            /* Collapsed rendering with middle dropdown for long trails */
            <>
              {/* First Item (Home) */}
              <li className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                {firstItem.path ? (
                  <Link
                    to={firstItem.path}
                    className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-stone-500 hover:bg-stone-100 hover:text-brand-600 transition dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-brand-400"
                  >
                    {firstItem.icon && <firstItem.icon size={14} className="shrink-0" />}
                    <span className="hidden sm:inline">{firstItem.label}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-1.5 py-0.5 text-stone-500 dark:text-stone-400">
                    {firstItem.icon && <firstItem.icon size={14} className="shrink-0" />}
                    <span className="hidden sm:inline">{firstItem.label}</span>
                  </span>
                )}
                <ChevronRight size={13} className="shrink-0 text-stone-400 dark:text-stone-600" aria-hidden="true" />
              </li>

              {/* Middle Collapsed Dropdown */}
              <li className="relative flex items-center" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCollapsedOpen((prev) => !prev)}
                  aria-expanded={collapsedOpen}
                  aria-label="Show collapsed breadcrumb items"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-stone-500 hover:bg-stone-100 hover:text-stone-900 transition dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
                >
                  <MoreHorizontal size={15} />
                </button>

                {collapsedOpen && (
                  <div className="absolute left-0 top-full z-40 mt-1.5 min-w-44 rounded-xl glass-sm p-1.5 shadow-xl border border-stone-200/60 dark:border-stone-700/60">
                    {middleItems.map((midItem, idx) => (
                      <div key={idx}>
                        {midItem.path ? (
                          <Link
                            to={midItem.path}
                            onClick={() => setCollapsedOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-stone-700 hover:bg-stone-100 hover:text-brand-600 transition dark:text-stone-300 dark:hover:bg-white/5 dark:hover:text-brand-400"
                          >
                            <FolderOpen size={13} className="text-stone-400" />
                            <span className="truncate">{midItem.label}</span>
                          </Link>
                        ) : (
                          <span className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-stone-500 dark:text-stone-400">
                            <FolderOpen size={13} className="text-stone-400" />
                            <span className="truncate">{midItem.label}</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <ChevronRight size={13} className="ml-1 shrink-0 text-stone-400 dark:text-stone-600" aria-hidden="true" />
              </li>

              {/* Last Item (Active Page) */}
              <li className="flex items-center gap-1.5 whitespace-nowrap min-w-0">
                <span
                  aria-current="page"
                  className="flex items-center gap-1.5 font-semibold text-stone-900 dark:text-stone-100 truncate max-w-[200px] sm:max-w-[320px] md:max-w-none"
                >
                  {lastItem.icon && <lastItem.icon size={14} className="shrink-0 text-brand-600 dark:text-brand-400" />}
                  <span className="truncate">{lastItem.label}</span>
                </span>
              </li>
            </>
          )}
        </ol>
      </div>

      {/* RIGHT: Quick Utility Actions (e.g. Copy Link) */}
      {showCopyLink && (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={t('breadcrumb.copyLink') || 'Copy page link'}
            title={copied ? (t('breadcrumb.linkCopied') || 'Copied!') : (t('breadcrumb.copyLink') || 'Copy page link')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
              copied
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-200'
            }`}
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">{t('breadcrumb.linkCopied') || 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span className="hidden sm:inline">{t('breadcrumb.copyLink') || 'Copy Link'}</span>
              </>
            )}
          </button>
        </div>
      )}
    </nav>
  )
}
