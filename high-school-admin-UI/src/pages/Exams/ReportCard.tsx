import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  FileText, 
  Printer, 
  Download, 
  Search, 
  Award, 
  User, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Sparkles,
  School
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface ReportCardSubject {
  name: string;
  code: string;
  credits: number;
  score: number;
  grade: string;
  gpa: number;
  remarks: string;
}

export default function ReportCard() {
  const { showToast } = useToast();
  const [selectedStudent, setSelectedStudent] = useState("Ethan Walker");
  const [selectedTerm, setSelectedTerm] = useState("Term 2 (2025 - 2026)");

  const studentReport = {
    studentName: "Ethan Walker",
    studentId: "OIS-2026-STU001",
    gradeLevel: "Grade 10-A",
    rollNumber: "10A-01",
    academicYear: "2025 - 2026",
    term: "Term 2 (Midterm)",
    attendanceRate: 98.2,
    rankInClass: "1st of 32",
    gpa: 3.92,
    subjects: [
      {
        name: "Advanced Biology",
        code: "SCI-301",
        credits: 4,
        score: 94,
        grade: "A+",
        gpa: 4.0,
        remarks: "Outstanding scientific curiosity and experimental writeup.",
      },
      {
        name: "Calculus BC",
        code: "MTH-402",
        credits: 4,
        score: 96,
        grade: "A+",
        gpa: 4.0,
        remarks: "Exemplary understanding of derivatives and integration.",
      },
      {
        name: "Modern World History",
        code: "HUM-201",
        credits: 3,
        score: 89,
        grade: "A",
        gpa: 3.8,
        remarks: "Great essay structure and historical context critique.",
      },
      {
        name: "Literature & Composition II",
        code: "ENG-202",
        credits: 3,
        score: 91,
        grade: "A+",
        gpa: 4.0,
        remarks: "Thoughtful textual analysis and creative writing.",
      },
      {
        name: "AP Computer Science A",
        code: "CS-501",
        credits: 4,
        score: 98,
        grade: "A+",
        gpa: 4.0,
        remarks: "Top algorithm efficiency in recursion problem set.",
      },
      {
        name: "Digital Illustration & UI",
        code: "ART-105",
        credits: 2,
        score: 87,
        grade: "A",
        gpa: 3.7,
        remarks: "Strong aesthetic sensibility and layout balance.",
      },
    ],
    principalFeedback:
      "Ethan has demonstrated exceptional dedication and intellectual rigor across all academic disciplines this term. Keep up the tremendous standard of excellence!",
    homeroomFeedback:
      "A proactive leader who consistently fosters collaborative learning and assists peers.",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Student Report Cards"
          subtitle="Generate, preview, print, and publish comprehensive academic evaluation certificates."
        />
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/15 text-stone-700 dark:text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <Printer size={15} />
            <span>Print Report</span>
          </button>
          <button
            onClick={() => showToast("Downloading official report card PDF", "success")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Download size={16} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Selectors */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="w-full sm:w-64">
          <label className="block text-[11px] font-semibold text-stone-500 mb-1">
            Select Student
          </label>
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
          >
            <option value="Ethan Walker">Ethan Walker (10A-01)</option>
            <option value="Sophia Martinez">Sophia Martinez (10A-02)</option>
            <option value="Liam Chen">Liam Chen (10A-03)</option>
            <option value="Olivia Robinson">Olivia Robinson (10A-04)</option>
          </select>
        </div>

        <div className="w-full sm:w-64">
          <label className="block text-[11px] font-semibold text-stone-500 mb-1">
            Evaluation Period
          </label>
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
          >
            <option value="Term 2 (2025 - 2026)">Term 2 (2025 - 2026)</option>
            <option value="Term 1 (2025 - 2026)">Term 1 (2025 - 2026)</option>
          </select>
        </div>
      </div>

      {/* Official Report Card Printable Document */}
      <div className="rounded-3xl p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/15 shadow-xl max-w-4xl mx-auto space-y-6">
        {/* School Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between pb-6 border-b-2 border-stone-200 dark:border-white/15 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-500/30">
              <School size={28} />
            </div>
            <div>
              <h2 className="text-xl font-black text-stone-900 dark:text-white uppercase tracking-tight">
                Oakridge International High School
              </h2>
              <div className="text-xs text-stone-500 font-medium">
                100 Academic Way, Metro City • admin@oakridge.edu
              </div>
            </div>
          </div>
          <div className="text-right">
            <span className="px-3 py-1 rounded-full text-xs font-black bg-brand-50 dark:bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/30 uppercase tracking-wider">
              Official Academic Transcript
            </span>
            <div className="text-xs text-stone-400 font-mono mt-1">
              Session: {studentReport.academicYear}
            </div>
          </div>
        </div>

        {/* Student Dossier Matrix */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-xs">
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">
              Student Name
            </span>
            <span className="font-bold text-stone-900 dark:text-white text-sm">
              {studentReport.studentName}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">
              Student ID / Roll
            </span>
            <span className="font-mono font-semibold text-stone-800 dark:text-stone-200">
              {studentReport.studentId}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">
              Class & Section
            </span>
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              {studentReport.gradeLevel}
            </span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px] uppercase font-bold">
              Term GPA / Standing
            </span>
            <span className="font-black text-emerald-600 dark:text-emerald-400 text-sm">
              {studentReport.gpa} (Rank: {studentReport.rankInClass})
            </span>
          </div>
        </div>

        {/* Subject Scores Table */}
        <div className="overflow-hidden rounded-2xl border border-stone-200 dark:border-white/10">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 font-bold border-b border-stone-200 dark:border-white/10">
              <tr>
                <th className="p-3">Subject</th>
                <th className="p-3 text-center">Credits</th>
                <th className="p-3 text-center">Marks (100)</th>
                <th className="p-3 text-center">Grade</th>
                <th className="p-3 text-center">Grade Point</th>
                <th className="p-3">Teacher Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/60 dark:divide-white/5">
              {studentReport.subjects.map((sub, idx) => (
                <tr key={idx} className="hover:bg-stone-50 dark:hover:bg-white/5">
                  <td className="p-3 font-bold text-stone-900 dark:text-white">
                    {sub.name}
                    <span className="text-[10px] text-stone-400 font-mono ml-2 font-normal">
                      {sub.code}
                    </span>
                  </td>
                  <td className="p-3 text-center font-medium">{sub.credits}</td>
                  <td className="p-3 text-center font-bold text-stone-900 dark:text-white">
                    {sub.score}%
                  </td>
                  <td className="p-3 text-center font-bold text-brand-600 dark:text-brand-400">
                    {sub.grade}
                  </td>
                  <td className="p-3 text-center font-semibold">{sub.gpa.toFixed(1)}</td>
                  <td className="p-3 text-stone-600 dark:text-stone-300 text-[11px] italic">
                    "{sub.remarks}"
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remarks and Signatures */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-xs">
            <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
              Homeroom Teacher Commentary:
            </span>
            <p className="text-stone-600 dark:text-stone-400 italic">
              {studentReport.homeroomFeedback}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-xs">
            <span className="font-bold text-stone-800 dark:text-stone-200 block mb-1">
              Principal's Review:
            </span>
            <p className="text-stone-600 dark:text-stone-400 italic">
              {studentReport.principalFeedback}
            </p>
          </div>
        </div>

        {/* Signature lines */}
        <div className="pt-8 flex items-center justify-between text-xs text-stone-400 border-t border-dashed border-stone-200 dark:border-white/15">
          <div className="text-center w-40">
            <div className="border-b border-stone-300 dark:border-white/20 pb-1 mb-1 font-serif italic text-stone-600 dark:text-stone-300">
              Dr. John Whitfield
            </div>
            <span className="text-[10px]">Class Teacher Signature</span>
          </div>
          <div className="text-center w-40">
            <div className="border-b border-stone-300 dark:border-white/20 pb-1 mb-1 font-serif italic text-stone-600 dark:text-stone-300">
              Dr. Robert Sterling
            </div>
            <span className="text-[10px]">Principal Signature</span>
          </div>
        </div>
      </div>
    </div>
  );
}
