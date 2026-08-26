// src/layouts/Sidebar.tsx
import { useState, useEffect, useMemo, useRef } from "react";
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
  Library,
  Calendar as CalendarIcon,
  MessageSquare,
  Wallet,
  FileText,
  X,
  Search,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { useSchool } from "@/context/SchoolContext";
import { useAuth } from "@/hooks/useAuth";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";
import { useTranslations, type TranslationKey } from "@/i18n";

type Section =
  | "SETUP"
  | "ACADEMIC"
  | "EXAMS"
  | "FEES"
  | "LIBRARY"
  | "CALENDAR"
  | "MESSAGES"
  | "STUDENTS"
  | "TEACHERS"
  | "COMMUNICATION"
  | "REPORTS"
  | "CHILDREN"
  | "SYSTEM";

interface MenuItem {
  translationKey: TranslationKey;
  icon: LucideIcon;
  path: string;
  badge?: string | number;
  badgeColor?: string;
}

interface MenuSection {
  key: Section;
  titleKey: TranslationKey;
  icon: LucideIcon;
  items: MenuItem[];
}

// Role-tailored menu configuration
const roleMenus: Record<string, MenuSection[]> = {
  admin: [
    {
      key: "SETUP",
      titleKey: "sidebar.setup",
      icon: Settings,
      items: [
        { translationKey: "sidebar.schoolSetup", icon: Settings, path: "/setup/school" },
        { translationKey: "sidebar.rolesPermissions", icon: ShieldCheck, path: "/setup/roles" },
        { translationKey: "sidebar.subjects", icon: BookMarked, path: "/setup/subjects" },
        { translationKey: "sidebar.schedules", icon: CalendarDays, path: "/setup/schedules" },
        { translationKey: "sidebar.users", icon: User, path: "/setup/users" },
        { translationKey: "sidebar.translations", icon: Languages, path: "/setup/translations" },
      ],
    },
    {
      key: "ACADEMIC",
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
      key: "EXAMS",
      titleKey: "sidebar.exams",
      icon: FileText,
      items: [
        { translationKey: "sidebar.examList", icon: FileText, path: "/academic/exams" },
        { translationKey: "sidebar.reportCards", icon: Award, path: "/academic/report-cards" },
      ],
    },
    {
      key: "FEES",
      titleKey: "sidebar.fees",
      icon: Wallet,
      items: [
        { translationKey: "sidebar.feeStructures", icon: Wallet, path: "/fees/structures" },
        { translationKey: "sidebar.invoices", icon: FileText, path: "/fees/invoices" },
        { translationKey: "sidebar.payments", icon: FileText, path: "/fees/payments" },
      ],
    },
    {
      key: "LIBRARY",
      titleKey: "sidebar.library",
      icon: Library,
      items: [
        { translationKey: "sidebar.books", icon: Library, path: "/library/books" },
        { translationKey: "sidebar.borrow", icon: Library, path: "/library/borrow" },
        { translationKey: "sidebar.returns", icon: Library, path: "/library/returns" },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      items: [
        { translationKey: "sidebar.calendarView", icon: CalendarIcon, path: "/calendar" },
      ],
    },
    {
      key: "MESSAGES",
      titleKey: "sidebar.messages",
      icon: MessageSquare,
      items: [
        { translationKey: "sidebar.inbox", icon: MessageSquare, path: "/messages", badge: "3", badgeColor: "bg-teal-500 text-white" },
      ],
    },
    {
      key: "STUDENTS",
      titleKey: "sidebar.students",
      icon: Users2,
      items: [
        { translationKey: "sidebar.studentList", icon: Users2, path: "/students" },
        { translationKey: "sidebar.attendance", icon: ClipboardCheck, path: "/students/attendance" },
        { translationKey: "sidebar.leaveRequests", icon: FileClock, path: "/students/leave-requests", badge: "2", badgeColor: "bg-amber-500 text-white" },
      ],
    },
    {
      key: "TEACHERS",
      titleKey: "sidebar.teachers",
      icon: UserCog,
      items: [
        { translationKey: "sidebar.teacherList", icon: UserCog, path: "/teachers" },
        { translationKey: "sidebar.teacherAssignments", icon: UserSquare2, path: "/teachers/assignments" },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/communication/announcements" },
        { translationKey: "sidebar.notifications", icon: Megaphone, path: "/communication/notifications" },
      ],
    },
    {
      key: "REPORTS",
      titleKey: "sidebar.reports",
      icon: BarChart3,
      items: [
        { translationKey: "sidebar.attendanceReport", icon: ClipboardCheck, path: "/reports/attendance" },
        { translationKey: "sidebar.gradeReport", icon: FileBarChart, path: "/reports/grades" },
        { translationKey: "sidebar.studentReport", icon: Users2, path: "/reports/students" },
        { translationKey: "sidebar.teacherReport", icon: UserSquare2, path: "/reports/teachers" },
      ],
    },
    {
      key: "SYSTEM",
      titleKey: "sidebar.system",
      icon: Settings,
      items: [
        { translationKey: "sidebar.auditLogs", icon: Settings, path: "/system/logs" },
      ],
    },
  ],
  teacher: [
    {
      key: "ACADEMIC",
      titleKey: "sidebar.academic",
      icon: BookOpenCheck,
      items: [
        { translationKey: "sidebar.classes", icon: BookOpenCheck, path: "/teacher/classes" },
        { translationKey: "sidebar.lessons", icon: NotebookText, path: "/teacher/lessons" },
        { translationKey: "sidebar.homework", icon: PenLine, path: "/teacher/homework" },
        { translationKey: "sidebar.quizTests", icon: FileQuestion, path: "/teacher/quizzes" },
        { translationKey: "sidebar.grades", icon: Award, path: "/teacher/grades" },
      ],
    },
    {
      key: "EXAMS",
      titleKey: "sidebar.exams",
      icon: FileText,
      items: [
        { translationKey: "sidebar.examList", icon: FileText, path: "/teacher/exams" },
      ],
    },
    {
      key: "STUDENTS",
      titleKey: "sidebar.students",
      icon: Users2,
      items: [
        { translationKey: "sidebar.studentList", icon: Users2, path: "/teacher/students" },
        { translationKey: "sidebar.attendance", icon: ClipboardCheck, path: "/teacher/attendance" },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/teacher/announcements" },
        { translationKey: "sidebar.notifications", icon: Megaphone, path: "/teacher/notifications" },
      ],
    },
    {
      key: "MESSAGES",
      titleKey: "sidebar.messages",
      icon: MessageSquare,
      items: [
        { translationKey: "sidebar.inbox", icon: MessageSquare, path: "/teacher/messages", badge: "3", badgeColor: "bg-teal-500 text-white" },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      items: [
        { translationKey: "sidebar.calendarView", icon: CalendarIcon, path: "/teacher/calendar" },
      ],
    },
    {
      key: "LIBRARY",
      titleKey: "sidebar.library",
      icon: Library,
      items: [
        { translationKey: "sidebar.books", icon: Library, path: "/teacher/library" },
      ],
    },
  ],
  student: [
    {
      key: "ACADEMIC",
      titleKey: "sidebar.academic",
      icon: BookOpenCheck,
      items: [
        { translationKey: "sidebar.classes", icon: BookOpenCheck, path: "/student/classes" },
        { translationKey: "sidebar.homework", icon: PenLine, path: "/student/homework" },
        { translationKey: "sidebar.quizTests", icon: FileQuestion, path: "/student/quizzes" },
        { translationKey: "sidebar.grades", icon: Award, path: "/student/grades" },
      ],
    },
    {
      key: "EXAMS",
      titleKey: "sidebar.exams",
      icon: FileText,
      items: [
        { translationKey: "sidebar.examList", icon: FileText, path: "/student/exams" },
        { translationKey: "sidebar.reportCards", icon: Award, path: "/student/report-cards" },
      ],
    },
    {
      key: "STUDENTS",
      titleKey: "sidebar.students",
      icon: Users2,
      items: [
        { translationKey: "sidebar.attendance", icon: ClipboardCheck, path: "/student/attendance" },
        { translationKey: "sidebar.leaveRequests", icon: FileClock, path: "/student/leave-requests" },
      ],
    },
    {
      key: "FEES",
      titleKey: "sidebar.fees",
      icon: Wallet,
      items: [
        { translationKey: "sidebar.invoices", icon: Wallet, path: "/student/fees" },
      ],
    },
    {
      key: "LIBRARY",
      titleKey: "sidebar.library",
      icon: Library,
      items: [
        { translationKey: "sidebar.books", icon: Library, path: "/student/library" },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      items: [
        { translationKey: "sidebar.calendarView", icon: CalendarIcon, path: "/student/calendar" },
      ],
    },
    {
      key: "MESSAGES",
      titleKey: "sidebar.messages",
      icon: MessageSquare,
      items: [
        { translationKey: "sidebar.inbox", icon: MessageSquare, path: "/student/messages", badge: "3", badgeColor: "bg-teal-500 text-white" },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/student/announcements" },
        { translationKey: "sidebar.notifications", icon: Megaphone, path: "/student/notifications" },
      ],
    },
  ],
  parent: [
    {
      key: "CHILDREN",
      titleKey: "sidebar.children",
      icon: Users2,
      items: [
        { translationKey: "sidebar.myChildren", icon: Users2, path: "/parent/children" },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/parent/announcements" },
        { translationKey: "sidebar.notifications", icon: Megaphone, path: "/parent/notifications" },
      ],
    },
    {
      key: "MESSAGES",
      titleKey: "sidebar.messages",
      icon: MessageSquare,
      items: [
        { translationKey: "sidebar.inbox", icon: MessageSquare, path: "/parent/messages", badge: "3", badgeColor: "bg-teal-500 text-white" },
      ],
    },
  ],
};

const roleBadgeColorMap: Record<string, string> = {
  admin: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  teacher: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  student: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  parent: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
};

function sectionForPath(pathname: string, menu: MenuSection[]): Section | null {
  const match = menu.find((section) =>
    section.items.some((item) => pathname === item.path || pathname.startsWith(item.path + "/"))
  );
  return match?.key ?? null;
}

const activeItemClass =
  "border-l-4 sm:border-l-6 border-brand-700 glass p-3 sm:p-3.5 font-semibold text-brand-700 hover:text-brand-800 hover:border-brand-800 dark:text-brand-300 dark:hover:text-brand-200 shadow-xs";
const inactiveItemClass =
  "border border-transparent text-stone-600 hover:text-stone-800 hover:bg-black/5 dark:hover:bg-white/5 dark:text-stone-400 dark:hover:text-stone-200";

export default function Sidebar({
  mobileOpen,
  onClose,
  role: propRole,
}: {
  mobileOpen?: boolean;
  onClose?: () => void;
  role?: "admin" | "teacher" | "student" | "parent";
}) {
  const location = useLocation();
  const { school } = useSchool();
  const { role: authRole, user, logout } = useAuth();
  const { t } = useTranslations();

  const activeRole = (propRole || authRole || "admin").toLowerCase();
  const schoolName = school?.name || "School Portal";
  const logoUrl = resolveAssetUrl(school?.logoUrl);

  // --- Collapsed State with LocalStorage Persistence ---
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "true";
    } catch {
      return false;
    }
  });

  const toggleCollapsed = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("sidebar_collapsed", String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // --- Quick Search Filter for Sidebar Items ---
  const [searchQuery, setSearchQuery] = useState("");

  // Hover Popover in Compact Mode
  const [hoveredSection, setHoveredSection] = useState<Section | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Active role's menu sections
  const baseMenu = useMemo(() => {
    return roleMenus[activeRole] || roleMenus.admin;
  }, [activeRole]);

  // Filtered menu based on search query
  const filteredMenu = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return baseMenu;

    return baseMenu
      .map((section) => {
        const translatedSectionTitle = t(section.titleKey).toLowerCase();
        const sectionMatches = translatedSectionTitle.includes(query);

        const matchingItems = section.items.filter((item) => {
          const translatedItem = t(item.translationKey).toLowerCase();
          return translatedItem.includes(query);
        });

        if (sectionMatches) {
          return section;
        }

        if (matchingItems.length > 0) {
          return {
            ...section,
            items: matchingItems,
          };
        }

        return null;
      })
      .filter((s): s is MenuSection => s !== null);
  }, [baseMenu, searchQuery, t]);

  // Open section management
  const [openSection, setOpenSection] = useState<Section | null>(() =>
    sectionForPath(location.pathname, baseMenu)
  );

  useEffect(() => {
    const active = sectionForPath(location.pathname, baseMenu);
    if (active) {
      setOpenSection(active);
    }
  }, [location.pathname, baseMenu]);

  const toggle = (section: Section) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleLinkClick = () => {
    if (onClose) {
      onClose();
    }
    setHoveredSection(null);
  };

  const handleMouseEnter = (sectionKey: Section) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (isCollapsed) {
      setHoveredSection(sectionKey);
    }
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredSection(null);
      }, 180);
    }
  };

  const dashboardPath = activeRole === "admin" ? "/dashboard" : `/${activeRole}/dashboard`;
  const isDashboardActive = location.pathname === dashboardPath || (activeRole === "admin" && location.pathname === "/");

  const userDisplayName = user?.name || (user?.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'User Profile');
  const userInitials = userDisplayName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'AD';
  const roleBadgeStyle = roleBadgeColorMap[activeRole] || roleBadgeColorMap.admin;

  // --- Render compact rail mode for desktop ---
  const renderCompactMenu = () => (
    <div className="flex h-full flex-col justify-between p-2">
      <div className="flex flex-col items-center space-y-3">
        {/* Brand / Logo */}
        <div className="my-2 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl glass-sm text-stone-700 dark:text-stone-200">
          {logoUrl ? (
            <img src={logoUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <GraduationCap size={22} />
          )}
        </div>

        {/* Dashboard quick icon */}
        <NavLink
          to={dashboardPath}
          onClick={handleLinkClick}
          title={t("sidebar.dashboard")}
          className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
            isDashboardActive
              ? "bg-brand-700 text-white shadow-md shadow-brand-700/20 dark:bg-brand-600 font-semibold"
              : "text-stone-600 hover:bg-black/5 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-100"
          }`}
        >
          <LayoutDashboard size={20} />
        </NavLink>

        <div className="h-px w-8 bg-stone-300/60 dark:bg-white/10 my-1" />

        {/* Section Icons with Hover Popover */}
        <nav className="flex flex-col space-y-1.5">
          {baseMenu.map((section) => {
            const SectionIcon = section.icon;
            const isSectionActive = section.items.some((item) =>
              location.pathname === item.path || location.pathname.startsWith(item.path + "/")
            );
            const isHovered = hoveredSection === section.key;

            return (
              <div
                key={section.key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(section.key)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggle(section.key)}
                  aria-label={t(section.titleKey)}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                    isSectionActive
                      ? "bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300 font-semibold"
                      : "text-stone-600 hover:bg-black/5 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-100"
                  }`}
                >
                  <SectionIcon size={20} />
                  {isSectionActive && (
                    <span className="absolute -right-0.5 top-2 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white dark:ring-stone-900" />
                  )}
                </button>

                {/* Popover Flyout for Compact Mode */}
                {isHovered && (
                  <div
                    className="absolute left-full top-0 z-50 ml-3 w-56 rounded-2xl glass-sm p-3 shadow-2xl backdrop-blur-xl border border-white/20 animate-in fade-in zoom-in-95 duration-150"
                    onMouseEnter={() => handleMouseEnter(section.key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-stone-200/50 pb-2 px-1 dark:border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-200">
                        {t(section.titleKey)}
                      </span>
                      <span className="text-[10px] text-stone-400 font-medium">{section.items.length} items</span>
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isItemActive =
                          location.pathname === item.path ||
                          location.pathname.startsWith(item.path + "/");

                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={handleLinkClick}
                            className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition ${
                              isItemActive
                                ? "bg-brand-700 text-white font-semibold shadow-xs"
                                : "text-stone-600 hover:bg-black/5 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-white/5 dark:hover:text-white"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <Icon size={14} className="shrink-0" />
                              <span className="truncate">{t(item.translationKey)}</span>
                            </span>
                            {item.badge && (
                              <span className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[9px] font-bold ${item.badgeColor || 'bg-brand-600 text-white'}`}>
                                {item.badge}
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>

      {/* Compact Mode Footer with Expand Button & User Avatar */}
      <div className="flex flex-col items-center space-y-2 pt-3 border-t border-stone-200/50 dark:border-white/10">
        <button
          type="button"
          onClick={toggleCollapsed}
          title="Expand sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-500 hover:bg-black/5 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-white/5 dark:hover:text-stone-200 transition"
          aria-label="Expand sidebar"
        >
          <PanelLeft size={18} />
        </button>

        <div
          title={`${userDisplayName} (${activeRole})`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-xs shadow-xs cursor-default select-none"
        >
          {userInitials}
        </div>
      </div>
    </div>
  );

  // --- Render standard expanded menu ---
  const renderExpandedMenu = (isMobile = false) => (
    <div className="flex min-h-full flex-col justify-between">
      <div>
        {/* Header Branding */}
        <div className="sticky top-0 z-10 rounded-2xl sm:rounded-[28px] glass-sm px-4 py-3.5 m-2.5 sm:m-3 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-2xl glass-sm text-stone-700 dark:text-stone-200 shadow-xs">
              {logoUrl ? (
                <img src={logoUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <GraduationCap size={22} />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-sm sm:text-[15px] font-bold leading-tight text-stone-900 dark:text-stone-100">
                {schoolName}
              </h2>
              <p className="truncate text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">
                {t("footer.systemName")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Desktop collapse toggle */}
            {!isMobile && (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl text-stone-400 hover:bg-black/5 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white transition"
                title="Collapse sidebar"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={17} />
              </button>
            )}

            {/* Mobile close button */}
            {isMobile && (
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-500 hover:bg-stone-200/50 hover:text-stone-800 lg:hidden dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white transition"
                aria-label="Close navigation"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Dashboard Link */}
        <div className="px-3 sm:px-4 pt-1">
          <NavLink
            to={dashboardPath}
            onClick={handleLinkClick}
            className={({ isActive }) =>
              `flex min-h-[42px] items-center justify-between gap-3 rounded-2xl px-3.5 py-2 text-sm font-medium transition ${
                isActive ? activeItemClass : inactiveItemClass
              }`
            }
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard size={17} />
              <span>{t("sidebar.dashboard")}</span>
            </div>
            {isDashboardActive && (
              <span className="h-2 w-2 rounded-full bg-brand-600 dark:bg-brand-400" />
            )}
          </NavLink>
        </div>

        {/* Quick Menu Filter Input */}
        <div className="px-3 sm:px-4 py-2">
          <div className="relative flex items-center">
            <Search size={14} className="absolute left-3 text-stone-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search menu items..."
              className="w-full rounded-xl bg-stone-100/70 dark:bg-white/5 pl-8 pr-7 py-1.5 text-xs text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none focus:ring-1.5 focus:ring-brand-500/50 transition border border-transparent dark:border-white/5"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
              >
                <X size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 px-3 sm:px-4 py-1 space-y-1">
          {filteredMenu.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-stone-400 dark:text-stone-500">
              No matching menu items found.
            </div>
          ) : (
            filteredMenu.map((section) => {
              const SectionIcon = section.icon;
              const isSectionOpen = searchQuery ? true : openSection === section.key;
              const hasActiveChild = section.items.some((item) =>
                location.pathname === item.path || location.pathname.startsWith(item.path + "/")
              );

              return (
                <div key={section.key} className="pt-0.5">
                  <button
                    type="button"
                    onClick={() => toggle(section.key)}
                    className={`flex min-h-[40px] w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] transition ${
                      hasActiveChild
                        ? "text-brand-700 dark:text-brand-300 bg-brand-50/50 dark:bg-brand-950/20"
                        : "text-stone-600 hover:text-stone-900 hover:bg-black/5 dark:text-stone-400 dark:hover:text-stone-200 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      <SectionIcon size={16} className={hasActiveChild ? "text-brand-600 dark:text-brand-400" : "text-stone-500"} />
                      <span className="truncate">{t(section.titleKey)}</span>
                    </span>
                    <div className="flex items-center gap-1.5">
                      {hasActiveChild && (
                        <span className="h-1.5 w-1.5 rounded-full bg-brand-600 dark:bg-brand-400" />
                      )}
                      {isSectionOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </div>
                  </button>

                  {isSectionOpen && (
                    <div className="mt-1 space-y-0.5 pl-3 sm:pl-3.5 border-l-2 border-stone-200/60 dark:border-white/10 ml-3.5 my-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isItemActive =
                          location.pathname === item.path ||
                          location.pathname.startsWith(item.path + "/");

                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={handleLinkClick}
                            className={`flex min-h-[36px] items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                              isItemActive ? activeItemClass : inactiveItemClass
                            }`}
                          >
                            <span className="flex items-center gap-2.5 truncate">
                              <Icon size={15} className="shrink-0" />
                              <span className="truncate">{t(item.translationKey)}</span>
                            </span>
                            {item.badge && (
                              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor || 'bg-brand-600 text-white'}`}>
                                {item.badge}
                              </span>
                            )}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </nav>
      </div>

      {/* User Profile Mini Footer Card */}
      <div className="p-3 m-2.5 sm:m-3 rounded-2xl glass-sm border border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white font-bold text-xs shadow-xs select-none">
            {userInitials}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight">
              {userDisplayName}
            </p>
            <span className={`inline-block text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded-md ${roleBadgeStyle}`}>
              {activeRole}
            </span>
          </div>
        </div>

        {logout && (
          <button
            type="button"
            onClick={() => logout()}
            title="Sign out"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition"
            aria-label="Sign out"
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-xs transition-opacity duration-200 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onClose && onClose()}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile drawer (Always full view) */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-[295px] max-w-[85vw] transform glass-sm text-stone-900 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden dark:text-stone-100 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="h-full overflow-y-auto">{renderExpandedMenu(true)}</div>
      </div>

      {/* Desktop sidebar (supports compact rail and full view) */}
      <aside
        className={`hidden sticky top-0 h-screen shrink-0 flex-col lg:flex glass-sm overflow-y-auto transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-18" : "w-72"
        }`}
      >
        {isCollapsed ? renderCompactMenu() : renderExpandedMenu(false)}
      </aside>
    </>
  );
}
