import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/layouts/Header';
import Sidebar from '@/layouts/Sidebar';
import Footer from '@/layouts/Footer';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { SchoolProvider } from '@/context/SchoolContext';

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <SchoolProvider>
      <div className="min-h-screen flex text-stone-900 dark:text-stone-100">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="flex-1 min-h-screen flex flex-col">
          <Header onOpenSidebar={() => setMobileOpen(true)} />

          <main className="flex-1 m-2 sm:m-4 rounded-2xl sm:rounded-3xl glass-sm p-3 sm:p-6 lg:p-8 overflow-hidden">
            <Breadcrumbs />
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </SchoolProvider>
  );
}