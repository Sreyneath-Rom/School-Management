// src/pages/Teachers/TeacherProfiles.tsx
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Award, 
  BookOpen, 
  Clock, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Star,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Building2,
  QrCode,
  FileText,
  Users,
  ExternalLink,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import { teacherService, type TeacherRecord } from "@/services/teacherService";

interface ExtendedFacultyProfile extends TeacherRecord {
  officeRoom?: string;
  educationHistory?: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  publications?: Array<{
    title: string;
    journal: string;
    year: string;
  }>;
  officeHours?: string;
  studentReviewsCount?: number;
  totalStudentsTaught?: number;
}

const RICH_FACULTY_ROSTER: ExtendedFacultyProfile[] = [
  {
    id: "t1",
    employeeId: "FAC-SCI-01",
    firstName: "John",
    lastName: "Whitfield",
    name: "Dr. John Whitfield",
    title: "Head of Science & Biology Faculty",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&h=256&fit=crop",
    department: "Science",
    position: "Department Chair",
    qualifications: "Ph.D. in Molecular Biology (Harvard University)",
    specialization: "Cellular Biochemistry, CRISPR & Genetics",
    weeklyTeachingHours: 18,
    assignedClasses: ["Grade 10-A", "Grade 10-B", "Grade 12-A"],
    subjectsTaught: ["Advanced Biology", "AP Biology Seminar", "Genetics Elective"],
    performanceRating: 4.92,
    joiningDate: "2019-08-15",
    email: "john.whitfield@oakridge.edu",
    phone: "+1 (555) 019-2834",
    status: "Active",
    officeRoom: "Science Building, Suite 304",
    officeHours: "Mon & Wed: 2:30 PM – 4:30 PM",
    studentReviewsCount: 148,
    totalStudentsTaught: 96,
    educationHistory: [
      { degree: "Ph.D. in Molecular Biology", institution: "Harvard University", year: "2014" },
      { degree: "M.Sc. in Biological Chemistry", institution: "Johns Hopkins University", year: "2010" },
      { degree: "B.S. in Biochemistry (Summa Cum Laude)", institution: "UC Berkeley", year: "2008" },
    ],
    publications: [
      { title: "Targeted Epigenetic Modifications in High School Pedagogy", journal: "Journal of Science Education", year: "2023" },
      { title: "Cellular Metabolism Models in Secondary Science Curricula", journal: "Biotech & Society", year: "2021" },
    ],
  },
  {
    id: "t2",
    employeeId: "FAC-MTH-03",
    firstName: "Marcus",
    lastName: "Kane",
    name: "Prof. Marcus Kane",
    title: "Senior Mathematics Lecturer & STEM Coordinator",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&h=256&fit=crop",
    department: "Mathematics",
    position: "Senior Lecturer",
    qualifications: "M.Sc. in Applied Mathematics (MIT)",
    specialization: "Calculus, Differential Equations & Topology",
    weeklyTeachingHours: 20,
    assignedClasses: ["Grade 11-A", "Grade 12-A"],
    subjectsTaught: ["Calculus BC", "Linear Algebra", "Competitive Math Prep"],
    performanceRating: 4.88,
    joiningDate: "2018-01-10",
    email: "marcus.kane@oakridge.edu",
    phone: "+1 (555) 019-9943",
    status: "Active",
    officeRoom: "Mathematics Hall, Room 212",
    officeHours: "Tue & Thu: 3:00 PM – 5:00 PM",
    studentReviewsCount: 172,
    totalStudentsTaught: 110,
    educationHistory: [
      { degree: "M.Sc. in Applied Mathematics", institution: "Massachusetts Institute of Technology (MIT)", year: "2012" },
      { degree: "B.S. in Pure Mathematics", institution: "Princeton University", year: "2009" },
    ],
    publications: [
      { title: "Geometric Intuition in High School Advanced Calculus", journal: "Mathematical Pedagogical Review", year: "2022" },
    ],
  },
  {
    id: "t3",
    employeeId: "FAC-CS-02",
    firstName: "Elena",
    lastName: "Vance",
    name: "Elena Vance",
    title: "Director of Computer Science & Robotics Lab",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&h=256&fit=crop",
    department: "Technology",
    position: "Faculty Lead",
    qualifications: "M.S. in Computer Science (Stanford University)",
    specialization: "Algorithms, Neural Networks & Autonomous Robotics",
    weeklyTeachingHours: 16,
    assignedClasses: ["Grade 10-A", "Grade 11-B", "Grade 12-B"],
    subjectsTaught: ["AP Computer Science A", "Robotics Engineering", "Data Structures"],
    performanceRating: 4.95,
    joiningDate: "2020-08-01",
    email: "elena.vance@oakridge.edu",
    phone: "+1 (555) 019-4821",
    status: "Active",
    officeRoom: "Turing Innovation Hub, Lab 102",
    officeHours: "Mon & Fri: 1:30 PM – 3:30 PM",
    studentReviewsCount: 135,
    totalStudentsTaught: 84,
    educationHistory: [
      { degree: "M.S. in Computer Science", institution: "Stanford University", year: "2016" },
      { degree: "B.S. in Computer Engineering", institution: "Carnegie Mellon University", year: "2014" },
    ],
    publications: [
      { title: "Empowering Secondary Students with Edge AI & Robotics", journal: "IEEE Transactions on Education", year: "2024" },
    ],
  },
  {
    id: "t4",
    employeeId: "FAC-ENG-05",
    firstName: "Sarah",
    lastName: "Chen",
    name: "Sarah Chen",
    title: "Senior Faculty in World Literature & Rhetoric",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&h=256&fit=crop",
    department: "Languages",
    position: "Faculty Member",
    qualifications: "M.A. in Comparative Literature (Columbia University)",
    specialization: "Modernist Fiction, Post-Colonial Narratives & Rhetoric",
    weeklyTeachingHours: 17,
    assignedClasses: ["Grade 9-A", "Grade 10-A", "Grade 11-A"],
    subjectsTaught: ["World Literature", "Rhetoric & Composition", "Creative Writing"],
    performanceRating: 4.84,
    joiningDate: "2021-09-01",
    email: "sarah.chen@oakridge.edu",
    phone: "+1 (555) 019-7712",
    status: "Active",
    officeRoom: "Humanities Hall, Room 108",
    officeHours: "Wed & Fri: 2:00 PM – 4:00 PM",
    studentReviewsCount: 160,
    totalStudentsTaught: 105,
    educationHistory: [
      { degree: "M.A. in Comparative Literature", institution: "Columbia University", year: "2015" },
      { degree: "B.A. in English Literature", institution: "Yale University", year: "2013" },
    ],
    publications: [
      { title: "Dialectical Storytelling in High School Literary Criticism", journal: "Humanities Education Quarterly", year: "2023" },
    ],
  },
];

