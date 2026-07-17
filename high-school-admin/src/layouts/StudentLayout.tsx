import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/layouts/Header';
import Sidebar from '@/layouts/Sidebar';
import Footer from '@/layouts/Footer';

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen flex text-stone-900 dark:text-stone-100">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 min-h-screen flex flex-col">
        <Header onOpenSidebar={() => setMobileOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}