import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
  ChevronDown,
  ChevronRight,
  Settings,
  Languages,
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
import { useSchool } from "@/context/SchoolContext";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";
import { useTranslations } from "@/i18n";

type Section =
  | "SETUP"
  | "ACADEMIC"
  | "STUDENTS"
  | "TEACHERS"
  | "COMMUNICATION"
  | "REPORTS";

interface MenuItem {
  translationKey: string;
  icon: any;
  path: string;
}

interface MenuSection {
  key: Section;
  titleKey: string;
  icon: any;
  items: MenuItem[];
}

const menu: MenuSection[] = [
  {
    key: "SETUP" as Section,
    titleKey: "sidebar.setup",
    icon: Settings,
    items: [
      { translationKey: "sidebar.schoolSetup", icon: Settings, path: "/setup/school" },
      { translationKey: "sidebar.rolesPermissions", icon: ShieldCheck, path: "/setup/roles" },
      { translationKey: "sidebar.subjects", icon: BookMarked, path: "/setup/subjects" },
      { translationKey: "sidebar.schedules", icon: CalendarDays, path: "/setup/schedules" },
      { translationKey: "sidebar.users", icon: User, path: "/setup/users" },
      { translationKey: "header.changeLanguage", icon: Languages, path: "/setup/translations" },
    ],
  },
  {
    key: "ACADEMIC" as Section,
    titleKey: "sidebar.academic",
    icon: BookOpenCheck,
    items: [
      { translationKey: "sidebar.classes", icon: BookOpenCheck, path: "/academic/classes" },
      { translationKey: "sidebar.lessons", icon: NotebookText, path: "/academic/lessons" },
      { translationKey: "sidebar.homework", icon: PenLine, path: "/academic/homework" },
      { translationKey: "sidebar.quizTests", icon: FileQuestion, path: "/academic/quizzes" },
      { translationKey: "sidebar.grades", icon: Award, path: "/academic/grades" },
    ],
  },
  {
    key: "STUDENTS" as Section,
    titleKey: "sidebar.students",
    icon: Users2,
    items: [
      { translationKey: "sidebar.studentList", icon: Users2, path: "/students" },
      { translationKey: "sidebar.attendance", icon: ClipboardCheck, path: "/students/attendance" },
      { translationKey: "sidebar.leaveRequests", icon: FileClock, path: "/students/leave-requests" },
    ],
  },
  {
    key: "TEACHERS" as Section,
    titleKey: "sidebar.teachers",
    icon: UserCog,
    items: [
      { translationKey: "sidebar.teacherList", icon: UserCog, path: "/teachers" },
      { translationKey: "sidebar.teacherAssignments", icon: UserSquare2, path: "/teachers/assignments" },
    ],
  },
  {
    key: "COMMUNICATION" as Section,
    titleKey: "sidebar.communication",
    icon: Megaphone,
    items: [
      { translationKey: "sidebar.announcements", icon: Megaphone, path: "/communication/announcements" },
      { translationKey: "sidebar.notifications", icon: Megaphone, path: "/communication/notifications" },
    ],
  },
  {
    key: "REPORTS" as Section,
    titleKey: "sidebar.reports",
    icon: BarChart3,
    items: [
      { translationKey: "sidebar.attendanceReport", icon: ClipboardCheck, path: "/reports/attendance" },
      { translationKey: "sidebar.gradeReport", icon: FileBarChart, path: "/reports/grades" },
      { translationKey: "sidebar.studentReport", icon: Users2, path: "/reports/students" },
      { translationKey: "sidebar.teacherReport", icon: UserSquare2, path: "/reports/teachers" },
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
  const { school } = useSchool();
  const { t } = useTranslations();

  const schoolName = school?.name || "Your School";
  const logoUrl = school?.logoUrl ? resolveAssetUrl(school.logoUrl) : null;

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
          <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full glass-sm text-stone-600 dark:text-stone-300">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-full w-full object-cover" />
            ) : (
              <GraduationCap size={22} />
            )}
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-bold leading-tight text-stone-900 dark:text-stone-100">
              {schoolName}
            </h2>
            <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-stone-600 dark:text-stone-400">
              {t('footer.systemName')}
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
          <span>{t('sidebar.dashboard')}</span>
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
                  {t(section.titleKey)}
                </span>
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>

              {isOpen && (
                <div className="mt-1 space-y-0.5 pl-4">
                  {section.items.map((item) => {
                    const Icon = item.icon;

                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition ${
                            isActive ? activeItemClass : inactiveItemClass
                          }`
                        }
                      >
                        <Icon size={16} />
                        <span>{t(item.translationKey)}</span>
                      </NavLink>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

    
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