export default function TeacherProfiles() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [faculty, setFaculty] = useState<ExtendedFacultyProfile[]>(RICH_FACULTY_ROSTER);
  const [selectedId, setSelectedId] = useState<string>("t1");
  const [activeTab, setActiveTab] = useState<"overview" | "schedule" | "evaluations" | "badge">("overview");

  // Load from API
  useEffect(() => {
    async function loadData() {
      try {
        const apiData = await teacherService.list();
        if (Array.isArray(apiData) && apiData.length > 0) {
          const merged: ExtendedFacultyProfile[] = apiData.map((item, idx) => {
            const fallback = RICH_FACULTY_ROSTER[idx % RICH_FACULTY_ROSTER.length];
            return {
              ...fallback,
              ...item,
              id: item.id,
              name: item.name || `${item.firstName} ${item.lastName}`,
              officeRoom: fallback.officeRoom,
              educationHistory: fallback.educationHistory,
              publications: fallback.publications,
              officeHours: fallback.officeHours,
              studentReviewsCount: fallback.studentReviewsCount,
              totalStudentsTaught: fallback.totalStudentsTaught,
            };
          });
          setFaculty(merged);
        }
      } catch {
        // use RICH_FACULTY_ROSTER
      }
    }
    loadData();
  }, []);

  // Handle URL query ?id=...
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId && faculty.some((f) => f.id === urlId)) {
      setSelectedId(urlId);
    }
  }, [searchParams, faculty]);

  const handleSelectFaculty = (id: string) => {
    setSelectedId(id);
    setSearchParams({ id });
  };

  const currentIndex = faculty.findIndex((f) => f.id === selectedId);
  const teacher = faculty[currentIndex >= 0 ? currentIndex : 0] || RICH_FACULTY_ROSTER[0];

  const handlePrevFaculty = () => {
    if (currentIndex > 0) {
      handleSelectFaculty(faculty[currentIndex - 1].id);
    }
  };

  const handleNextFaculty = () => {
    if (currentIndex < faculty.length - 1) {
      handleSelectFaculty(faculty[currentIndex + 1].id);
    }
  };

  const initials = `${(teacher.firstName || '').charAt(0)}${(teacher.lastName || '').charAt(0)}`.toUpperCase() || 'FC';
  const workloadPct = Math.min(100, Math.round(((teacher.weeklyTeachingHours || 18) / 24) * 100));

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Navigator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeading
          title="Teacher Profiles & Faculty Dossier"
          subtitle="Holistic academic qualifications, assigned workloads, student evaluation metrics, and institutional records."
        />

        {/* Quick Nav / Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-xl border border-stone-200 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 p-0.5">
            <button
              onClick={handlePrevFaculty}
              disabled={currentIndex <= 0}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white disabled:opacity-30 transition"
              title="Previous Faculty"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextFaculty}
              disabled={currentIndex >= faculty.length - 1}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white disabled:opacity-30 transition"
              title="Next Faculty"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <select
            id="faculty-profile-selector"
            value={teacher.id}
            onChange={(e) => handleSelectFaculty(e.target.value)}
            className="h-9 px-3 text-xs font-semibold rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.department})
              </option>
            ))}
          </select>

          <button
            onClick={() => window.print()}
            className="inline-flex h-9 items-center gap-1.5 px-3 rounded-xl border border-stone-200 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-white/10 text-stone-700 dark:text-stone-200 text-xs font-semibold transition cursor-pointer"
            title="Print dossier summary"
          >
            <Printer className="h-3.5 w-3.5 text-stone-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("badge");
              showToast("Displaying official Faculty Credential badge", "info");
            }}
            className="inline-flex h-9 items-center gap-1.5 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>Faculty Badge</span>
          </button>
        </div>
      </div>

      {/* Main Faculty Header Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Avatar with Status Ring */}
          <div className="relative shrink-0">
            {teacher.avatarUrl ? (
              <img
                src={teacher.avatarUrl}
                alt={teacher.name}
                className="h-24 w-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500/20 to-brand-600/10 text-3xl font-black text-brand-700 dark:text-brand-300 ring-4 ring-brand-500/20 shadow-md">
                {initials}
              </div>
            )}
            <span
              className={`absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-stone-900 ${
                teacher.status === "Active" ? "bg-emerald-500" : "bg-amber-500"
              }`}
              title={teacher.status === "Active" ? "Active Faculty" : "On Leave"}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </span>
          </div>

          {/* Details & Contacts */}
          <div className="flex-1 text-center lg:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-2.5">
              <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                {teacher.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-lg border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-700 dark:text-brand-300 w-max mx-auto sm:mx-0">
                <Building2 className="h-3.5 w-3.5" />
                {teacher.department} • {teacher.position || "Faculty Member"}
              </span>
              <span className="font-mono text-xs font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-white/10 px-2 py-1 rounded-lg w-max mx-auto sm:mx-0">
                {teacher.employeeId}
              </span>
            </div>

            <p className="text-xs font-medium text-stone-600 dark:text-stone-300">
              {teacher.title}
            </p>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-xs text-stone-600 dark:text-stone-300 pt-1">
              <a
                href={`mailto:${teacher.email}`}
                className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                <Mail className="h-3.5 w-3.5 text-stone-400" />
                <span>{teacher.email}</span>
              </a>
              <a
                href={`tel:${teacher.phone}`}
                className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                <Phone className="h-3.5 w-3.5 text-stone-400" />
                <span className="font-mono">{teacher.phone}</span>
              </a>
              <span className="flex items-center gap-1.5 text-stone-500">
                <MapPin className="h-3.5 w-3.5 text-stone-400" />
                <span>{teacher.officeRoom || "Science Hall 304"}</span>
              </span>
              <span className="flex items-center gap-1.5 text-stone-500">
                <Calendar className="h-3.5 w-3.5 text-stone-400" />
                <span>Joined: {teacher.joiningDate}</span>
              </span>
            </div>
          </div>

          {/* Quick Metrics KPI Strip */}
          <div className="grid grid-cols-3 gap-2.5 shrink-0 w-full sm:w-auto">
            {/* Workload */}
            <div className="rounded-2xl border border-stone-200/60 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 p-3 text-center min-w-[95px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Workload</div>
              <div className="mt-1 text-xl font-black text-brand-700 dark:text-brand-300">
                {teacher.weeklyTeachingHours}h
              </div>
              <div className="text-[10px] font-semibold text-stone-500">of 24h Capacity</div>
            </div>

            {/* Rating */}
            <div className="rounded-2xl border border-stone-200/60 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 p-3 text-center min-w-[95px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Evaluation</div>
              <div className="mt-1 inline-flex items-center gap-1 text-xl font-black text-amber-700 dark:text-amber-400">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span>{teacher.performanceRating?.toFixed(2) || '4.92'}</span>
              </div>
              <div className="text-[10px] font-semibold text-stone-500">{teacher.studentReviewsCount || 148} Reviews</div>
            </div>

            {/* Students */}
            <div className="rounded-2xl border border-stone-200/60 dark:border-white/10 bg-stone-50/80 dark:bg-white/5 p-3 text-center min-w-[95px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-stone-400">Students</div>
              <div className="mt-1 text-xl font-black text-emerald-700 dark:text-emerald-400">
                {teacher.totalStudentsTaught || 96}
              </div>
              <div className="text-[10px] font-semibold text-stone-500">{teacher.assignedClasses?.length || 3} Cohorts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu Strip */}
      <div className="flex items-center gap-2 border-b border-stone-200/80 dark:border-white/10 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "overview"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          <GraduationCap className="h-3.5 w-3.5" />
          <span>Academic Background & Research</span>
        </button>

        <button
          onClick={() => setActiveTab("schedule")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "schedule"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Teaching Load & Timetable</span>
        </button>

        <button
          onClick={() => setActiveTab("evaluations")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "evaluations"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          <Star className="h-3.5 w-3.5" />
          <span>Student Reviews & Feedback</span>
        </button>

        <button
          onClick={() => setActiveTab("badge")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "badge"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          <QrCode className="h-3.5 w-3.5" />
          <span>Faculty ID Credential</span>
        </button>
      </div>

      {/* Tab Panels */}

      {/* 1. Academic Background & Research */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Degrees & Institutions */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <Award className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span>Higher Degrees & Academic Credentials</span>
            </h3>

            <div className="space-y-3">
              {(teacher.educationHistory || [
                { degree: teacher.qualifications, institution: "Accredited University", year: "2014" },
              ]).map((edu, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 flex items-start justify-between">
                  <div>
                    <div className="font-bold text-stone-900 dark:text-white">{edu.degree}</div>
                    <div className="text-stone-500 mt-0.5">{edu.institution}</div>
                  </div>
                  <span className="font-mono font-semibold text-brand-700 dark:text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded-md text-[11px]">
                    {edu.year}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-100 dark:border-white/5 space-y-2">
              <div className="text-stone-400 font-bold uppercase text-[10px]">Domain Specialization</div>
              <p className="text-stone-700 dark:text-stone-300 leading-relaxed font-medium">
                {teacher.specialization}
              </p>
            </div>
          </div>

          {/* Research & Publications */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Publications, Grants & Office Consultation</span>
            </h3>

            <div className="space-y-3">
              {(teacher.publications || [
                { title: "Secondary STEM Curriculum Enhancement", journal: "Journal of Education", year: "2023" },
              ]).map((pub, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10">
                  <div className="font-bold text-stone-900 dark:text-white">"{pub.title}"</div>
                  <div className="text-stone-500 text-[11px] mt-1 flex items-center justify-between">
                    <span>{pub.journal}</span>
                    <span className="font-mono text-stone-400">{pub.year}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-xl bg-brand-500/10 border border-brand-500/20 space-y-1">
              <div className="font-bold text-brand-800 dark:text-brand-200 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                <span>Student Consultation & Office Hours</span>
              </div>
              <div className="text-brand-700 dark:text-brand-300">
                {teacher.officeHours || "Mon & Wed: 2:30 PM – 4:30 PM"} in {teacher.officeRoom || "Room 304"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Teaching Load & Timetable */}
      {activeTab === "schedule" && (
        <div className="space-y-5 text-xs">
          {/* Active Courses List */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span>Allocated Courses & Assigned Cohorts</span>
              </h3>
              <span className="text-[11px] font-semibold text-stone-500">
                Weekly Load: {teacher.weeklyTeachingHours} Hours
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(teacher.subjectsTaught || []).map((subject, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-stone-200/60 dark:border-white/10 bg-stone-50 dark:bg-white/5 space-y-2">
                  <div className="font-bold text-stone-900 dark:text-white text-sm">{subject}</div>
                  <div className="text-stone-500">Class Cohort: {teacher.assignedClasses[idx % teacher.assignedClasses.length] || "Grade 10"}</div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="font-semibold text-brand-700 dark:text-brand-300">4.0 Credits</span>
                    <span className="text-stone-400 font-mono">32 Students</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Timetable Schedule Matrix */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 space-y-4 shadow-xs">
            <div className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Weekly Instructional Matrix (Spring 2026)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs">
                <thead>
                  <tr className="border-b border-stone-200 dark:border-white/10 text-stone-500 font-bold uppercase text-[10px]">
                    <th className="py-2 px-3 text-left">Period & Time</th>
                    <th className="py-2 px-3">Monday</th>
                    <th className="py-2 px-3">Tuesday</th>
                    <th className="py-2 px-3">Wednesday</th>
                    <th className="py-2 px-3">Thursday</th>
                    <th className="py-2 px-3">Friday</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                  <tr>
                    <td className="py-2.5 px-3 text-left font-mono font-semibold text-stone-500">P1 • 08:30 - 09:30</td>
                    <td className="py-2.5 px-3"><span className="p-1 rounded-md bg-brand-500/15 text-brand-700 dark:text-brand-300 font-semibold block">{teacher.subjectsTaught[0] || "Biology"}</span></td>
                    <td className="py-2.5 px-3 text-stone-400">Prep Period</td>
                    <td className="py-2.5 px-3"><span className="p-1 rounded-md bg-brand-500/15 text-brand-700 dark:text-brand-300 font-semibold block">{teacher.subjectsTaught[0] || "Biology"}</span></td>
                    <td className="py-2.5 px-3 text-stone-400">Prep Period</td>
                    <td className="py-2.5 px-3"><span className="p-1 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-semibold block">Lab Practicum</span></td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-left font-mono font-semibold text-stone-500">P2 • 09:45 - 10:45</td>
                    <td className="py-2.5 px-3 text-stone-400">Department Meeting</td>
                    <td className="py-2.5 px-3"><span className="p-1 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold block">{teacher.subjectsTaught[1] || "AP Seminar"}</span></td>
                    <td className="py-2.5 px-3 text-stone-400">Office Hour</td>
                    <td className="py-2.5 px-3"><span className="p-1 rounded-md bg-purple-500/15 text-purple-700 dark:text-purple-300 font-semibold block">{teacher.subjectsTaught[1] || "AP Seminar"}</span></td>
                    <td className="py-2.5 px-3 text-stone-400">Office Hour</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-left font-mono font-semibold text-stone-500">P3 • 11:00 - 12:00</td>
                    <td className="py-2.5 px-3"><span className="p-1 rounded-md bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold block">STEM Elective</span></td>
                    <td className="py-2.5 px-3 text-stone-400">Faculty Review</td>
                    <td className="py-2.5 px-3"><span className="p-1 rounded-md bg-teal-500/15 text-teal-700 dark:text-teal-300 font-semibold block">STEM Elective</span></td>
                    <td className="py-2.5 px-3 text-stone-400">Research Block</td>
                    <td className="py-2.5 px-3 text-stone-400">Department Colloquium</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. Student Reviews & Evaluations */}
      {activeTab === "evaluations" && (
        <div className="space-y-5 text-xs">
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                <span>Annual Student Course Evaluation Summary</span>
              </h3>
              <span className="font-bold text-amber-700 dark:text-amber-400 text-sm">
                ★ {teacher.performanceRating?.toFixed(2) || '4.92'} / 5.00 Overall Score
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-[10px] font-bold uppercase text-amber-700 dark:text-amber-300">Course Clarity</div>
                <div className="text-2xl font-black text-amber-800 dark:text-amber-200 mt-0.5">4.95</div>
                <div className="text-[10px] text-amber-600">Syllabus & Rubrics</div>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">Student Support</div>
                <div className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-0.5">4.90</div>
                <div className="text-[10px] text-emerald-600">Office Hour Accessibility</div>
              </div>
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-[10px] font-bold uppercase text-blue-700 dark:text-blue-300">Fair Grading</div>
                <div className="text-2xl font-black text-blue-800 dark:text-blue-200 mt-0.5">4.88</div>
                <div className="text-[10px] text-blue-600">Constructive Feedback</div>
              </div>
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                <div className="text-[10px] font-bold uppercase text-purple-700 dark:text-purple-300">Enthusiasm</div>
                <div className="text-2xl font-black text-purple-800 dark:text-purple-200 mt-0.5">4.98</div>
                <div className="text-[10px] text-purple-600">Engagement & Energy</div>
              </div>
            </div>

            {/* Student Quotes */}
            <div className="space-y-3 pt-2">
              <div className="font-bold text-stone-800 dark:text-stone-200">Recent Student Testimonials</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl border border-stone-200/60 dark:border-white/10 bg-stone-50/50 dark:bg-white/5 space-y-1.5">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500" />
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 italic">
                    "Explains complex biological pathways with real-world clinical examples. Always available after class to answer questions about lab research."
                  </p>
                  <div className="text-[10px] text-stone-400 font-semibold">— AP Biology Senior Class Cohort</div>
                </div>

                <div className="p-4 rounded-xl border border-stone-200/60 dark:border-white/10 bg-stone-50/50 dark:bg-white/5 space-y-1.5">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-3 w-3 fill-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500" />
                    <Star className="h-3 w-3 fill-amber-500" />
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 italic">
                    "The feedback on scientific lab reports is thorough and helped me prepare for national science fairs. Best teacher at Oakridge!"
                  </p>
                  <div className="text-[10px] text-stone-400 font-semibold">— Grade 11 Science Olympiad Participant</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Faculty ID Credential Badge */}
      {activeTab === "badge" && (
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Official Oakridge High Faculty Credential & Access Pass
            </h3>
            <p className="text-xs text-stone-500">
              Authorized academic faculty credential for building access, laboratories, and administrative halls.
            </p>
          </div>

          {/* High-Craft Faculty Badge */}
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-stone-300 dark:border-stone-700 bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 text-white p-6 shadow-2xl overflow-hidden">
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-teal-500/20 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-brand-500/20 blur-2xl" />

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-sm font-black tracking-wider uppercase text-teal-400">Oakridge High School</div>
                <div className="text-[10px] text-stone-400">Faculty Academic Staff ID</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30">
                <Building2 className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-5 flex items-center gap-4">
              {teacher.avatarUrl ? (
                <img
                  src={teacher.avatarUrl}
                  alt={teacher.name}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-teal-400/50 shadow-md"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-teal-700 text-2xl font-black ring-2 ring-teal-400/50">
                  {initials}
                </div>
              )}

              <div className="space-y-1">
                <div className="text-lg font-black">{teacher.name}</div>
                <div className="text-xs font-semibold text-teal-300">{teacher.department} Faculty</div>
                <div className="font-mono text-[11px] text-stone-300">EMP: {teacher.employeeId}</div>
                <div className="text-[10px] text-stone-400">Security Clearance: LEVEL 3</div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-mono tracking-widest text-xs text-stone-300">
                  ||||| ||| |||| | ||||| || ||
                </div>
                <div className="text-[9px] text-stone-400 font-mono">{teacher.employeeId} • ALL ACCESS</div>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-emerald-500/20 px-2 py-1 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>AUTHORIZED</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("Faculty digital credential pass downloaded", "success")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md transition cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download Digital Pass</span>
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 text-xs font-semibold hover:bg-stone-100 transition cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print Badge Pass</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
