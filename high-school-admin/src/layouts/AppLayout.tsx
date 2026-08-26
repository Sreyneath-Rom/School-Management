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
      <div className="min-h-screen flex text-stone-900 dark:text-stone-100">
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={role ?? undefined} // <-- pass role to filter menu items
        />

        <div className="flex-1 min-h-screen flex flex-col">
          <Header onOpenSidebar={() => setMobileOpen(true)} />

          {/* === MAIN CONTENT – WITH RESPONSIVE GLASS CONTAINER & BREADCRUMBS === */}
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