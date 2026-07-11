import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Header from '@/layouts/Header';
import Sidebar from '@/layouts/Sidebar';
import Footer from '@/layouts/Footer';

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onOpenSidebar={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}