// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { adminRoutes } from "./AdminRoutes";
import { teacherRoutes } from "./TeacherRoutes";
import { studentRoutes } from "./StudentRoutes";
import { parentRoutes } from "./ParentRoutes"; // NEW
import { useAuth } from "@/hooks/useAuth";
import { Login, AdminLogin, StudentLogin, TeacherLogin, ParentLogin } from "@/pages/Authentication";

export default function AppRoutes() {
  const { isAuthenticated, role } = useAuth();
  const portalRole = "admin";

  if (!isAuthenticated || !role) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/parent" element={<ParentLogin />} />
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
      : role === "parent"
      ? "/parent/dashboard"
      : "/dashboard";

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/login/admin" element={<AdminLogin />} />
      <Route path="/login/teacher" element={<TeacherLogin />} />
      <Route path="/login/student" element={<StudentLogin />} />
      <Route path="/login/parent" element={<ParentLogin />} />

      {role === "admin" && adminRoutes()}
      {role === "teacher" && teacherRoutes()}
      {role === "student" && studentRoutes()}
      {role === "parent" && parentRoutes()}

      <Route path="/" element={<Navigate to={homeRoute} replace />} />
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  );
}