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
      {/* 
        Added `ambient-dashboard` to activate the background light blobs.
        This provides the colorful backdrop that the glass panels refract.
      */}
      <div className="relative page-theme ambient-dashboard flex h-dvh w-full overflow-hidden text-color">
        {/* Soft pastel ambient light orbs that refract through the liquid glass panels */}
        <div className="pointer-events-none absolute -top-32 left-1/4 h-120 w-120 rounded-full bg-blue-300/35 dark:bg-blue-600/15 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -right-24 h-110 w-110 rounded-full bg-purple-300/30 dark:purple-600/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-100 w-100 rounded-full bg-cyan-300/35 dark:bg-cyan-600/15 blur-3xl" />
        <div className="pointer-events-none absolute bottom-1/4 -left-20 h-96 w-96 rounded-full bg-amber-200/25 dark:bg-amber-500/10 blur-3xl" />

        {/* Minimalist 3D translucent fluid glass ribbons background */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-25 dark:opacity-15 select-none">
          <img
            src="/assets/images/fluid_glass_ribbons.jpg"
            alt="Fluid glass ribbons"
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover object-center scale-105 filter blur-[0.5px] mix-blend-overlay"
          />
        </div>

        <Sidebar
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
          role={(role as any) ?? undefined}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <Header onOpenSidebar={() => setMobileOpen(true)} />

          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
            <main className="flex-1 w-full max-w-[1600px] mx-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
              <div className="mb-4">
                <Breadcrumbs />
              </div>
              <Outlet />
            </main>

            <Footer />
          </div>
        </div>
      </div>
    </SchoolProvider>
  );
}