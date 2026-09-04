import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar, 
  Clock, 
  Award, 
  Users, 
  CheckCircle2, 
  Layers, 
  ChevronRight,
  BookOpen
} from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/components/common/ToastProvider";

interface ExamItem {
  id: string;
  name: string;
  code: string;
  term: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  status: "Scheduled" | "Ongoing" | "Grading" | "Published";
  totalSubjects: number;
  participatingStudents: number;
  gradingProgress: number; // percentage
}

export default function ExamList() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [exams, setExams] = useState<ExamItem[]>([
    {
      id: "ex-1",
      name: "Midterm Examination Term 2",
      code: "EX-2026-T2-MID",
      term: "Term 2",
      academicYear: "2025 - 2026",
      startDate: "2026-03-02",
      endDate: "2026-03-10",
      status: "Grading",
      totalSubjects: 14,
      participatingStudents: 640,
      gradingProgress: 78,
    },
    {
      id: "ex-2",
      name: "Final Comprehensive Exam Term 1",
      code: "EX-2025-T1-FIN",
      term: "Term 1",
      academicYear: "2025 - 2026",
      startDate: "2025-11-10",
      endDate: "2025-11-20",
      status: "Published",
      totalSubjects: 16,
      participatingStudents: 1280,
      gradingProgress: 100,
    },
    {
      id: "ex-3",
      name: "Spring Final Term Examination",
      code: "EX-2026-T3-FIN",
      term: "Term 3",
      academicYear: "2025 - 2026",
      startDate: "2026-05-18",
      endDate: "2026-05-28",
      status: "Scheduled",
      totalSubjects: 16,
      participatingStudents: 1284,
      gradingProgress: 0,
    },
    {
      id: "ex-4",
      name: "Diagnostic Aptitude Benchmark",
      code: "EX-2025-DIAG",
      term: "Term 1",
      academicYear: "2025 - 2026",
      startDate: "2025-09-05",
      endDate: "2025-09-08",
      status: "Published",
      totalSubjects: 8,
      participatingStudents: 320,
      gradingProgress: 100,
    },
  ]);

  const filteredExams = exams.filter((ex) => {
    const matchesSearch =
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.term.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || ex.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Examinations"
          subtitle="Oversee school examinations, test sessions, evaluation deadlines, and publishing status."
        />
        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            to="/academic/exam-schedules"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/15 text-stone-700 dark:text-stone-200 text-xs font-semibold transition"
          >
            <Calendar size={15} />
            <span>Exam Schedules</span>
          </Link>
          <Link
            to="/academic/mark-entry"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>New Exam / Mark Entry</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search exam title, session code, or term..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Grading">Grading</option>
            <option value="Published">Published</option>
          </select>
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredExams.map((exam) => (
          <div
            key={exam.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <FileText size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {exam.name}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono">
                      {exam.code} • {exam.term} ({exam.academicYear})
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    exam.status === "Published"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      : exam.status === "Grading"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      : "bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30"
                  }`}
                >
                  {exam.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Calendar size={13} /> Examination Window:
                  </span>
                  <span className="font-medium">
                    {exam.startDate} to {exam.endDate}
                  </span>
                </div>

                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <BookOpen size={13} /> Tested Subjects:
                  </span>
                  <span className="font-medium">{exam.totalSubjects} Papers</span>
                </div>

                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Users size={13} /> Enrolled Candidates:
                  </span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {exam.participatingStudents} Candidates
                  </span>
                </div>

                {/* Grading progress */}
                <div className="pt-2">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-stone-500">Grading & Evaluation Progress</span>
                    <span className="font-bold text-stone-800 dark:text-stone-200">
                      {exam.gradingProgress}%
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-stone-200/70 dark:bg-white/10 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        exam.gradingProgress === 100
                          ? "bg-emerald-500"
                          : exam.gradingProgress > 50
                          ? "bg-brand-500"
                          : "bg-amber-500"
                      }`}
                      style={{ width: `${exam.gradingProgress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-2">
              <Link
                to={`/academic/mark-entry?exam=${exam.id}`}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-500/10 hover:bg-brand-500 hover:text-white text-brand-700 dark:text-brand-300 transition flex items-center gap-1.5"
              >
                <span>Enter Marks</span>
                <ChevronRight size={14} />
              </Link>

              <Link
                to="/academic/report-cards"
                className="text-xs font-semibold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition"
              >
                Generate Report Cards →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
