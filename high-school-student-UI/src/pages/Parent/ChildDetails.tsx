import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  GraduationCap, 
  Award, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  FileText, 
  MessageSquare, 
  Download, 
  CreditCard, 
  AlertCircle,
  BookOpen,
  UserCheck,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

export default function ChildDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"grades" | "attendance" | "behavior" | "fees">("grades");

  // Mock Student Profile
  const student = {
    id: id || "child-1",
    name: "Lucas Vance",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    rollNumber: "STD-2025-041",
    gradeLevel: "Grade 11",
    classSection: "Grade 11A",
    academicYear: "2025 - 2026",
    term: "Term 2",
    gpa: 3.84,
    attendanceRate: 96.8,
    classTeacher: "Dr. Sarah Jenkins",
    emergencyContact: "Helen Vance (Mother) - +1 (555) 345-6789",
    medicalNotes: "No chronic conditions. Wears corrective lenses.",
  };

  const subjectGrades = [
    {
      subject: "Advanced Calculus",
      code: "MATH-401",
      teacher: "Dr. Sarah Jenkins",
      quizAvg: "92%",
      midterm: "95%",
      finalExam: "Pending",
      grade: "A",
      remarks: "Demonstrates exceptional mastery in differential equations and limits.",
    },
    {
      subject: "Quantum Physics & Mechanics",
      code: "PHYS-301",
      teacher: "Prof. Marcus Thorne",
      quizAvg: "89%",
      midterm: "91%",
      finalExam: "Pending",
      grade: "A-",
      remarks: "Thorough laboratory reports. Excellent collaboration in team experiments.",
    },
    {
      subject: "World Literature & Composition",
      code: "ENG-201",
      teacher: "Elena Rostova",
      quizAvg: "86%",
      midterm: "88%",
      finalExam: "Pending",
      grade: "B+",
      remarks: "Insightful critical essays; continued focus on stylistic structure advised.",
    },
    {
      subject: "Computer Science - Data Structures",
      code: "CS-101",
      teacher: "David Kim",
      quizAvg: "98%",
      midterm: "98%",
      finalExam: "Pending",
      grade: "A+",
      remarks: "Outstanding computational logic and software architecture problem solving.",
    },
    {
      subject: "Modern World History",
      code: "HIST-202",
      teacher: "Amina Al-Mansoor",
      quizAvg: "90%",
      midterm: "92%",
      finalExam: "Pending",
      grade: "A",
      remarks: "Active participant in seminar discussions and historical source analyses.",
    },
  ];

  const attendanceLog = [
    { date: "2026-03-04", status: "Present", arrival: "08:15 AM", periods: "6/6 attended" },
    { date: "2026-03-03", status: "Present", arrival: "08:20 AM", periods: "6/6 attended" },
    { date: "2026-03-02", status: "Excused Absence", arrival: "—", periods: "Doctor's Appointment (Slip Verified)" },
    { date: "2026-02-27", status: "Present", arrival: "08:10 AM", periods: "6/6 attended" },
    { date: "2026-02-26", status: "Present", arrival: "08:18 AM", periods: "6/6 attended" },
  ];

  const awards = [
    { title: "Honor Roll - High Honors", date: "Term 1, 2025", desc: "Awarded for achieving cumulative term GPA above 3.80." },
    { title: "1st Place - Regional STEM Expo", date: "December 2025", desc: "Autonomous solar navigation rover model exhibition." },
    { title: "Outstanding Citizenship Commendation", date: "November 2025", desc: "Peer tutoring in peer mathematics clinic." },
  ];

  const invoices = [
    { id: "INV-2026-004", term: "Term 2 Tuition Fee", amount: "$3,450.00", dueDate: "2026-01-15", paidDate: "2026-01-12", status: "Paid" },
    { id: "INV-2025-089", term: "Lab & Tech Fee", amount: "$450.00", dueDate: "2025-09-10", paidDate: "2025-09-08", status: "Paid" },
    { id: "INV-2025-001", term: "Term 1 Tuition Fee", amount: "$3,450.00", dueDate: "2025-08-15", paidDate: "2025-08-10", status: "Paid" },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Breadcrumb & Return */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/parent/children"
            className="p-2 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">
              {student.name}'s Academic Profile
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              {student.classSection} • Roll No: {student.rollNumber} • Class Advisor: {student.classTeacher}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => showToast("Downloading certified digital transcript...", "success")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-white/5 transition"
          >
            <Download size={14} />
            <span>Official Transcript</span>
          </button>
          <Link
            to="/messages"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition"
          >
            <MessageSquare size={14} />
            <span>Contact Advisor</span>
          </Link>
        </div>
      </div>

      {/* Hero Student Banner */}
      <div className="p-6 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 bg-white/40 dark:bg-stone-900/40 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-500/30 shadow-md"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                {student.name}
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-200/50">
                {student.gradeLevel}
              </span>
            </div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              Emergency: {student.emergencyContact}
            </div>
            <div className="text-xs text-stone-400 mt-0.5">
              Medical: {student.medicalNotes}
            </div>
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="flex items-center gap-6 divide-x divide-stone-200 dark:divide-white/10 text-center">
          <div className="px-3">
            <div className="text-xs text-stone-400">Term 2 GPA</div>
            <div className="text-xl font-extrabold text-stone-900 dark:text-white mt-0.5">{student.gpa}</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Top 5% Tier</div>
          </div>

          <div className="px-3">
            <div className="text-xs text-stone-400">Attendance</div>
            <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">{student.attendanceRate}%</div>
            <div className="text-[10px] text-stone-400">122 / 125 Days</div>
          </div>

          <div className="px-3">
            <div className="text-xs text-stone-400">Disciplinary</div>
            <div className="text-xl font-extrabold text-brand-600 dark:text-brand-400 mt-0.5">Clean</div>
            <div className="text-[10px] text-stone-400">Zero Infractions</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200/70 dark:border-white/10 pb-2 overflow-x-auto text-xs font-semibold">
        {[
          { id: "grades", label: "Academic Grades & Marks", icon: BookOpen },
          { id: "attendance", label: "Attendance Record", icon: UserCheck },
          { id: "behavior", label: "Commendations & Awards", icon: Award },
          { id: "fees", label: "Tuition & Fee Ledger", icon: CreditCard },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5"
            }`}
          >
            <tab.icon size={15} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Grades & Marks */}
      {activeTab === "grades" && (
        <div className="rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200/70 dark:border-white/10 bg-stone-50/50 dark:bg-white/[0.02] text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Subject & Instructor</th>
                  <th className="py-3.5 px-4 text-center">Quiz Avg</th>
                  <th className="py-3.5 px-4 text-center">Midterm Exam</th>
                  <th className="py-3.5 px-4 text-center">Letter Grade</th>
                  <th className="py-3.5 px-4">Instructor Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/50 dark:divide-white/5 text-stone-700 dark:text-stone-200">
                {subjectGrades.map((sub, i) => (
                  <tr key={i} className="hover:bg-stone-500/5">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900 dark:text-white">{sub.subject}</div>
                      <div className="text-[11px] text-stone-400">{sub.code} • {sub.teacher}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{sub.quizAvg}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">{sub.midterm}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-extrabold text-sm">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-stone-600 dark:text-stone-300 text-[11px]">
                      {sub.remarks}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Attendance */}
      {activeTab === "attendance" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-stone-900 dark:text-white">Recent Attendance Sessions</span>
              <p className="text-stone-500">Official registry taken at 08:30 AM homeroom daily.</p>
            </div>
            <Link
              to="/students/leave-requests"
              className="px-3.5 py-1.5 rounded-xl bg-brand-600 text-white font-semibold shadow-sm hover:bg-brand-700 transition"
            >
              Submit Excuse Slip
            </Link>
          </div>

          <div className="rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200/70 dark:border-white/10 bg-stone-50/50 dark:bg-white/[0.02] text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Homeroom Arrival</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Period Log Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/50 dark:divide-white/5 text-stone-700 dark:text-stone-200">
                {attendanceLog.map((log, i) => (
                  <tr key={i} className="hover:bg-stone-500/5">
                    <td className="py-3 px-4 font-semibold text-stone-900 dark:text-white">{log.date}</td>
                    <td className="py-3 px-4 font-mono">{log.arrival}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        log.status === "Present"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500">{log.periods}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Behavior & Awards */}
      {activeTab === "behavior" && (
        <div className="space-y-3">
          {awards.map((aw, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-start gap-3.5 bg-white/40 dark:bg-stone-900/40"
            >
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
                <Award size={20} />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900 dark:text-white text-sm">{aw.title}</h3>
                  <span className="text-[10px] font-mono text-stone-400">{aw.date}</span>
                </div>
                <p className="text-stone-600 dark:text-stone-300 mt-1">{aw.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Tuition & Billing */}
      {activeTab === "fees" && (
        <div className="rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200/70 dark:border-white/10 bg-stone-50/50 dark:bg-white/[0.02] text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50 dark:divide-white/5 text-stone-700 dark:text-stone-200">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-stone-500/5">
                  <td className="py-3.5 px-4 font-mono font-semibold text-stone-900 dark:text-white">{inv.id}</td>
                  <td className="py-3.5 px-4 font-medium">{inv.term}</td>
                  <td className="py-3.5 px-4 font-bold text-stone-900 dark:text-white">{inv.amount}</td>
                  <td className="py-3.5 px-4 text-stone-500">{inv.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => showToast(`Receipt for ${inv.id} downloaded`, "success")}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      <Download size={13} />
                      <span>PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
