import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Megaphone, 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Users, 
  Pin, 
  Trash2, 
  Edit3, 
  Eye, 
  AlertTriangle, 
  CheckCircle2, 
  Bell, 
  Paperclip,
  X,
  Sparkles
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface Announcement {
  id: string;
  title: string;
  category: "General" | "Academic" | "Emergency" | "Event" | "Maintenance";
  priority: "Urgent" | "High" | "Normal";
  audience: "All" | "Teachers" | "Parents" | "Students" | "Staff";
  publishedAt: string;
  author: string;
  content: string;
  isPinned: boolean;
  status: "Published" | "Draft" | "Archived";
  viewsCount: number;
}

const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "anc-1",
    title: "Midterm Examination Term 2 Schedule & Protocol",
    category: "Academic",
    priority: "High",
    audience: "All",
    publishedAt: "2026-03-02 09:00",
    author: "Academic Registrar Office",
    content: "The official timetable for Term 2 Midterm Examinations has been released. All students are requested to report to their designated examination rooms 15 minutes prior to the paper start time. Strictly no electronic smartwatches or mobile phones permitted.",
    isPinned: true,
    status: "Published",
    viewsCount: 1420,
  },
  {
    id: "anc-2",
    title: "Parent-Teacher Advisory Conference (PTA) Registration Open",
    category: "Event",
    priority: "High",
    audience: "Parents",
    publishedAt: "2026-03-01 14:30",
    author: "Principal's Office",
    content: "The annual Spring Term Parent-Teacher conference is scheduled for Friday, March 6th. Parents can now book individual 15-minute consultations with subject teachers through their portal account or by contacting the administrative office.",
    isPinned: true,
    status: "Published",
    viewsCount: 890,
  },
  {
    id: "anc-3",
    title: "Severe Weather Advisory & Campus Safety Protocol",
    category: "Emergency",
    priority: "Urgent",
    audience: "All",
    publishedAt: "2026-02-27 18:00",
    author: "Campus Operations & Safety",
    content: "Due to heavy snowfall predictions, morning school bus transit will operate with a 30-minute delay. Outdoor athletic facilities remain closed until further inspection by safety personnel.",
    isPinned: false,
    status: "Published",
    viewsCount: 2150,
  },
  {
    id: "anc-4",
    title: "National STEM Robotics Competition Selection Results",
    category: "General",
    priority: "Normal",
    audience: "Students",
    publishedAt: "2026-02-25 11:20",
    author: "Robotics & Engineering Club",
    content: "Congratulations to our 10 finalist students selected to represent Oakridge High School at the regional robotics qualifiers in Chicago. Briefing session this Thursday at 3:30 PM in STEM Lab 2.",
    isPinned: false,
    status: "Published",
    viewsCount: 640,
  },
  {
    id: "anc-5",
    title: "Campus IT & Student Portal Scheduled Maintenance Window",
    category: "Maintenance",
    priority: "Normal",
    audience: "All",
    publishedAt: "2026-02-20 16:00",
    author: "IT Infrastructure Team",
    content: "Routine database index optimization and server cluster maintenance will take place this Sunday between 02:00 AM and 04:00 AM EST. Services may experience intermittent downtime.",
    isPinned: false,
    status: "Archived",
    viewsCount: 420,
  },
];

