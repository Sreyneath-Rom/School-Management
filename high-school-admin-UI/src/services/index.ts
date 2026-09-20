// src/services/index.ts

export { academicService } from './academicService'
export { academicYearService } from './academicYearService'
export type { AcademicYearRecord, AcademicYearPayload } from './academicYearService'
export { announcementService } from './announcementService'
export { attendanceService } from './attendanceService'
export { authService } from './authService'
export { badgeService } from './badgeService'
export type { BadgeCounts } from './badgeService'
export { classService } from './classService'
export { dashboardService } from './dashboardService'
export { examService } from './examService'
export { gradeLevelService } from './gradeLevelService'
export { languagesService } from './languagesService'
export { leaveRequestService } from './leaveRequestService'
export { notificationService } from './notificationService'
export { reportService } from './reportService'
export { roleService, MODULES } from './roleService'
export { roomService } from './roomService'
export { scheduleService } from './scheduleService'
export { schoolService } from './schoolService'
export { studentService } from './studentService'
export { subjectService } from './subjectService'
export { teacherService } from './teacherService'
export { termService } from './termService'
export { translationsService } from './translationsService'
export { userService } from './userService'
export { messageService } from './messageService'
export type {
  MessageRole,
  MessageFolder,
  MessageItem,
  MessageThread,
  ThreadDetail,
  MessageAttachment,
  SendMessagePayload,
  CreateThreadPayload,
} from './messageService'