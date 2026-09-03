// src/routes/TeacherRoutes.tsx
import type { ReactElement } from "react";
import { Route } from "react-router-dom";
import AppLayout from "@/layouts/AppLayout";

import Dashboard from "@/pages/Dashboard/Dashboard";
import Classes from "@/pages/Academic/Classes";
import Schedules from "@/pages/Setup/Schedules";
import Lessons from "@/pages/Academic/Lessons";
import Homework from "@/pages/Academic/Homework";
import Quizzes from "@/pages/Academic/Quizzes";
import Grades from "@/pages/Academic/Grades";
import GradeReport from "@/pages/Reports/GradeReport";
import StudentList from "@/pages/Students/StudentList";
import Attendance from "@/pages/Students/Attendance";
import AnnouncementsPage from "@/pages/Communication/Announcements";
import Notifications from "@/pages/Communication/Notifications";
import ExamList from "@/pages/Exams/ExamList";
import MarkEntry from "@/pages/Exams/MarkEntry";
import Inbox from "@/pages/Messages/Inbox";
import Conversation from "@/pages/Messages/Conversation";
import CalendarView from "@/pages/Calendar/CalendarView";
import BookList from "@/pages/Library/BookList";

export const teacherRoutes = (): ReactElement => (
  <Route element={<AppLayout />}>
    <Route path="/teacher/dashboard" element={<Dashboard />} />
    <Route path="/teacher/classes" element={<Classes />} />
    <Route path="/teacher/classes/:id" element={<Classes />} />
    <Route path="/teacher/timetable" element={<Schedules />} />
    <Route path="/teacher/schedules" element={<Schedules />} />
    <Route path="/teacher/lessons" element={<Lessons />} />
    <Route path="/teacher/lessons/create" element={<Lessons />} />
    <Route path="/teacher/homework" element={<Homework />} />
    <Route path="/teacher/homework/create" element={<Homework />} />
    <Route path="/teacher/quizzes" element={<Quizzes />} />
    <Route path="/teacher/quizzes/create" element={<Quizzes />} />
    <Route path="/teacher/attendance" element={<Attendance />} />
    <Route path="/teacher/grades" element={<Grades />} />
    <Route path="/teacher/progress" element={<GradeReport />} />
    <Route path="/teacher/exams" element={<ExamList />} />
    <Route path="/teacher/exams/:id/marks" element={<MarkEntry />} />
    <Route path="/teacher/students" element={<StudentList />} />
    <Route path="/teacher/announcements" element={<AnnouncementsPage />} />
    <Route path="/teacher/notifications" element={<Notifications />} />
    <Route path="/teacher/messages" element={<Inbox />} />
    <Route path="/teacher/messages/:id" element={<Conversation />} />
    <Route path="/teacher/calendar" element={<CalendarView />} />
    <Route path="/teacher/library" element={<BookList />} />
  </Route>
);