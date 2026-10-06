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
  Sparkles,
  Layers,
  Check,
  ChevronsDown,
  ChevronsUp,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { useSchool } from "@/hooks/useSchool";
import { useAuth } from "@/hooks/useAuth";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";
import { useTranslations, type TranslationKey } from "@/i18n";
import PncBrandLogo from "@/components/common/PncBrandLogo";
import type { UserRole } from "@/utils/rolePermissions";

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

// Complete role-tailored menu configuration
const roleMenus: Record<string, MenuSection[]> = {
  admin: [
    {
      key: "SETUP",
      titleKey: "sidebar.setup",
      icon: Settings,
      categoryGroup: "core",
      items: [
        { translationKey: "sidebar.schoolSetup", icon: Settings, path: "/setup/school" },
        { translationKey: "sidebar.academicYears", icon: CalendarRange, path: "/setup/academic-years" },
        { translationKey: "sidebar.gradeLevels", icon: GraduationCap, path: "/setup/grade-levels" },
        { translationKey: "sidebar.terms", icon: Clock, path: "/setup/terms" },
        { translationKey: "sidebar.subjects", icon: BookMarked, path: "/setup/subjects" },
        { translationKey: "sidebar.rooms", icon: DoorOpen, path: "/setup/rooms" },
        { translationKey: "sidebar.rolesPermissions", icon: ShieldCheck, path: "/setup/roles" },
        { translationKey: "sidebar.users", icon: User, path: "/setup/users" },
        { translationKey: "sidebar.translations", icon: Languages, path: "/setup/translations" },
      ],
    },
    {
      key: "ACADEMIC",
      titleKey: "sidebar.academic",
      icon: BookOpenCheck,
      categoryGroup: "academic",
      items: [
        { translationKey: "sidebar.classes", icon: BookOpenCheck, path: "/academic/classes" },
        { translationKey: "sidebar.classSubjects", icon: BookMarked, path: "/academic/class-subjects" },
        { translationKey: "sidebar.classSchedules", icon: CalendarDays, path: "/academic/schedules" },
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
      categoryGroup: "academic",
      items: [
        { translationKey: "sidebar.exams", icon: FileText, path: "/academic/exams" },
        { translationKey: "sidebar.examSchedules", icon: CalendarClock, path: "/academic/exam-schedules" },
        { translationKey: "sidebar.markEntry", icon: CheckSquare, path: "/academic/mark-entry" },
        { translationKey: "sidebar.reportCards", icon: Award, path: "/academic/report-cards" },
      ],
    },
    {
      key: "STUDENTS",
      titleKey: "sidebar.students",
      icon: Users2,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.studentList", icon: Users2, path: "/students" },
        { translationKey: "sidebar.studentProfiles", icon: Contact2, path: "/students/profiles" },
        { translationKey: "sidebar.attendance", icon: ClipboardCheck, path: "/students/attendance" },
        {
          translationKey: "sidebar.leaveRequests",
          icon: FileClock,
          path: "/students/leave-requests",
          badge: "2",
          badgeColor: "bg-amber-500/90 text-white shadow-xs",
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
        { translationKey: "sidebar.teacherList", icon: UserCog, path: "/teachers" },
        { translationKey: "sidebar.teacherProfiles", icon: UserCheck, path: "/teachers/profiles" },
        { translationKey: "sidebar.teacherAssignments", icon: UserSquare2, path: "/teachers/assignments" },
        { translationKey: "sidebar.teacherAttendance", icon: ClipboardCheck, path: "/teachers/attendance" },
      ],
    },
    {
      key: "LIBRARY",
      titleKey: "sidebar.library",
      icon: Library,
      categoryGroup: "academic",
      items: [
        { translationKey: "sidebar.books", icon: Library, path: "/library/books" },
        { translationKey: "sidebar.libraryCategories", icon: Tags, path: "/library/categories" },
        { translationKey: "sidebar.borrow", icon: BookmarkPlus, path: "/library/borrow" },
        { translationKey: "sidebar.returns", icon: Undo2, path: "/library/returns" },
        {
          translationKey: "sidebar.overdueBooks",
          icon: AlertCircle,
          path: "/library/overdue",
          badge: "4",
          badgeColor: "bg-rose-500/90 text-white shadow-xs",
        },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      categoryGroup: "core",
      items: [
        { translationKey: "sidebar.calendarView", icon: CalendarIcon, path: "/calendar" },
        { translationKey: "sidebar.calendarEvents", icon: PartyPopper, path: "/calendar/events" },
        { translationKey: "sidebar.calendarHolidays", icon: SunMedium, path: "/calendar/holidays" },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/communication/announcements" },
        { translationKey: "sidebar.notifications", icon: Bell, path: "/communication/notifications" },
        {
          translationKey: "sidebar.messages",
          icon: MessageSquare,
          path: "/messages",
          badge: "3",
          badgeColor: "bg-cyan-500/90 text-white shadow-xs",
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
        { translationKey: "sidebar.attendanceReport", icon: ClipboardCheck, path: "/reports/attendance" },
        { translationKey: "sidebar.academicPerformanceReport", icon: LineChart, path: "/reports/academic" },
        { translationKey: "sidebar.studentReport", icon: Users2, path: "/reports/students" },
        { translationKey: "sidebar.teacherReport", icon: UserSquare2, path: "/reports/teachers" },
        { translationKey: "sidebar.libraryReport", icon: Library, path: "/reports/library" },
      ],
    },
    {
      key: "SYSTEM",
      titleKey: "sidebar.system",
      icon: Sliders,
      categoryGroup: "system",
      items: [
        { translationKey: "sidebar.auditLogs", icon: FileText, path: "/system/logs" },
        { translationKey: "sidebar.activityLogs", icon: Activity, path: "/system/activity" },
        { translationKey: "sidebar.systemSettings", icon: Sliders, path: "/system/settings" },
        {
          translationKey: "sidebar.responsiveStudio",
          icon: Layers,
          path: "/system/responsive-studio",
          badge: "Live",
          badgeColor: "bg-blue-600 text-white shadow-xs",
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
      categoryGroup: "academic",
      items: [
        { translationKey: "sidebar.examList", icon: FileText, path: "/teacher/exams" },
      ],
    },
    {
      key: "STUDENTS",
      titleKey: "sidebar.students",
      icon: Users2,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.studentList", icon: Users2, path: "/teacher/students" },
        { translationKey: "sidebar.attendance", icon: ClipboardCheck, path: "/teacher/attendance" },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/teacher/announcements" },
        { translationKey: "sidebar.notifications", icon: Megaphone, path: "/teacher/notifications" },
        {
          translationKey: "sidebar.inbox",
          icon: MessageSquare,
          path: "/teacher/messages",
          badge: "3",
          badgeColor: "bg-cyan-500/90 text-white",
        },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      categoryGroup: "core",
      items: [
        { translationKey: "sidebar.calendarView", icon: CalendarIcon, path: "/teacher/calendar" },
      ],
    },
    {
      key: "LIBRARY",
      titleKey: "sidebar.library",
      icon: Library,
      categoryGroup: "academic",
      items: [
        { translationKey: "sidebar.books", icon: Library, path: "/teacher/library" },
      ],
    },
    {
      key: "REPORTS",
      titleKey: "sidebar.reports",
      icon: BarChart3,
      categoryGroup: "system",
      items: [
        { translationKey: "sidebar.attendanceReport", icon: ClipboardCheck, path: "/teacher/reports/attendance" },
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
        { translationKey: "sidebar.classes", icon: BookOpenCheck, path: "/student/classes" },
        { translationKey: "sidebar.lessons", icon: NotebookText, path: "/student/lessons" },
        { translationKey: "sidebar.homework", icon: PenLine, path: "/student/homework" },
        { translationKey: "sidebar.quizTests", icon: FileQuestion, path: "/student/quizzes" },
        { translationKey: "sidebar.grades", icon: Award, path: "/student/grades" },
      ],
    },
    {
      key: "EXAMS",
      titleKey: "sidebar.exams",
      icon: FileText,
      categoryGroup: "academic",
      items: [
        { translationKey: "sidebar.examList", icon: FileText, path: "/student/exams" },
        { translationKey: "sidebar.reportCards", icon: Award, path: "/student/report-cards" },
      ],
    },
    {
      key: "STUDENTS",
      titleKey: "sidebar.students",
      icon: Users2,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.attendance", icon: ClipboardCheck, path: "/student/attendance" },
        { translationKey: "sidebar.leaveRequests", icon: FileClock, path: "/student/leave-requests" },
      ],
    },
    {
      key: "FEES",
      titleKey: "sidebar.fees",
      icon: DollarSign,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.invoices", icon: FileText, path: "/student/fees" },
      ],
    },
    {
      key: "LIBRARY",
      titleKey: "sidebar.library",
      icon: Library,
      categoryGroup: "academic",
      items: [
        { translationKey: "sidebar.books", icon: Library, path: "/student/library" },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      categoryGroup: "core",
      items: [
        { translationKey: "sidebar.calendarView", icon: CalendarIcon, path: "/student/calendar" },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/student/announcements" },
        { translationKey: "sidebar.notifications", icon: Megaphone, path: "/student/notifications" },
        {
          translationKey: "sidebar.inbox",
          icon: MessageSquare,
          path: "/student/messages",
          badge: "3",
          badgeColor: "bg-cyan-500/90 text-white",
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
        { translationKey: "sidebar.myChildren", icon: Users2, path: "/parent/children" },
      ],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/parent/announcements" },
        { translationKey: "sidebar.notifications", icon: Megaphone, path: "/parent/notifications" },
        {
          translationKey: "sidebar.inbox",
          icon: MessageSquare,
          path: "/parent/messages",
          badge: "3",
          badgeColor: "bg-cyan-500/90 text-white",
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
    bg: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
    text: "text-blue-700 dark:text-blue-300",
    ring: "border-blue-500/30 dark:border-blue-400/30",
  },
  teacher: {
    label: "Teacher / Faculty",
    bg: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    text: "text-emerald-700 dark:text-emerald-300",
    ring: "border-emerald-500/30 dark:border-emerald-400/30",
  },
  student: {
    label: "Student",
    bg: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    text: "text-sky-700 dark:text-sky-300",
    ring: "border-sky-500/30 dark:border-sky-400/30",
  },
  parent: {
    label: "Parent / Guardian",
    bg: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    text: "text-amber-700 dark:text-amber-300",
    ring: "border-amber-500/30 dark:border-amber-400/30",
  },
};

function sectionForPath(pathname: string, menu: MenuSection[]): Section | null {
  const match = menu.find((section) =>
    section.items.some(
      (item) => pathname === item.path || pathname.startsWith(item.path + "/")
    )
  );
  return match?.key ?? null;
}

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
  role?: UserRole | "admin" | "teacher" | "student" | "parent";
}

export default function Sidebar({
  mobileOpen = false,
  onClose,
  role: propRole,
}: SidebarProps) {
  const location = useLocation();
  const { school } = useSchool();
  const { role: authRole, user, logout } = useAuth();
  const { t } = useTranslations();

  const activeRole = (propRole || authRole || "admin").toLowerCase();
  const schoolName = school?.name || "High School Academic OS";
  const schoolMotto =
    (typeof school?.settings?.motto === "string"
      ? school.settings.motto
      : null) || "Better Skills, Brighter Future";
  const logoUrl = resolveAssetUrl(school?.logoUrl);

  // --- Collapsed Rail Mode State with LocalStorage Persistence ---
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

  // Section expansion state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    const active = sectionForPath(location.pathname, baseMenu);
    if (active) {
      initial[active] = true;
    } else if (baseMenu.length > 0) {
      initial[baseMenu[0].key] = true;
    }
    return initial;
  });

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

  const toggleSection = (sectionKey: Section) => {
    setOpenSections((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const allSectionsOpen = useMemo(() => {
    return (
      baseMenu.length > 0 &&
      baseMenu.every((s) => !!openSections[s.key])
    );
  }, [baseMenu, openSections]);

  const toggleAllSections = () => {
    const nextState = !allSectionsOpen;
    const updated: Record<string, boolean> = {};
    baseMenu.forEach((s) => {
      updated[s.key] = nextState;
    });
    setOpenSections((prev) => ({
      ...prev,
      ...updated,
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

  // --------------------------------------------------------------------------
  // 1. RENDER COMPACT RAIL MODE (Desktop when collapsed)
  // --------------------------------------------------------------------------
  const renderCompactMenu = () => (
    <div className="flex h-full flex-col justify-between p-2.5 select-none overflow-hidden">
      <div className="flex flex-col items-center space-y-2.5 overflow-y-auto no-scrollbar flex-1 py-1">
        {/* Brand Logo - Raised Neumorphic Disc */}
        <button
          type="button"
          onClick={toggleCollapsed}
          title={`${schoolName} (Click to expand sidebar)`}
          className="group relative my-1 flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden neu-circle-disc text-slate-700 dark:text-slate-200 cursor-pointer hover:scale-105 transition-all duration-200"
        >
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={schoolName}
              className="h-full w-full object-cover"
            />
          ) : (
            <PncBrandLogo collapsed className="scale-85" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Dashboard Quick Icon */}
        <NavLink
          to={dashboardPath}
          onClick={handleLinkClick}
          title={t("sidebar.dashboard")}
          className={`relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200 shrink-0 ${
            isDashboardActive
              ? "active-blue-capsule shadow-[0_6px_18px_rgba(37,99,235,0.4)] text-white"
              : "neu-circle-disc text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
          }`}
        >
          <LayoutDashboard size={18} />
          {isDashboardActive && (
            <span className="absolute -right-0.5 top-1.5 h-2 w-2 rounded-full bg-white ring-2 ring-blue-600" />
          )}
        </NavLink>

        <div className="h-px w-8 bg-slate-300/60 dark:bg-white/10 my-1 shrink-0" />

        {/* Section Icons with Hover Popover */}
        <nav
          className="flex flex-col space-y-2"
          aria-label="Compact navigation"
        >
          {baseMenu.map((section) => {
            const SectionIcon = section.icon;
            const isSectionActive = section.items.some(
              (item) =>
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/")
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
                  className={`relative flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-200 ${
                    isSectionActive
                      ? "active-blue-capsule text-white shadow-[0_6px_16px_rgba(37,99,235,0.35)]"
                      : "neu-circle-disc text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 hover:scale-105"
                  }`}
                >
                  <SectionIcon size={17} />
                  {isSectionActive && (
                    <span className="absolute -right-0.5 top-1.5 h-2 w-2 rounded-full bg-white ring-2 ring-blue-600" />
                  )}
                  {!isSectionActive && hasBadges && (
                    <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-amber-500 ring-1 ring-white dark:ring-slate-900" />
                  )}
                </button>

                {/* Popover Flyout for Compact Mode with Liquid Glass Surface */}
                {isHovered && (
                  <div
                    className="absolute left-full top-0 z-50 ml-3 w-64 neu-glass-card p-3 shadow-2xl backdrop-blur-2xl border border-white/70 dark:border-white/15 animate-in fade-in zoom-in-95 duration-150"
                    onMouseEnter={() => handleMouseEnter(section.key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-white/40 pb-2 px-1 dark:border-white/10">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
                        <SectionIcon
                          size={15}
                          className="text-blue-600 dark:text-blue-400"
                        />
                        {t(section.titleKey)}
                      </span>
                      <span className="text-[10px] text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full neu-raised-pill">
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
                            className={`flex items-center justify-between rounded-full px-3 py-2 text-xs font-medium transition duration-150 ${
                              isItemActive
                                ? "active-blue-capsule text-white shadow-xs font-semibold"
                                : "text-slate-700 hover:text-blue-600 hover:bg-white/40 dark:text-slate-200 dark:hover:bg-white/10 dark:hover:text-white"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <Icon size={14} className="shrink-0" />
                              <span className="truncate">
                                {t(item.translationKey)}
                              </span>
                            </span>
                            {item.badge && (
                              <span
                                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                                  item.badgeColor || "bg-blue-600 text-white"
                                } ${item.badgePulse ? "animate-pulse" : ""}`}
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

      {/* Compact Mode Footer: Expand Button & User Avatar */}
      <div className="flex flex-col items-center space-y-2 pt-3 border-t border-white/40 dark:border-white/10 shrink-0">
        <button
          type="button"
          onClick={toggleCollapsed}
          title="Expand sidebar"
          className="flex h-9 w-9 items-center justify-center neu-circle-disc text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 transition"
          aria-label="Expand sidebar"
        >
          <PanelLeft size={16} />
        </button>

        <div
          title={`${userDisplayName} (${roleConfig.label})`}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md cursor-default select-none ring-2 ring-white/60 dark:ring-slate-800"
        >
          {userInitials}
        </div>
      </div>
    </div>
  );

  // --------------------------------------------------------------------------
  // 2. RENDER FULL EXPANDED MENU (Neumorphic + Liquid Glass Hybrid, Clean & Direct)
  // --------------------------------------------------------------------------
  const renderExpandedMenu = (isMobile = false) => (
    <div className="flex h-full flex-col justify-between select-none overflow-hidden">
      {/* ---------------- Top Area: Brand, Header & Controls ---------------- */}
      <div className="shrink-0 p-3.5 pb-2 space-y-2.5">
        {/* School Crest / PNC Brand Identity Card */}
        <div className="p-3 rounded-2xl neu-raised-pill border border-white/80 dark:border-white/10 relative overflow-hidden group">
          <div className="flex items-center justify-between gap-2.5 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full neu-circle-disc text-slate-700 dark:text-slate-200">
                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt={schoolName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <PncBrandLogo collapsed className="scale-80" />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-xs font-bold tracking-tight text-slate-800 dark:text-slate-100">
                  {schoolName}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="truncate text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
                    {schoolMotto}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Desktop Collapse Button */}
              {!isMobile && (
                <button
                  type="button"
                  onClick={toggleCollapsed}
                  className="hidden lg:flex h-8 w-8 items-center justify-center neu-circle-disc text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
                  title="Collapse sidebar to rail mode"
                  aria-label="Collapse sidebar"
                >
                  <PanelLeftClose size={15} />
                </button>
              )}

              {/* Mobile Close Button */}
              {isMobile && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex h-9 w-9 shrink-0 items-center justify-center neu-circle-disc text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition lg:hidden"
                  aria-label="Close navigation drawer"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Academic Context Bar */}
          <div className="mt-2 pt-1.5 border-t border-white/50 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
            <span className="inline-flex items-center gap-1 font-medium">
              <Clock size={10} className="text-blue-600 dark:text-blue-400" />
              Semester 2 • 2025–2026
            </span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Active
            </span>
          </div>
        </div>

        {/* Dashboard Link - Distinct Active Capsule */}
        <div>
          <NavLink
            to={dashboardPath}
            onClick={handleLinkClick}
            className={`group relative flex h-11 items-center justify-between gap-3 rounded-full px-3.5 text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              isDashboardActive
                ? "active-blue-capsule shadow-[0_8px_20px_rgba(37,99,235,0.35)] text-white"
                : "text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3">
              {isDashboardActive ? (
                <div className="flex h-7.5 w-7.5 items-center justify-center rounded-full bg-white/25 backdrop-blur-md border border-white/50 text-white shadow-inner">
                  <LayoutDashboard size={15} className="stroke-[2.2]" />
                </div>
              ) : (
                <div className="neu-circle-disc flex h-7.5 w-7.5 items-center justify-center text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:scale-105 transition-all">
                  <LayoutDashboard size={15} className="stroke-[2]" />
                </div>
              )}
              <span className="font-bold">{t("sidebar.dashboard")}</span>
            </div>
            {isDashboardActive ? (
              <span className="flex h-2 w-2 rounded-full bg-white shadow-xs ring-2 ring-white/40" />
            ) : (
              <span className="text-[10px] text-slate-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                ↵
              </span>
            )}
          </NavLink>
        </div>
      </div>

      {/* ---------------- Middle Scrollable Navigation List (No search, No categories) ---------------- */}
      <div className="flex-1 overflow-y-auto px-3.5 py-1 space-y-1.5 no-scrollbar scroll-smooth">
        {/* Navigation Sections Header with Micro Collapse All Toggle */}
        <div className="flex items-center justify-between px-2 pt-1 pb-0.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Menu
          </span>
          <button
            type="button"
            onClick={toggleAllSections}
            title={allSectionsOpen ? "Collapse all sections" : "Expand all sections"}
            className="flex h-6 w-6 items-center justify-center neu-circle-disc text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition"
            aria-label={allSectionsOpen ? "Collapse all" : "Expand all"}
          >
            {allSectionsOpen ? (
              <ChevronsUp size={12} />
            ) : (
              <ChevronsDown size={12} />
            )}
          </button>
        </div>

        <nav aria-label="Sidebar Sections">
          {baseMenu.map((section) => {
            const SectionIcon = section.icon;
            const isSectionOpen = !!openSections[section.key];
            const hasActiveChild = section.items.some(
              (item) =>
                location.pathname === item.path ||
                location.pathname.startsWith(item.path + "/")
            );

            return (
              <div key={section.key} className="pt-0.5">
                {/* Section Accordion Header */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.key)}
                  className={`group flex min-h-[38px] w-full items-center justify-between rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] transition-all duration-200 cursor-pointer ${
                    hasActiveChild
                      ? "text-blue-700 dark:text-blue-300 neu-raised-pill border border-blue-500/25"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-white/30 dark:hover:bg-white/5"
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                        hasActiveChild
                          ? "bg-blue-600 text-white shadow-xs"
                          : "neu-circle-disc text-slate-500 group-hover:text-blue-600"
                      }`}
                    >
                      <SectionIcon size={13} />
                    </div>
                    <span className="truncate">{t(section.titleKey)}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[9.5px] font-semibold text-slate-500 dark:text-slate-400 px-1.5 py-0.5 rounded-full neu-raised-pill">
                      {section.items.length}
                    </span>
                    {hasActiveChild && (
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400 ring-2 ring-blue-500/30" />
                    )}
                    {isSectionOpen ? (
                      <ChevronDown
                        size={13}
                        className="transition-transform duration-200 text-slate-400"
                      />
                    ) : (
                      <ChevronRight
                        size={13}
                        className="transition-transform duration-200 text-slate-400"
                      />
                    )}
                  </div>
                </button>

                {/* Nested Section Items */}
                {isSectionOpen && (
                  <div className="mt-1 space-y-1 pl-3 border-l-2 border-white/60 dark:border-white/10 ml-4 my-1">
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
                          className={`group relative flex h-9.5 items-center justify-between gap-2.5 rounded-full px-3 text-xs font-medium transition-all duration-200 cursor-pointer ${
                            isItemActive
                              ? "active-blue-capsule shadow-[0_6px_16px_rgba(37,99,235,0.32)] text-white font-semibold"
                              : "text-slate-600 hover:text-slate-900 hover:bg-white/40 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                          }`}
                        >
                          <span className="flex items-center gap-2.5 truncate">
                            {isItemActive ? (
                              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-white shadow-inner">
                                <Icon size={13} className="stroke-[2.2]" />
                              </div>
                            ) : (
                              <div className="neu-circle-disc flex h-6 w-6 shrink-0 items-center justify-center text-slate-500 group-hover:text-blue-600 group-hover:scale-105 transition-all">
                                <Icon size={12} className="stroke-[1.8]" />
                              </div>
                            )}
                            <span className="truncate">
                              {t(item.translationKey)}
                            </span>
                          </span>

                          {item.badge ? (
                            <span
                              className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold ${
                                item.badgeColor || "bg-blue-600 text-white"
                              } ${item.badgePulse ? "animate-pulse" : ""}`}
                            >
                              {item.badge}
                            </span>
                          ) : isItemActive ? (
                            <Check size={13} className="text-white shrink-0 mr-1" />
                          ) : null}
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

      {/* ---------------- Bottom Area: Liquid Glass Accent & User Profile ---------------- */}
      <div className="shrink-0 p-3 pt-1 space-y-2 select-none">
        {/* Floating Mini Droplet & Quote Accent */}
        <div className="p-2.5 rounded-2xl neu-raised-pill border border-white/80 dark:border-white/10 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-8 h-8 shrink-0 overflow-visible pointer-events-none">
              <img
                src="/assets/images/liquid_glass_droplet.jpg"
                alt="Liquid Glass"
                className="w-full h-full object-contain filter drop-shadow-[0_4px_8px_rgba(59,130,246,0.3)]"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const parent = e.currentTarget.parentElement;
                  if (parent) {
                    parent.innerHTML = `
                      <svg viewBox="0 0 100 80" class="w-full h-full drop-shadow-[0_4px_8px_rgba(59,130,246,0.3)]" fill="none">
                        <defs>
                          <linearGradient id="dropGradSm" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#38bdf8" />
                            <stop offset="100%" stop-color="#2563eb" />
                          </linearGradient>
                        </defs>
                        <path d="M 15 50 C 10 30, 30 15, 60 20 C 85 25, 95 45, 80 60 C 65 75, 25 70, 15 50 Z" fill="url(#dropGradSm)" />
                      </svg>
                    `;
                  }
                }}
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-semibold text-slate-700 dark:text-slate-300 leading-tight truncate">
                Small steps every day
              </p>
              <p className="text-[9.5px] font-medium text-slate-500 dark:text-slate-400 leading-tight truncate">
                lead to big results.
              </p>
            </div>
          </div>
          <Heart size={13} className="text-rose-500 fill-none shrink-0" />
        </div>

        {/* User Profile Card with Neumorphic Disc Avatar & Logout */}
        <div className="p-2.5 rounded-2xl neu-raised-pill border border-white/80 dark:border-white/10 flex items-center justify-between gap-2 shadow-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md select-none ring-2 ring-white/70 dark:ring-slate-800">
              {userInitials}
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {userDisplayName}
              </p>
              <span
                className={`inline-flex items-center gap-1 text-[8.5px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full mt-0.5 border ${roleConfig.bg} ${roleConfig.ring}`}
              >
                <Sparkles size={8} />
                {roleConfig.label}
              </span>
            </div>
          </div>

          {logout && (
            <button
              type="button"
              onClick={() => logout()}
              title="Sign out"
              className="flex h-8 w-8 shrink-0 items-center justify-center neu-circle-disc text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition"
              aria-label="Sign out"
            >
              <LogOut size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Backdrop Overlay with Blur */}
      <div
        className={`fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile Drawer (Touch-Optimized Liquid Glass Card) */}
      <aside
        className={`fixed left-3 top-3 bottom-3 z-50 w-76 max-w-[calc(100vw-1.5rem)] neu-glass-card transform transition-transform duration-300 ease-out lg:hidden rounded-3xl ${
          mobileOpen ? "translate-x-0" : "-translate-x-[110%]"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Drawer"
      >
        {renderExpandedMenu(true)}
      </aside>

      {/* Desktop / Laptop Floating Sidebar (Neumorphic + Liquid Glass) */}
      <aside
        className={`hidden lg:flex shrink-0 my-4 ml-4 h-[calc(100dvh-2rem)] neu-glass-card z-20 overflow-hidden rounded-3xl transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-72 xl:w-76"
        }`}
        aria-label="Sidebar"
      >
        {isCollapsed ? renderCompactMenu() : renderExpandedMenu(false)}
      </aside>
    </>
  );
}