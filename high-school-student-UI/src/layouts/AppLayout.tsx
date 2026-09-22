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
      <div className="page-theme h-screen w-full flex overflow-hidden text-text-main">
        {/* Fixed Desktop Sidebar & Mobile Drawer (self-contained scrolling, independent of main container) */}
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={role ?? undefined}
        />

        {/* Main Content Viewport with independent scrolling */}
        <div className="flex-1 h-full flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">
          <Header onOpenSidebar={() => setMobileOpen(true)} />

          {/* Main Content Viewport */}
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
