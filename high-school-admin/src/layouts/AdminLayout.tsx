import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-900">
      <Sidebar />

      <div className="flex-1 min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-100">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}