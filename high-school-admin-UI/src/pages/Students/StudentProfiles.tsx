import { useState } from "react";
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
  Download
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface StudentProfileData {
  id: string;
  name: string;
  avatarUrl: string;
  rollNo: string;
  gradeLevel: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  emergencyContact: string;
  enrollmentDate: string;
  bloodGroup: string;
  gpa: number;
  attendanceRate: number;
  feesStatus: "Paid" | "Pending" | "Partial";
}

export default function StudentProfiles() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<"overview" | "academic" | "attendance" | "finance" | "documents">("overview");
  const [selectedStudentId, setSelectedStudentId] = useState("stu-1");

  const students: StudentProfileData[] = [
    {
      id: "stu-1",
      name: "Ethan Walker",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop",
      rollNo: "10A-01",
      gradeLevel: "Grade 10-A",
      dateOfBirth: "2009-04-12",
      gender: "Male",
      email: "ethan.walker@student.oakridge.edu",
      phone: "+1 (555) 234-5678",
      address: "742 Evergreen Terrace, Springfield",
      parentName: "Arthur Walker & Clara Walker",
      parentPhone: "+1 (555) 876-5432",
      parentEmail: "arthur.walker@gmail.com",
      emergencyContact: "+1 (555) 999-1122 (Dr. David Walker - Uncle)",
      enrollmentDate: "2023-08-20",
      bloodGroup: "O+",
      gpa: 3.92,
      attendanceRate: 98.2,
      feesStatus: "Paid",
    },
    {
      id: "stu-2",
      name: "Sophia Martinez",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=128&h=128&fit=crop",
      rollNo: "10A-02",
      gradeLevel: "Grade 10-A",
      dateOfBirth: "2009-08-19",
      gender: "Female",
      email: "sophia.martinez@student.oakridge.edu",
      phone: "+1 (555) 345-6789",
      address: "128 Beacon Hill Ave, Boston",
      parentName: "Carlos & Elena Martinez",
      parentPhone: "+1 (555) 987-6543",
      parentEmail: "carlos.martinez@corp.com",
      emergencyContact: "+1 (555) 444-2211",
      enrollmentDate: "2023-08-20",
      bloodGroup: "A+",
      gpa: 3.88,
      attendanceRate: 96.5,
      feesStatus: "Paid",
    },
  ];

  const student = students.find((s) => s.id === selectedStudentId) || students[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Student Dossier & Profiles"
          subtitle="Comprehensive 360-degree academic history, attendance record, and parent contact details."
        />
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.rollNo})
              </option>
            ))}
          </select>

          <button
            onClick={() => showToast("Downloading student ID card badge", "success")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Download size={14} />
            <span>ID Badge</span>
          </button>
        </div>
      </div>

      {/* Main Student Header Hero */}
      <div className="rounded-3xl p-6 glass-strong border border-stone-200/80 dark:border-white/15 flex flex-col md:flex-row items-center gap-6 shadow-md">
        <img
          src={student.avatarUrl}
          alt={student.name}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
        />

        <div className="flex-1 text-center md:text-left space-y-1.5">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">
              {student.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-700 dark:text-brand-300 w-max mx-auto md:mx-0">
              {student.gradeLevel} • Roll #{student.rollNo}
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-stone-500">
            <span className="flex items-center gap-1">
              <Mail size={13} /> {student.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={13} /> {student.phone}
            </span>
            <span className="flex items-center gap-1">
              <MapPin size={13} /> {student.address}
            </span>
          </div>
        </div>

        {/* Quick KPI Counters */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-center min-w-[90px]">
            <div className="text-[10px] text-stone-400 font-bold uppercase">Cum. GPA</div>
            <div className="text-lg font-black text-brand-600 dark:text-brand-400">
              {student.gpa}
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-center min-w-[90px]">
            <div className="text-[10px] text-stone-400 font-bold uppercase">Attendance</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {student.attendanceRate}%
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-center min-w-[90px]">
            <div className="text-[10px] text-stone-400 font-bold uppercase">Fee Dues</div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400">
              {student.feesStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex items-center gap-2 border-b border-stone-200/70 dark:border-white/10 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "overview"
              ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          General & Guardian
        </button>
        <button
          onClick={() => setActiveTab("academic")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "academic"
              ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          Academic Performance
        </button>
        <button
          onClick={() => setActiveTab("attendance")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "attendance"
              ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          Attendance Log
        </button>
        <button
          onClick={() => setActiveTab("finance")}
          className={`px-4 py-2 rounded-xl transition cursor-pointer ${
            activeTab === "finance"
              ? "bg-brand-600 text-white shadow-md shadow-brand-500/20"
              : "text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5"
          }`}
        >
          Fee Invoices
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Guardian Information */}
          <div className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <HeartHandshake size={18} className="text-brand-500" />
              <span>Parent & Guardian Information</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-200/40 dark:border-white/5">
                <span className="text-stone-500">Parent / Guardian:</span>
                <span className="font-semibold text-stone-800 dark:text-stone-200">
                  {student.parentName}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200/40 dark:border-white/5">
                <span className="text-stone-500">Contact Phone:</span>
                <span className="font-mono font-medium text-stone-800 dark:text-stone-200">
                  {student.parentPhone}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200/40 dark:border-white/5">
                <span className="text-stone-500">Parent Email:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {student.parentEmail}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-500">Emergency Contact:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {student.emergencyContact}
                </span>
              </div>
            </div>
          </div>

          {/* Medical & Bio Details */}
          <div className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 space-y-4">
            <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-500" />
              <span>Medical & Enrollment Records</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-200/40 dark:border-white/5">
                <span className="text-stone-500">Blood Group:</span>
                <span className="font-bold text-rose-600 dark:text-rose-400">
                  {student.bloodGroup}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200/40 dark:border-white/5">
                <span className="text-stone-500">Date of Birth:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {student.dateOfBirth} (Age 16)
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-200/40 dark:border-white/5">
                <span className="text-stone-500">Gender:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {student.gender}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-stone-500">Admission Enrollment Date:</span>
                <span className="font-medium text-stone-800 dark:text-stone-200">
                  {student.enrollmentDate}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "academic" && (
        <div className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-4">
            Enrolled Courses & Current Scores
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/10">
              <div className="text-xs text-stone-500">Advanced Biology</div>
              <div className="text-lg font-bold text-stone-900 dark:text-white mt-1">94% (A+)</div>
              <div className="text-[11px] text-stone-400 mt-1">Dr. John Whitfield</div>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/10">
              <div className="text-xs text-stone-500">Calculus BC</div>
              <div className="text-lg font-bold text-stone-900 dark:text-white mt-1">96% (A+)</div>
              <div className="text-[11px] text-stone-400 mt-1">Prof. Marcus Kane</div>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/10">
              <div className="text-xs text-stone-500">AP Computer Science</div>
              <div className="text-lg font-bold text-stone-900 dark:text-white mt-1">98% (A+)</div>
              <div className="text-[11px] text-stone-400 mt-1">Elena Vance</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "attendance" && (
        <div className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white mb-3">
            30-Day Attendance Record
          </h3>
          <p className="text-xs text-stone-500 mb-4">
            Total School Days: 180 • Present: 177 • Late: 2 • Excused Medical: 1
          </p>
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 size={16} /> Exemplary 98.2% attendance record this semester.
          </div>
        </div>
      )}

      {activeTab === "finance" && (
        <div className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 space-y-3">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white">
            Tuition & Fee Status
          </h3>
          <div className="p-4 rounded-xl bg-stone-50 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 flex items-center justify-between text-xs">
            <div>
              <div className="font-bold text-stone-900 dark:text-white">
                Semester 2 Standard Tuition
              </div>
              <div className="text-stone-500 font-mono mt-0.5">INV-2026-0891 • Paid in Full</div>
            </div>
            <span className="px-2.5 py-1 rounded-md font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
              $4,250.00 PAID
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
