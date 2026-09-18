// src/types/index.ts

// ---- API envelope ----
export type {
  ApiSuccess,
  ApiFailure,
  ApiResponse,
  PaginationMeta,
  Paginated,
  SortOrder,
  ListQuery,
} from './api'
export { isApiFailure } from './api'

// ---- Auth ----
export type {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from './auth'

// ---- Users and roles ----
export type {
  UserRole,
  UserStatus,
  Gender,
  ParentRelationship,
  User,
  UserStudentProfile,
  UserTeacherProfile,
  CurrentUser,
} from './user'
export { getFullName, getDisplayClass, getDisplayDepartment, ROLE_LABELS, ROLE_COLORS } from './user'

export type {
  PermissionAction,
  PermissionDef,
  ModuleDef,
  RoleDef,
  CreateRolePayload,
  UpdateRolePayload,
  UpdateRolePermissionsPayload,
} from './roles'
export { PERMISSION_ACTIONS } from './roles'

// ---- School ----
export type { School, SchoolFormState, GradeScale } from './school'
export { schoolFormToPayload } from './school'

// ---- Profiles ----
export type {
  StudentGuardian,
  StudentAttendanceSummary,
  StudentProfile,
  StudentProfileView,
} from './studentProfile'
export { toStudentProfileView } from './studentProfile'

export type {
  TeacherSubjectLink,
  TeacherHomeroomClass,
  TeacherProfile,
  TeacherProfileView,
  CreateTeacherPayload,
  UpdateTeacherPayload,
  ListTeachersQuery,
} from './teacherProfile'
export { toTeacherProfileView } from './teacherProfile'

// ---- Academic content ----
export type {
  LessonMaterial,
  Lesson,
  HomeworkAttachment,
  HomeworkSubmission,
  Homework,
  QuizQuestion,
  Quiz,
  QuizSubmission,
  GradePeriod,
  GradeRecord,
  MyGrade,
  StudentProgress,
} from './academic'

// ---- Academic structure ----
export type { ClassRecord, CreateClassPayload, UpdateClassPayload, ListClassesQuery } from './class'

export type {
  Subject,
  CreateSubjectPayload,
  UpdateSubjectPayload,
  ListSubjectsQuery,
} from './subject'

export type {
  DayOfWeek,
  Schedule,
  CreateSchedulePayload,
  UpdateSchedulePayload,
  ListSchedulesQuery,
} from './schedule'
export { DAY_LABELS, WEEK_DISPLAY_ORDER } from './schedule'

// ---- Attendance and leave ----
export type {
  AttendanceStatus,
  AttendanceRecord,
  UnmarkedAttendanceRow,
  AttendanceListRow,
  AttendanceStats,
  AttendanceListQuery,
  CheckInPayload,
  BulkMarkPayload,
  UpdateAttendancePayload,
} from './attendance'
export {
  isUnmarkedRow,
  ATTENDANCE_LABELS,
  ATTENDANCE_COLORS,
} from './attendance'

export type {
  LeaveStatus,
  LeaveRequest,
  CreateLeaveRequestPayload,
  CreateLeaveRequestForStudentPayload,
  UpdateLeaveRequestPayload,
  ReviewLeaveRequestPayload,
  ListLeaveRequestsQuery,
} from './leaveRequest'
export {
  LEAVE_STATUS_LABELS,
  LEAVE_STATUS_COLORS,
} from './leaveRequest'

// ---- Communication ----
export type {
  AnnouncementAudience,
  Announcement,
  CreateAnnouncementPayload,
  UpdateAnnouncementPayload,
} from './announcement'

export type {
  NotificationChannel,
  Notification,
  UpdateNotificationPayload,
  CreateNotificationPayload,
  ListNotificationsQuery,
} from './notification'

// ---- Reports ----
export type {
  AttendanceReportQuery,
  GradesReportQuery,
  AttendanceReportRow,
  StudentReportResponse,
  TeacherReportResponse,
} from './report'

// ---- i18n ----
export type {
  Language,
  Translation,
  TranslationMap,
  UpsertTranslationsPayload,
  AutoTranslatePayload,
  AutoTranslateResponse,
  CreateLanguagePayload,
  UpdateLanguagePayload,
} from './translation'

// ---- Dashboard display types (UI-only, not API shapes) ----
export type {
  StatCard,
  AttendanceDay,
  EnrollmentSlice,
  EventItem,
  ActivityItem,
  LeaveRequestItem,
  AnnouncementItem,
  NavLink,
  NavSection,
  Status,
} from './dashboard'