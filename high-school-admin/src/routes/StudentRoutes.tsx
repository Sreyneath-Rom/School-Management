import type { ReactElement } from 'react';
import { Route } from 'react-router-dom';

// Student Layout
import StudentLayout from '@/layouts/StudentLayout';

// Student Pages
import Dashboard from '@/pages/Dashboard/Dashboard';
import Classes from '@/pages/Academic/Classes';
import Homework from '@/pages/Academic/Homework';
import Quizzes from '@/pages/Academic/Quizzes';
import Grades from '@/pages/Academic/Grades';
import Attendance from '@/pages/Students/Attendance';
import LeaveRequests from '@/pages/Students/LeaveRequests';
import AnnouncementsPage from '@/pages/Communication/Announcements';
import Notifications from '@/pages/Communication/Notifications';

export const studentRoutes = (): ReactElement => (
  <Route element={<StudentLayout />}>
    {/* Dashboard */}
    <Route path="/student/dashboard" element={<Dashboard />} />

    {/* Academic */}
    <Route path="/student/classes" element={<Classes />} />
    <Route path="/student/homework" element={<Homework />} />
    <Route path="/student/quizzes" element={<Quizzes />} />

    {/* Grades & Performance */}
    <Route path="/student/grades" element={<Grades />} />

    {/* Attendance & Leaves */}
    <Route path="/student/attendance" element={<Attendance />} />
    <Route path="/student/leave-requests" element={<LeaveRequests />} />

    {/* Communication */}
    <Route path="/student/announcements" element={<AnnouncementsPage />} />
    <Route path="/student/notifications" element={<Notifications />} />
  </Route>
);