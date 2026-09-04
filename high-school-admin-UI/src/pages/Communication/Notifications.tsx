import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Calendar, 
  FileText, 
  AlertCircle, 
  ShieldAlert, 
  Award, 
  Users, 
  ExternalLink,
  Settings,
  X
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "academic" | "leave" | "security" | "system" | "billing";
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Student Leave Application Submitted",
    message: "Helen Vance submitted a medical leave request for Lucas Vance (Grade 11A) for Mar 5 - Mar 7.",
    type: "leave",
    timestamp: "12 minutes ago",
    read: false,
    actionUrl: "/students/leave-requests",
    actionLabel: "Review Request",
  },
  {
    id: "notif-2",
    title: "Midterm Examination Timetable Updated",
    message: "Room allocations and proctor supervision for Advanced Mathematics (MATH-401) finalized.",
    type: "academic",
    timestamp: "1 hour ago",
    read: false,
    actionUrl: "/academic/exams",
    actionLabel: "View Schedule",
  },
  {
    id: "notif-3",
    title: "Security: New Administrative Session Login",
    message: "Admin portal logged in from Chrome (macOS) - IP 192.168.1.45 at 08:32 AM.",
    type: "security",
    timestamp: "2 hours ago",
    read: false,
    actionUrl: "/system/audit-logs",
    actionLabel: "View Audit Log",
  },
  {
    id: "notif-4",
    title: "Parent-Teacher Advisory Conference Scheduled",
    message: "Event confirmed for Friday, March 6th in Main Auditorium. 42 parents currently RSVP'd.",
    type: "system",
    timestamp: "Yesterday at 4:15 PM",
    read: true,
    actionUrl: "/calendar",
    actionLabel: "Calendar Event",
  },
  {
    id: "notif-5",
    title: "Term 2 Tuition Installment Remittance",
    message: "Tuition settlement received from Robert Miller for Ethan Miller ($3,450.00).",
    type: "billing",
    timestamp: "Mar 02, 2026",
    read: true,
  },
  {
    id: "notif-6",
    title: "Faculty Coursework Allocation Adjusted",
    message: "Marcus Thorne assigned as Lead Teacher for Grade 11 Physics & Mechanics.",
    type: "academic",
    timestamp: "Mar 01, 2026",
    read: true,
    actionUrl: "/teachers/assignments",
    actionLabel: "View Allocations",
  },
];

export default function Notifications() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [filterType, setFilterType] = useState<string>("all");
  const [isPrefOpen, setIsPrefOpen] = useState(false);

  // Preference switches
  const [prefEmail, setPrefEmail] = useState(true);
  const [prefPush, setPrefPush] = useState(true);
  const [prefSMS, setPrefSMS] = useState(false);

  const filtered = notifications.filter((n) => {
    if (filterType === "all") return true;
    if (filterType === "unread") return !n.read;
    return n.type === filterType;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read", "success");
  };

  const clearAll = () => {
    setNotifications([]);
    showToast("Notifications cleared", "info");
  };

  const toggleItemRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const deleteItem = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getIcon = (type: NotificationItem["type"]) => {
    switch (type) {
      case "academic":
        return <Award size={18} className="text-blue-500" />;
      case "leave":
        return <FileText size={18} className="text-amber-500" />;
      case "security":
        return <ShieldAlert size={18} className="text-red-500" />;
      case "billing":
        return <CheckCheck size={18} className="text-emerald-500" />;
      default:
        return <Bell size={18} className="text-purple-500" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Notification Center"
          subtitle="Real-time alerts, academic milestones, security log triggers, and administrative updates."
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-white/5 transition"
            >
              <CheckCheck size={14} />
              <span>Mark all read</span>
            </button>
          )}

          <button
            onClick={() => setIsPrefOpen(true)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
            title="Notification Settings"
          >
            <Settings size={16} />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-3 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Alerts" },
            { id: "unread", label: `Unread (${unreadCount})` },
            { id: "leave", label: "Leave Requests" },
            { id: "academic", label: "Academic" },
            { id: "security", label: "Security" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterType === tab.id
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-stone-400 hover:text-red-500 font-medium whitespace-nowrap"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 text-xs">
            No notifications in this category. You're completely caught up!
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-2xl glass-sm border transition flex items-start justify-between gap-4 ${
                !item.read
                  ? "border-brand-500/30 bg-brand-500/[0.03]"
                  : "border-stone-200/70 dark:border-white/10 bg-white/40 dark:bg-stone-900/40"
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 shrink-0 mt-0.5">
                  {getIcon(item.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className={`text-xs font-bold ${!item.read ? 'text-stone-900 dark:text-white' : 'text-stone-700 dark:text-stone-300'}`}>
                      {item.title}
                    </h3>
                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1">
                    <span className="text-[11px] text-stone-400 font-medium">
                      {item.timestamp}
                    </span>

                    {item.actionUrl && (
                      <Link
                        to={item.actionUrl}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        <span>{item.actionLabel || "View"}</span>
                        <ExternalLink size={11} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => toggleItemRead(item.id)}
                  className="p-1 rounded text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
                  title={item.read ? "Mark as unread" : "Mark as read"}
                >
                  <CheckCheck size={15} />
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="p-1 rounded text-stone-400 hover:text-red-500"
                  title="Dismiss notification"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preferences Modal */}
      {isPrefOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass border border-stone-200/80 dark:border-white/10 p-6 shadow-2xl bg-white dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Settings size={18} className="text-brand-500" />
                <span>Notification Preferences</span>
              </h3>
              <button
                onClick={() => setIsPrefOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-white/5">
                <div>
                  <div className="font-semibold text-stone-900 dark:text-white">Email Digest & Alerts</div>
                  <div className="text-stone-400 text-[11px]">Receive daily briefing and urgent circulars via email</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefEmail}
                  onChange={(e) => setPrefEmail(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-white/5">
                <div>
                  <div className="font-semibold text-stone-900 dark:text-white">In-App Browser Push</div>
                  <div className="text-stone-400 text-[11px]">Instant notifications for grade submissions and messages</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefPush}
                  onChange={(e) => setPrefPush(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-white/5">
                <div>
                  <div className="font-semibold text-stone-900 dark:text-white">SMS Emergency Broadcast</div>
                  <div className="text-stone-400 text-[11px]">Critical campus emergency and closure SMS alerts</div>
                </div>
                <input
                  type="checkbox"
                  checked={prefSMS}
                  onChange={(e) => setPrefSMS(e.target.checked)}
                  className="rounded text-brand-600 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-stone-200 dark:border-white/10">
              <button
                onClick={() => {
                  setIsPrefOpen(false);
                  showToast("Notification preferences updated", "success");
                }}
                className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md shadow-brand-500/20"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
