// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { adminRoutes } from "./AdminRoutes";
import { teacherRoutes } from "./TeacherRoutes";
import { studentRoutes } from "./StudentRoutes";
import { parentRoutes } from "./ParentRoutes"; // NEW
import { useAuth } from "@/hooks/useAuth";
import { Login, AdminLogin, StudentLogin, TeacherLogin } from "@/pages/Authentication";

export default function AppRoutes() {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated || !role) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const homeRoute =
    role === "admin"
      ? "/dashboard"
      : role === "teacher"
      ? "/teacher/dashboard"
      : role === "student"
      ? "/student/dashboard"
      : "/parent/dashboard";

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={homeRoute} replace />} />
      <Route path="/login/admin" element={<Navigate to={homeRoute} replace />} />
      <Route path="/login/teacher" element={<Navigate to={homeRoute} replace />} />
      <Route path="/login/student" element={<Navigate to={homeRoute} replace />} />

      {role === "admin" && adminRoutes()}
      {role === "teacher" && teacherRoutes()}
      {role === "student" && studentRoutes()}
      {role === "parent" && parentRoutes()}

      <Route path="/" element={<Navigate to={homeRoute} replace />} />
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  );
}