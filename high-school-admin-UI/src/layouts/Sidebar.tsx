// src/layouts/Sidebar.tsx
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  CalendarRange,
  Clock,
  DoorOpen,
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
  Contact2,
  UserCheck,
  Megaphone,
  BarChart3,
  LineChart,
  DollarSign,
  Library,
  Calendar as CalendarIcon,
  MessageSquare,
  FileText,
  CalendarClock,
  CheckSquare,
  Tags,
  BookmarkPlus,
  Undo2,
  AlertCircle,
  PartyPopper,
  SunMedium,
  Bell,
  Activity,
  Sliders,
  X,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { useSchool } from "@/context/SchoolContext";
import { useAuth } from "@/hooks/useAuth";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";
import { useTranslations, type TranslationKey } from "@/i18n";

type Section =
  | "DASHBOARD"
  | "SETUP"
  | "ACADEMIC"
  | "EXAMS"
  | "STUDENTS"
  | "TEACHERS"
  | "FEES"
  | "LIBRARY"
  | "CALENDAR"
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
  badgePulse?: boolean;
}

interface MenuSection {
  key: Section;
  titleKey: TranslationKey;
  icon: LucideIcon;
  categoryGroup?: "core" | "academic" | "management" | "system";
  items: MenuItem[];
}

