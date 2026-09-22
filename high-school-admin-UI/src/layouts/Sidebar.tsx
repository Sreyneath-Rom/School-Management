// src/layouts/Sidebar.tsx
import {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  GraduationCap,
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
  Calendar as CalendarIcon,
  MessageSquare,
  FileText,
  CalendarClock,
  CheckSquare,
  PartyPopper,
  SunMedium,
  Bell,
  Activity,
  Sliders,
  X,
  PanelLeftClose,
  PanelLeft,
  LogOut,
  Search,
  School2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useSchool } from "@/hooks/useSchool";
import { useBadgeCounts } from "@/hooks/useBadgeCounts";
import { resolveAssetUrl } from "@/utils/resolveAssetUrl";
import { useTranslations, type TranslationKey } from "@/i18n";

/* Neumorphic hairline seams. Replaces the old `border-* border-surface`
   and `divide-* divide-surface` rules, which had no visible effect once
   --glass-bg = --page-background. */
const SEAM_B = "shadow-[0_1px_0_var(--neu-shadow-dark)]";
const SEAM_T = "shadow-[0_-1px_0_var(--neu-shadow-dark)]";

type Section =
  | "DASHBOARD"
  | "SETUP"
  | "ACADEMIC"
  | "EXAMS"
  | "STUDENTS"
  | "TEACHERS"
  | "CALENDAR"
  | "COMMUNICATION"
  | "REPORTS"
  | "CHILDREN"
  | "SYSTEM";

const UNKNOWN_PATH_PERMISSION = "__unmatched_path__";

type BadgeKey = "leave-requests" | "messages";

interface MenuItem {
  translationKey: TranslationKey;
  icon: LucideIcon;
  path: string;
  badgeKey?: BadgeKey;
  badgeColor?: string;
  badgePulse?: boolean;
}

function permissionForPath(path: string): string {
  if (path.includes("/setup/roles")) return "roles.view";
  if (path.includes("/setup/users")) return "users.view";
  if (path.includes("/setup/school")) return "school.view";
  if (path.includes("/setup/academic-years")) return "academicYears.view";
  if (path.includes("/setup/rooms")) return "rooms.view";
  if (path.includes("/setup/grade-levels")) return "gradeLevels.view";
  if (path.includes("/setup/terms")) return "terms.view";
  if (path.includes("/setup/translations")) return "translations.view";
  if (path.includes("/setup/subjects")) return "subjects.view";
  if (
    path.includes("/academic/exams") ||
    path.includes("/academic/exam-") ||
    path.includes("/academic/mark-") ||
    path.includes("/academic/report-cards")
  )
    return "grades.view";
  if (path.includes("/academic/classes")) return "classes.view";
  if (path.includes("/academic/schedules")) return "schedules.view";
  if (path.includes("/academic/lessons")) return "lessons.view";
  if (path.includes("/academic/homework")) return "homework.view";
  if (path.includes("/academic/quizzes")) return "quizzes.view";
  if (path.includes("/academic/grades")) return "grades.view";
  if (
    path.includes("/students/attendance") ||
    path.includes("/teacher/attendance") ||
    path.includes("/student/attendance")
  )
    return "attendance.view";
  if (
    path.includes("/students/leave-requests") ||
    path.includes("/student/leave-requests")
  )
    return "leaveRequests.view";
  if (
    path === "/students" ||
    path.includes("/students/profiles") ||
    path.includes("/teacher/students")
  )
    return "students.view";
  if (path === "/teachers" || path.includes("/teachers/")) return "teachers.view";
  if (path.includes("/reports/")) return "reports.view";
  if (path.includes("/communication/announcements"))
    return "announcements.view";
  if (path.includes("/communication/notifications"))
    return "notifications.view";
  if (path.includes("/messages")) return "notifications.view";

  if (import.meta.env.DEV) {
    console.warn(`[sidebar] no permission rule for path: ${path}`);
  }
  return UNKNOWN_PATH_PERMISSION;
}

interface MenuSection {
  key: Section;
  titleKey: TranslationKey;
  icon: LucideIcon;
  categoryGroup?: "core" | "academic" | "management" | "system";
  items: MenuItem[];
}

