import { useState, useRef, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Send, 
  Paperclip, 
  MoreVertical, 
  Star, 
  Trash2, 
  FileText, 
  Download, 
  Check, 
  CheckCheck,
  User,
  Phone,
  Mail,
  Clock
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface MessageItem {
  id: string;
  senderId: string; // 'me' or 'other'
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

export default function Conversation() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Participant info (mocked based on ID or default)
  const participant = {
    name: "Dr. Sarah Jenkins",
    role: "Department Chair - Mathematics",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    email: "sarah.jenkins@oakridge.edu",
    phone: "+1 (555) 234-8901",
    status: "Online",
    subject: "Midterm Grade Moderation & Marking Rubric",
  };

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "m-1",
      senderId: "other",
      text: "Good morning! I have finalized the moderation guidelines and grading scheme for the Term 2 Calculus and Statistics exams.",
      timestamp: "09:42 AM",
    },
    {
      id: "m-2",
      senderId: "other",
      text: "Could you review the attached rubric to ensure it aligns with the state board accreditation standards?",
      timestamp: "09:43 AM",
      attachment: {
        name: "Term2_Calculus_Rubric_v2.pdf",
        size: "1.4 MB",
        type: "pdf",
      },
    },
    {
      id: "m-3",
      senderId: "me",
      text: "Thank you Dr. Jenkins. I've taken a quick glance; the breakdown between theoretical proofs and computational questions is very well balanced.",
      timestamp: "10:15 AM",
    },
    {
      id: "m-4",
      senderId: "other",
      text: "Excellent! When should I distribute the physical papers to the assigned examination proctors?",
      timestamp: "10:24 AM",
    },
  ]);

  const [replyText, setReplyText] = useState("");

  const quickReplies = [
    "Papers can be collected from Room 102 by 8:00 AM.",
    "Approved! Please proceed with distribution.",
    "Let's schedule a brief 10-minute briefing.",
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;

    const newMsg: MessageItem = {
      id: `m-${Date.now()}`,
      senderId: "me",
      text: replyText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, newMsg]);
    setReplyText("");
    showToast("Reply sent", "success");
  };

  const handleQuickReply = (text: string) => {
    setReplyText(text);
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto flex flex-col h-[calc(100vh-140px)] min-h-[580px]">
      {/* Top Participant Header */}
      <div className="flex items-center justify-between p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 bg-white/40 dark:bg-stone-900/40">
        <div className="flex items-center gap-3">
          <Link
            to="/messages"
            className="p-2 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div className="relative">
            <img
              src={participant.avatar}
              alt={participant.name}
              className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-white/10"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-stone-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-stone-900 dark:text-white">
                {participant.name}
              </h2>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
                {participant.status}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {participant.role} • {participant.subject}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <a
            href={`mailto:${participant.email}`}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
            title="Send Email"
          >
            <Mail size={16} />
          </a>
          <button
            onClick={() => showToast("Conversation archived", "info")}
            className="p-2 rounded-xl hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
            title="Archive"
          >
            <Star size={16} />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 bg-white/30 dark:bg-stone-950/20 space-y-4">
        {messages.map((m) => {
          const isMe = m.senderId === "me";
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
            >
              <div
                className={`max-w-[78%] sm:max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-sm ${
                  isMe
                    ? "bg-brand-600 text-white rounded-br-none"
                    : "bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-200/60 dark:border-white/5 rounded-bl-none"
                }`}
              >
                <p>{m.text}</p>

                {m.attachment && (
                  <div className={`mt-2.5 flex items-center justify-between p-2.5 rounded-xl border ${
                    isMe
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-white/10 text-stone-900 dark:text-white"
                  }`}>
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-brand-400" />
                      <div>
                        <div className="font-semibold text-[11px] truncate max-w-[180px]">
                          {m.attachment.name}
                        </div>
                        <div className="text-[10px] opacity-75">{m.attachment.size}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => showToast(`Downloaded ${m.attachment?.name}`, "success")}
                      className="p-1 rounded hover:bg-black/10 transition"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                )}
              </div>

              <span className="text-[10px] text-stone-400 mt-1 px-1 flex items-center gap-1">
                {m.timestamp}
                {isMe && <CheckCheck size={12} className="text-brand-500" />}
              </span>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Reply Prompts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider shrink-0">
          Suggested:
        </span>
        {quickReplies.map((qr, i) => (
          <button
            key={i}
            onClick={() => handleQuickReply(qr)}
            className="px-3 py-1 rounded-xl glass-sm border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:border-brand-500 hover:text-brand-600 whitespace-nowrap transition cursor-pointer text-[11px]"
          >
            {qr}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSend} className="p-2.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 bg-white dark:bg-stone-900 flex items-center gap-2">
        <button
          type="button"
          onClick={() => showToast("Upload attachment dialog", "info")}
          className="p-2 rounded-xl text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-white/5 transition"
          title="Attach file"
        >
          <Paperclip size={18} />
        </button>

        <input
          type="text"
          value={replyText}
          onChange={(e) => setReplyText(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 bg-transparent text-xs text-stone-900 dark:text-white placeholder-stone-400 focus:outline-none px-2"
        />

        <button
          type="submit"
          disabled={!replyText.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
        >
          <span>Send</span>
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
