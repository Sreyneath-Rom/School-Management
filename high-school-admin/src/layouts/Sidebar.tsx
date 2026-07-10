import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Settings,
  ShieldCheck,
  BookMarked,
  CalendarDays,
  User,
  BookOpenCheck,
  NotebookText,
  PenLine,
  FileQuestion,
  Award,
  Users2,
  ClipboardCheck,
  FileClock,
  UserCog,
  UserSquare2,
  Megaphone,
  BarChart3,
  FileBarChart,
  X,
} from "lucide-react";

type Section =
  | "SETUP"
  | "ACADEMIC"
  | "STUDENTS"
  | "TEACHERS"
  | "COMMUNICATION"
  | "REPORTS";

const menu = [
  {
    key: "SETUP" as Section,
    title: "SETUP",
    icon: Settings,
    items: [
      { name: "School Setup", icon: Settings, path: "/setup/school" },
      { name: "Roles & Permissions", icon: ShieldCheck, path: "/setup/roles" },
      { name: "Subjects", icon: BookMarked, path: "/setup/subjects" },
      { name: "Schedules", icon: CalendarDays, path: "/setup/schedules" },
      { name: "Users", icon: User, path: "/setup/users" },
    ],
  },
  {
    key: "ACADEMIC" as Section,
    title: "ACADEMIC",
    icon: BookOpenCheck,
    items: [
      { name: "Classes", icon: BookOpenCheck, path: "/academic/classes" },
      { name: "Lessons", icon: NotebookText, path: "/academic/lessons" },
      { name: "Homework", icon: PenLine, path: "/academic/homework" },
      { name: "Quiz & Tests", icon: FileQuestion, path: "/academic/quizzes" },
      { name: "Grades", icon: Award, path: "/academic/grades" },
    ],
  },
  {
    key: "STUDENTS" as Section,
    title: "STUDENTS",
    icon: Users2,
    items: [
      { name: "Student List", icon: Users2, path: "/students" },
      { name: "Attendance", icon: ClipboardCheck, path: "/students/attendance" },
      { name: "Leave Requests", icon: FileClock, path: "/students/leave-requests" },
    ],
  },
  {
    key: "TEACHERS" as Section,
    title: "TEACHERS",
    icon: UserCog,
    items: [
      { name: "Teacher List", icon: UserCog, path: "/teachers" },
      { name: "Teacher Assignments", icon: UserSquare2, path: "/teachers/assignments" },
    ],
  },
  {
    key: "COMMUNICATION" as Section,
    title: "COMMUNICATION",
    icon: Megaphone,
    items: [
      { name: "Announcements", icon: Megaphone, path: "/communication/announcements" },
      { name: "Notifications", icon: Megaphone, path: "/communication/notifications" },
    ],
  },
  {
    key: "REPORTS" as Section,
    title: "REPORTS",
    icon: BarChart3,
    items: [
      { name: "Attendance Report", icon: ClipboardCheck, path: "/reports/attendance" },
      { name: "Grade Report", icon: FileBarChart, path: "/reports/grades" },
      { name: "Student Report", icon: Users2, path: "/reports/students" },
      { name: "Teacher Report", icon: UserSquare2, path: "/reports/teachers" },
    ],
  },
];

function sectionForPath(pathname: string): Section | null {
  const match = menu.find((section) =>
    section.items.some((item) => pathname.startsWith(item.path))
  );
  return match?.key ?? null;
}

const activeItemClass =
  "border border-cyan-600/40 bg-cyan-50 font-semibold text-cyan-700";
const inactiveItemClass =
  "border border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-800";

export default function Sidebar({ mobileOpen, onClose }: { mobileOpen?: boolean; onClose?: () => void }) {
  const location = useLocation();

  // Accordion: only one section key (or null) is ever "open" at a time.
  const [openSection, setOpenSection] = useState<Section | null>(() =>
    sectionForPath(location.pathname)
  );

  useEffect(() => {
    const active = sectionForPath(location.pathname);
    if (active) {
      setOpenSection(active);
    }
  }, [location.pathname]);

  const toggle = (section: Section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const menuContent = (
    <>
      {/* Logo */}
      <div className="px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-700 text-white">
            <GraduationCap size={22} />
          </div>

          <div>
            <h2 className="text-[15px] font-bold leading-tight text-slate-900">
              Varin High School
            </h2>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-400">
              School Management System
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="px-4">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition ${
              isActive ? activeItemClass : inactiveItemClass
            }`
          }
        >
          <LayoutDashboard size={16} />
          <span>Dashboard</span>
        </NavLink>
      </div>

      {/* Menu */}
      <nav className="flex-1 px-4 py-4">
        {menu.map((section) => {
          const SectionIcon = section.icon;
          const isOpen = openSection === section.key;

          return (
            <div key={section.key} className="mb-1 pt-1">
              <button
                onClick={() => toggle(section.key)}
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate-500 transition hover:text-slate-700"
              >
                <span className="flex items-center gap-3">
                  <SectionIcon size={18} />
                  {section.title}
                </span>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {isOpen && (
                <div className="mt-1 space-y-0.5 pl-4">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition ${
                            isActive ? activeItemClass : inactiveItemClass
                          }`
                        }
                      >
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4">
        <div className="rounded-2xl glass-strong p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            Academic Year
          </p>
          <p className="mt-1 text-lg font-bold text-slate-900">2025 – 2026</p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 lg:hidden ${mobileOpen ? 'block' : 'hidden'}`}
        onClick={() => onClose && onClose()}
      />

      {/* Mobile drawer */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-72 transform bg-white text-slate-900 transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-700 text-white">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Varin High School</h3>
              <p className="text-xs text-slate-500">School Management</p>
            </div>
          </div>
          <button onClick={() => onClose && onClose()} aria-label="Close menu" className="p-2">
            <X size={18} />
          </button>
        </div>

        <div className="h-full overflow-y-auto">{menuContent}</div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden sticky top-0 h-screen w-72 flex-col lg:flex">{menuContent}</aside>
    </>
  );
}