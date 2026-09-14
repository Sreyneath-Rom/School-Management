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
  Search,
  School2,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
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

// Category group labels for organizing section flow
const categoryGroupLabels: Record<string, string> = {
  core: "Core Administration",
  academic: "Curriculum & Academic",
  management: "Faculty & Students",
  system: "Communication & Reports",
};

// Role-tailored menu configuration (preserved exactly for all roles)
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
          translationKey: "sidebar.activityLogs",
          icon: Activity,
          path: "/system/activity",
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
          icon: Bell,
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
          icon: Bell,
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
          icon: Bell,
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
  { label: string; badgeClass: string; dotClass: string }
> = {
  admin: {
    label: "Administrator",
    badgeClass: "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/20",
    dotClass: "bg-blue-500",
  },
  teacher: {
    label: "Faculty",
    badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/20",
    dotClass: "bg-emerald-500",
  },
  student: {
    label: "Scholar",
    badgeClass: "bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-500/20",
    dotClass: "bg-purple-500",
  },
  parent: {
    label: "Guardian",
    badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/20",
    dotClass: "bg-amber-500",
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
  const { role: authRole, user, logout } = useAuth();
  const { t } = useTranslations();

  const activeRole = (propRole || authRole || "admin").toLowerCase();

  const dashboardPath =
    activeRole === "admin" ? "/dashboard" : `/${activeRole}/dashboard`;
  const isDashboardActive =
    location.pathname === dashboardPath ||
    (activeRole === "admin" && location.pathname === "/");

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

  // Quick search filter for menu items
  const [searchQuery, setSearchQuery] = useState("");

  // Active role's menu sections
  const baseMenu = useMemo(() => {
    return roleMenus[activeRole] || roleMenus.admin;
  }, [activeRole]);

  // Single Accordion State: Only 1 section expanded at a time ("flow: 1 expand other collapse")
  const [openSection, setOpenSection] = useState<Section | null>(() => {
    if (isDashboardActive) return null;
    return (
      sectionForPath(location.pathname, baseMenu) ||
      (baseMenu.length > 0 ? baseMenu[0].key : null)
    );
  });

  // Automatically keep current route's section expanded and others collapsed.
  // On the Dashboard, collapse all accordion sections.
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

  // Toggle section: opens target section and collapses all others
  const toggleSection = (sectionKey: Section) => {
    setOpenSection((current) => (current === sectionKey ? null : sectionKey));
  };

  // Filtered menu if search query is present
  const filteredMenu = useMemo(() => {
    if (!searchQuery.trim()) return baseMenu;
    const q = searchQuery.toLowerCase();
    return baseMenu
      .map((section) => {
        const titleMatch = t(section.titleKey).toLowerCase().includes(q);
        const matchedItems = section.items.filter((item) =>
          t(item.translationKey).toLowerCase().includes(q),
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

  // If searching, auto-expand sections with matches
  useEffect(() => {
    if (searchQuery.trim() && filteredMenu.length > 0) {
      setOpenSection(filteredMenu[0].key);
    }
  }, [searchQuery, filteredMenu]);

  // Group sections by categoryGroup for visual hierarchy
  const groupedSections = useMemo(() => {
    const groups: { [key: string]: MenuSection[] } = {};
    filteredMenu.forEach((sec) => {
      const g = sec.categoryGroup || "academic";
      if (!groups[g]) groups[g] = [];
      groups[g].push(sec);
    });
    return groups;
  }, [filteredMenu]);

  // Refs for keyboard navigation
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
    index: number,
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

  // Escape key closes mobile drawer
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
    <div className="app-sidebar flex h-full flex-col justify-between p-2 select-none overflow-hidden bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl">
      <div className="flex flex-col items-center space-y-2 overflow-y-auto no-scrollbar flex-1 py-1.5">
        {/* School Crest mini icon */}
        <div
          title="Varin High School"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-teal-900 text-white shadow-md border border-teal-500/30"
        >
          <School2 size={18} className="text-teal-300" />
        </div>

        {/* Expand sidebar trigger button */}
        <button
          type="button"
          onClick={toggleCollapsed}
          title="Expand sidebar"
          className="group relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white cursor-pointer transition-all duration-200 active:scale-95"
          aria-label="Expand sidebar"
        >
          <PanelLeft
            size={17}
            className="group-hover:scale-110 transition-transform duration-200"
          />
        </button>

        {/* Dashboard quick icon */}
        <NavLink
          to={dashboardPath}
          onClick={handleLinkClick}
          title={t("sidebar.dashboard")}
          className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 shrink-0 ${
            isDashboardActive
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/30 font-semibold"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
          }`}
        >
          <LayoutDashboard size={18} />
          {isDashboardActive && (
            <span className="absolute -right-0.5 top-1.5 h-2 w-2 rounded-full bg-white ring-2 ring-teal-600" />
          )}
        </NavLink>

        <div className="my-1 h-px w-6 bg-slate-200/80 dark:bg-slate-800 shrink-0" />

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
                  className={`relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${
                    isSectionActive
                      ? "bg-teal-500/15 text-teal-700 font-semibold ring-1 ring-teal-500/30 dark:bg-teal-500/25 dark:text-teal-300 dark:ring-teal-400/30"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <SectionIcon size={18} />
                  {isSectionActive && (
                    <span className="absolute -right-0.5 top-1.5 h-2 w-2 rounded-full bg-teal-600 ring-2 ring-white dark:ring-slate-900" />
                  )}
                  {!isSectionActive && hasBadges && (
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-amber-500 ring-1 ring-white dark:ring-slate-900" />
                  )}
                </button>

                {/* Popover Flyout for Compact Mode */}
                {isHovered && (
                  <div
                    className="absolute left-full top-0 z-50 ml-3 w-72 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-3 shadow-2xl shadow-slate-900/10 dark:shadow-black/40 border border-slate-200/90 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150"
                    onMouseEnter={() => handleMouseEnter(section.key)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="mb-2 flex items-center justify-between border-b border-slate-100 pb-2 px-1 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <SectionIcon
                          size={15}
                          className="text-teal-600 dark:text-teal-400"
                        />
                        {t(section.titleKey)}
                      </span>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                        {section.items.length} items
                      </span>
                    </div>
                    <div className="space-y-0.5 max-h-72 overflow-y-auto pr-1">
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
                            className={`flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs transition duration-150 ${
                              isItemActive
                                ? "bg-teal-600 text-white font-medium shadow-xs"
                                : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
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
                                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${item.badgeColor || "bg-teal-600 text-white"} ${item.badgePulse ? "animate-pulse" : ""}`}
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

      {/* Compact Mode Footer with User Initials */}
      <div className="flex flex-col items-center space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-800/80 shrink-0">
        <div
          title={`${userDisplayName} (${roleConfig.label})`}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white font-bold text-xs shadow-xs cursor-default select-none ring-1 ring-white/20"
        >
          {userInitials}
        </div>
      </div>
    </div>
  );

  // --- Render Standard Expanded Menu ---
  const renderExpandedMenu = (isMobile = false) => (
    <div className="flex h-full flex-col justify-between select-none overflow-hidden bg-white/75 dark:bg-slate-900/80 backdrop-blur-2xl">
      {/* Top Header: Institutional Branding & Controls */}
      <div className="shrink-0 p-3 pb-2 space-y-3">
        <div className="flex items-center justify-between gap-2">
          {/* School Identity Emblem */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 via-teal-950 to-slate-900 text-white shadow-md border border-teal-500/30">
              <School2 size={18} className="text-teal-300" />
              <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-amber-400 ring-1 ring-white dark:ring-slate-900" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="truncate text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  Varin High School
                </h2>
              </div>
              <p className="truncate text-[10.5px] font-semibold text-teal-600 dark:text-teal-400">
                វិទ្យាល័យ វ៉ារិន • AY 2025–26
              </p>
            </div>
          </div>

          {/* Desktop Collapse Toggle / Mobile Close Button */}
          <div className="flex items-center gap-1 shrink-0">
            {!isMobile && (
              <button
                type="button"
                onClick={toggleCollapsed}
                className="hidden lg:flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition cursor-pointer"
                title="Collapse sidebar (rail mode)"
                aria-label="Collapse sidebar"
              >
                <PanelLeftClose size={16} />
              </button>
            )}

            {isMobile && (
              <button
                type="button"
                onClick={onClose}
                className="flex min-h-[40px] min-w-[40px] shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition cursor-pointer"
                aria-label="Close navigation drawer"
              >
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Menu Search / Filter */}
        <div className="relative">
          <span className="absolute left-3 top-2.5 text-slate-400">
            <Search size={14} />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Quick search menu..."
            className="w-full pl-8 pr-7 py-2 rounded-xl text-xs bg-slate-100/90 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-500 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Primary Dashboard Link */}
        <NavLink
          to={dashboardPath}
          onClick={handleLinkClick}
          className={`group flex min-h-[38px] w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs font-bold transition-all duration-150 ${
            isDashboardActive
              ? "bg-teal-600 text-white shadow-md shadow-teal-600/25"
              : "text-slate-700 hover:text-slate-900 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/80"
          }`}
        >
          <div
            className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg transition-colors ${
              isDashboardActive
                ? "bg-white/20 text-white"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white"
            }`}
          >
            <LayoutDashboard size={14} />
          </div>
          <span className="truncate text-xs">{t("sidebar.dashboard")}</span>
          {isDashboardActive && (
            <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          )}
        </NavLink>
      </div>

      {/* Middle Scrollable Navigation List (Single-Accordion Flow Preserved: 1 expand, others collapse) */}
      <div className="flex-1 overflow-y-auto px-3 py-1 space-y-3 scroll-smooth [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-slate-300/60 hover:[&::-webkit-scrollbar-thumb]:bg-slate-400/80 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700/60 dark:hover:[&::-webkit-scrollbar-thumb]:bg-slate-600/80">
        <nav aria-label="Sidebar Sections">
          {Object.entries(groupedSections).map(([groupKey, sections]) => {
            const groupTitle = categoryGroupLabels[groupKey] || groupKey;

            return (
              <div key={groupKey} className="space-y-1">
                {/* Category Group Header */}
                <div className="px-2 pt-2 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {groupTitle}
                </div>

                {sections.map((section, index) => {
                  const SectionIcon = section.icon;
                  const isSectionOpen = openSection === section.key;
                  const hasActiveChild = section.items.some(
                    (item) =>
                      location.pathname === item.path ||
                      location.pathname.startsWith(item.path + "/"),
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
                        className={`group flex min-h-[38px] w-full items-center justify-between rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${
                          isSectionOpen
                            ? "bg-slate-100/90 dark:bg-slate-800/90 text-slate-900 dark:text-white shadow-xs"
                            : hasActiveChild
                            ? "text-teal-700 bg-teal-500/10 dark:text-teal-300 dark:bg-teal-500/15 font-bold"
                            : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 truncate">
                          <div
                            className={`flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              isSectionOpen || hasActiveChild
                                ? "bg-teal-600 text-white shadow-xs"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-white"
                            }`}
                          >
                            <SectionIcon size={14} />
                          </div>
                          <span className="truncate text-xs">
                            {t(section.titleKey)}
                          </span>
                        </span>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {!isSectionOpen && hasActiveChild && (
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600 dark:bg-teal-400"
                              aria-hidden="true"
                            />
                          )}
                          <span className="text-[10px] text-slate-400 font-medium px-1">
                            {section.items.length}
                          </span>
                          <ChevronRight
                            size={14}
                            className={`transition-transform duration-200 text-slate-400 ${
                              isSectionOpen ? "rotate-90 text-teal-600 dark:text-teal-400" : "rotate-0"
                            }`}
                          />
                        </div>
                      </button>

                      {/* Sub-item Accordion Panel (Animated smoothly via CSS grid) */}
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        aria-hidden={!isSectionOpen}
                        className={`grid transition-[grid-template-rows] duration-250 ease-in-out ${
                          isSectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden min-h-0">
                          <div className="relative mt-1 mb-1 ml-4 pl-3 space-y-0.5 border-l border-slate-200 dark:border-slate-800">
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
                                  tabIndex={isSectionOpen ? 0 : -1}
                                  className={`group relative flex min-h-[34px] items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-xs transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 ${
                                    isItemActive
                                      ? "font-bold bg-teal-600 text-white shadow-xs"
                                      : "font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
                                  }`}
                                >
                                  {isItemActive && (
                                    <span className="absolute -left-[17px] top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-teal-600 ring-2 ring-white dark:ring-slate-900" />
                                  )}
                                  <span className="flex items-center gap-2 truncate">
                                    <Icon
                                      size={14}
                                      className={`shrink-0 ${
                                        isItemActive
                                          ? "text-white"
                                          : "text-slate-400 group-hover:text-slate-700 dark:text-slate-400 dark:group-hover:text-slate-200"
                                      }`}
                                    />
                                    <span className="truncate text-xs">
                                      {t(item.translationKey)}
                                    </span>
                                  </span>
                                  {item.badge && (
                                    <span
                                      className={`rounded-full px-1.5 py-0.5 text-[9.5px] font-bold ${
                                        isItemActive
                                          ? "bg-white/20 text-white"
                                          : item.badgeColor || "bg-teal-600 text-white"
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
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </div>

      {/* User Profile Bottom Footer */}
      <div className="shrink-0 p-3 pt-2 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 dark:bg-slate-800/70 p-2.5 border border-slate-200/70 dark:border-slate-700/70">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-600 text-white font-bold text-xs select-none shadow-xs">
              {userInitials}
              <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900 animate-pulse" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {userDisplayName}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  className={`text-[9.5px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-md border ${roleConfig.badgeClass}`}
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
              className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/30 dark:hover:text-rose-400 transition-colors cursor-pointer"
              aria-label="Sign out"
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
      {/* Mobile Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-300 lg:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => onClose && onClose()}
        aria-hidden={!mobileOpen}
      />

      {/* Mobile Drawer (Touch-Optimized for Phones & Tablets < 1024px) */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-[310px] max-w-[85vw] transform transition-transform duration-300 ease-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation"
      >
        <div className="h-full overflow-hidden">{renderExpandedMenu(true)}</div>
      </div>

      {/* Desktop / Laptop Sidebar (Fixed viewport height, independent of main view scroll) */}
      <aside
        className={`app-sidebar hidden h-full shrink-0 flex-col lg:flex overflow-hidden transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-[68px]" : "w-72 xl:w-[18.5rem]"
        }`}
      >
        {isCollapsed ? renderCompactMenu() : renderExpandedMenu(false)}
      </aside>
    </>
  );
}
