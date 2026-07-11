import type { ReactElement } from 'react';
import { Route } from 'react-router-dom';

// Teacher Layout
import TeacherLayout from '@/layouts/TeacherLayout';

// Teacher Pages
import Dashboard from '@/pages/Dashboard/Dashboard';
import Classes from '@/pages/Academic/Classes';
import Lessons from '@/pages/Academic/Lessons';
import Homework from '@/pages/Academic/Homework';
import Quizzes from '@/pages/Academic/Quizzes';
import Grades from '@/pages/Academic/Grades';
import StudentList from '@/pages/Students/StudentList';
import Attendance from '@/pages/Students/Attendance';
import AnnouncementsPage from '@/pages/Communication/Announcements';

export const teacherRoutes = (): ReactElement => (
  <Route element={<TeacherLayout />}>
    {/* Dashboard */}
    <Route path="/teacher/dashboard" element={<Dashboard />} />

    {/* Academic Management */}
    <Route path="/teacher/classes" element={<Classes />} />
    <Route path="/teacher/lessons" element={<Lessons />} />
    <Route path="/teacher/homework" element={<Homework />} />
    <Route path="/teacher/quizzes" element={<Quizzes />} />

    {/* Grades & Assessment */}
    <Route path="/teacher/grades" element={<Grades />} />

    {/* Student Management */}
    <Route path="/teacher/students" element={<StudentList />} />
    <Route path="/teacher/attendance" element={<Attendance />} />

    {/* Communication */}
    <Route path="/teacher/announcements" element={<AnnouncementsPage />} />
  </Route>
);