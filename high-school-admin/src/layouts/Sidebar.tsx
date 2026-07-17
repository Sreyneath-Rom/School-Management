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
  "border-l-6 border-brand-700 glass p-4 font-semibold text-brand-700 hover:text-brand-800 hover:border-brand-800 dark:text-brand-300 dark:hover:text-brand-200";
const inactiveItemClass =
  "border border-transparent text-stone-600 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200";

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
      <div className="sticky top-0 z-10 rounded-[28px] glass-sm px-4 py-4 m-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full glass-sm text-stone-600 dark:text-stone-300">
            <GraduationCap size={22} />
          </div>

          <div>
            <h2 className="text-[15px] font-bold leading-tight text-stone-900 dark:text-stone-100">
              Varin High School
            </h2>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-600 dark:text-stone-400">
              School Management
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
                className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-stone-600 transition hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
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
      <div className="p-4 sticky bottom-0">
        <div className="rounded-[28px] glass-sm p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-600 dark:text-stone-400">
            Academic Year
          </p>
          <p className="mt-1 text-lg font-bold text-stone-900 dark:text-stone-100">2025 – 2026</p>
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
        className={`fixed left-0 top-0 z-50 h-full w-72 transform glass-sm text-stone-900 transition-transform duration-200 lg:hidden dark:text-stone-100 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full overflow-y-auto">{menuContent}</div>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden sticky top-0 h-screen w-74 flex-col lg:flex">{menuContent}</aside>
    </>
  );
}