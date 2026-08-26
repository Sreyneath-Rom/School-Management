// src/layouts/AppLayout.tsx
import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
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
          role={role} // <-- pass role to filter menu items
        />

        <div className="flex-1 min-h-screen flex flex-col">
          <Header onOpenSidebar={() => setMobileOpen(true)} />

          {/* === MAIN CONTENT – NOW WITH GLASS === */}
          <main className="flex-1 m-4 rounded-2xl glass-sm p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>

          <Footer />
        </div>
      </div>
    </SchoolProvider>
  );
}