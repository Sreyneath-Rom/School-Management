//src/layouts/AdminLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "@/components/common/Breadcrumbs";

import { SchoolProvider } from "@/context/SchoolContext";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useAuth();

  return (
    <SchoolProvider>
      <div className="flex h-screen w-full overflow-hidden">

        {/* ================================================================
            SIDEBAR
        ================================================================= */}
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={role ?? "admin"}
        />

        {/* ================================================================
            MAIN APPLICATION AREA
        ================================================================= */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* Header */}
          <Header
            onOpenSidebar={() => setMobileOpen(true)}
          />

          {/* ==============================================================
              CONTENT
          =============================================================== */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden">

            <main className="min-h-full p-2 sm:p-4 lg:p-5">

              <div className="min-h-[calc(100vh-8rem)] rounded-2xl sm:rounded-3xl bg-white/70 p-4 shadow-sm backdrop-blur-xl sm:p-6 lg:p-8 dark:bg-stone-900/60">

                {/* Breadcrumb */}
                <Breadcrumbs />

                {/* Page */}
                <div className="mt-5">
                  <Outlet />
                </div>

              </div>

            </main>

            {/* Footer */}
            <Footer />

          </div>
        </div>
      </div>
    </SchoolProvider>
  );
}