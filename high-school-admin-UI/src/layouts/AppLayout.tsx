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
          role={(role as any) ?? undefined}
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
            <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
              {/* Breadcrumb Navigation */}
              <div className="mb-4">
                <Breadcrumbs />
              </div>

              {/* Page Content */}
              <Outlet />
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