const categoryGroupLabels: Record<string, string> = {
  core: "Core Administration",
  academic: "Curriculum & Academic",
  management: "Faculty & Students",
  system: "Communication & Reports",
};

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
          badgeKey: "leave-requests",
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
        { translationKey: "sidebar.teacherList", icon: UserCog, path: "/teachers" },
        { translationKey: "sidebar.teacherProfiles", icon: UserCheck, path: "/teachers/profiles" },
        { translationKey: "sidebar.teacherAssignments", icon: UserSquare2, path: "/teachers/assignments" },
        { translationKey: "sidebar.teacherAttendance", icon: ClipboardCheck, path: "/teachers/attendance" },
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
          badgeKey: "messages",
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
        { translationKey: "sidebar.attendanceReport", icon: ClipboardCheck, path: "/reports/attendance" },
        { translationKey: "sidebar.academicPerformanceReport", icon: LineChart, path: "/reports/academic" },
        { translationKey: "sidebar.studentReport", icon: Users2, path: "/reports/students" },
        { translationKey: "sidebar.teacherReport", icon: UserSquare2, path: "/reports/teachers" },
      ],
    },
    {
      key: "SYSTEM",
      titleKey: "sidebar.system",
      icon: Sliders,
      categoryGroup: "system",
      items: [
        { translationKey: "sidebar.activityLogs", icon: Activity, path: "/system/activity" },
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
      items: [{ translationKey: "sidebar.examList", icon: FileText, path: "/teacher/exams" }],
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
        { translationKey: "sidebar.notifications", icon: Bell, path: "/teacher/notifications" },
        {
          translationKey: "sidebar.inbox",
          icon: MessageSquare,
          path: "/teacher/messages",
          badgeKey: "messages",
          badgeColor: "bg-teal-500 text-white",
        },
      ],
    },
    {
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      categoryGroup: "core",
      items: [{ translationKey: "sidebar.calendarView", icon: CalendarIcon, path: "/teacher/calendar" }],
    },
    {
      key: "REPORTS",
      titleKey: "sidebar.reports",
      icon: BarChart3,
      categoryGroup: "system",
      items: [{ translationKey: "sidebar.attendanceReport", icon: ClipboardCheck, path: "/teacher/reports/attendance" }],
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
      key: "CALENDAR",
      titleKey: "sidebar.calendar",
      icon: CalendarIcon,
      categoryGroup: "core",
      items: [{ translationKey: "sidebar.calendarView", icon: CalendarIcon, path: "/student/calendar" }],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/student/announcements" },
        { translationKey: "sidebar.notifications", icon: Bell, path: "/student/notifications" },
        {
          translationKey: "sidebar.inbox",
          icon: MessageSquare,
          path: "/student/messages",
          badgeKey: "messages",
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
      items: [{ translationKey: "sidebar.myChildren", icon: Users2, path: "/parent/children" }],
    },
    {
      key: "COMMUNICATION",
      titleKey: "sidebar.communication",
      icon: Megaphone,
      categoryGroup: "management",
      items: [
        { translationKey: "sidebar.announcements", icon: Megaphone, path: "/parent/announcements" },
        { translationKey: "sidebar.notifications", icon: Bell, path: "/parent/notifications" },
        {
          translationKey: "sidebar.inbox",
          icon: MessageSquare,
          path: "/parent/messages",
          badgeKey: "messages",
          badgeColor: "bg-teal-500 text-white",
        },
      ],
    },
  ],
};

const roleBadgeColorMap: Record<string, { label: string; badgeClass: string }> = {
  admin: {
    label: "Administrator",
    badgeClass: "bg-surface text-brand-600 dark:text-brand-300",
  },
  teacher: { label: "Faculty", badgeClass: "bg-surface text-success" },
  student: { label: "Scholar", badgeClass: "bg-surface text-info" },
  parent: { label: "Guardian", badgeClass: "bg-surface text-warning" },
};

