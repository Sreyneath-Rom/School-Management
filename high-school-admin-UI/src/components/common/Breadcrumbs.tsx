// src/components/common/Breadcrumbs.tsx
import { useState, useRef, useEffect, useMemo, type ComponentType } from 'react'
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
import { useTranslations } from '@/i18n/useTranslations'
import { useAuth } from '@/hooks/useAuth'

// ============================================================================
// Types
// ============================================================================

export interface BreadcrumbItem {
  label: string
  path?: string
  isCurrent?: boolean
  icon?: ComponentType<{ size?: number; className?: string }>
}

interface SegmentConfig {
  key: string
  fallback: string
  parentPath?: string
  defaultChildPath?: string
}

const SEGMENT_CONFIGS: Record<string, SegmentConfig> = {
  dashboard: { key: 'sidebar.dashboard', fallback: 'Dashboard' },
  setup: { key: 'sidebar.setup', fallback: 'Setup', defaultChildPath: '/setup/school' },
  academic: { key: 'sidebar.academic', fallback: 'Academic', defaultChildPath: '/academic/classes' },
  students: { key: 'sidebar.students', fallback: 'Students', defaultChildPath: '/students' },
  teachers: { key: 'sidebar.teachers', fallback: 'Teachers', defaultChildPath: '/teachers' },
  communication: { key: 'sidebar.communication', fallback: 'Communication', defaultChildPath: '/communication/announcements' },
  reports: { key: 'sidebar.reports', fallback: 'Reports', defaultChildPath: '/reports/attendance' },
  calendar: { key: 'sidebar.calendar', fallback: 'Calendar', defaultChildPath: '/calendar' },
  messages: { key: 'sidebar.messages', fallback: 'Messages', defaultChildPath: '/messages' },
  system: { key: 'sidebar.system', fallback: 'System', defaultChildPath: '/system/logs' },
  parent: { key: 'sidebar.children', fallback: 'Parent Portal', defaultChildPath: '/parent/dashboard' },
  children: { key: 'sidebar.myChildren', fallback: 'My Children', defaultChildPath: '/parent/children' },

  school: { key: 'sidebar.schoolSetup', fallback: 'School Information' },
  'academic-years': { key: 'sidebar.academicYears', fallback: 'Academic Years' },
  terms: { key: 'sidebar.terms', fallback: 'Terms' },
  subjects: { key: 'sidebar.subjects', fallback: 'Subjects' },
  rooms: { key: 'sidebar.rooms', fallback: 'Rooms' },
  roles: { key: 'sidebar.rolesPermissions', fallback: 'Roles & Permissions' },
  users: { key: 'sidebar.users', fallback: 'Users' },
  translations: { key: 'sidebar.translations', fallback: 'Translations' },

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

  create: { key: 'breadcrumb.createExam', fallback: 'Create' },
  edit: { key: 'breadcrumb.editExam', fallback: 'Edit' },
  marks: { key: 'breadcrumb.marksEntry', fallback: 'Mark Entry' },

  events: { key: 'sidebar.calendarEvents', fallback: 'Events' },
  holidays: { key: 'sidebar.calendarHolidays', fallback: 'Holidays' },

  profiles: { key: 'sidebar.studentProfiles', fallback: 'Profiles' },
  attendance: { key: 'sidebar.attendance', fallback: 'Attendance' },
  'leave-requests': { key: 'sidebar.leaveRequests', fallback: 'Leave Requests' },

  assignments: { key: 'sidebar.teacherAssignments', fallback: 'Teacher Assignments' },

  announcements: { key: 'sidebar.announcements', fallback: 'Announcements' },
  notifications: { key: 'sidebar.notifications', fallback: 'Notifications' },

  'attendance-report': { key: 'sidebar.attendanceReport', fallback: 'Attendance Report' },
  'grade-report': { key: 'sidebar.gradeReport', fallback: 'Academic Performance' },
  'student-report': { key: 'sidebar.studentReport', fallback: 'Student Report' },
  'teacher-report': { key: 'sidebar.teacherReport', fallback: 'Teacher Report' },

  logs: { key: 'sidebar.auditLogs', fallback: 'Audit Logs' },
  activity: { key: 'sidebar.activityLogs', fallback: 'Activity Logs' },
  'system-settings': { key: 'sidebar.systemSettings', fallback: 'System Settings' },

  profile: { key: 'header.myProfile', fallback: 'My Profile' },
  settings: { key: 'header.settings', fallback: 'Settings' },
}