// Role-tailored menu configuration
const roleMenus: Record<string, MenuSection[]> = {
  admin: [
    {
      key: "SETUP",
      titleKey: "sidebar.setup",
      icon: Settings,
      categoryGroup: "core",
      items: [
        {
          translationKey: "sidebar.schoolSetup",
          icon: Settings,
          path: "/setup/school",
        },
        {
          translationKey: "sidebar.academicYears",
          icon: CalendarRange,
          path: "/setup/academic-years",
        },
        {
          translationKey: "sidebar.gradeLevels",
          icon: GraduationCap,
          path: "/setup/grade-levels",
        },
        { translationKey: "sidebar.terms", icon: Clock, path: "/setup/terms" },
        {
          translationKey: "sidebar.subjects",
          icon: BookMarked,
          path: "/setup/subjects",
        },
        {
          translationKey: "sidebar.rooms",
          icon: DoorOpen,
          path: "/setup/rooms",
        },
        {
          translationKey: "sidebar.rolesPermissions",
          icon: ShieldCheck,
          path: "/setup/roles",
        },
        { translationKey: "sidebar.users", icon: User, path: "/setup/users" },
        {
          translationKey: "sidebar.translations",
          icon: Languages,
          path: "/setup/translations",
        },
      ],
    },
    {
      key: "ACADEMIC",
      titleKey: "sidebar.academic",
      icon: BookOpenCheck,
      categoryGroup: "academic",
      items: [
        {
          translationKey: "sidebar.classes",
          icon: BookOpenCheck,
          path: "/academic/classes",
        },
        {
          translationKey: "sidebar.classSubjects",
          icon: BookMarked,
          path: "/academic/class-subjects",
        },
        {
          translationKey: "sidebar.classSchedules",
          icon: CalendarDays,
          path: "/academic/schedules",
        },
        {
          translationKey: "sidebar.lessons",
          icon: NotebookText,
          path: "/academic/lessons",
        },
        {
          translationKey: "sidebar.homework",
          icon: PenLine,
          path: "/academic/homework",
        },
        {
          translationKey: "sidebar.quizTests",
          icon: FileQuestion,
          path: "/academic/quizzes",
        },
        {
          translationKey: "sidebar.grades",
          icon: Award,
          path: "/academic/grades",
        },
      ],
    },
    {
      key: "EXAMS",
      titleKey: "sidebar.exams",
      icon: FileText,
      categoryGroup: "academic",
      items: [
        {
          translationKey: "sidebar.exams",
          icon: FileText,
          path: "/academic/exams",
        },
        {
          translationKey: "sidebar.examSchedules",
          icon: CalendarClock,
          path: "/academic/exam-schedules",
        },
        {
          translationKey: "sidebar.markEntry",
          icon: CheckSquare,
          path: "/academic/mark-entry",
        },
        {
          translationKey: "sidebar.reportCards",
          icon: Award,
          path: "/academic/report-cards",
        },
      ],
    },
    {
      key: "STUDENTS",
      titleKey: "sidebar.students",
      icon: Users2,
      categoryGroup: "management",
      items: [
        {
          translationKey: "sidebar.studentList",
          icon: Users2,
          path: "/students",
        },
        {
          translationKey: "sidebar.studentProfiles",
          icon: Contact2,
          path: "/students/profiles",
        },
        {
          translationKey: "sidebar.attendance",
          icon: ClipboardCheck,
          path: "/students/attendance",
        },
        {
          translationKey: "sidebar.leaveRequests",
          icon: FileClock,
          path: "/students/leave-requests",
          badge: "2",
          badgeColor: "bg-amber-500 text-white",
          badgePulse: true,
        },
      ],
    },
    {
      key: "TEACHERS",
      titleKey: "sidebar.teachers",
      icon: UserCog,
      categoryGroup: "management",
      items: [
        {
          translationKey: "sidebar.teacherList",
          icon: UserCog,
          path: "/teachers",
        },
        {
          translationKey: "sidebar.teacherProfiles",
          icon: UserCheck,
          path: "/teachers/profiles",
        },
        {
          translationKey: "sidebar.teacherAssignments",
          icon: UserSquare2,
          path: "/teachers/assignments",
        },
        {
          translationKey: "sidebar.teacherAttendance",
          icon: ClipboardCheck,
          path: "/teachers/attendance",
        },
      ],
    },
    {
      key: "LIBRARY",
      titleKey: "sidebar.library",
      icon: Library,
      categoryGroup: "academic",
      items: [
        {
          translationKey: "sidebar.books",
          icon: Library,
          path: "/library/books",
        },
        {
          translationKey: "sidebar.libraryCategories",
          icon: Tags,
          path: "/library/categories",
        },
        {
          translationKey: "sidebar.borrow",
          icon: BookmarkPlus,
          path: "/library/borrow",
        },
        {
          translationKey: "sidebar.returns",
          icon: Undo2,
          path: "/library/returns",
        },
        {
          translationKey: "sidebar.overdueBooks",
          icon: AlertCircle,
          path: "/library/overdue",
          badge: "4",
          badgeColor: "bg-rose-500 text-white",
        },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      categoryGroup: "core",
      items: [
        {
          translationKey: "sidebar.calendarView",
          icon: CalendarIcon,
          path: "/calendar",
        },
        {
          translationKey: "sidebar.calendarEvents",
          icon: PartyPopper,
          path: "/calendar/events",
        },
        {
          translationKey: "sidebar.calendarHolidays",
          icon: SunMedium,
          path: "/calendar/holidays",
        },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        {
          translationKey: "sidebar.announcements",
          icon: Megaphone,
          path: "/communication/announcements",
        },
        {
          translationKey: "sidebar.notifications",
          icon: Bell,
          path: "/communication/notifications",
        },
        {
          translationKey: "sidebar.messages",
          icon: MessageSquare,
          path: "/messages",
          badge: "3",
          badgeColor: "bg-teal-500 text-white",
          badgePulse: true,
        },
      ],
    },
    {
      key: "REPORTS",
      titleKey: "sidebar.reports",
      icon: BarChart3,
      categoryGroup: "system",
      items: [
        {
          translationKey: "sidebar.attendanceReport",
          icon: ClipboardCheck,
          path: "/reports/attendance",
        },
        {
          translationKey: "sidebar.academicPerformanceReport",
          icon: LineChart,
          path: "/reports/academic",
        },
        {
          translationKey: "sidebar.studentReport",
          icon: Users2,
          path: "/reports/students",
        },
        {
          translationKey: "sidebar.teacherReport",
          icon: UserSquare2,
          path: "/reports/teachers",
        },
        {
          translationKey: "sidebar.libraryReport",
          icon: Library,
          path: "/reports/library",
        },
      ],
    },
    {
      key: "SYSTEM",
      titleKey: "sidebar.system",
      icon: Sliders,
      categoryGroup: "system",
      items: [
        {
          translationKey: "sidebar.auditLogs",
          icon: FileText,
          path: "/system/logs",
        },
        {
          translationKey: "sidebar.activityLogs",
          icon: Activity,
          path: "/system/activity",
        },
        {
          translationKey: "sidebar.systemSettings",
          icon: Sliders,
          path: "/system/settings",
        },
        {
          translationKey: "sidebar.responsiveStudio",
          icon: Layers,
          path: "/system/responsive-studio",
          badge: "Live",
          badgeColor: "bg-brand-500 text-white",
        },
      ],
    },
  ],
  teacher: [
    {
      key: "ACADEMIC",
      titleKey: "sidebar.academic",
      icon: BookOpenCheck,
      categoryGroup: "academic",
      items: [
        {
          translationKey: "sidebar.classes",
          icon: BookOpenCheck,
          path: "/teacher/classes",
        },
        {
          translationKey: "sidebar.lessons",
          icon: NotebookText,
          path: "/teacher/lessons",
        },
        {
          translationKey: "sidebar.homework",
          icon: PenLine,
          path: "/teacher/homework",
        },
        {
          translationKey: "sidebar.quizTests",
          icon: FileQuestion,
          path: "/teacher/quizzes",
        },
        {
          translationKey: "sidebar.grades",
          icon: Award,
          path: "/teacher/grades",
        },
      ],
    },
    {
      key: "EXAMS",
      titleKey: "sidebar.exams",
      icon: FileText,
      categoryGroup: "academic",
      items: [
        {
          translationKey: "sidebar.examList",
          icon: FileText,
          path: "/teacher/exams",
        },
      ],
    },
    {
      key: "STUDENTS",
      titleKey: "sidebar.students",
      icon: Users2,
      categoryGroup: "management",
      items: [
        {
          translationKey: "sidebar.studentList",
          icon: Users2,
          path: "/teacher/students",
        },
        {
          translationKey: "sidebar.attendance",
          icon: ClipboardCheck,
          path: "/teacher/attendance",
        },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        {
          translationKey: "sidebar.announcements",
          icon: Megaphone,
          path: "/teacher/announcements",
        },
        {
          translationKey: "sidebar.notifications",
          icon: Megaphone,
          path: "/teacher/notifications",
        },
        {
          translationKey: "sidebar.inbox",
          icon: MessageSquare,
          path: "/teacher/messages",
          badge: "3",
          badgeColor: "bg-teal-500 text-white",
        },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      categoryGroup: "core",
      items: [
        {
          translationKey: "sidebar.calendarView",
          icon: CalendarIcon,
          path: "/teacher/calendar",
        },
      ],
    },
    {
      key: "LIBRARY",
      titleKey: "sidebar.library",
      icon: Library,
      categoryGroup: "academic",
      items: [
        {
          translationKey: "sidebar.books",
          icon: Library,
          path: "/teacher/library",
        },
      ],
    },
    {
      key: "REPORTS",
      titleKey: "sidebar.reports",
      icon: BarChart3,
      categoryGroup: "system",
      items: [
        {
          translationKey: "sidebar.attendanceReport",
          icon: ClipboardCheck,
          path: "/teacher/reports/attendance",
        },
      ],
    },
  ],
  student: [
    {
      key: "ACADEMIC",
      titleKey: "sidebar.academic",
      icon: BookOpenCheck,
      categoryGroup: "academic",
      items: [
        {
          translationKey: "sidebar.classes",
          icon: BookOpenCheck,
          path: "/student/classes",
        },
        {
          translationKey: "sidebar.lessons",
          icon: NotebookText,
          path: "/student/lessons",
        },
        {
          translationKey: "sidebar.homework",
          icon: PenLine,
          path: "/student/homework",
        },
        {
          translationKey: "sidebar.quizTests",
          icon: FileQuestion,
          path: "/student/quizzes",
        },
        {
          translationKey: "sidebar.grades",
          icon: Award,
          path: "/student/grades",
        },
      ],
    },
    {
      key: "EXAMS",
      titleKey: "sidebar.exams",
      icon: FileText,
      categoryGroup: "academic",
      items: [
        {
          translationKey: "sidebar.examList",
          icon: FileText,
          path: "/student/exams",
        },
        {
          translationKey: "sidebar.reportCards",
          icon: Award,
          path: "/student/report-cards",
        },
      ],
    },
    {
      key: "STUDENTS",
      titleKey: "sidebar.students",
      icon: Users2,
      categoryGroup: "management",
      items: [
        {
          translationKey: "sidebar.attendance",
          icon: ClipboardCheck,
          path: "/student/attendance",
        },
        {
          translationKey: "sidebar.leaveRequests",
          icon: FileClock,
          path: "/student/leave-requests",
        },
      ],
    },
    {
      key: "FEES",
      titleKey: "sidebar.fees",
      icon: DollarSign,
      categoryGroup: "management",
      items: [
        {
          translationKey: "sidebar.invoices",
          icon: FileText,
          path: "/student/fees",
        },
      ],
    },
    {
      key: "LIBRARY",
      titleKey: "sidebar.library",
      icon: Library,
      categoryGroup: "academic",
      items: [
        {
          translationKey: "sidebar.books",
          icon: Library,
          path: "/student/library",
        },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      categoryGroup: "core",
      items: [
        {
          translationKey: "sidebar.calendarView",
          icon: CalendarIcon,
          path: "/student/calendar",
        },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        {
          translationKey: "sidebar.announcements",
          icon: Megaphone,
          path: "/student/announcements",
        },
        {
          translationKey: "sidebar.notifications",
          icon: Megaphone,
          path: "/student/notifications",
        },
        {
          translationKey: "sidebar.inbox",
          icon: MessageSquare,
          path: "/student/messages",
          badge: "3",
          badgeColor: "bg-teal-500 text-white",
        },
      ],
    },
  ],
  parent: [
    {
      key: "CHILDREN",
      titleKey: "sidebar.children",
      icon: Users2,
      categoryGroup: "core",
      items: [
        {
          translationKey: "sidebar.myChildren",
          icon: Users2,
          path: "/parent/children",
        },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        {
          translationKey: "sidebar.announcements",
          icon: Megaphone,
          path: "/parent/announcements",
        },
        {
          translationKey: "sidebar.notifications",
          icon: Megaphone,
          path: "/parent/notifications",
        },
        {
          translationKey: "sidebar.inbox",
          icon: MessageSquare,
          path: "/parent/messages",
          badge: "3",
          badgeColor: "bg-teal-500 text-white",
        },
      ],
    },
  ],
};

const roleBadgeColorMap: Record<
  string,
  { label: string; bg: string; text: string; ring: string }
> = {
  admin: {
    label: "Administrator",
    bg: "bg-gradient-to-r from-purple-500/15 to-indigo-500/15 text-purple-700 dark:text-purple-300",
    text: "text-purple-700 dark:text-purple-300",
    ring: "border-purple-500/30 dark:border-purple-400/30",
  },
  teacher: {
    label: "Teacher / Faculty",
    bg: "bg-gradient-to-r from-emerald-500/15 to-teal-500/15 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "border-emerald-500/30 dark:border-emerald-400/30",
  },
  student: {
    label: "Student",
    bg: "bg-gradient-to-r from-sky-500/15 to-blue-500/15 text-sky-700 dark:text-sky-300",
    text: "text-sky-700 dark:text-sky-300",
    ring: "border-sky-500/30 dark:border-sky-400/30",
  },
  parent: {
    label: "Parent / Guardian",
    bg: "bg-gradient-to-r from-amber-500/15 to-orange-500/15 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    ring: "border-amber-500/30 dark:border-amber-400/30",
  },
};

function sectionForPath(pathname: string, menu: MenuSection[]): Section | null {
  const match = menu.find((section) =>
    section.items.some(
      (item) => pathname === item.path || pathname.startsWith(item.path + "/"),
    ),
  );
  return match?.key ?? null;
}

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
  const schoolName = school?.name || "High School Academic OS";
  const schoolMotto = school?.settings?.motto || "MoEYS Curriculum • 2025–2026";
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

  // Hover Popover in Compact Rail Mode
  const [hoveredSection, setHoveredSection] = useState<Section | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Active role's menu sections
  const baseMenu = useMemo(() => {
    return roleMenus[activeRole] || roleMenus.admin;
  }, [activeRole]);

  // Section expansion state (supports expanding/collapsing individual sections or all at once)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      const active = sectionForPath(location.pathname, baseMenu);
      if (active) {
        initial[active] = true;
      } else if (baseMenu.length > 0) {
        initial[baseMenu[0].key] = true;
      }
      return initial;
    },
  );

  // Automatically expand section when current route changes
  useEffect(() => {
    const active = sectionForPath(location.pathname, baseMenu);
    if (active) {
      setOpenSections((prev) => ({
        ...prev,
        [active]: true,
      }));
    }
  }, [location.pathname, baseMenu]);

  // Body scroll lock on mobile when drawer is active
  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileOpen]);

  // Keyboard shortcut listener: Esc closes the mobile drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (mobileOpen && onClose) {
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onClose]);

  const toggleSection = (sectionKey: Section) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const handleLinkClick = useCallback(() => {
    if (onClose) {
      onClose();
    }
    setHoveredSection(null);
  }, [onClose]);

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
      }, 200);
    }
  };

  const dashboardPath =
    activeRole === "admin" ? "/dashboard" : `/${activeRole}/dashboard`;
  const isDashboardActive =
    location.pathname === dashboardPath ||
    (activeRole === "admin" && location.pathname === "/");

  const userDisplayName =
    user?.name ||
    (user?.firstName
      ? `${user.firstName} ${user.lastName || ""}`.trim()
      : "Administrator");
  const userInitials =
    userDisplayName
      .split(" ")
      .map((n) => n[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD";
  const roleConfig = roleBadgeColorMap[activeRole] || roleBadgeColorMap.admin;

  // --- Render Compact Rail Mode for Desktop ---
  const renderCompactMenu = () => (
    <div className="flex h-full flex-col justify-between bg-[#f8fafc] p-2.5 select-none overflow-hidden dark:bg-[#111318]">
      <div className="flex flex-col items-center space-y-2 overflow-y-auto no-scrollbar flex-1 py-1">
        {/* Brand / Logo */}
        <button
          type="button"
          onClick={toggleCollapsed}
          title={`${schoolName} (Click to expand sidebar)`}
          className="group relative my-1 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-[15px] bg-gradient-to-br from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-600/25 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={schoolName}
              className="h-full w-full object-cover"
            />
          ) : (
            <GraduationCap
              size={22}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
        </button>

        {/* Dashboard quick icon */}
        <NavLink
          to={dashboardPath}
          onClick={handleLinkClick}
          title={t("sidebar.dashboard")}
          className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition duration-200 shrink-0 ${
            isDashboardActive
              ? "bg-gradient-to-tr from-brand-600 to-brand-500 text-white shadow-md shadow-brand-500/25 font-semibold"
              : "text-stone-600 hover:bg-stone-500/10 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
          }`}
        >
          <LayoutDashboard size={20} />
          {isDashboardActive && (
            <span className="absolute -right-0.5 top-2 h-2 w-2 rounded-full bg-white ring-2 ring-brand-600" />
          )}
        </NavLink>

        <div className="my-1 h-px w-8 bg-slate-200 dark:bg-white/10 shrink-0" />

        {/* Section Icons with Hover Popover */}
        <nav
          className="flex flex-col space-y-1.5"
          aria-label="Compact navigation"
        >
          {baseMenu.map((section) => {
            const SectionIcon = section.icon;
            const isSectionActive = section.items.some(
              (item) =>
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/"),
            );
            const isHovered = hoveredSection === section.key;
            const hasBadges = section.items.some((item) => !!item.badge);

            return (
              <div
                key={section.key}
                className="relative"
                onMouseEnter={() => handleMouseEnter(section.key)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  aria-label={t(section.titleKey)}
                  className={`relative flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-200 ${
                    isSectionActive
                      ? "bg-white text-brand-700 shadow-md shadow-slate-200/70 ring-1 ring-brand-100 dark:bg-white/10 dark:text-brand-300 dark:ring-brand-400/20"
                      : "text-slate-500 hover:bg-white hover:text-slate-900 hover:shadow-sm dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
                  }`}
                >
                  <SectionIcon size={20} />
                  {isSectionActive && (
                    <span className="absolute -right-0.5 top-2 h-2.5 w-2.5 rounded-full bg-brand-600 ring-2 ring-white dark:ring-stone-900" />
                  )}
                  {!isSectionActive && hasBadges && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-1 ring-white dark:ring-stone-900" />
                  )}
                </button>

                {/* Popover Flyout for Compact Mode */}
                {isHovered && (
                  <div
                    className="absolute left-full top-0 z-50 ml-3.5 w-64 rounded-2xl bg-white dark:bg-stone-900 p-3.5 shadow-2xl border border-stone-200 dark:border-white/15 animate-in fade-in zoom-in-95 duration-150"
                    onMouseEnter={() => handleMouseEnter(section.key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="mb-2.5 flex items-center justify-between border-b border-stone-200/50 pb-2 px-1 dark:border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                        <SectionIcon
                          size={15}
                          className="text-brand-600 dark:text-brand-400"
                        />
                        {t(section.titleKey)}
                      </span>
                      <span className="text-[10px] text-stone-500 dark:text-stone-400 font-semibold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-white/10">
                        {section.items.length} items
                      </span>
                    </div>
                    <div className="space-y-1 max-h-72 overflow-y-auto pr-1">
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
                            className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-xs font-medium transition duration-150 ${
                              isItemActive
                                ? "bg-gradient-to-r from-brand-600 to-brand-500 text-white font-semibold shadow-xs"
                                : "text-stone-600 hover:bg-stone-500/10 hover:text-stone-900 dark:text-stone-300 dark:hover:bg-white/10 dark:hover:text-white"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <Icon size={15} className="shrink-0" />
                              <span className="truncate">
                                {t(item.translationKey)}
                              </span>
                            </span>
                            {item.badge && (
                              <span
                                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${item.badgeColor || "bg-brand-600 text-white"} ${item.badgePulse ? "animate-pulse" : ""}`}
                              >
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
      <div className="flex flex-col items-center space-y-2 pt-3 border-t border-slate-200 dark:border-white/10 shrink-0">
        <button
          type="button"
          onClick={toggleCollapsed}
          title="Expand sidebar"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-500/10 hover:text-stone-800 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-200 transition"
          aria-label="Expand sidebar"
        >
          <PanelLeft size={18} />
        </button>

        <div
          title={`${userDisplayName} (${roleConfig.label})`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-brand-600 to-brand-500 text-white font-bold text-xs shadow-xs cursor-default select-none ring-2 ring-white dark:ring-stone-800"
        >
          {userInitials}
        </div>
      </div>
    </div>
  );

  // --- Render Standard Expanded Menu ---
  const renderExpandedMenu = (isMobile = false) => (
    <div className="flex h-full flex-col justify-between select-none overflow-hidden">
      {/* Top Fixed Area: School Branding & Quick Controls */}
      <div className="shrink-0 p-4 pb-3 space-y-3">
        {/* School Crest & System Identity */}
        <div className="flex items-center justify-between gap-2.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[14px] bg-[#078b9b] text-white">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={schoolName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <GraduationCap size={22} />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="truncate text-[17px] font-bold tracking-tight text-slate-900 dark:text-stone-100">
                {schoolName}
              </h2>
              <p className="truncate text-[10px] font-medium text-slate-500 dark:text-stone-400 tracking-[0.1em] uppercase">
                {schoolMotto}
              </p>
            </div>
          </div>

          {/* Desktop collapse toggle */}
          {!isMobile && (
            <button
              type="button"
              onClick={toggleCollapsed}
              className="hidden lg:flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl text-stone-400 hover:bg-stone-100 hover:text-stone-700 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white transition"
              title="Collapse sidebar to rail mode"
              aria-label="Collapse sidebar"
            >
              <PanelLeftClose size={17} />
            </button>
          )}

          {/* Mobile close button with minimum 44px touch area */}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl text-stone-500 hover:bg-stone-100 hover:text-stone-800 lg:hidden dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-white transition"
              aria-label="Close navigation drawer"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Dashboard Link */}
        <div>
          <NavLink
            to={dashboardPath}
            onClick={handleLinkClick}
            className={`group relative flex min-h-[40px] items-center justify-between gap-3 rounded-[14px] border-l-4 px-3 py-2 text-sm font-semibold transition-all duration-200 ${
              isDashboardActive
                ? "border-[#078b9b] bg-slate-100 text-[#078b9b] shadow-[0_2px_8px_rgba(15,23,42,0.16)] dark:bg-white/10 dark:text-teal-300"
                : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-white/10 dark:text-stone-300 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-[9px] transition-colors ${isDashboardActive ? "text-[#078b9b]" : "text-slate-400"}`}
              >
                <LayoutDashboard size={16} />
              </div>
              <span>{t("sidebar.dashboard")}</span>
            </div>
          </NavLink>
        </div>
      </div>

      {/* Middle Scrollable Navigation List (Self-contained scroll) */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1 scroll-smooth">
        <nav aria-label="Sidebar Sections">
          {baseMenu.map((section) => {
            const SectionIcon = section.icon;
            const isSectionOpen = !!openSections[section.key];
            const hasActiveChild = section.items.some(
              (item) =>
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/"),
            );

            return (
              <div key={section.key} className="pt-0.5">
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className={`flex min-h-[38px] w-full items-center justify-between rounded-xl px-3 py-2 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors duration-150 ${
                    hasActiveChild
                      ? "text-slate-800 dark:text-stone-100"
                      : "text-slate-700 hover:text-slate-900 dark:text-stone-400 dark:hover:text-stone-200"
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <SectionIcon
                      size={16}
                      className={
                        hasActiveChild
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-stone-500"
                      }
                    />
                    <span className="truncate">{t(section.titleKey)}</span>
                  </span>
                  {isSectionOpen ? (
                    <ChevronDown
                      size={15}
                      className="transition-transform duration-200 text-stone-400"
                    />
                  ) : (
                    <ChevronRight
                      size={15}
                      className="transition-transform duration-200 text-stone-400"
                    />
                  )}
                </button>

                {isSectionOpen && (
                  <div className="mt-0.5 space-y-0.5">
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
                          className={`group relative flex min-h-[40px] lg:min-h-[38px] items-center justify-between gap-2 rounded-[13px] pl-10 pr-3 py-1.5 text-sm transition-all duration-150 ${
                            isItemActive
                              ? "font-semibold  text-brand-700 shadow-sm shadow-slate-200/60  dark:text-brand-300"
                              : "font-medium text-slate-600 hover:bg-white hover:text-slate-900 dark:text-stone-400 dark:hover:bg-white/10 dark:hover:text-stone-100"
                          }`}
                        >
                          <span className="flex items-center gap-2.5 truncate">
                            <Icon
                              size={15}
                              className={`shrink-0 ${isItemActive ? "text-[#078b9b] dark:text-teal-300" : "text-slate-700 group-hover:text-slate-900"}`}
                            />
                            <span className="truncate">
                              {t(item.translationKey)}
                            </span>
                          </span>
                          {item.badge && (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${item.badgeColor || "bg-brand-600 text-white"} ${item.badgePulse ? "animate-pulse" : ""}`}
                            >
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
          })}
        </nav>
      </div>

      {/* User Profile Bottom Footer (Always visible at bottom) */}
      <div className="shrink-0 border-t border-slate-200/80 p-3 pt-3 dark:border-white/10">
        <div className="flex items-center justify-between gap-2 rounded-[18px] border border-slate-200/80 bg-white p-2 shadow-sm shadow-slate-200/50 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white font-bold text-xs select-none">
              {userInitials}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-stone-900 dark:text-stone-100 leading-tight">
                {userDisplayName}
              </p>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {roleConfig.label}
              </span>
            </div>
          </div>

          {logout && (
            <button
              type="button"
              onClick={() => logout()}
              title="Sign out"
              className="flex min-h-[36px] min-w-[36px] shrink-0 items-center justify-center rounded-xl text-stone-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors"
              aria-label="Sign out"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onClose && onClose()}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile Drawer (Touch-Optimized for Phones & Tablets < 1024px) */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-[320px] max-w-[88vw] transform  transition-transform duration-300 ease-out lg:hidden  ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="h-full overflow-hidden">{renderExpandedMenu(true)}</div>
      </div>

      {/* Desktop / Laptop Sidebar (Fixed viewport height, completely independent of main view scroll) */}
      <aside
        className={`hidden h-full shrink-0 flex-col lg:flex overflow-hidden transition-all duration-300 ease-in-out  ${
          isCollapsed ? "w-[76px]" : "w-72 xl:w-[20rem]"
        }`}
      >
        {isCollapsed ? renderCompactMenu() : renderExpandedMenu(false)}
      </aside>
    </>
  );
}
