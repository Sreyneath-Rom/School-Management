import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard/Dashboard";

import SchoolSetup from "../pages/Setup/SchoolSetup";
import Roles from "../pages/Setup/Roles";
import Subjects from "../pages/Setup/Subjects";
import Schedules from "../pages/Setup/Schedules";
import Users from "../pages/Setup/Users";

import Classes from "../pages/Academic/Classes";
import Lessons from "../pages/Academic/Lessons";
import Homework from "../pages/Academic/Homework";
import Quizzes from "../pages/Academic/Quizzes";
import Grades from "../pages/Academic/Grades";

import StudentList from "../pages/Students/StudentList";
import Attendance from "../pages/Students/Attendance";
import LeaveRequests from "../pages/Students/LeaveRequests";

import TeacherList from "../pages/Teachers/TeacherList";
import TeacherAssignments from "../pages/Teachers/TeacherAssignments";

import AnnouncementsPage from "../pages/Communication/Announcements";
import Notifications from "../pages/Communication/Notifications";

import AttendanceReport from "../pages/Reports/AttendanceReport";
import GradeReport from "../pages/Reports/GradeReport";
import StudentReport from "../pages/Reports/StudentReport";
import TeacherReport from "../pages/Reports/TeacherReport";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/setup/school" element={<SchoolSetup />} />
        <Route path="/setup/roles" element={<Roles />} />
        <Route path="/setup/subjects" element={<Subjects />} />
        <Route path="/setup/schedules" element={<Schedules />} />
        <Route path="/setup/users" element={<Users />} />

        <Route path="/academic/classes" element={<Classes />} />
        <Route path="/academic/lessons" element={<Lessons />} />
        <Route path="/academic/homework" element={<Homework />} />
        <Route path="/academic/quizzes" element={<Quizzes />} />
        <Route path="/academic/grades" element={<Grades />} />

        <Route path="/students" element={<StudentList />} />
        <Route path="/students/attendance" element={<Attendance />} />
        <Route path="/students/leave-requests" element={<LeaveRequests />} />

        <Route path="/teachers" element={<TeacherList />} />
        <Route path="/teachers/assignments" element={<TeacherAssignments />} />

        <Route path="/communication/announcements" element={<AnnouncementsPage />} />
        <Route path="/communication/notifications" element={<Notifications />} />

        <Route path="/reports/attendance" element={<AttendanceReport />} />
        <Route path="/reports/grades" element={<GradeReport />} />
        <Route path="/reports/students" element={<StudentReport />} />
        <Route path="/reports/teachers" element={<TeacherReport />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Route>
    </Routes>
  );
}