function formatSegmentLabel(segment: string): string {
  if (!segment) return ''
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

  const homePath = useMemo(() => {
    switch (role) {
      case 'teacher': return '/teacher/dashboard'
      case 'student': return '/student/dashboard'
      case 'parent': return '/parent/dashboard'
      default: return '/dashboard'
    }
  }, [role])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setCollapsedOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const items = useMemo<BreadcrumbItem[]>(() => {
    if (customItems && customItems.length > 0) return customItems

    const pathname = location.pathname
    const segments = pathname.split('/').filter(Boolean)

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

    const isRolePrefix = (seg: string, idx: number) =>
      idx === 0 && ['teacher', 'student', 'parent'].includes(seg)

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      accumulatedPath += `/${segment}`

      if (isRolePrefix(segment, i) && segments.length > 1) continue
      if (segment === 'dashboard' && i > 0) continue

      const isLast = i === segments.length - 1
      const config = SEGMENT_CONFIGS[segment.toLowerCase()]

      let label = ''
      if (config?.key) {
        label = t(config.key as never) || config.fallback
      } else {
        label = formatSegmentLabel(segment)
      }

      const prevSegment = i > 0 ? segments[i - 1].toLowerCase() : ''
      if (segment === 'create') {
        if (prevSegment === 'events') label = t('breadcrumb.createEvent') || 'Create Event'
        else if (prevSegment === 'exams') label = t('breadcrumb.createExam') || 'Create Exam'
      } else if (segment === 'edit') {
        if (prevSegment === 'events') label = t('breadcrumb.editEvent') || 'Edit Event'
        else if (prevSegment === 'exams') label = t('breadcrumb.editExam') || 'Edit Exam'
      } else if (segment === 'marks') {
        label = t('breadcrumb.marksEntry') || 'Mark Entry'
      } else if (prevSegment === 'children' && !config) {
        label = `${t('breadcrumb.childDetails') || 'Child Details'} (${segment})`
      } else if (prevSegment === 'messages' && !config) {
        label = `${t('breadcrumb.conversation') || 'Conversation'} (${segment})`
      }

      const resolvedPath = isLast
        ? undefined
        : config?.defaultChildPath && accumulatedPath === `/${segment}`
          ? config.defaultChildPath
          : accumulatedPath

      breadcrumbs.push({ label, path: resolvedPath, isCurrent: isLast })
    }

    return breadcrumbs
  }, [location.pathname, customItems, homePath, t])

  const handleCopyLink = async () => {
    const markCopied = () => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }

    try {
      await navigator.clipboard.writeText(window.location.href)
      markCopied()
    } catch {
      const input = document.createElement('input')
      input.value = window.location.href
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      markCopied()
    }
  }

  const isSingleHome = items.length <= 1
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
      <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {showBackButton && !isSingleHome && (
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label={t('breadcrumb.back') || 'Go back'}
            title={t('breadcrumb.back') || 'Back'}
            className="mr-1 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-fg-muted hover:text-fg active:shadow-sunken transition cursor-pointer"
          >
            <ArrowLeft size={15} />
          </button>
        )}

        <ol className="flex min-w-0 items-center gap-1 sm:gap-1.5 list-none p-0 m-0">
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
                    <ChevronRight size={13} className="shrink-0 text-fg-muted" aria-hidden="true" />
                  )}

                  {isLast ? (
                    <span
                      aria-current="page"
                      className="flex items-center gap-1.5 font-semibold text-fg truncate max-w-50 sm:max-w-80 md:max-w-none"
                    >
                      {Icon && <Icon size={14} className="shrink-0 text-brand-600 dark:text-brand-400" />}
                      <span className="truncate">{item.label}</span>
                    </span>
                  ) : item.path ? (
                    <Link
                      to={item.path}
                      className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-fg-muted hover:text-brand-600 transition"
                    >
                      {Icon && <Icon size={14} className="shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 px-1.5 py-0.5 text-fg-muted">
                      {Icon && <Icon size={14} className="shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </span>
                  )}
                </li>
              )
            })
          ) : (
            <>
              <li className="flex items-center gap-1 sm:gap-1.5 whitespace-nowrap">
                {firstItem.path ? (
                  <Link
                    to={firstItem.path}
                    className="flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-fg-muted hover:text-brand-600 transition"
                  >
                    {firstItem.icon && <firstItem.icon size={14} className="shrink-0" />}
                    <span className="hidden sm:inline">{firstItem.label}</span>
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 px-1.5 py-0.5 text-fg-muted">
                    {firstItem.icon && <firstItem.icon size={14} className="shrink-0" />}
                    <span className="hidden sm:inline">{firstItem.label}</span>
                  </span>
                )}
                <ChevronRight size={13} className="shrink-0 text-fg-muted" aria-hidden="true" />
              </li>

              <li className="relative flex items-center" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setCollapsedOpen((prev) => !prev)}
                  aria-expanded={collapsedOpen}
                  aria-label="Show collapsed breadcrumb items"
                  className="flex h-6 w-6 items-center justify-center rounded-md text-fg-muted hover:text-fg transition cursor-pointer"
                >
                  <MoreHorizontal size={15} />
                </button>

                {collapsedOpen && (
                  // `.dropdown-surface` supplies the elevated shadow; the
                  // old `shadow-xl` was overriding it.
                  <div className="dropdown-surface left-0 top-full z-40 mt-1.5 min-w-44 rounded-xl p-1.5">
                    {middleItems.map((midItem, idx) => (
                      <div key={idx}>
                        {midItem.path ? (
                          <Link
                            to={midItem.path}
                            onClick={() => setCollapsedOpen(false)}
                            className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-fg-muted hover:text-brand-600 transition"
                          >
                            <FolderOpen size={13} />
                            <span className="truncate">{midItem.label}</span>
                          </Link>
                        ) : (
                          <span className="flex items-center gap-2 px-2.5 py-1.5 text-xs text-fg-muted">
                            <FolderOpen size={13} />
                            <span className="truncate">{midItem.label}</span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <ChevronRight size={13} className="ml-1 shrink-0 text-fg-muted" aria-hidden="true" />
              </li>

              <li className="flex items-center gap-1.5 whitespace-nowrap min-w-0">
                <span
                  aria-current="page"
                  className="flex items-center gap-1.5 font-semibold text-fg truncate max-w-50 sm:max-w-80 md:max-w-none"
                >
                  {lastItem.icon && (
                    <lastItem.icon size={14} className="shrink-0 text-brand-600 dark:text-brand-400" />
                  )}
                  <span className="truncate">{lastItem.label}</span>
                </span>
              </li>
            </>
          )}
        </ol>
      </div>

      {showCopyLink && (
        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handleCopyLink}
            aria-label={t('breadcrumb.copyLink') || 'Copy page link'}
            title={copied ? (t('breadcrumb.linkCopied') || 'Copied!') : (t('breadcrumb.copyLink') || 'Copy page link')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
              copied
                ? 'bg-success/15 text-success'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            {copied ? (
              <>
                <Check size={13} className="text-success" />
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