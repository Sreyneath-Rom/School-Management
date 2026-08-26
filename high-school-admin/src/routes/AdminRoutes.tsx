// src/routes/AdminRoutes.tsx
import { Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";
import AppLayout from "@/layouts/AppLayout";

// Existing pages...
import Dashboard from "@/pages/Dashboard/Dashboard";
import SchoolSetup from "@/pages/Setup/SchoolSetup";
import Roles from "@/pages/Setup/Roles";
import Subjects from "@/pages/Setup/Subjects";
import Schedules from "@/pages/Setup/Schedules";
import Users from "@/pages/Setup/Users";
import TranslationManager from "@/pages/Setup/TranslationManager";
import Classes from "@/pages/Academic/Classes";
import Lessons from "@/pages/Academic/Lessons";
import Homework from "@/pages/Academic/Homework";
import Quizzes from "@/pages/Academic/Quizzes";
import Grades from "@/pages/Academic/Grades";
import StudentList from "@/pages/Students/StudentList";
import Attendance from "@/pages/Students/Attendance";
import LeaveRequests from "@/pages/Students/LeaveRequests";
import TeacherList from "@/pages/Teachers/TeacherList";
import TeacherAssignments from "@/pages/Teachers/TeacherAssignments";
import AnnouncementsPage from "@/pages/Communication/Announcements";
import Notifications from "@/pages/Communication/Notifications";
import AttendanceReport from "@/pages/Reports/AttendanceReport";
import GradeReport from "@/pages/Reports/GradeReport";
import StudentReport from "@/pages/Reports/StudentReport";
import TeacherReport from "@/pages/Reports/TeacherReport";

// NEW PAGES (placeholder imports – create these later)
import ExamList from "@/pages/Exams/ExamList";
import ExamForm from "@/pages/Exams/ExamForm";
import MarkEntry from "@/pages/Exams/MarkEntry";
import ReportCard from "@/pages/Exams/ReportCard";
import FeeStructure from "@/pages/Fees/FeeStructure";
import Invoices from "@/pages/Fees/Invoices";
import Payments from "@/pages/Fees/Payments";
import BookList from "@/pages/Library/BookList";
import BorrowForm from "@/pages/Library/BorrowForm";
import ReturnForm from "@/pages/Library/ReturnForm";
import CalendarView from "@/pages/Calendar/CalendarView";
import EventForm from "@/pages/Calendar/EventForm";
import Inbox from "@/pages/Messages/Inbox";
import Conversation from "@/pages/Messages/Conversation";
import AuditLogs from "@/pages/System/AuditLogs";

export const adminRoutes = (): ReactElement => (
  <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />

    {/* Setup */}
    <Route path="/setup/school" element={<SchoolSetup />} />
    <Route path="/setup/roles" element={<Roles />} />
    <Route path="/setup/subjects" element={<Subjects />} />
    <Route path="/setup/schedules" element={<Schedules />} />
    <Route path="/setup/users" element={<Users />} />
    <Route path="/setup/translations" element={<TranslationManager />} />

    {/* Academic */}
    <Route path="/academic/classes" element={<Classes />} />
    <Route path="/academic/lessons" element={<Lessons />} />
    <Route path="/academic/homework" element={<Homework />} />
    <Route path="/academic/quizzes" element={<Quizzes />} />
    <Route path="/academic/grades" element={<Grades />} />

    {/* Exams */}
    <Route path="/academic/exams" element={<ExamList />} />
    <Route path="/academic/exams/create" element={<ExamForm />} />
    <Route path="/academic/exams/:id/edit" element={<ExamForm />} />
    <Route path="/academic/exams/:id/marks" element={<MarkEntry />} />
    <Route path="/academic/report-cards" element={<ReportCard />} />

    {/* Fees */}
    <Route path="/fees/structures" element={<FeeStructure />} />
    <Route path="/fees/invoices" element={<Invoices />} />
    <Route path="/fees/payments" element={<Payments />} />

    {/* Library */}
    <Route path="/library/books" element={<BookList />} />
    <Route path="/library/borrow" element={<BorrowForm />} />
    <Route path="/library/returns" element={<ReturnForm />} />

    {/* Calendar */}
    <Route path="/calendar" element={<CalendarView />} />
    <Route path="/calendar/events/create" element={<EventForm />} />
    <Route path="/calendar/events/:id/edit" element={<EventForm />} />

    {/* Messages */}
    <Route path="/messages" element={<Inbox />} />
    <Route path="/messages/:id" element={<Conversation />} />

    {/* Students */}
    <Route path="/students" element={<StudentList />} />
    <Route path="/students/attendance" element={<Attendance />} />
    <Route path="/students/leave-requests" element={<LeaveRequests />} />

    {/* Teachers */}
    <Route path="/teachers" element={<TeacherList />} />
    <Route path="/teachers/assignments" element={<TeacherAssignments />} />

    {/* Communication */}
    <Route path="/communication/announcements" element={<AnnouncementsPage />} />
    <Route path="/communication/notifications" element={<Notifications />} />

    {/* Reports */}
    <Route path="/reports/attendance" element={<AttendanceReport />} />
    <Route path="/reports/grades" element={<GradeReport />} />
    <Route path="/reports/students" element={<StudentReport />} />
    <Route path="/reports/teachers" element={<TeacherReport />} />

    {/* System */}
    <Route path="/system/logs" element={<AuditLogs />} />

    {/* Fallback */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Route>
);