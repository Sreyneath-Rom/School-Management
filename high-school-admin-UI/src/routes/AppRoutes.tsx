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

  if (role !== portalRole) {
    return <Login />;
  }

  const homeRoute = "/dashboard";

  return (
    <Routes>
      <Route path="/login" element={<Navigate to={homeRoute} replace />} />
      <Route path="/login/admin" element={<Navigate to={homeRoute} replace />} />
      <Route path="/login/teacher" element={<Navigate to={homeRoute} replace />} />
      <Route path="/login/student" element={<Navigate to={homeRoute} replace />} />
      <Route path="/login/parent" element={<Navigate to={homeRoute} replace />} />

      {(role as string) === "admin" && adminRoutes()}
      {(role as string) === "teacher" && teacherRoutes()}
      {(role as string) === "student" && studentRoutes()}
      {(role as string) === "parent" && parentRoutes()}

      <Route path="/" element={<Navigate to={homeRoute} replace />} />
      <Route path="*" element={<Navigate to={homeRoute} replace />} />
    </Routes>
  );
}