export default function Announcements() {
  const { showToast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Academic" as Announcement["category"],
    priority: "Normal" as Announcement["priority"],
    audience: "All" as Announcement["audience"],
    content: "",
    isPinned: false,
    sendBroadcast: true,
  });

  const filtered = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === "All" || a.priority === priorityFilter;
    const matchesAudience = audienceFilter === "All" || a.audience === audienceFilter;
    return matchesSearch && matchesPriority && matchesAudience;
  });

  const totalPublished = announcements.filter(a => a.status === "Published").length;
  const urgentCount = announcements.filter(a => a.priority === "Urgent" && a.status === "Published").length;

  const handleTogglePin = (id: string) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, isPinned: !a.isPinned } : a));
    showToast("Announcement pin state toggled", "info");
  };

  const handleDelete = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
    showToast("Announcement removed", "info");
  };

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      category: "Academic",
      priority: "Normal",
      audience: "All",
      content: "",
      isPinned: false,
      sendBroadcast: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: Announcement) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      category: item.category,
      priority: item.priority,
      audience: item.audience,
      content: item.content,
      isPinned: item.isPinned,
      sendBroadcast: false,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast("Please fill all required fields", "error");
      return;
    }

    if (editingItem) {
      setAnnouncements(prev => prev.map(a => a.id === editingItem.id ? {
        ...a,
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        audience: formData.audience,
        content: formData.content,
        isPinned: formData.isPinned,
      } : a));
      showToast("Announcement updated successfully", "success");
    } else {
      const newItem: Announcement = {
        id: `anc-${Date.now()}`,
        title: formData.title,
        category: formData.category,
        priority: formData.priority,
        audience: formData.audience,
        content: formData.content,
        publishedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        author: "Principal's Office",
        isPinned: formData.isPinned,
        status: "Published",
        viewsCount: 1,
      };
      setAnnouncements([newItem, ...announcements]);
      showToast("Broadcast announcement published to school board", "success");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="School Announcements Board"
          subtitle="Publish official broadcasts, circulars, emergency updates, and institutional notifications."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Announcement</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Megaphone size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{totalPublished}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Active Bulletins</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{urgentCount}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Urgent Alerts</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
            <Pin size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">
              {announcements.filter(a => a.isPinned).length}
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Pinned to Top</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">98.4%</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Community Reach</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search announcements by title, keywords, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-white/5 text-xs text-stone-700 dark:text-stone-300">
            <Filter size={13} className="text-stone-400" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All" className="dark:bg-stone-900">All Priorities</option>
              <option value="Urgent" className="dark:bg-stone-900">Urgent</option>
              <option value="High" className="dark:bg-stone-900">High</option>
              <option value="Normal" className="dark:bg-stone-900">Normal</option>
            </select>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-white/5 text-xs text-stone-700 dark:text-stone-300">
            <Users size={13} className="text-stone-400" />
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All" className="dark:bg-stone-900">All Audiences</option>
              <option value="Teachers" className="dark:bg-stone-900">Teachers</option>
              <option value="Parents" className="dark:bg-stone-900">Parents</option>
              <option value="Students" className="dark:bg-stone-900">Students</option>
            </select>
          </div>
        </div>
      </div>

      {/* Announcements Stream */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 text-xs">
            No announcements match your search filters.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-5 rounded-2xl glass-sm border transition shadow-sm space-y-3 ${
                item.isPinned
                  ? "border-brand-500/40 bg-brand-500/[0.02]"
                  : "border-stone-200/70 dark:border-white/10 bg-white/40 dark:bg-stone-900/40"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.isPinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300">
                        <Pin size={10} className="fill-brand-700 dark:fill-brand-300" /> Pinned
                      </span>
                    )}

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      item.priority === 'Urgent'
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                        : item.priority === 'High'
                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                    }`}>
                      {item.priority}
                    </span>

                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-300">
                      {item.category}
                    </span>

                    <span className="text-[11px] text-stone-400">
                      Target: <strong className="text-stone-600 dark:text-stone-300">{item.audience}</strong>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900 dark:text-white">
                    {item.title}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleTogglePin(item.id)}
                    className={`p-1.5 rounded-lg transition ${item.isPinned ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/20' : 'text-stone-400 hover:text-stone-600'}`}
                    title={item.isPinned ? "Unpin notice" : "Pin notice"}
                  >
                    <Pin size={16} className={item.isPinned ? "fill-current" : ""} />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-400 hover:text-stone-600 transition"
                    title="Edit Notice"
                  >
                    <Edit3 size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-stone-400 hover:text-red-600 transition"
                    title="Delete Notice"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <p className="text-xs text-stone-700 dark:text-stone-200 leading-relaxed">
                {item.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-stone-200/50 dark:border-white/5 text-[11px] text-stone-400">
                <div className="flex items-center gap-3">
                  <span>Author: <strong className="text-stone-600 dark:text-stone-300">{item.author}</strong></span>
                  <span>•</span>
                  <span>Published: {item.publishedAt}</span>
                </div>

                <div className="flex items-center gap-1 text-stone-400">
                  <Eye size={12} />
                  <span>{item.viewsCount} views</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl glass border border-stone-200/80 dark:border-white/10 p-6 shadow-2xl bg-white dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Megaphone size={18} className="text-brand-500" />
                <span>{editingItem ? "Edit Announcement" : "Create New Announcement"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Term 2 Examination Timetable Notice"
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  >
                    <option value="Academic" className="dark:bg-stone-900">Academic</option>
                    <option value="Event" className="dark:bg-stone-900">Event</option>
                    <option value="Emergency" className="dark:bg-stone-900">Emergency</option>
                    <option value="General" className="dark:bg-stone-900">General</option>
                    <option value="Maintenance" className="dark:bg-stone-900">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  >
                    <option value="Normal" className="dark:bg-stone-900">Normal</option>
                    <option value="High" className="dark:bg-stone-900">High</option>
                    <option value="Urgent" className="dark:bg-stone-900">Urgent</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Audience
                  </label>
                  <select
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  >
                    <option value="All" className="dark:bg-stone-900">All Community</option>
                    <option value="Teachers" className="dark:bg-stone-900">Teachers</option>
                    <option value="Parents" className="dark:bg-stone-900">Parents</option>
                    <option value="Students" className="dark:bg-stone-900">Students</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Bulletin Content *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Official announcement description and directions..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPinned}
                    onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                    className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">Pin to top of board</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.sendBroadcast}
                    onChange={(e) => setFormData({ ...formData, sendBroadcast: e.target.checked })}
                    className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">Broadcast email notification</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20"
                >
                  {editingItem ? "Save Changes" : "Publish Announcement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
