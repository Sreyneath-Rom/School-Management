import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/layouts/Header';
import Sidebar from '@/layouts/Sidebar';
import Footer from '@/layouts/Footer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { SchoolProvider } from '@/context/SchoolContext';
import { useAuth } from '@/hooks/useAuth';

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useAuth();

  return (
    <SchoolProvider>
      <div className="h-screen w-full flex overflow-hidden text-stone-900 dark:text-stone-100">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={role ?? 'student'}
        />

        <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">
          <Header onOpenSidebar={() => setMobileOpen(true)} />

          <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
            <div className="mb-4">
              <Breadcrumbs />
            </div>
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </SchoolProvider>
  );
}