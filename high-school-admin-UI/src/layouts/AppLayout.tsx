// src/layouts/AppLayout.tsx

import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "@/components/common/Breadcrumbs";

import { SchoolProvider } from "@/context/SchoolContext";
import { useAuth } from "@/hooks/useAuth";

export default function AppLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useAuth();

  return (
    <SchoolProvider>
      <div className="page-theme flex h-screen w-full overflow-hidden text-color">
        {/* ============================================================
            SIDEBAR
        ============================================================ */}
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={role ?? undefined}
        />

        {/* ============================================================
            APPLICATION AREA
        ============================================================ */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          {/* ==========================================================
              HEADER
          ========================================================== */}
          <Header onOpenSidebar={() => setMobileOpen(true)} />

          {/* ==========================================================
              SCROLLABLE CONTENT
          ========================================================== */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <main className="page-surface flex-1 p-2 sm:p-4 lg:p-5">
              {/* ======================================================
                  PAGE CONTAINER
              ====================================================== */}
              <div
                className="
                  min-h-full
                  rounded-2xl
                  p-4
                  shadow-xs
                  glass-sm
                  border-surface
                  sm:rounded-3xl
                  sm:p-6
                  lg:p-8
                "
              >
                {/* Breadcrumb */}
                <Breadcrumbs />

                {/* Page Content */}
                <div className="mt-5">
                  <Outlet />
                </div>
              </div>
            </main>

            {/* ========================================================
                FOOTER
            ======================================================== */}
            <Footer />
          </div>
        </div>
      </div>
    </SchoolProvider>
  );
}
