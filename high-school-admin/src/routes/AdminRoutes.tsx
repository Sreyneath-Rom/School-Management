import { Route, Navigate } from "react-router-dom";
import type { ReactElement } from "react";

// Admin Layout
import AdminLayout from '@/layouts/AdminLayout';

// Admin Pages
import Dashboard from '@/pages/Dashboard/Dashboard';

import SchoolSetup from '@/pages/Setup/SchoolSetup';
import Roles from '@/pages/Setup/Roles';
import Subjects from '@/pages/Setup/Subjects';
import Schedules from '@/pages/Setup/Schedules';
import Users from '@/pages/Setup/Users';

import Classes from '@/pages/Academic/Classes';
import Lessons from '@/pages/Academic/Lessons';
import Homework from '@/pages/Academic/Homework';
import Quizzes from '@/pages/Academic/Quizzes';
import Grades from '@/pages/Academic/Grades';

import StudentList from '@/pages/Students/StudentList';
import Attendance from '@/pages/Students/Attendance';
import LeaveRequests from '@/pages/Students/LeaveRequests';

import TeacherList from '@/pages/Teachers/TeacherList';
import TeacherAssignments from '@/pages/Teachers/TeacherAssignments';

import AnnouncementsPage from '@/pages/Communication/Announcements';
import Notifications from '@/pages/Communication/Notifications';

import AttendanceReport from '@/pages/Reports/AttendanceReport';
import GradeReport from '@/pages/Reports/GradeReport';
import StudentReport from '@/pages/Reports/StudentReport';
import TeacherReport from '@/pages/Reports/TeacherReport';

export const adminRoutes = (): ReactElement => (
  <Route element={<AdminLayout />}>
    <Route path="/dashboard" element={<Dashboard />} />

    {/* Setup & Configuration */}
    <Route path="/setup/school" element={<SchoolSetup />} />
    <Route path="/setup/roles" element={<Roles />} />
    <Route path="/setup/subjects" element={<Subjects />} />
    <Route path="/setup/schedules" element={<Schedules />} />
    <Route path="/setup/users" element={<Users />} />

    {/* Academic Management */}
    <Route path="/academic/classes" element={<Classes />} />
    <Route path="/academic/lessons" element={<Lessons />} />
    <Route path="/academic/homework" element={<Homework />} />
    <Route path="/academic/quizzes" element={<Quizzes />} />
    <Route path="/academic/grades" element={<Grades />} />

    {/* Student Management */}
    <Route path="/students" element={<StudentList />} />
    <Route path="/students/attendance" element={<Attendance />} />
    <Route path="/students/leave-requests" element={<LeaveRequests />} />

    {/* Teacher Management */}
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

    {/* Fallback Routes */}
    <Route path="/" element={<Navigate to="/dashboard" replace />} />
    <Route path="*" element={<Navigate to="/dashboard" replace />} />
  </Route>
);