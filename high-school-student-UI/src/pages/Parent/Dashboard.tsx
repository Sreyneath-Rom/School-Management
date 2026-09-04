import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { 
  GraduationCap, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Bell, 
  ArrowRight,
  UserCheck,
  AlertCircle,
  BookOpen,
  Award
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface ChildSummary {
  id: string;
  name: string;
  avatar: string;
  grade: string;
  rollNumber: string;
  gpa: number;
  attendancePct: number;
  classTeacher: string;
  pendingTasks: number;
  feeStatus: "Paid" | "Due";
}

const CHILDREN: ChildSummary[] = [
  {
    id: "child-1",
    name: "Lucas Vance",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    grade: "Grade 11A",
    rollNumber: "STD-2025-041",
    gpa: 3.84,
    attendancePct: 96.8,
    classTeacher: "Dr. Sarah Jenkins",
    pendingTasks: 3,
    feeStatus: "Paid",
  },
  {
    id: "child-2",
    name: "Maya Vance",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    grade: "Grade 9B",
    rollNumber: "STD-2025-092",
    gpa: 3.92,
    attendancePct: 98.2,
    classTeacher: "Elena Rostova",
    pendingTasks: 1,
    feeStatus: "Paid",
  },
];

export default function ParentDashboard() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [selectedChildId, setSelectedChildId] = useState(CHILDREN[0].id);

  const activeChild = CHILDREN.find(c => c.id === selectedChildId) || CHILDREN[0];

  return (
    <div className="space-y-6">
      {/* Top Banner & Child Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <PageHeading
            title="Parent Overview Portal"
            subtitle="Track real-time academic progress, daily attendance, grade reports, and school notices for your children."
          />
        </div>

        {/* Ward Selector Chips */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 self-start sm:self-auto bg-stone-100/50 dark:bg-white/5">
          {CHILDREN.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChildId(child.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                selectedChildId === child.id
                  ? "bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-white"
              }`}
            >
              <img
                src={child.avatar}
                alt={child.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{child.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick Metrics of Active Child */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Award size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{activeChild.gpa} <span className="text-xs text-stone-400 font-normal">/ 4.0</span></div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Term 2 GPA (Top 5%)</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <UserCheck size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{activeChild.attendancePct}%</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Attendance Rate</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{activeChild.pendingTasks} Tasks</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Due This Week</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CreditCard size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">Up to Date</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">School Tuition Fees</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Subjects & Upcoming Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Academic Performance & Recent Subjects */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <BookOpen size={16} className="text-brand-500" />
                  <span>Subject Performance & Coursework</span>
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Current semester grades and teacher evaluations for {activeChild.name}.
                </p>
              </div>

              <Link
                to={`/parent/children/${activeChild.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <span>Full Transcript</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { subject: "Advanced Calculus", code: "MATH-401", grade: "A", score: "94%", teacher: "Dr. Sarah Jenkins", status: "Ahead of Pace" },
                { subject: "Physics & Mechanics", code: "PHYS-301", grade: "A-", score: "91%", teacher: "Prof. Marcus Thorne", status: "Lab Project Submitted" },
                { subject: "World Literature", code: "ENG-201", grade: "B+", score: "88%", teacher: "Elena Rostova", status: "Essay Pending Review" },
                { subject: "Computer Science", code: "CS-101", grade: "A+", score: "98%", teacher: "David Kim", status: "Top Score in Class" },
              ].map((sub, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl border border-stone-200/50 dark:border-white/5 bg-stone-50/50 dark:bg-white/[0.02] flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-stone-900 dark:text-white">{sub.subject}</div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">{sub.teacher}</div>
                    <div className="text-[10px] text-brand-600 dark:text-brand-400 mt-1 font-medium">{sub.status}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-extrabold text-stone-900 dark:text-white">{sub.grade}</div>
                    <div className="text-[11px] text-stone-400 font-mono">{sub.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Today's Schedule Card */}
          <div className="p-5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Calendar size={16} className="text-brand-500" />
              <span>Today's Class Timetable</span>
            </h3>

            <div className="space-y-2 text-xs">
              {[
                { time: "08:30 - 09:45 AM", subject: "Advanced Calculus", room: "Room 302", teacher: "Dr. Jenkins", active: false },
                { time: "10:00 - 11:15 AM", subject: "Quantum Physics Lab", room: "Science Lab B", teacher: "Prof. Thorne", active: true },
                { time: "11:30 - 12:45 PM", subject: "World Literature", room: "Room 105", teacher: "Elena Rostova", active: false },
                { time: "01:45 - 03:00 PM", subject: "Robotics Club", room: "Makerspace", teacher: "David Kim", active: false },
              ].map((period, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-xl border transition flex items-center justify-between ${
                    period.active
                      ? "border-brand-500/40 bg-brand-50/40 dark:bg-brand-900/10 text-stone-900 dark:text-white"
                      : "border-stone-200/50 dark:border-white/5 bg-stone-50/30 dark:bg-white/[0.01] text-stone-700 dark:text-stone-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-stone-500 dark:text-stone-400 min-w-[110px]">
                      {period.time}
                    </span>
                    <div>
                      <div className="font-semibold text-stone-900 dark:text-white">{period.subject}</div>
                      <div className="text-[11px] text-stone-400">{period.room} • {period.teacher}</div>
                    </div>
                  </div>

                  {period.active && (
                    <span className="px-2 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold">
                      Happening Now
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Quick Parent Actions & Alerts */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Panel */}
          <div className="p-5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 space-y-3">
            <h3 className="text-sm font-bold text-stone-900 dark:text-white">
              Parent Quick Actions
            </h3>
            
            <div className="space-y-2">
              <Link
                to="/students/leave-requests"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-900/10 border border-stone-200/50 dark:border-white/5 text-xs text-stone-800 dark:text-stone-200 font-semibold transition group"
              >
                <div className="flex items-center gap-2.5">
                  <FileText size={16} className="text-brand-600 dark:text-brand-400" />
                  <span>Submit Absence Request</span>
                </div>
                <ArrowRight size={14} className="text-stone-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <Link
                to="/messages"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-900/10 border border-stone-200/50 dark:border-white/5 text-xs text-stone-800 dark:text-stone-200 font-semibold transition group"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare size={16} className="text-blue-600 dark:text-blue-400" />
                  <span>Message Class Advisor</span>
                </div>
                <ArrowRight size={14} className="text-stone-400 group-hover:translate-x-0.5 transition" />
              </Link>

              <button
                onClick={() => showToast("Certified Term 1 Report Card downloading...", "success")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-900/10 border border-stone-200/50 dark:border-white/5 text-xs text-stone-800 dark:text-stone-200 font-semibold transition group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Award size={16} className="text-purple-600 dark:text-purple-400" />
                  <span>Download Report Card</span>
                </div>
                <ArrowRight size={14} className="text-stone-400 group-hover:translate-x-0.5 transition" />
              </button>

              <Link
                to="/calendar"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 dark:bg-white/5 hover:bg-brand-50 dark:hover:bg-brand-900/10 border border-stone-200/50 dark:border-white/5 text-xs text-stone-800 dark:text-stone-200 font-semibold transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar size={16} className="text-amber-600 dark:text-amber-400" />
                  <span>School Event Calendar</span>
                </div>
                <ArrowRight size={14} className="text-stone-400 group-hover:translate-x-0.5 transition" />
              </Link>
            </div>
          </div>

          {/* School Notice Card */}
          <div className="p-5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 space-y-3 bg-brand-500/[0.02]">
            <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400">
              <Bell size={16} />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                Key Parent Notice
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-white dark:bg-stone-900 border border-stone-200/70 dark:border-white/10 space-y-1.5 text-xs">
              <div className="font-bold text-stone-900 dark:text-white">PTA Advisory Conference</div>
              <p className="text-stone-600 dark:text-stone-300 text-[11px] leading-relaxed">
                Scheduled for Friday, March 6th from 2:00 PM to 6:00 PM in the Main Auditorium. Please confirm your attendance slot.
              </p>
              <div className="text-[10px] text-stone-400 pt-1">Posted by Administration Office</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
