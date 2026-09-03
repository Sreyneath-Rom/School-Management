// src/routes/AdminRoutes.tsx
import { Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import AppLayout from "@/layouts/AppLayout";

// Setup
import Dashboard from "@/pages/Dashboard/Dashboard";
import SchoolSetup from "@/pages/Setup/SchoolSetup";
import AcademicYears from "@/pages/Setup/AcademicYears";
import Terms from "@/pages/Setup/Terms";
import Subjects from "@/pages/Setup/Subjects";
import Rooms from "@/pages/Setup/Rooms";
import Roles from "@/pages/Setup/Roles";
import Users from "@/pages/Setup/Users";
import GradeLevels from "@/pages/Setup/GradeLevels";
import TranslationManager from "@/pages/Setup/TranslationManager";

// Academic
import Classes from "@/pages/Academic/Classes";
import ClassSubjects from "@/pages/Academic/ClassSubjects";
import Schedules from "@/pages/Setup/Schedules";
import Lessons from "@/pages/Academic/Lessons";
import Homework from "@/pages/Academic/Homework";
import Quizzes from "@/pages/Academic/Quizzes";
import Grades from "@/pages/Academic/Grades";

// Exams
import ExamList from "@/pages/Exams/ExamList";
import ExamForm from "@/pages/Exams/ExamForm";
import ExamSchedules from "@/pages/Exams/ExamSchedules";
import MarkEntry from "@/pages/Exams/MarkEntry";
import ReportCard from "@/pages/Exams/ReportCard";

// Students
import StudentList from "@/pages/Students/StudentList";
import StudentProfiles from "@/pages/Students/StudentProfiles";
import Attendance from "@/pages/Students/Attendance";
import LeaveRequests from "@/pages/Students/LeaveRequests";

// Teachers
import TeacherList from "@/pages/Teachers/TeacherList";
import TeacherProfiles from "@/pages/Teachers/TeacherProfiles";
import TeacherAssignments from "@/pages/Teachers/TeacherAssignments";
import TeacherAttendance from "@/pages/Teachers/TeacherAttendance";



// Library
import BookList from "@/pages/Library/BookList";
import LibraryCategories from "@/pages/Library/LibraryCategories";
import BorrowForm from "@/pages/Library/BorrowForm";
import ReturnForm from "@/pages/Library/ReturnForm";
import OverdueBooks from "@/pages/Library/OverdueBooks";


// Calendar
import CalendarView from "@/pages/Calendar/CalendarView";
import EventForm from "@/pages/Calendar/EventForm";

// Communication & Messages
import AnnouncementsPage from "@/pages/Communication/Announcements";
import Notifications from "@/pages/Communication/Notifications";
import Inbox from "@/pages/Messages/Inbox";
import Conversation from "@/pages/Messages/Conversation";

// Reports
import AttendanceReport from "@/pages/Reports/AttendanceReport";
import GradeReport from "@/pages/Reports/GradeReport";
import StudentReport from "@/pages/Reports/StudentReport";
import TeacherReport from "@/pages/Reports/TeacherReport";

// System
import AuditLogs from "@/pages/System/AuditLogs";
import ResponsiveScreenStudio from "@/pages/System/ResponsiveScreenStudio";

export const adminRoutes = (): ReactElement => (
  <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/admin/dashboard" element={<Dashboard />} />

    {/* Setup */}
    <Route path="/setup/school" element={<SchoolSetup />} />
    <Route path="/admin/school" element={<SchoolSetup />} />
    <Route path="/setup/academic-years" element={<AcademicYears />} />
    <Route path="/admin/school/academic-years" element={<AcademicYears />} />
    <Route path="/setup/terms" element={<Terms />} />
    <Route path="/admin/school/terms" element={<Terms />} />
    <Route path="/setup/subjects" element={<Subjects />} />
    <Route path="/admin/subjects" element={<Subjects />} />
    <Route path="/setup/rooms" element={<Rooms />} />
    <Route path="/setup/roles" element={<Roles />} />
    <Route path="/admin/roles" element={<Roles />} />
    <Route path="/admin/roles/permissions" element={<Roles />} />
    <Route path="/setup/users" element={<Users />} />
    <Route path="/setup/users/:id" element={<Users />} />
    <Route path="/admin/users" element={<Users />} />
    <Route path="/admin/users/:id" element={<Users />} />
    <Route path="/setup/grade-levels" element={<GradeLevels />} />
    <Route path="/setup/grades" element={<GradeLevels />} />
    <Route path="/admin/grade-levels" element={<GradeLevels />} />
    <Route path="/setup/translations" element={<TranslationManager />} />

    {/* Academic */}
    <Route path="/academic/classes" element={<Classes />} />
    <Route path="/academic/classes/:id" element={<Classes />} />
    <Route path="/admin/classes" element={<Classes />} />
    <Route path="/admin/classes/:id" element={<Classes />} />
    <Route path="/academic/class-subjects" element={<ClassSubjects />} />
    <Route path="/academic/schedules" element={<Schedules />} />
    <Route path="/admin/schedules" element={<Schedules />} />
    <Route path="/academic/lessons" element={<Lessons />} />
    <Route path="/academic/homework" element={<Homework />} />
    <Route path="/academic/quizzes" element={<Quizzes />} />
    <Route path="/academic/grades" element={<Grades />} />
    <Route path="/admin/grades" element={<Grades />} />

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
    <Route path="/students/:id" element={<StudentProfiles />} />
    <Route path="/admin/students" element={<StudentList />} />
    <Route path="/admin/students/:id" element={<StudentProfiles />} />
    <Route path="/students/attendance" element={<Attendance />} />
    <Route path="/admin/attendance" element={<Attendance />} />
    <Route path="/admin/attendance/reports" element={<AttendanceReport />} />
    <Route path="/students/leave-requests" element={<LeaveRequests />} />

    {/* Teachers */}
    <Route path="/teachers" element={<TeacherList />} />
    <Route path="/teachers/profiles" element={<TeacherProfiles />} />
    <Route path="/teachers/:id" element={<TeacherProfiles />} />
    <Route path="/admin/teachers" element={<TeacherList />} />
    <Route path="/admin/teachers/:id" element={<TeacherProfiles />} />
    <Route path="/teachers/assignments" element={<TeacherAssignments />} />
    <Route path="/teachers/attendance" element={<TeacherAttendance />} />

    {/* Library */}
    <Route path="/library/books" element={<BookList />} />
    <Route path="/library/categories" element={<LibraryCategories />} />
    <Route path="/library/borrow" element={<BorrowForm />} />
    <Route path="/library/returns" element={<ReturnForm />} />
    <Route path="/library/overdue" element={<OverdueBooks />} />

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
    <Route path="/admin/communication/announcements" element={<AnnouncementsPage />} />
    <Route path="/communication/notifications" element={<Notifications />} />
    <Route path="/admin/communication/notifications" element={<Notifications />} />

    {/* Reports */}
    <Route path="/reports/attendance" element={<AttendanceReport />} />
    <Route path="/reports/academic" element={<GradeReport />} />
    <Route path="/admin/reports/academic" element={<GradeReport />} />
    <Route path="/reports/grades" element={<GradeReport />} />
    <Route path="/reports/students" element={<StudentReport />} />
    <Route path="/admin/reports/students" element={<StudentReport />} />
    <Route path="/reports/teachers" element={<TeacherReport />} />
    <Route path="/reports/library" element={<BookList />} />

    {/* System */}
    <Route path="/system/logs" element={<AuditLogs />} />
    <Route path="/system/activity" element={<AuditLogs />} />
    <Route path="/system/settings" element={<SchoolSetup />} />
    <Route path="/system/responsive-studio" element={<ResponsiveScreenStudio />} />
    <Route path="/system/screens" element={<ResponsiveScreenStudio />} />

    {/* Fallback */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Route>
);