import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/layouts/Header';
import Sidebar from '@/layouts/Sidebar';
import Footer from '@/layouts/Footer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { SchoolProvider } from '@/context/SchoolContext';
import { useAuth } from '@/hooks/useAuth';

export default function TeacherLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useAuth();

  return (
    <SchoolProvider>
      <div className="h-screen w-full flex overflow-hidden text-stone-900 dark:text-stone-100">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={role ?? 'teacher'}
        />

        <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">
          <Header onOpenSidebar={() => setMobileOpen(true)} />

          <main className="flex-1 m-2 sm:m-4 rounded-2xl sm:rounded-3xl glass-sm p-3 sm:p-6 lg:p-8">
            <Breadcrumbs />
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </SchoolProvider>
  );
}