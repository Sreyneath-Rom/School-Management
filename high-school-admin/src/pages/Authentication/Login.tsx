import { useState } from 'react';
import AdminLogin from './AdminLogin';
import StudentLogin from './StudentLogin';
import TeacherLogin from './TeacherLogin';
import { School2, Sliders, User2 } from 'lucide-react';
import AuthBackground from '@/components/auth/AuthBackground';
import Button from '@/components/common/Button';

type UserRole = 'admin' | 'student' | 'teacher';

export default function Login() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  if (selectedRole === 'admin') {
    return <AdminLogin />;
  }

  if (selectedRole === 'student') {
    return <StudentLogin />;
  }

  if (selectedRole === 'teacher') {
    return <TeacherLogin />;
  }

  // Role Selection Screen
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <AuthBackground variant="admin" />

      <div className="relative z-10 w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center">
              <School2 size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Varin High School</h1>
          <p className="text-gray-600 text-lg">School Management System</p>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {/* Admin Card */}
          <div
            onClick={() => setSelectedRole('admin')}
            className="glass-sm rounded-[28px] p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform group"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition">
                <Sliders size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Admin</h3>
              <p className="text-gray-600 text-sm mb-4">Manage school, users, and settings</p>

              <Button variant='solidOutline' type="button" onClick={() => setSelectedRole('admin')} className="w-full bg-blue-500 hover:bg-blue-600 ">
                Login as Admin
              </Button>
            </div>
          </div>

          {/* Teacher Card */}
          <div
            onClick={() => setSelectedRole('teacher')}
            className="glass-sm rounded-[28px] p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform group"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-600 transition">
                <User2 size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Teacher</h3>
              <p className="text-gray-600 text-sm mb-4">Manage classes and grades</p>
              <Button variant='solidOutline' type="button" onClick={() => setSelectedRole('teacher')} className="w-full bg-green-500 hover:bg-green-600 ">
                Login as Teacher
              </Button>

            </div>
          </div>

          {/* Student Card */}
          <div
            onClick={() => setSelectedRole('student')}
            className="glass-sm rounded-[28px] p-8 cursor-pointer hover:shadow-2xl hover:scale-105 transition transform group"
          >
            <div className="text-center">
              <div className="w-20 h-20 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-600 transition">
                <User2 size={32} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Student</h3>
              <p className="text-gray-600 text-sm mb-4">Access your dashboard and grades</p>
              <Button variant='solidOutline' type="button" onClick={() => setSelectedRole('student')} className="w-full bg-purple-500 hover:bg-purple-600 ">
                Login as Student
              </Button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-gray-600 text-sm">
            © 2024 Varin High School. All rights reserved. | Authorized access only
          </p>
        </div>
      </div>
    </div>
  );
}
