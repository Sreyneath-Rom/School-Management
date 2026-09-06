// src/layouts/StudentLayout.tsx

import { useState } from "react";
import { Outlet } from "react-router-dom";

import Header from "@/layouts/Header";
import Sidebar from "@/layouts/Sidebar";
import Footer from "@/layouts/Footer";

import Breadcrumbs from "@/components/common/Breadcrumbs";

import { SchoolProvider } from "@/context/SchoolContext";
import { useAuth } from "@/hooks/useAuth";

export default function StudentLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { role } = useAuth();

  return (
    <SchoolProvider>
      <div className="flex h-screen w-full overflow-hidden">

        {/* ============================================================
            SIDEBAR
        ============================================================ */}
        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={role ?? "student"}
        />

        {/* ============================================================
            APPLICATION AREA
        ============================================================ */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">

          {/* ==========================================================
              HEADER
          ========================================================== */}
          <Header
            onOpenSidebar={() => setMobileOpen(true)}
          />

          {/* ==========================================================
              SCROLLABLE CONTENT
          ========================================================== */}
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">

            <main className="flex-1 p-2 sm:p-4 lg:p-5">

              {/* ======================================================
                  PAGE CONTAINER
              ====================================================== */}
              <div
                className="
                  min-h-full
                  rounded-2xl
                  bg-white/75
                  p-4
                  shadow-sm
                  backdrop-blur-xl
                  sm:rounded-3xl
                  sm:p-6
                  lg:p-8
                  dark:bg-stone-900/65
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