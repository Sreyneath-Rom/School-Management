// src/routes/StudentRoutes.tsx
import type { ReactElement } from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";

import Dashboard from "@/pages/Dashboard/Dashboard";
import Classes from "@/pages/Academic/Classes";
import Lessons from "@/pages/Academic/Lessons";
import Homework from "@/pages/Academic/Homework";
import Quizzes from "@/pages/Academic/Quizzes";
import Grades from "@/pages/Academic/Grades";
import Attendance from "@/pages/Students/Attendance";
import LeaveRequests from "@/pages/Students/LeaveRequests";
import AnnouncementsPage from "@/pages/Communication/Announcements";
import Notifications from "@/pages/Communication/Notifications";
import ExamList from "@/pages/Exams/ExamList";
import ReportCard from "@/pages/Exams/ReportCard";
import Inbox from "@/pages/Messages/Inbox";
import Conversation from "@/pages/Messages/Conversation";
import CalendarView from "@/pages/Calendar/CalendarView";
import BookList from "@/pages/Library/BookList";
import FeeInvoices from "@/pages/Fees/Invoices";

export const studentRoutes = (): ReactElement => (
  <Route element={<AppLayout />}>
    <Route path="/student/dashboard" element={<Dashboard />} />
    <Route path="/student/classes" element={<Classes />} />
    <Route path="/student/lessons" element={<Lessons />} />
    <Route path="/student/homework" element={<Homework />} />
    <Route path="/student/quizzes" element={<Quizzes />} />
    <Route path="/student/grades" element={<Grades />} />
    <Route path="/student/exams" element={<ExamList />} />
    <Route path="/student/report-cards" element={<ReportCard />} />
    <Route path="/student/attendance" element={<Attendance />} />
    <Route path="/student/leave-requests" element={<LeaveRequests />} />
    <Route path="/student/announcements" element={<AnnouncementsPage />} />
    <Route path="/student/notifications" element={<Notifications />} />
    <Route path="/student/messages" element={<Inbox />} />
    <Route path="/student/messages/:id" element={<Conversation />} />
    <Route path="/student/calendar" element={<CalendarView />} />
    <Route path="/student/library" element={<BookList />} />
    <Route path="/student/fees" element={<FeeInvoices />} />
  </Route>
);