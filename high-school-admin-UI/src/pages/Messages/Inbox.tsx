import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { 
  Inbox as InboxIcon, 
  Send, 
  Star, 
  Trash2, 
  Search, 
  Plus, 
  Users, 
  Mail, 
  Paperclip, 
  CheckCheck, 
  Clock, 
  X, 
  Filter, 
  Sparkles,
  Archive
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

export interface MessageThread {
  id: string;
  senderName: string;
  senderRole: "Teacher" | "Parent" | "Student" | "Admin";
  senderAvatar: string;
  subject: string;
  preview: string;
  timestamp: string;
  unread: boolean;
  starred: boolean;
  hasAttachment: boolean;
  folder: "inbox" | "sent" | "archive";
  recipientName?: string;
}

export const INITIAL_THREADS: MessageThread[] = [
  {
    id: "msg-1",
    senderName: "Dr. Sarah Jenkins",
    senderRole: "Teacher",
    senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    subject: "Midterm Grade Moderation & Marking Rubric",
    preview: "Hello team, I have uploaded the revised grading criteria for Calculus and Statistics. Please review before Friday...",
    timestamp: "10:24 AM",
    unread: true,
    starred: true,
    hasAttachment: true,
    folder: "inbox",
  },
  {
    id: "msg-2",
    senderName: "Helen Vance",
    senderRole: "Parent",
    senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    subject: "Lucas Vance - Medical Absence Confirmation & Work",
    preview: "Good morning, attached is the doctor's slip regarding Lucas's viral recovery. Could his teachers send homework over portal?",
    timestamp: "Yesterday",
    unread: true,
    starred: false,
    hasAttachment: true,
    folder: "inbox",
  },
  {
    id: "msg-3",
    senderName: "Prof. Marcus Thorne",
    senderRole: "Teacher",
    senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    subject: "Science Lab Equipment Requisition Approval",
    preview: "We have finalized our quote for the new digital spectrometers for Physics Lab 2. Purchase orders attached.",
    timestamp: "Mar 02",
    unread: false,
    starred: true,
    hasAttachment: true,
    folder: "inbox",
  },
  {
    id: "msg-4",
    senderName: "Chloe Dupont",
    senderRole: "Student",
    senderAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    subject: "Robotics Olympiad Travel Schedule Clearance",
    preview: "Dear Administration, our club advisor asked us to submit the finalized bus travel itinerary and parent slips...",
    timestamp: "Feb 28",
    unread: false,
    starred: false,
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: "msg-5",
    senderName: "Robert Miller",
    senderRole: "Parent",
    senderAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    subject: "Tuition Invoice Payment Confirmation",
    preview: "Thank you for the update. We have transferred the term fee installment via direct bank remittance.",
    timestamp: "Feb 26",
    unread: false,
    starred: false,
    hasAttachment: false,
    folder: "inbox",
  },
  {
    id: "msg-6",
    senderName: "School Administration",
    senderRole: "Admin",
    senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    subject: "Sent: Upcoming Emergency Evacuation Drill Briefing",
    preview: "This notice outlines the evacuation protocol scheduled for next Wednesday at 11:15 AM.",
    timestamp: "Feb 24",
    unread: false,
    starred: false,
    hasAttachment: true,
    folder: "sent",
    recipientName: "All Faculty & Students",
  },
];

export default function Inbox() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [threads, setThreads] = useState<MessageThread[]>(INITIAL_THREADS);
  const [activeFolder, setActiveFolder] = useState<"inbox" | "unread" | "starred" | "teachers" | "parents" | "sent">("inbox");
  const [searchTerm, setSearchTerm] = useState("");
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  // Compose State
  const [composeTo, setComposeTo] = useState("");
  const [composeRole, setComposeRole] = useState<"Teacher" | "Parent" | "Student">("Teacher");
  const [composeSubject, setComposeSubject] = useState("");
  const [composeBody, setComposeBody] = useState("");

  const toggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => t.id === id ? { ...t, starred: !t.starred } : t));
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => prev.map(t => t.id === id ? { ...t, unread: false } : t));
    showToast("Message marked as read", "info");
  };

  const deleteThread = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setThreads(prev => prev.filter(t => t.id !== id));
    showToast("Conversation deleted", "info");
  };

  const filteredThreads = threads.filter((t) => {
    const matchesSearch =
      t.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.preview.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (activeFolder === "inbox") return t.folder === "inbox";
    if (activeFolder === "unread") return t.unread && t.folder === "inbox";
    if (activeFolder === "starred") return t.starred;
    if (activeFolder === "teachers") return t.senderRole === "Teacher" && t.folder === "inbox";
    if (activeFolder === "parents") return t.senderRole === "Parent" && t.folder === "inbox";
    if (activeFolder === "sent") return t.folder === "sent";
    return true;
  });

  const totalUnread = threads.filter(t => t.unread && t.folder === "inbox").length;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeTo || !composeSubject || !composeBody) {
      showToast("Please fill all required fields", "error");
      return;
    }

    const newMsg: MessageThread = {
      id: `msg-${Date.now()}`,
      senderName: "School Administration",
      senderRole: "Admin",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      recipientName: composeTo,
      subject: composeSubject,
      preview: composeBody,
      timestamp: "Just now",
      unread: false,
      starred: false,
      hasAttachment: false,
      folder: "sent",
    };

    setThreads([newMsg, ...threads]);
    setIsComposeOpen(false);
    setComposeTo("");
    setComposeSubject("");
    setComposeBody("");
    showToast("Message dispatched successfully", "success");
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Communications Inbox"
          subtitle="Direct messaging channel between staff, educators, parents, and student representatives."
        />
        <button
          onClick={() => setIsComposeOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Compose Message</span>
        </button>
      </div>

      {/* Main Container */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 p-4 shadow-sm min-h-[580px]">
        {/* Sidebar Folders */}
        <div className="md:col-span-3 space-y-1.5 border-b md:border-b-0 md:border-r border-stone-200/70 dark:border-white/10 pb-4 md:pb-0 md:pr-4">
          <button
            onClick={() => setActiveFolder("inbox")}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeFolder === "inbox"
                ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <InboxIcon size={16} />
              <span>All Received</span>
            </div>
            {totalUnread > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeFolder === 'inbox' ? 'bg-brand-500 text-white' : 'bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-300'
              }`}>
                {totalUnread}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveFolder("unread")}
            className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeFolder === "unread"
                ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail size={16} />
              <span>Unread</span>
            </div>
            {totalUnread > 0 && (
              <span className="text-[11px] font-bold text-amber-500">{totalUnread}</span>
            )}
          </button>

          <button
            onClick={() => setActiveFolder("starred")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeFolder === "starred"
                ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
            }`}
          >
            <Star size={16} />
            <span>Starred</span>
          </button>

          <div className="pt-3 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            By Role
          </div>

          <button
            onClick={() => setActiveFolder("teachers")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeFolder === "teachers"
                ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
            }`}
          >
            <Users size={16} />
            <span>Teachers & Faculty</span>
          </button>

          <button
            onClick={() => setActiveFolder("parents")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeFolder === "parents"
                ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
            }`}
          >
            <Users size={16} />
            <span>Parents</span>
          </button>

          <div className="pt-3 pb-1 px-3 text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Outbox
          </div>

          <button
            onClick={() => setActiveFolder("sent")}
            className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeFolder === "sent"
                ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
            }`}
          >
            <Send size={16} />
            <span>Sent Messages</span>
          </button>
        </div>

        {/* Message List Pane */}
        <div className="md:col-span-9 space-y-3 flex flex-col justify-between">
          <div>
            {/* Search within messages */}
            <div className="relative mb-3">
              <Search size={16} className="absolute left-3.5 top-2.5 text-stone-400" />
              <input
                type="text"
                placeholder="Search messages by sender, subject, keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-100 dark:bg-white/5 text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>

            {/* List */}
            <div className="divide-y divide-stone-200/50 dark:divide-white/5 border border-stone-200/50 dark:border-white/5 rounded-2xl overflow-hidden bg-white/40 dark:bg-stone-950/20">
              {filteredThreads.length === 0 ? (
                <div className="p-12 text-center text-stone-400 text-xs">
                  No messages in this folder or search result.
                </div>
              ) : (
                filteredThreads.map((thread) => (
                  <div
                    key={thread.id}
                    onClick={() => navigate(`/messages/${thread.id}`)}
                    className={`flex items-start sm:items-center justify-between p-3.5 gap-3 transition cursor-pointer hover:bg-stone-500/5 ${
                      thread.unread ? "bg-brand-500/[0.03] font-semibold" : ""
                    }`}
                  >
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={(e) => toggleStar(thread.id, e)}
                        className={`p-1 rounded-lg transition ${
                          thread.starred ? "text-amber-500 fill-amber-500" : "text-stone-300 hover:text-stone-500"
                        }`}
                      >
                        <Star size={16} className={thread.starred ? "fill-amber-500" : ""} />
                      </button>

                      <img
                        src={thread.senderAvatar}
                        alt={thread.senderName}
                        className="w-9 h-9 rounded-full object-cover shrink-0 border border-stone-200 dark:border-white/10"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-stone-900 dark:text-white font-bold truncate">
                            {thread.folder === "sent" ? `To: ${thread.recipientName}` : thread.senderName}
                          </span>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300">
                            {thread.senderRole}
                          </span>
                          {thread.unread && (
                            <span className="w-2 h-2 rounded-full bg-brand-500 shrink-0" />
                          )}
                        </div>

                        <div className="text-xs text-stone-800 dark:text-stone-200 font-medium truncate mt-0.5">
                          {thread.subject}
                        </div>
                        <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                          {thread.preview}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start sm:self-center">
                      {thread.hasAttachment && (
                        <Paperclip size={14} className="text-stone-400" />
                      )}
                      <span className="text-[11px] text-stone-400 whitespace-nowrap">
                        {thread.timestamp}
                      </span>
                      <button
                        onClick={(e) => deleteThread(thread.id, e)}
                        className="p-1 rounded text-stone-300 hover:text-red-500 transition"
                        title="Delete conversation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Compose Modal */}
      {isComposeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl glass border border-stone-200/80 dark:border-white/10 p-6 shadow-2xl bg-white dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Send size={16} className="text-brand-500" />
                <span>Compose New Message</span>
              </h3>
              <button
                onClick={() => setIsComposeOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSend} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Recipient Name / Email *
                  </label>
                  <input
                    type="text"
                    required
                    value={composeTo}
                    onChange={(e) => setComposeTo(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Role Category
                  </label>
                  <select
                    value={composeRole}
                    onChange={(e) => setComposeRole(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  >
                    <option value="Teacher" className="dark:bg-stone-900">Teacher</option>
                    <option value="Parent" className="dark:bg-stone-900">Parent</option>
                    <option value="Student" className="dark:bg-stone-900">Student</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={composeSubject}
                  onChange={(e) => setComposeSubject(e.target.value)}
                  placeholder="Subject of message..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Message Content *
                </label>
                <textarea
                  rows={5}
                  required
                  value={composeBody}
                  onChange={(e) => setComposeBody(e.target.value)}
                  placeholder="Type your communication here..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => showToast("File attachment dialog", "info")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
                >
                  <Paperclip size={14} />
                  <span>Attach Document</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsComposeOpen(false)}
                    className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20"
                  >
                    <Send size={14} />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