function sectionForPath(pathname: string, menu: MenuSection[]): Section | null {
  const match = menu.find((section) =>
    section.items.some(
      (item) => pathname === item.path || pathname.startsWith(item.path + "/")
    )
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
  const { role: authRole, user, logout } = useAuth();
  const { school } = useSchool();
  const badgeCounts = useBadgeCounts();
  const { t } = useTranslations();

  const activeRole = (propRole || authRole || "admin").toLowerCase();

  const dashboardPath =
    activeRole === "admin" ? "/dashboard" : `/${activeRole}/dashboard`;
  const isDashboardActive =
    location.pathname === dashboardPath ||
    (activeRole === "admin" && location.pathname === "/");

  const schoolName = school?.name ?? "";
  const academicYear = school?.academicYear ?? "";
  const schoolInitials =
    schoolName
      .split(/\s+/)
      .map((w) => w[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase() || "HS";

  const resolveBadge = (
    item: MenuItem
  ): { text: string; color: string; pulse: boolean } | null => {
    if (!item.badgeKey) return null;
    const count = badgeCounts[item.badgeKey];
    if (!count || count <= 0) return null;
    return {
      text: String(count),
      color: item.badgeColor ?? "bg-brand-600 text-white",
      pulse: item.badgePulse ?? false,
    };
  };

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
        /* ignore */
      }
      return next;
    });
  };

  const [hoveredSection, setHoveredSection] = useState<Section | null>(null);
  const hoverTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const baseMenu = useMemo(() => {
    const menu = roleMenus[activeRole] || roleMenus.admin;
    const permissionKeys = user?.permissionKeys ?? [];
    if (permissionKeys.length === 0) return menu;

    return menu
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const requiredPermission = permissionForPath(item.path);
          return permissionKeys.includes(requiredPermission);
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [activeRole, user?.permissionKeys]);

  const [openSection, setOpenSection] = useState<Section | null>(() => {
    if (isDashboardActive) return null;
    return (
      sectionForPath(location.pathname, baseMenu) ||
      (baseMenu.length > 0 ? baseMenu[0].key : null)
    );
  });

  useEffect(() => {
    if (isDashboardActive) {
      setOpenSection(null);
      return;
    }
    const active = sectionForPath(location.pathname, baseMenu);
    if (active) {
      setOpenSection(active);
    }
  }, [location.pathname, baseMenu, isDashboardActive]);

  const toggleSection = (sectionKey: Section) => {
    setOpenSection((current) => (current === sectionKey ? null : sectionKey));
  };

  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return baseMenu;
    const q = searchQuery.toLowerCase();
    return baseMenu
      .map((section) => {
        const titleMatch = t(section.titleKey).toLowerCase().includes(q);
        const matchedItems = section.items.filter((item) =>
          t(item.translationKey).toLowerCase().includes(q)
        );
        if (titleMatch || matchedItems.length > 0) {
          return {
            ...section,
            items: titleMatch ? section.items : matchedItems,
          };
        }
        return null;
      })
      .filter(Boolean) as MenuSection[];
  }, [baseMenu, searchQuery, t]);

  useEffect(() => {
    if (searchQuery.trim() && filteredMenu.length > 0) {
      setOpenSection(filteredMenu[0].key);
    }
  }, [searchQuery, filteredMenu]);

  const groupedSections = useMemo(() => {
    const groups: { [key: string]: MenuSection[] } = {};
    filteredMenu.forEach((sec) => {
      const g = sec.categoryGroup || "academic";
      if (!groups[g]) groups[g] = [];
      groups[g].push(sec);
    });
    return groups;
  }, [filteredMenu]);

  const sectionPanelRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const sectionTriggerRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (openSection) {
      sectionPanelRefs.current[openSection]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [openSection]);

  const handleSectionKeyDown = (
    e: ReactKeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const triggers = sectionTriggerRefs.current;
    if (!triggers.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      triggers[(index + 1) % triggers.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      triggers[(index - 1 + triggers.length) % triggers.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      triggers[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      triggers[triggers.length - 1]?.focus();
    }
  };

  useEffect(() => {
    if (mobileOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [mobileOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (searchQuery) {
          setSearchQuery("");
        } else if (mobileOpen && onClose) {
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onClose, searchQuery]);

  const handleLinkClick = useCallback(() => {
    if (onClose) onClose();
    setHoveredSection(null);
  }, [onClose]);

  const handleMouseEnter = (sectionKey: Section) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    if (isCollapsed) setHoveredSection(sectionKey);
  };

  const handleMouseLeave = () => {
    if (isCollapsed) {
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredSection(null);
      }, 200);
    }
  };

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
  const userAvatarUrl = user?.avatarUrl ? resolveAssetUrl(user.avatarUrl) : null;

  /* --------------------------------------------------------------
     Compact rail mode (desktop only)
     -------------------------------------------------------------- */
  const renderCompactMenu = () => (
    <div className="app-sidebar flex h-full flex-col justify-between p-2 select-none overflow-hidden">
      <div className="flex flex-col items-center space-y-2.5 overflow-y-auto no-scrollbar flex-1 py-2">
        <div
          title={schoolName || "School"}
          className="relative group flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-600 via-brand-700 to-indigo-800 text-white shadow-md shadow-brand-600/20 ring-1 ring-white/20 transition-transform duration-200 hover:scale-105"
        >
          {schoolName ? (
            <span className="text-xs font-black tracking-tight">{schoolInitials}</span>
          ) : (
            <School2 size={18} className="text-white" />
          )}
          <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-surface" />
        </div>

        <button
          type="button"
          onClick={toggleCollapsed}
          title="Expand sidebar"
          aria-label="Expand sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-secondary glass-interactive"
        >
          <PanelLeft size={16} />
        </button>

        <NavLink
          to={dashboardPath}
          onClick={handleLinkClick}
          title={t("sidebar.dashboard")}
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 shrink-0 ${
            isDashboardActive
              ? "bg-brand-600 text-white font-semibold"
              : "text-secondary hover:text-fg"
          }`}
        >
          <LayoutDashboard size={18} />
          {isDashboardActive && (
            <span className="absolute -right-0.5 top-1.5 h-2 w-2 rounded-full bg-white ring-2 ring-brand-600" />
          )}
        </NavLink>

        <div className="my-1 h-px w-6 bg-(--neu-shadow-dark) shrink-0" />

        <nav
          className="flex flex-col space-y-1.5 w-full items-center"
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
            const hasBadges = section.items.some((item) => resolveBadge(item));

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
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${
                    isSectionActive
                      ? "bg-surface text-brand-600 font-semibold ring-1 ring-brand-500/30 dark:text-brand-300"
                      : "text-secondary hover:text-fg"
                  }`}
                >
                  <SectionIcon size={18} />
                  {isSectionActive && (
                    <span className="absolute -right-0.5 top-1.5 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-surface" />
                  )}
                  {!isSectionActive && hasBadges && (
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-500 ring-1 ring-surface" />
                  )}
                </button>

                {isHovered && (
                  <div
                    className="dropdown-surface absolute left-full top-0 z-50 ml-3 w-72 rounded-2xl p-3 animate-in fade-in zoom-in-95 duration-150"
                    onMouseEnter={() => handleMouseEnter(section.key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className={`mb-2 flex items-center justify-between pb-2 px-1 ${SEAM_B}`}>
                      <span className="text-xs font-bold text-color flex items-center gap-1.5">
                        <SectionIcon size={15} className="text-brand-600 dark:text-brand-400" />
                        {t(section.titleKey)}
                      </span>
                      <span className="text-[10px] text-secondary font-semibold px-2 py-0.5 rounded-full bg-surface">
                        {section.items.length} items
                      </span>
                    </div>
                    <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const isItemActive =
                          location.pathname === item.path ||
                          location.pathname.startsWith(item.path + "/");
                        const badge = resolveBadge(item);

                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={handleLinkClick}
                            className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition duration-150 ${
                              isItemActive
                                ? "bg-brand-600 text-white font-medium"
                                : "text-secondary hover:text-fg"
                            }`}
                          >
                            <span className="flex items-center gap-2 truncate">
                              <Icon size={14} className="shrink-0" />
                              <span className="truncate">{t(item.translationKey)}</span>
                            </span>
                            {badge && (
                              <span
                                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${badge.color} ${
                                  badge.pulse ? "animate-pulse" : ""
                                }`}
                              >
                                {badge.text}
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

      <div className={`flex flex-col items-center space-y-2 pt-2 shrink-0 ${SEAM_T}`}>
        <div
          title={`${userDisplayName} (${roleConfig.label})`}
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-linear-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs select-none ring-1 ring-surface"
        >
          {userAvatarUrl ? (
            <img src={userAvatarUrl} alt={userDisplayName} className="h-full w-full object-cover" />
          ) : (
            userInitials
          )}
        </div>
      </div>
    </div>
  );

  /* --------------------------------------------------------------
     Expanded menu (desktop + mobile drawer)
     -------------------------------------------------------------- */
  const renderExpandedMenu = (isMobile = false) => (
    // `app-sidebar` handles bg + width-0 border. glassmorphism-era
    // `bg-surface/90 backdrop-blur-md border-r border-surface` removed.
    <div className="app-sidebar flex h-full flex-col justify-between select-none overflow-hidden">
      {/* Top branding + search + dashboard link */}
      <div className="shrink-0 p-3.5 pb-2 space-y-3">
        <div className="flex items-center justify-between gap-2.5 p-2 rounded-2xl shadow-sunken">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-brand-600 via-brand-700 to-indigo-800 text-white shadow-sm shadow-brand-600/20 ring-1 ring-white/10">
              <School2 size={19} className="text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-emerald-400 ring-2 ring-surface" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-xs font-bold tracking-tight text-color">
                {schoolName || "School Administration"}
              </h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-brand-600 dark:text-brand-400">
                  <Sparkles size={10} className="shrink-0 opacity-70" />
                  {academicYear ? `AY ${academicYear}` : "Portal"}
                </span>
                <span className="h-1 w-1 rounded-full bg-(--neu-shadow-dark) shrink-0" />
                <span className="text-[10px] text-secondary capitalize truncate">
                  {roleConfig.label}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!isMobile && (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-secondary glass-interactive"
                title="Collapse sidebar (rail mode)"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={15} />
              </button>
            )}

            {isMobile && (
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-9 min-w-9 shrink-0 items-center justify-center rounded-xl text-secondary glass-interactive lg:hidden"
                aria-label="Close navigation drawer"
              >
                <X size={17} />
              </button>
            )}
          </div>
        </div>

        {/* Quick search — no longer fights the global `neu-inset` rule
            that now applies to every text input. We only layer on the
            padding + focus ring + brand text. */}
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-secondary pointer-events-none z-10">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search menu..."
            className="w-full pl-8.5 pr-8 py-2 rounded-xl text-xs text-color focus:outline-none focus:ring-2 focus:ring-brand-500/60 transition-all duration-150"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-secondary hover:text-fg p-0.5 cursor-pointer rounded-md"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <NavLink
          to={dashboardPath}
          onClick={handleLinkClick}
          className={`group flex min-h-9.5 w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
            isDashboardActive
              ? "bg-brand-600 text-white shadow-sm shadow-brand-600/30"
              : "text-secondary hover:text-fg"
          }`}
        >
          <div
            className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg transition-colors ${
              isDashboardActive
                ? "bg-white/20 text-white"
                : "bg-surface text-secondary"
            }`}
          >
            <LayoutDashboard size={14} />
          </div>
          <span className="truncate text-xs font-medium">{t("sidebar.dashboard")}</span>
          {isDashboardActive && (
            <span className="ml-auto flex h-2 w-2 rounded-full bg-white animate-pulse" />
          )}
        </NavLink>
      </div>

      {/* Scrollable navigation */}
      <div className="flex-1 overflow-y-auto px-3.5 py-1.5 space-y-3.5 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-(--scrollbar-thumb) hover:[&::-webkit-scrollbar-thumb]:bg-(--scrollbar-thumb-hover)">
        <nav aria-label="Sidebar Sections">
          {Object.entries(groupedSections).map(([groupKey, sections]) => {
            const groupTitle = categoryGroupLabels[groupKey] || groupKey;

            return (
              <div key={groupKey} className="space-y-1">
                <div className="flex items-center gap-2 px-2.5 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
                  <span className="truncate">{groupTitle}</span>
                  <span className="flex-1 h-px bg-(--neu-shadow-dark) shrink-0" />
                </div>

                {sections.map((section, index) => {
                  const SectionIcon = section.icon;
                  const isSectionOpen = openSection === section.key;
                  const hasActiveChild = section.items.some(
                    (item) =>
                      location.pathname === item.path ||
                      location.pathname.startsWith(item.path + "/")
                  );
                  const triggerId = `sidebar-trigger-${section.key}`;
                  const panelId = `sidebar-panel-${section.key}`;

                  return (
                    <div
                      key={section.key}
                      ref={(el) => {
                        sectionPanelRefs.current[section.key] = el;
                      }}
                      className="scroll-mt-2"
                    >
                      <button
                        type="button"
                        id={triggerId}
                        ref={(el) => {
                          sectionTriggerRefs.current[index] = el;
                        }}
                        onClick={() => toggleSection(section.key)}
                        onKeyDown={(e) => handleSectionKeyDown(e, index)}
                        aria-expanded={isSectionOpen}
                        aria-controls={panelId}
                        className={`group flex min-h-9 w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-medium transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${
                          isSectionOpen
                            ? "text-color font-semibold shadow-sunken"
                            : hasActiveChild
                              ? "text-brand-700 dark:text-brand-300 font-semibold shadow-sunken"
                              : "text-secondary hover:text-fg"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <div
                            className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg transition-all duration-150 ${
                              isSectionOpen || hasActiveChild
                                ? "bg-brand-600 text-white shadow-xs shadow-brand-600/20"
                                : "bg-surface text-secondary"
                            }`}
                          >
                            <SectionIcon size={14} />
                          </div>
                          <span className="truncate text-xs">{t(section.titleKey)}</span>
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {!isSectionOpen && hasActiveChild && (
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600 dark:bg-brand-400"
                              aria-hidden="true"
                            />
                          )}
                          <span className="text-[10px] text-secondary font-medium px-1">
                            {section.items.length}
                          </span>
                          <ChevronRight
                            size={14}
                            className={`transition-transform duration-200 text-secondary ${
                              isSectionOpen
                                ? "rotate-90 text-brand-600 dark:text-brand-400"
                                : "rotate-0"
                            }`}
                          />
                        </div>
                      </button>

                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        aria-hidden={!isSectionOpen}
                        className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                          isSectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden min-h-0">
                          {/* Left rail — was `border-l border-surface`
                              (invisible); now a 1px shadow seam. */}
                          <div className="relative mt-1 mb-1 ml-4 pl-3 space-y-0.5 shadow-[-1px_0_0_var(--neu-shadow-dark)]">
                            {section.items.map((item) => {
                              const Icon = item.icon;
                              const isItemActive =
                                location.pathname === item.path ||
                                location.pathname.startsWith(item.path + "/");
                              const badge = resolveBadge(item);

                              return (
                                <NavLink
                                  key={item.path}
                                  to={item.path}
                                  onClick={handleLinkClick}
                                  tabIndex={isSectionOpen ? 0 : -1}
                                  className={`group relative flex min-h-8 items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/50 ${
                                    isItemActive
                                      ? "font-semibold bg-brand-600 text-white shadow-xs shadow-brand-600/20"
                                      : "font-normal text-secondary hover:text-fg"
                                  }`}
                                >
                                  {isItemActive && (
                                    <span className="absolute -left-4 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-brand-600 ring-2 ring-surface" />
                                  )}
                                  <span className="flex items-center gap-2 truncate">
                                    <Icon
                                      size={14}
                                      className={`shrink-0 ${
                                        isItemActive ? "text-white" : "text-secondary"
                                      }`}
                                    />
                                    <span className="truncate text-xs">
                                      {t(item.translationKey)}
                                    </span>
                                  </span>
                                  {badge && (
                                    <span
                                      className={`rounded-full px-1.5 py-0.5 text-[9px] font-bold tracking-tight ${
                                        isItemActive ? "bg-white/25 text-white" : badge.color
                                      } ${badge.pulse ? "animate-pulse" : ""}`}
                                    >
                                      {badge.text}
                                    </span>
                                  )}
                                </NavLink>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User footer */}
      <div className={`shrink-0 p-3.5 pt-2 ${SEAM_T}`}>
        <div className="flex items-center justify-between gap-2 rounded-2xl p-2.5 shadow-sunken">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-linear-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs select-none ring-1 ring-surface">
              {userAvatarUrl ? (
                <img src={userAvatarUrl} alt={userDisplayName} className="h-full w-full object-cover" />
              ) : (
                userInitials
              )}
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-surface" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-color leading-tight">
                {userDisplayName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md ${roleConfig.badgeClass}`}
                >
                  {roleConfig.label}
                </span>
              </div>
            </div>
          </div>

          {logout && (
            <button
              type="button"
              onClick={() => logout()}
              title="Sign out"
              aria-label="Sign out"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-secondary hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
            >
              <LogOut size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop — kept dark scrim, dropped the frosted blur */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onClose && onClose()}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile drawer — side shadow added because the outer wrapper
          isn't a `aside.app-sidebar`, so the CSS shadow rule doesn't
          reach it. */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-77.5 max-w-[85vw] transform transition-transform duration-300 ease-out lg:hidden shadow-[2px_0_6px_var(--neu-shadow-dark)] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="h-full overflow-hidden">{renderExpandedMenu(true)}</div>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`app-sidebar hidden h-full shrink-0 flex-col lg:flex overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-17" : "w-72 xl:w-74"
        }`}
      >
        {isCollapsed ? renderCompactMenu() : renderExpandedMenu(false)}
      </aside>
    </>
  );
}