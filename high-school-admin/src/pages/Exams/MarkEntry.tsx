import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  FileSpreadsheet, 
  Save, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Sparkles,
  Award,
  BookOpen
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface StudentMark {
  id: string;
  studentId: string;
  name: string;
  rollNo: string;
  score: number | string;
  maxScore: number;
  grade: string;
  feedback: string;
  status: "Graded" | "Pending" | "Absent";
}

export default function MarkEntry() {
  const { showToast } = useToast();
  const [selectedExam, setSelectedExam] = useState("Midterm Term 2");
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [selectedSubject, setSelectedSubject] = useState("Advanced Biology");
  const [searchTerm, setSearchTerm] = useState("");

  const [marks, setMarks] = useState<StudentMark[]>([
    {
      id: "m-1",
      studentId: "STU-001",
      name: "Ethan Walker",
      rollNo: "10A-01",
      score: 94,
      maxScore: 100,
      grade: "A+",
      feedback: "Exceptional mastery of genetics concepts.",
      status: "Graded",
    },
    {
      id: "m-2",
      studentId: "STU-002",
      name: "Sophia Martinez",
      rollNo: "10A-02",
      score: 88,
      maxScore: 100,
      grade: "A",
      feedback: "Strong analytical lab report writeup.",
      status: "Graded",
    },
    {
      id: "m-3",
      studentId: "STU-003",
      name: "Liam Chen",
      rollNo: "10A-03",
      score: 76,
      maxScore: 100,
      grade: "B",
      feedback: "Needs additional practice in cellular respiration diagrams.",
      status: "Graded",
    },
    {
      id: "m-4",
      studentId: "STU-004",
      name: "Olivia Robinson",
      rollNo: "10A-04",
      score: 92,
      maxScore: 100,
      grade: "A+",
      feedback: "Very thorough answer explanations.",
      status: "Graded",
    },
    {
      id: "m-5",
      studentId: "STU-005",
      name: "Noah Patel",
      rollNo: "10A-05",
      score: "",
      maxScore: 100,
      grade: "-",
      feedback: "",
      status: "Pending",
    },
    {
      id: "m-6",
      studentId: "STU-006",
      name: "Emma Watson",
      rollNo: "10A-06",
      score: "ABS",
      maxScore: 100,
      grade: "ABS",
      feedback: "Excused medical absence. Retest pending.",
      status: "Absent",
    },
  ]);

  const computeGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const handleScoreChange = (id: string, newScoreStr: string) => {
    setMarks((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        if (newScoreStr === "" || newScoreStr.toUpperCase() === "ABS") {
          return {
            ...item,
            score: newScoreStr,
            grade: newScoreStr === "" ? "-" : "ABS",
            status: newScoreStr === "" ? "Pending" : "Absent",
          };
        }
        const numeric = Math.min(Math.max(Number(newScoreStr) || 0, 0), item.maxScore);
        return {
          ...item,
          score: numeric,
          grade: computeGrade(numeric),
          status: "Graded",
        };
      })
    );
  };

  const handleFeedbackChange = (id: string, fb: string) => {
    setMarks((prev) =>
      prev.map((item) => (item.id === id ? { ...item, feedback: fb } : item))
    );
  };

  const handleSaveAll = () => {
    showToast("All student examination marks saved successfully", "success");
  };

  const gradedCount = marks.filter((m) => m.status === "Graded").length;
  const gradedScores = marks
    .filter((m) => typeof m.score === "number")
    .map((m) => m.score as number);
  const averageScore =
    gradedScores.length > 0
      ? (gradedScores.reduce((a, b) => a + b, 0) / gradedScores.length).toFixed(1)
      : "0";

  const filteredMarks = marks.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.rollNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Mark Entry Spreadsheet"
          subtitle="Record and calculate test marks, letter grades, teacher feedback, and exam results."
        />
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => showToast("Exporting marks CSV", "info")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/15 text-stone-700 dark:text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Save size={16} />
            <span>Save Marks</span>
          </button>
        </div>
      </div>

      {/* Selector Filters Header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div>
          <label className="block text-[11px] font-semibold text-stone-500 mb-1">
            Exam Session
          </label>
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Midterm Term 2">Midterm Term 2 (2025 - 2026)</option>
            <option value="Final Term 1">Final Comprehensive Exam Term 1</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-500 mb-1">
            Class & Section
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Grade 10-A">Grade 10-A</option>
            <option value="Grade 10-B">Grade 10-B</option>
            <option value="Grade 11-A">Grade 11-A</option>
            <option value="Grade 12-A">Grade 12-A</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-stone-500 mb-1">
            Subject Paper
          </label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Advanced Biology">Advanced Biology (SCI-301)</option>
            <option value="Calculus BC">Calculus BC (MTH-402)</option>
            <option value="Modern World History">Modern World History (HUM-201)</option>
            <option value="Literature & Composition II">Literature & Composition II (ENG-202)</option>
          </select>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-3.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
          <div className="text-xs text-stone-500 font-medium">Total Students</div>
          <div className="text-xl font-bold text-stone-900 dark:text-white mt-1">
            {marks.length}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
          <div className="text-xs text-stone-500 font-medium">Completed Marks</div>
          <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
            {gradedCount} / {marks.length}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
          <div className="text-xs text-stone-500 font-medium">Class Average</div>
          <div className="text-xl font-bold text-brand-600 dark:text-brand-400 mt-1">
            {averageScore} / 100
          </div>
        </div>
        <div className="p-3.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
          <div className="text-xs text-stone-500 font-medium">Highest Mark</div>
          <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-1">
            {gradedScores.length > 0 ? Math.max(...gradedScores) : 0} pts
          </div>
        </div>
      </div>

      {/* Marks Table */}
      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex items-center gap-3">
          <Search size={16} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search candidate name or roll number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5">Roll No</th>
                <th className="p-3.5">Student Name</th>
                <th className="p-3.5 w-32">Score (Max 100)</th>
                <th className="p-3.5">Grade</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Teacher Feedback / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filteredMarks.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5 font-mono text-stone-500 font-medium">{m.rollNo}</td>
                  <td className="p-3.5 font-semibold text-stone-900 dark:text-white">
                    {m.name}
                    <div className="text-[10px] text-stone-400 font-mono">{m.studentId}</div>
                  </td>
                  <td className="p-3.5">
                    <input
                      type="text"
                      value={m.score}
                      placeholder="0-100"
                      onChange={(e) => handleScoreChange(m.id, e.target.value)}
                      className="w-24 px-2.5 py-1.5 rounded-lg bg-stone-100/90 dark:bg-white/10 border border-stone-200 dark:border-white/15 text-center font-bold text-sm text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                        m.grade === "A+" || m.grade === "A"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : m.grade === "B" || m.grade === "C"
                          ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                          : m.grade === "ABS"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "bg-stone-200 dark:bg-white/10 text-stone-500"
                      }`}
                    >
                      {m.grade}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                        m.status === "Graded"
                          ? "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                          : m.status === "Absent"
                          ? "text-rose-600 dark:text-rose-400 bg-rose-500/10"
                          : "text-amber-600 dark:text-amber-400 bg-amber-500/10"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <input
                      type="text"
                      value={m.feedback}
                      placeholder="Enter remarks..."
                      onChange={(e) => handleFeedbackChange(m.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-transparent border border-stone-200/60 dark:border-white/10 focus:bg-stone-50 dark:focus:bg-white/5 focus:outline-none focus:ring-1 focus:ring-brand-500"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
