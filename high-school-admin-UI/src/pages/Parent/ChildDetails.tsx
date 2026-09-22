// src/pages/Parent/ChildDetails.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, Award, Download, MessageSquare,
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

/* Neumorphic hairline seams.
   - SEAM_B / SEAM_T: single-edge divider (bottom / top)
   - SEAM_X:          inset verticals — used on middle cells of a 3-up
                      stat row to draw left & right seams without adding
                      layout borders that would clip. */
const SEAM_B = "shadow-[0_1px_0_var(--neu-shadow-dark)]";
const SEAM_T = "shadow-[0_-1px_0_var(--neu-shadow-dark)]";
const SEAM_X =
  "shadow-[inset_1px_0_0_var(--neu-shadow-dark),inset_-1px_0_0_var(--neu-shadow-dark)]";

export default function ChildDetails() {
  const { id } = useParams<{ id: string }>();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<"grades" | "attendance" | "behavior" | "fees">("grades");

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
    { subject: "Advanced Calculus", code: "MATH-401", teacher: "Dr. Sarah Jenkins", quizAvg: "92%", midterm: "95%", finalExam: "Pending", grade: "A", remarks: "Demonstrates exceptional mastery in differential equations and limits." },
    { subject: "Quantum Physics & Mechanics", code: "PHYS-301", teacher: "Prof. Marcus Thorne", quizAvg: "89%", midterm: "91%", finalExam: "Pending", grade: "A-", remarks: "Thorough laboratory reports. Excellent collaboration in team experiments." },
    { subject: "World Literature & Composition", code: "ENG-201", teacher: "Elena Rostova", quizAvg: "86%", midterm: "88%", finalExam: "Pending", grade: "B+", remarks: "Insightful critical essays; continued focus on stylistic structure advised." },
    { subject: "Computer Science - Data Structures", code: "CS-101", teacher: "David Kim", quizAvg: "98%", midterm: "98%", finalExam: "Pending", grade: "A+", remarks: "Outstanding computational logic and software architecture problem solving." },
    { subject: "Modern World History", code: "HIST-202", teacher: "Amina Al-Mansoor", quizAvg: "90%", midterm: "92%", finalExam: "Pending", grade: "A", remarks: "Active participant in seminar discussions and historical source analyses." },
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
      {/* Breadcrumb & return */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/parent/children"
            aria-label="Back to children list"
            className="glass-sm glass-interactive p-2 rounded-xl text-fg-muted hover:text-fg"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-fg">
              {student.name}'s Academic Profile
            </h1>
            <p className="text-xs text-fg-muted">
              {student.classSection} • Roll No: {student.rollNumber} • Class Advisor: {student.classTeacher}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => showToast("Downloading certified digital transcript...", "success")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-semibold"
          >
            <Download size={14} />
            <span>Official Transcript</span>
          </button>
          <Link
            to="/messages"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl theme-button-primary text-xs font-semibold"
          >
            <MessageSquare size={14} />
            <span>Contact Advisor</span>
          </Link>
        </div>
      </div>

      {/* Hero banner */}
      <div className="p-6 rounded-2xl glass-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-fg">{student.name}</h2>
              {/* Grade chip — brand-tinted, matches chips elsewhere */}
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/25">
                {student.gradeLevel}
              </span>
            </div>
            <div className="text-xs text-fg-muted mt-1">
              Emergency: {student.emergencyContact}
            </div>
            <div className="text-xs text-fg-muted/70 mt-0.5">
              Medical: {student.medicalNotes}
            </div>
          </div>
        </div>

        {/* Highlight stats — SEAM_X on the middle cell gives vertical seams */}
        <div className="flex items-center gap-6 text-center">
          <div className="px-3">
            <div className="text-xs text-fg-muted">Term 2 GPA</div>
            <div className="text-xl font-extrabold text-fg mt-0.5">{student.gpa}</div>
            <div className="text-[10px] text-success font-semibold">Top 5% Tier</div>
          </div>

          <div className={`px-3 ${SEAM_X}`}>
            <div className="text-xs text-fg-muted">Attendance</div>
            <div className="text-xl font-extrabold text-success mt-0.5">{student.attendanceRate}%</div>
            <div className="text-[10px] text-fg-muted/70">122 / 125 Days</div>
          </div>

          <div className="px-3">
            <div className="text-xs text-fg-muted">Disciplinary</div>
            <div className="text-xl font-extrabold text-brand-600 dark:text-brand-400 mt-0.5">Clean</div>
            <div className="text-[10px] text-fg-muted/70">Zero Infractions</div>
          </div>
        </div>
      </div>

      {/* Tabs — active segment is a pressed-in brand well */}
      <div className={`flex items-center gap-2 pb-2 overflow-x-auto text-xs font-semibold ${SEAM_B}`}>
        {[
          { id: "grades", label: "Academic Grades & Marks" },
          { id: "attendance", label: "Attendance Record" },
          { id: "behavior", label: "Commendations & Awards" },
          { id: "fees", label: "Tuition & Fee Ledger" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition cursor-pointer shrink-0 ${
              activeTab === tab.id
                ? "bg-brand-600 text-white shadow-sunken"
                : "text-fg-muted hover:text-fg hover:shadow-sunken"
            }`}
          >
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab 1: Grades */}
      {activeTab === "grades" && (
        <div className="rounded-2xl glass-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className={`text-[11px] font-semibold text-fg-muted uppercase tracking-wider ${SEAM_B}`}>
                  <th className="py-3.5 px-4">Subject &amp; Instructor</th>
                  <th className="py-3.5 px-4 text-center">Quiz Avg</th>
                  <th className="py-3.5 px-4 text-center">Midterm Exam</th>
                  <th className="py-3.5 px-4 text-center">Letter Grade</th>
                  <th className="py-3.5 px-4">Instructor Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--neu-shadow-dark) text-fg">
                {subjectGrades.map((sub, i) => (
                  <tr key={i} className="hover:shadow-sunken transition-shadow">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-fg">{sub.subject}</div>
                      <div className="text-[11px] text-fg-muted/70">{sub.code} • {sub.teacher}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center font-mono">{sub.quizAvg}</td>
                    <td className="py-3.5 px-4 text-center font-mono font-semibold">{sub.midterm}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-block px-2.5 py-0.5 rounded-lg bg-success/15 text-success font-extrabold text-sm">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 max-w-xs text-fg-muted text-[11px]">
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
          <div className="p-4 rounded-2xl glass-sm flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-fg">Recent Attendance Sessions</span>
              <p className="text-fg-muted">Official registry taken at 08:30 AM homeroom daily.</p>
            </div>
            <Link
              to="/students/leave-requests"
              className="px-3.5 py-1.5 rounded-xl theme-button-primary font-semibold"
            >
              Submit Excuse Slip
            </Link>
          </div>

          <div className="rounded-2xl glass-sm overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`text-[11px] font-semibold text-fg-muted uppercase tracking-wider ${SEAM_B}`}>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Homeroom Arrival</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Period Log Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-(--neu-shadow-dark) text-fg">
                {attendanceLog.map((log, i) => (
                  <tr key={i} className="hover:shadow-sunken transition-shadow">
                    <td className="py-3 px-4 font-semibold text-fg">{log.date}</td>
                    <td className="py-3 px-4 font-mono">{log.arrival}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          log.status === "Present"
                            ? "bg-success/15 text-success"
                            : "bg-warning/15 text-warning"
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-fg-muted">{log.periods}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Awards */}
      {activeTab === "behavior" && (
        <div className="space-y-3">
          {awards.map((aw, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl glass-sm flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-xl bg-warning/15 text-warning shrink-0 shadow-sunken">
                <Award size={20} />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-fg text-sm">{aw.title}</h3>
                  <span className="text-[10px] font-mono text-fg-muted/70">{aw.date}</span>
                </div>
                <p className="text-fg-muted mt-1">{aw.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Fees */}
      {activeTab === "fees" && (
        <div className="rounded-2xl glass-sm overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`text-[11px] font-semibold text-fg-muted uppercase tracking-wider ${SEAM_B}`}>
                <th className="py-3.5 px-4">Invoice #</th>
                <th className="py-3.5 px-4">Description</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--neu-shadow-dark) text-fg">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:shadow-sunken transition-shadow">
                  <td className="py-3.5 px-4 font-mono font-semibold text-fg">{inv.id}</td>
                  <td className="py-3.5 px-4 font-medium">{inv.term}</td>
                  <td className="py-3.5 px-4 font-bold text-fg">{inv.amount}</td>
                  <td className="py-3.5 px-4 text-fg-muted">{inv.dueDate}</td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-success/15 text-success">
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