// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { SchoolProvider } from "@/context/SchoolContext";
import { useAuth } from "@/hooks/useAuth"; // <-- to get role

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useAuth(); // admin | teacher | student | parent

  return (
    <SchoolProvider>
      <div className="app-shell-height w-full flex overflow-hidden text-stone-900 dark:text-stone-100">
        {/* Fixed Desktop Sidebar & Mobile Drawer (self-contained scrolling, independent of main container) */}
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={role ?? undefined}
        />

        {/* Main Content Viewport with independent scrolling */}
        <div className="flex-1 h-full min-w-0 flex flex-col overflow-y-auto overflow-x-hidden">
          <Header onOpenSidebar={() => setMobileOpen(true)} />

          {/* === MAIN CONTENT – WITH RESPONSIVE GLASS CONTAINER & BREADCRUMBS === */}
          <main className="flex-1 m-1.5 sm:m-4 rounded-2xl sm:rounded-3xl glass-sm p-2.5 sm:p-6 lg:p-8">
            <Breadcrumbs />
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </SchoolProvider>
  );
}
