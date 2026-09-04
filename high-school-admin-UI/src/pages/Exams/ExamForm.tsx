import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { 
  ArrowLeft, 
  Save, 
  Calendar, 
  Clock, 
  Award, 
  BookOpen, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Sparkles,
  Layers,
  FileCheck
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface SubjectSchedule {
  id: string;
  subjectName: string;
  subjectCode: string;
  gradeLevel: string;
  examDate: string;
  startTime: string;
  endTime: string;
  room: string;
  maxScore: number;
  passScore: number;
  supervisor: string;
}

export default function ExamForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  // Form State
  const [title, setTitle] = useState(isEditing ? "Midterm Examination Term 2" : "");
  const [code, setCode] = useState(isEditing ? "EX-2026-T2-MID" : "EX-2026-T2-001");
  const [term, setTerm] = useState("Term 2");
  const [academicYear, setAcademicYear] = useState("2025 - 2026");
  const [examType, setExamType] = useState("Midterm");
  const [status, setStatus] = useState<"Draft" | "Scheduled" | "Ongoing" | "Grading" | "Published">("Scheduled");
  const [startDate, setStartDate] = useState("2026-03-02");
  const [endDate, setEndDate] = useState("2026-03-10");
  const [gradingDeadline, setGradingDeadline] = useState("2026-03-18");
  const [gradingScale, setGradingScale] = useState("Letter Grades (A-F)");
  const [weightage, setWeightage] = useState(30);
  const [instructions, setInstructions] = useState(
    "Standard examination regulations apply. Scientific calculators allowed for designated STEM papers only. Strictly no electronic devices."
  );

  // Subject schedule rows
  const [schedules, setSchedules] = useState<SubjectSchedule[]>([
    {
      id: "sch-1",
      subjectName: "Advanced Mathematics",
      subjectCode: "MATH-401",
      gradeLevel: "Grade 12",
      examDate: "2026-03-02",
      startTime: "09:00",
      endTime: "11:30",
      room: "Main Auditorium",
      maxScore: 100,
      passScore: 50,
      supervisor: "Dr. Sarah Jenkins",
    },
    {
      id: "sch-2",
      subjectName: "Physics & Mechanics",
      subjectCode: "PHYS-301",
      gradeLevel: "Grade 11",
      examDate: "2026-03-04",
      startTime: "09:00",
      endTime: "11:00",
      room: "Science Wing Hall 1",
      maxScore: 100,
      passScore: 50,
      supervisor: "Prof. Marcus Thorne",
    },
    {
      id: "sch-3",
      subjectName: "World Literature",
      subjectCode: "ENG-201",
      gradeLevel: "Grade 10",
      examDate: "2026-03-06",
      startTime: "13:00",
      endTime: "15:00",
      room: "Room 105",
      maxScore: 100,
      passScore: 45,
      supervisor: "Elena Rostova",
    },
  ]);

  const handleAddSubjectRow = () => {
    const newRow: SubjectSchedule = {
      id: `sch-${Date.now()}`,
      subjectName: "General Chemistry",
      subjectCode: "CHEM-101",
      gradeLevel: "Grade 10",
      examDate: startDate || "2026-03-08",
      startTime: "09:00",
      endTime: "11:00",
      room: "Lab 2",
      maxScore: 100,
      passScore: 50,
      supervisor: "Staff Examiner",
    };
    setSchedules([...schedules, newRow]);
  };

  const handleRemoveSubject = (schId: string) => {
    setSchedules(schedules.filter(s => s.id !== schId));
  };

  const handleUpdateSchedule = (schId: string, field: keyof SubjectSchedule, value: any) => {
    setSchedules(schedules.map(s => s.id === schId ? { ...s, [field]: value } : s));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Exam title is required", "error");
      return;
    }
    showToast(isEditing ? "Examination details updated" : "Examination created successfully", "success");
    setTimeout(() => {
      navigate("/academic/exams");
    }, 400);
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/academic/exams"
            className="p-2 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">
              {isEditing ? "Edit Examination Session" : "Create New Examination"}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Configure session criteria, academic terms, grading parameters, and paper timetables.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            type="button"
            onClick={() => navigate("/academic/exams")}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-white/5 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Save size={15} />
            <span>{isEditing ? "Save Changes" : "Publish Exam"}</span>
          </button>
        </div>
      </div>

      {/* Primary Configuration Card */}
      <div className="p-6 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 space-y-5 bg-white/40 dark:bg-stone-900/40">
        <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
          <Award size={16} className="text-brand-500" />
          <span>General Examination Information</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="md:col-span-2">
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Examination Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterm Comprehensive Assessment Term 2"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Exam Code Identifier *
            </label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="EX-2026-T2-MID"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 font-mono text-stone-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Academic Term
            </label>
            <select
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            >
              <option value="Term 1" className="dark:bg-stone-900">Term 1 (Fall)</option>
              <option value="Term 2" className="dark:bg-stone-900">Term 2 (Spring)</option>
              <option value="Term 3" className="dark:bg-stone-900">Term 3 (Summer)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Academic Year
            </label>
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Lifecycle Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            >
              <option value="Draft" className="dark:bg-stone-900">Draft</option>
              <option value="Scheduled" className="dark:bg-stone-900">Scheduled</option>
              <option value="Ongoing" className="dark:bg-stone-900">Ongoing</option>
              <option value="Grading" className="dark:bg-stone-900">Grading</option>
              <option value="Published" className="dark:bg-stone-900">Published</option>
            </select>
          </div>
        </div>

        {/* Date Milestones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-stone-200/50 dark:border-white/5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Conclude Date
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Mark Submission Deadline
            </label>
            <input
              type="date"
              value={gradingDeadline}
              onChange={(e) => setGradingDeadline(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Evaluation Policy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-200/50 dark:border-white/5 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Grading Scale Scheme
            </label>
            <select
              value={gradingScale}
              onChange={(e) => setGradingScale(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            >
              <option value="Letter Grades (A-F)" className="dark:bg-stone-900">Standard Letter Grades (A, B, C, D, F)</option>
              <option value="GPA 4.0" className="dark:bg-stone-900">GPA Standard (4.0 Scale)</option>
              <option value="Percentage" className="dark:bg-stone-900">Pure Percentage (0 - 100%)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Term Grade Weightage (%)
            </label>
            <input
              type="number"
              min={5}
              max={100}
              value={weightage}
              onChange={(e) => setWeightage(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Student & Proctor Instructions
            </label>
            <textarea
              rows={2}
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Papers / Subjects Schedule Roster */}
      <div className="p-6 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 space-y-4 bg-white/40 dark:bg-stone-900/40">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <Layers size={16} className="text-brand-500" />
              <span>Exam Timetable & Subject Papers</span>
            </h2>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Specific paper slots, duration, rooms, and assigned proctors.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddSubjectRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-700 dark:text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <Plus size={14} />
            <span>Add Paper</span>
          </button>
        </div>

        <div className="space-y-3">
          {schedules.map((row, idx) => (
            <div
              key={row.id}
              className="p-4 rounded-xl border border-stone-200/60 dark:border-white/5 bg-stone-50/50 dark:bg-white/[0.02] grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
            >
              <div className="sm:col-span-3">
                <label className="block text-[11px] text-stone-400 mb-0.5">Subject & Code</label>
                <input
                  type="text"
                  value={row.subjectName}
                  onChange={(e) => handleUpdateSchedule(row.id, "subjectName", e.target.value)}
                  className="w-full font-medium bg-transparent border-b border-stone-200 dark:border-white/10 focus:outline-none focus:border-brand-500 text-stone-900 dark:text-white pb-1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-stone-400 mb-0.5">Grade Level</label>
                <select
                  value={row.gradeLevel}
                  onChange={(e) => handleUpdateSchedule(row.id, "gradeLevel", e.target.value)}
                  className="w-full bg-transparent border-b border-stone-200 dark:border-white/10 focus:outline-none text-stone-800 dark:text-stone-200 pb-1"
                >
                  <option value="Grade 9" className="dark:bg-stone-900">Grade 9</option>
                  <option value="Grade 10" className="dark:bg-stone-900">Grade 10</option>
                  <option value="Grade 11" className="dark:bg-stone-900">Grade 11</option>
                  <option value="Grade 12" className="dark:bg-stone-900">Grade 12</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-stone-400 mb-0.5">Exam Date</label>
                <input
                  type="date"
                  value={row.examDate}
                  onChange={(e) => handleUpdateSchedule(row.id, "examDate", e.target.value)}
                  className="w-full bg-transparent border-b border-stone-200 dark:border-white/10 focus:outline-none text-stone-800 dark:text-stone-200 pb-1"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-stone-400 mb-0.5">Time (From - To)</label>
                <div className="flex items-center gap-1">
                  <input
                    type="time"
                    value={row.startTime}
                    onChange={(e) => handleUpdateSchedule(row.id, "startTime", e.target.value)}
                    className="w-1/2 bg-transparent text-[11px] focus:outline-none"
                  />
                  <span>-</span>
                  <input
                    type="time"
                    value={row.endTime}
                    onChange={(e) => handleUpdateSchedule(row.id, "endTime", e.target.value)}
                    className="w-1/2 bg-transparent text-[11px] focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] text-stone-400 mb-0.5">Hall & Max Mark</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={row.room}
                    onChange={(e) => handleUpdateSchedule(row.id, "room", e.target.value)}
                    placeholder="Hall"
                    className="w-20 bg-transparent border-b border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 pb-1 focus:outline-none"
                  />
                  <input
                    type="number"
                    value={row.maxScore}
                    onChange={(e) => handleUpdateSchedule(row.id, "maxScore", Number(e.target.value))}
                    className="w-14 bg-transparent border-b border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 pb-1 focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-1 text-right">
                <button
                  type="button"
                  onClick={() => handleRemoveSubject(row.id)}
                  className="p-1.5 text-stone-400 hover:text-red-500 transition rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                  title="Remove Paper"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
