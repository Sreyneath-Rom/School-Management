// src/routes/AdminRoutes.tsx
import { Route, Navigate } from 'react-router-dom'
import type { ReactElement } from 'react'
import AppLayout from '@/layouts/AppLayout'

// Setup
import Dashboard from '@/pages/Dashboard/Dashboard'
import SchoolSetup from '@/pages/Setup/SchoolSetup'
import AcademicYears from '@/pages/Setup/AcademicYears'
import GradeLevels from '@/pages/Setup/GradeLevels'
import Terms from '@/pages/Setup/Terms'
import Subjects from '@/pages/Setup/Subjects'
import Rooms from '@/pages/Setup/Rooms'
import Roles from '@/pages/Setup/Roles'
import Users from '@/pages/Setup/Users'
import TranslationManager from '@/pages/Setup/TranslationManager'

// Academic
import Classes from '@/pages/Academic/Classes'
import ClassSubjects from '@/pages/Academic/ClassSubjects'
import Schedules from '@/pages/Academic/Schedules'
import Lessons from '@/pages/Academic/Lessons'
import Homework from '@/pages/Academic/Homework'
import Quizzes from '@/pages/Academic/Quizzes'
import Grades from '@/pages/Academic/Grades'

// Exams
import ExamList from '@/pages/Exams/ExamList'
import ExamForm from '@/pages/Exams/ExamForm'
import ExamSchedules from '@/pages/Exams/ExamSchedules'
import MarkEntry from '@/pages/Exams/MarkEntry'
import ReportCard from '@/pages/Exams/ReportCard'

// Students
import StudentList from '@/pages/Students/StudentList'
import StudentProfiles from '@/pages/Students/StudentProfiles'
import Attendance from '@/pages/Students/Attendance'
import LeaveRequests from '@/pages/Students/LeaveRequests'

// Teachers
import TeacherList from '@/pages/Teachers/TeacherList'
import TeacherProfiles from '@/pages/Teachers/TeacherProfiles'
import TeacherAssignments from '@/pages/Teachers/TeacherAssignments'
import TeacherAttendance from '@/pages/Teachers/TeacherAttendance'

// Calendar
import CalendarView from '@/pages/Calendar/CalendarView'
import EventForm from '@/pages/Calendar/EventForm'

// Communication & Messages
import AnnouncementsPage from '@/pages/Communication/Announcements'
import Notifications from '@/pages/Communication/Notifications'
import Inbox from '@/pages/Messages/Inbox'
import Conversation from '@/pages/Messages/Conversation'

// Reports
import AttendanceReport from '@/pages/Reports/AttendanceReport'
import GradeReport from '@/pages/Reports/GradeReport'
import StudentReport from '@/pages/Reports/StudentReport'
import TeacherReport from '@/pages/Reports/TeacherReport'

// System
import AuditLogs from '@/pages/System/AuditLogs'

const ADMIN_HOME = '/dashboard'

export const adminRoutes = (): ReactElement => (
  <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />

    {/* Setup */}
    <Route path="/setup/school" element={<SchoolSetup />} />
    <Route path="/setup/academic-years" element={<AcademicYears />} />
    <Route path="/setup/grade-levels" element={<GradeLevels />} />
    <Route path="/setup/terms" element={<Terms />} />
    <Route path="/setup/subjects" element={<Subjects />} />
    <Route path="/setup/rooms" element={<Rooms />} />
    <Route path="/setup/roles" element={<Roles />} />
    <Route path="/setup/users" element={<Users />} />
    <Route path="/setup/translations" element={<TranslationManager />} />

    {/* Academic */}
    <Route path="/academic/classes" element={<Classes />} />
    <Route path="/academic/class-subjects" element={<ClassSubjects />} />
    <Route path="/academic/schedules" element={<Schedules />} />
    <Route path="/academic/lessons" element={<Lessons />} />
    <Route path="/academic/homework" element={<Homework />} />
    <Route path="/academic/quizzes" element={<Quizzes />} />
    <Route path="/academic/grades" element={<Grades />} />

    {/* Exams */}
    <Route path="/academic/exams" element={<ExamList />} />
    <Route path="/academic/exams/create" element={<ExamForm />} />
    <Route path="/academic/exams/:id/edit" element={<ExamForm />} />
    <Route path="/academic/exam-schedules" element={<ExamSchedules />} />
    <Route path="/academic/mark-entry" element={<MarkEntry />} />
    <Route path="/academic/exams/:id/marks" element={<MarkEntry />} />
    <Route path="/academic/report-cards" element={<ReportCard />} />

    {/* Students */}
    <Route path="/students" element={<StudentList />} />
    <Route path="/students/profiles" element={<StudentProfiles />} />
    <Route path="/students/attendance" element={<Attendance />} />
    <Route path="/students/leave-requests" element={<LeaveRequests />} />

    {/* Teachers */}
    <Route path="/teachers" element={<TeacherList />} />
    <Route path="/teachers/profiles" element={<TeacherProfiles />} />
    <Route path="/teachers/assignments" element={<TeacherAssignments />} />
    <Route path="/teachers/attendance" element={<TeacherAttendance />} />

    {/* Calendar */}
    <Route path="/calendar" element={<CalendarView />} />
    <Route path="/calendar/events" element={<CalendarView />} />
    <Route path="/calendar/events/create" element={<EventForm />} />
    <Route path="/calendar/events/:id/edit" element={<EventForm />} />
    <Route path="/calendar/holidays" element={<CalendarView />} />

    {/* Messages */}
    <Route path="/messages" element={<Inbox />} />
    <Route path="/messages/:id" element={<Conversation />} />

    {/* Communication */}
    <Route path="/communication/announcements" element={<AnnouncementsPage />} />
    <Route path="/communication/notifications" element={<Notifications />} />

    {/* Reports */}
    <Route path="/reports/attendance" element={<AttendanceReport />} />
    <Route path="/reports/academic" element={<GradeReport />} />
    <Route path="/reports/grades" element={<GradeReport />} />
    <Route path="/reports/students" element={<StudentReport />} />
    <Route path="/reports/teachers" element={<TeacherReport />} />

    {/* System */}
    <Route path="/system/activity" element={<AuditLogs />} />

    {/*
      Fallback inside AppLayout so redirects preserve the shell — the
      outlet swaps from the "not found" render to the dashboard without
      unmounting the sidebar, header, or SchoolProvider. `path="*"` also
      matches `/`, so a separate `path="/"` route is redundant.
    */}
    <Route path="*" element={<Navigate to={ADMIN_HOME} replace />} />
  </Route>
)