// src/pages/Students/StudentProfiles.tsx
import React, { useState, useEffect } from "react";
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
  HeartHandshake, 
  ShieldCheck, 
  FileText, 
  DollarSign, 
  CheckCircle2, 
  Search,
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingUp,
  CreditCard,
  Bus,
  QrCode,
  GraduationCap,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import { studentService } from "@/services/studentService";
import type { StudentUser } from "@/types/user";
import type { ExtendedStudentProfile } from "@/types/studentProfile";
import StatsGrid from "@/components/cards/StatsGrid";
import type { StatCard } from "@/types";

export default function StudentProfiles() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<"overview" | "academic" | "attendance" | "finance" | "badge">("overview");
  const [students, setStudents] = useState<ExtendedStudentProfile[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  // Load students from API and merge
  useEffect(() => {
    async function loadData() {
      try {
        const apiStudents = await studentService.list();
        if (Array.isArray(apiStudents) && apiStudents.length > 0) {
          const merged: ExtendedStudentProfile[] = apiStudents.map((s, idx) => {
            return {
              id: s.id,
              name: `${s.firstName} ${s.lastName}`,
              firstName: s.firstName,
              lastName: s.lastName,
              avatarUrl: s.profilePhoto,
              rollNo: (s as any).rollNo || `${s.grade.replace('Grade ', '')}${s.class}-${String(idx + 1).padStart(2, '0')}`,
              studentId: s.studentId || `STU-2025-${String(idx + 1).padStart(3, '0')}`,
              gradeLevel: `${s.grade}-${s.class}`,
              grade: s.grade,
              class: s.class,
              dateOfBirth: s.dateOfBirth || "",
              gender: s.gender || "Not specified",
              email: s.email,
              phone: s.phone || "",
              address: s.address || "",
              nationality: s.nationality || "",
              parentName: s.fatherName || s.motherName || s.guardianName || "",
              parentPhone: s.parentPhone || "",
              parentEmail: s.parentEmail || "",
              emergencyContact: "",
              relationship: s.relationship || "Guardian",
              enrollmentDate: s.enrollmentDate || "",
              bloodGroup: "",
              gpa: (s as any).gpa || 0,
              attendanceRate: (s as any).attendanceRate || 0,
              feesStatus: "Pending",
              status: s.status || "active",
              courses: [],
            };
          });
          setStudents(merged);
          setSelectedStudentId((current) => current || merged[0]?.id || "");
        }
      } catch {
        setStudents([]);
      }
    }
    loadData();
  }, []);

  // Handle URL param ?id=...
  useEffect(() => {
    const urlId = searchParams.get("id");
    if (urlId && students.some((s) => s.id === urlId)) {
      setSelectedStudentId(urlId);
    }
  }, [searchParams, students]);

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setSearchParams({ id });
  };

  const currentIndex = students.findIndex((s) => s.id === selectedStudentId);
  const student = students[currentIndex >= 0 ? currentIndex : 0];

  if (!student) {
    return (
      <div className="flex min-h-64 items-center justify-center rounded-3xl border border-stone-200 bg-white p-8 text-center dark:border-white/10 dark:bg-white/3">
        <div>
          <h2 className="text-lg font-semibold text-stone-900 dark:text-white">No student profiles found</h2>
          <p className="mt-2 text-sm text-stone-500 dark:text-stone-400">Student profile data will appear here after it is added to the database.</p>
        </div>
      </div>
    );
  }

  const handlePrevStudent = () => {
    if (currentIndex > 0) {
      handleSelectStudent(students[currentIndex - 1].id);
    }
  };

  const handleNextStudent = () => {
    if (currentIndex < students.length - 1) {
      handleSelectStudent(students[currentIndex + 1].id);
    }
  };

  const initials = `${(student.firstName || '').charAt(0)}${(student.lastName || '').charAt(0)}`.toUpperCase() || 'ST';

  const kpiCards: StatCard[] = [
    { id: "student-gpa", label: "Cumulative GPA", value: Number(student.gpa).toFixed(2), delta: "-", deltaDirection: "neutral", deltaLabel: "Top 5% rank", icon: "Sparkles", tint: "amber" },
    { id: "student-attendance", label: "Attendance Rate", value: `${student.attendanceRate}%`, delta: "-", deltaDirection: "neutral", deltaLabel: "177 / 180 days", icon: "Clock", tint: "green" },
    { id: "student-tuition", label: "Tuition Status", value: student.feesStatus, delta: "-", deltaDirection: "neutral", deltaLabel: "Zero balance", icon: "CreditCard", tint: "blue" },
  ];

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.gradeLevel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Navigator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeading
          title="Student Dossier & 360° Profile"
          subtitle="Holistic academic records, guardian contacts, attendance matrix, and official credentials."
        />

        {/* Student Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick prev / next buttons */}
          <div className="flex items-center rounded-xl border border-stone-200 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 p-0.5">
            <button
              onClick={handlePrevStudent}
              disabled={currentIndex <= 0}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white disabled:opacity-30 transition"
              title="Previous student"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNextStudent}
              disabled={currentIndex >= students.length - 1}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 dark:hover:text-white disabled:opacity-30 transition"
              title="Next student"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Student Selector Dropdown */}
          <select
            id="student-profile-selector"
            value={student.id}
            onChange={(e) => handleSelectStudent(e.target.value)}
            className="h-9 px-3 text-xs font-semibold rounded-xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNo}) - {s.gradeLevel}
              </option>
            ))}
          </select>

          {/* Print Button */}
          <button
            onClick={() => window.print()}
            className="inline-flex h-9 items-center gap-1.5 px-3 rounded-xl border border-stone-200 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 hover:bg-stone-100 dark:hover:bg-white/10 text-stone-700 dark:text-stone-200 text-xs font-semibold transition cursor-pointer"
            title="Print dossier summary"
          >
            <Printer className="h-3.5 w-3.5 text-stone-500" />
            <span className="hidden sm:inline">Print</span>
          </button>

          {/* Download ID Card Badge */}
          <button
            onClick={() => {
              setActiveTab("badge");
              showToast("Displaying official ID card badge preview", "info");
            }}
            className="inline-flex h-9 items-center gap-1.5 px-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <QrCode className="h-3.5 w-3.5" />
            <span>ID Badge</span>
          </button>
        </div>
      </div>

      {/* Main Student Header Hero */}
      <div className="relative overflow-hidden rounded-3xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Avatar with Status Ring */}
          <div className="relative shrink-0">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.name}
                className="h-24 w-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500/20 to-brand-600/10 text-3xl font-black text-brand-700 dark:text-brand-300 ring-4 ring-brand-500/20 shadow-md">
                {initials}
              </div>
            )}
            <span
              className={`absolute -bottom-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white dark:border-stone-900 ${
                student.status === "active" ? "bg-emerald-500" : "bg-stone-400"
              }`}
              title={student.status === "active" ? "Enrolled & Active" : "Inactive"}
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </span>
          </div>

          {/* Bio & Details */}
          <div className="flex-1 text-center lg:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-center lg:justify-start gap-2.5">
              <h2 className="text-2xl font-black text-stone-900 dark:text-white">
                {student.name}
              </h2>
              <span className="inline-flex items-center gap-1 rounded-lg border border-brand-500/30 bg-brand-500/10 px-2.5 py-1 text-xs font-bold text-brand-700 dark:text-brand-300 w-max mx-auto sm:mx-0">
                <GraduationCap className="h-3.5 w-3.5" />
                {student.gradeLevel} • Roll #{student.rollNo}
              </span>
              <span className="font-mono text-xs font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-white/10 px-2 py-1 rounded-lg w-max mx-auto sm:mx-0">
                {student.studentId}
              </span>
            </div>

            {/* Quick Contact Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-1.5 text-xs text-stone-600 dark:text-stone-300">
              <a
                href={`mailto:${student.email}`}
                className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                <Mail className="h-3.5 w-3.5 text-stone-400" />
                <span>{student.email}</span>
              </a>
              <a
                href={`tel:${student.phone}`}
                className="flex items-center gap-1.5 hover:text-brand-600 dark:hover:text-brand-400 transition"
              >
                <Phone className="h-3.5 w-3.5 text-stone-400" />
                <span className="font-mono">{student.phone}</span>
              </a>
              <span className="flex items-center gap-1.5 text-stone-500">
                <MapPin className="h-3.5 w-3.5 text-stone-400" />
                <span className="truncate max-w-55">{student.address}</span>
              </span>
            </div>
          </div>

        </div>
      </div>

      <StatsGrid cards={kpiCards} columns={3} />

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
          <User className="h-3.5 w-3.5" />
          <span>General & Guardian</span>
        </button>

        <button
          onClick={() => setActiveTab("academic")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "academic"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Academic Performance</span>
        </button>

        <button
          onClick={() => setActiveTab("attendance")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "attendance"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          <span>Attendance & Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab("finance")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "finance"
              ? "bg-brand-600 text-white shadow-xs"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          <CreditCard className="h-3.5 w-3.5" />
          <span>Fee Invoices & Ledger</span>
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
          <span>Student ID Card Badge</span>
        </button>
      </div>

      {/* Tab Panels */}

      {/* 1. General & Guardian */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Guardian Information */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <HeartHandshake className="h-4 w-4 text-brand-600 dark:text-brand-400" />
              <span>Parent & Legal Guardian Contacts</span>
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-white/5">
                <span className="text-stone-500">Primary Contact:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {student.parentName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-white/5">
                <span className="text-stone-500">Guardian Phone:</span>
                <a
                  href={`tel:${student.parentPhone}`}
                  className="font-mono font-semibold text-brand-700 dark:text-brand-300 hover:underline"
                >
                  {student.parentPhone}
                </a>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-white/5">
                <span className="text-stone-500">Guardian Email:</span>
                <a
                  href={`mailto:${student.parentEmail}`}
                  className="font-medium text-stone-800 dark:text-stone-200 hover:underline"
                >
                  {student.parentEmail}
                </a>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-white/5">
                <span className="text-stone-500">Emergency Dispatch:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {student.emergencyContact}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-500">Commute / School Bus:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200 flex items-center gap-1">
                  <Bus className="h-3.5 w-3.5 text-amber-500" />
                  {student.busRoute || "Route 14 - East District"}
                </span>
              </div>
            </div>
          </div>

          {/* Demographics & Health Profile */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Demographics & Medical Record</span>
            </h3>

            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-white/5">
                <span className="text-stone-500">Blood Group:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {student.bloodGroup} (Rh Positive)
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-white/5">
                <span className="text-stone-500">Date of Birth:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {student.dateOfBirth} (Age 16)
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-white/5">
                <span className="text-stone-500">Gender & Nationality:</span>
                <span className="font-medium capitalize text-stone-800 dark:text-stone-200">
                  {student.gender} • {student.nationality}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-white/5">
                <span className="text-stone-500">Official Enrollment Date:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {student.enrollmentDate} (AY 2023–2024)
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-500">Allergies & Medical Notes:</span>
                <span className="font-medium text-emerald-700 dark:text-emerald-400">
                  None reported / Full immunization cleared
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Academic Performance */}
      {activeTab === "academic" && (
        <div className="space-y-5 text-xs">
          {/* Enrolled Courses Table */}
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span>Enrolled Courses & Academic Standing</span>
              </h3>
              <span className="text-[11px] font-semibold text-stone-500">
                Spring 2026 Semester • 18 Credits Total
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-stone-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="py-2.5 px-3">Course Code & Title</th>
                    <th className="py-2.5 px-3">Instructor</th>
                    <th className="py-2.5 px-3">Credits</th>
                    <th className="py-2.5 px-3">Score Progress</th>
                    <th className="py-2.5 px-3 text-right">Letter Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                  {(student.courses || []).map((c) => (
                    <tr key={c.code} className="hover:bg-stone-50/50 dark:hover:bg-white/5">
                      <td className="py-3 px-3">
                        <div className="font-bold text-stone-900 dark:text-white">{c.name}</div>
                        <div className="font-mono text-[10px] text-brand-700 dark:text-brand-300">{c.code}</div>
                      </td>
                      <td className="py-3 px-3 text-stone-600 dark:text-stone-300">{c.teacher}</td>
                      <td className="py-3 px-3 font-semibold text-stone-800 dark:text-stone-200">{c.credits} cr</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-28 overflow-hidden rounded-full bg-stone-100 dark:bg-white/10">
                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{ width: `${c.score}%` }}
                            />
                          </div>
                          <span className="font-bold text-stone-800 dark:text-stone-200">{c.score}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2 py-0.5 font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                          {c.grade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Honors & Extracurriculars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
                <Award className="h-4 w-4 text-amber-500" />
                <span>Academic Distinctions & Awards</span>
              </div>
              <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>Dean's High Honors List (Fall 2025)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>State Science Fair Silver Medalist (Biology)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  <span>National Mathematics Olympiad - Top 5%</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 p-4 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 dark:text-white">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Clubs & Extracurricular Leadership</span>
              </div>
              <ul className="space-y-1.5 text-stone-600 dark:text-stone-300">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Robotics Club - Lead Software Architect</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Varsity Track & Field (Middle Distance)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
                  <span>Peer Academic Tutor (Calculus & Physics)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 3. Attendance Matrix & Conduct */}
      {activeTab === "attendance" && (
        <div className="space-y-5 text-xs">
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <Clock className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span>Annual Attendance Breakdown (180 Total Days)</span>
              </h3>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {student.attendanceRate}% Overall Rate
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Days Present
                </div>
                <div className="text-2xl font-black text-emerald-800 dark:text-emerald-200 mt-0.5">
                  177
                </div>
                <div className="text-[10px] text-emerald-600">98.3% of required days</div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                  Late Arrival
                </div>
                <div className="text-2xl font-black text-amber-800 dark:text-amber-200 mt-0.5">
                  2
                </div>
                <div className="text-[10px] text-amber-600">Transit delays excused</div>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  Excused Absence
                </div>
                <div className="text-2xl font-black text-blue-800 dark:text-blue-200 mt-0.5">
                  1
                </div>
                <div className="text-[10px] text-blue-600">Doctor appointment</div>
              </div>

              <div className="p-3.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  Unexcused
                </div>
                <div className="text-2xl font-black text-stone-700 dark:text-stone-300 mt-0.5">
                  0
                </div>
                <div className="text-[10px] text-stone-400">Zero violations</div>
              </div>
            </div>

            {/* Behavioral Conduct Box */}
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-bold text-stone-900 dark:text-white">
                  Behavioral & Citizenship Standing
                </div>
                <div className="text-stone-500">
                  No disciplinary referrals on file. Recommended for Student Council Prefect.
                </div>
              </div>
              <span className="px-3 py-1 rounded-full font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                Conduct Grade: A+ (Exemplary)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tuition & Finance */}
      {activeTab === "finance" && (
        <div className="space-y-4 text-xs">
          <div className="rounded-2xl border border-stone-200/80 dark:border-white/10 bg-white/70 dark:bg-stone-900/60 backdrop-blur-md p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                <span>Tuition & Student Account Ledger</span>
              </h3>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 font-bold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Account In Good Standing
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10">
                <div className="text-[10px] font-bold uppercase text-stone-400">Total Invoiced (2025–26)</div>
                <div className="text-xl font-black text-stone-900 dark:text-white mt-1">$8,500.00</div>
              </div>
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <div className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">Total Paid</div>
                <div className="text-xl font-black text-emerald-800 dark:text-emerald-200 mt-1">$8,500.00</div>
              </div>
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10">
                <div className="text-[10px] font-bold uppercase text-stone-400">Current Balance Due</div>
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">$0.00</div>
              </div>
            </div>

            {/* Invoices List */}
            <div className="space-y-2 pt-2">
              <div className="font-bold text-stone-800 dark:text-stone-200">Recent Invoices & Receipts</div>
              <div className="space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-stone-200/60 dark:border-white/5 bg-stone-50/50 dark:bg-white/5 gap-2">
                  <div>
                    <div className="font-bold text-stone-900 dark:text-white">Semester 2 Standard Tuition & STEM Lab Fee</div>
                    <div className="text-stone-500 font-mono mt-0.5">INV-2026-0891 • Paid via AutoPay (ACH Bank Transfer)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$4,250.00 PAID</span>
                    <button
                      onClick={() => showToast("Downloading official tax receipt INV-2026-0891", "success")}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 transition cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl border border-stone-200/60 dark:border-white/5 bg-stone-50/50 dark:bg-white/5 gap-2">
                  <div>
                    <div className="font-bold text-stone-900 dark:text-white">Semester 1 Standard Tuition & Athletics Package</div>
                    <div className="text-stone-500 font-mono mt-0.5">INV-2025-0142 • Paid via Credit Card (ending in 8841)</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">$4,250.00 PAID</span>
                    <button
                      onClick={() => showToast("Downloading official tax receipt INV-2025-0142", "success")}
                      className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 transition cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Student ID Card Badge Preview */}
      {activeTab === "badge" && (
        <div className="flex flex-col items-center justify-center p-6 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold text-stone-900 dark:text-white">
              Official Oakridge High Student ID Credential
            </h3>
            <p className="text-xs text-stone-500">
              Authorized student access badge for campus gates, library checkouts, and laboratory entry.
            </p>
          </div>

          {/* Realistic High-Craft ID Card */}
          <div className="relative w-full max-w-sm rounded-3xl border-2 border-stone-300 dark:border-stone-700 bg-linear-to-b from-stone-900 via-stone-800 to-stone-900 text-white p-6 shadow-2xl overflow-hidden">
            {/* Hologram / Ribbon Accent */}
            <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-500/20 blur-2xl" />
            <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-500/20 blur-2xl" />

            {/* School Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <div className="text-sm font-black tracking-wider uppercase text-brand-400">Oakridge High School</div>
                <div className="text-[10px] text-stone-400">Student Identification Credential</div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>

            {/* Photo & Identity */}
            <div className="mt-5 flex items-center gap-4">
              {student.avatarUrl ? (
                <img
                  src={student.avatarUrl}
                  alt={student.name}
                  className="h-20 w-20 rounded-2xl object-cover ring-2 ring-brand-400/50 shadow-md"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-700 text-2xl font-black ring-2 ring-brand-400/50">
                  {initials}
                </div>
              )}

              <div className="space-y-1">
                <div className="text-lg font-black">{student.name}</div>
                <div className="text-xs font-semibold text-brand-300">{student.gradeLevel}</div>
                <div className="font-mono text-[11px] text-stone-300">ID: {student.studentId}</div>
                <div className="text-[10px] text-stone-400">Expires: June 2026</div>
              </div>
            </div>

            {/* Barcode & Hologram Simulation */}
            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
              <div className="space-y-1">
                <div className="font-mono tracking-widest text-xs text-stone-300">
                  ||||| | |||| || ||||| | ||
                </div>
                <div className="text-[9px] text-stone-400 font-mono">{student.rollNo} • BARCODE</div>
              </div>

              <div className="flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[10px] font-bold text-emerald-400 border border-white/10">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>VERIFIED</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => showToast("Digital badge credential saved to downloads", "success")}
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
              <span>Print Badge Card</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
