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
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Star,
  Download
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface TeacherProfileData {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  department: string;
  employeeId: string;
  email: string;
  phone: string;
  joiningDate: string;
  qualifications: string;
  specialization: string;
  weeklyTeachingHours: number;
  assignedClasses: string[];
  subjectsTaught: string[];
  performanceRating: number;
  status: "Active" | "On Leave";
}

export default function TeacherProfiles() {
  const { showToast } = useToast();
  const [selectedId, setSelectedId] = useState("t1");

  const faculty: TeacherProfileData[] = [
    {
      id: "t1",
      name: "Dr. John Whitfield",
      title: "Head of Science & Biology Faculty",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop",
      department: "Science Department",
      employeeId: "FAC-SCI-01",
      email: "john.whitfield@oakridge.edu",
      phone: "+1 (555) 019-2834",
      joiningDate: "2019-08-15",
      qualifications: "Ph.D. in Molecular Biology (Harvard University)",
      specialization: "Cellular Biochemistry & Genetics",
      weeklyTeachingHours: 18,
      assignedClasses: ["Grade 10-A", "Grade 10-B", "Grade 12-A"],
      subjectsTaught: ["Advanced Biology", "AP Biology Seminar"],
      performanceRating: 4.9,
      status: "Active",
    },
    {
      id: "t2",
      name: "Prof. Marcus Kane",
      title: "Senior Mathematics Lecturer",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128&h=128&fit=crop",
      department: "Mathematics",
      employeeId: "FAC-MTH-03",
      email: "marcus.kane@oakridge.edu",
      phone: "+1 (555) 019-9943",
      joiningDate: "2018-01-10",
      qualifications: "M.Sc. in Applied Mathematics (MIT)",
      specialization: "Calculus, Differential Equations & Topology",
      weeklyTeachingHours: 20,
      assignedClasses: ["Grade 11-A", "Grade 12-A"],
      subjectsTaught: ["Calculus BC", "Linear Algebra"],
      performanceRating: 4.85,
      status: "Active",
    },
  ];

  const teacher = faculty.find((f) => f.id === selectedId) || faculty[0];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Teacher Profiles & Dossier"
          subtitle="Faculty academic credentials, assigned workloads, performance reviews, and department roles."
        />
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {faculty.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.department})
              </option>
            ))}
          </select>

          <button
            onClick={() => showToast("Downloading faculty credentials PDF", "success")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Download size={14} />
            <span>Faculty CV</span>
          </button>
        </div>
      </div>

      {/* Hero Card */}
      <div className="rounded-3xl p-6 glass-strong border border-stone-200/80 dark:border-white/15 flex flex-col md:flex-row items-center gap-6 shadow-md">
        <img
          src={teacher.avatarUrl}
          alt={teacher.name}
          className="w-24 h-24 rounded-2xl object-cover ring-4 ring-brand-500/20 shadow-md"
        />

        <div className="flex-1 text-center md:text-left space-y-1.5">
          <div className="flex flex-col md:flex-row md:items-center gap-2">
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">
              {teacher.name}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/15 text-brand-700 dark:text-brand-300 w-max mx-auto md:mx-0">
              {teacher.employeeId} • {teacher.department}
            </span>
          </div>

          <div className="text-xs font-medium text-stone-600 dark:text-stone-300">
            {teacher.title}
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-stone-500 pt-1">
            <span className="flex items-center gap-1">
              <Mail size={13} /> {teacher.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone size={13} /> {teacher.phone}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={13} /> Joined: {teacher.joiningDate}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-center min-w-[90px]">
            <div className="text-[10px] text-stone-400 font-bold uppercase">Workload</div>
            <div className="text-lg font-black text-brand-600 dark:text-brand-400">
              {teacher.weeklyTeachingHours}h / wk
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/60 dark:border-white/10 text-center min-w-[90px]">
            <div className="text-[10px] text-stone-400 font-bold uppercase">Rating</div>
            <div className="text-lg font-black text-amber-500 flex items-center justify-center gap-1">
              <Star size={16} fill="currentColor" /> {teacher.performanceRating}
            </div>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
            <GraduationCap size={18} className="text-brand-500" />
            <span>Academic Qualifications & Background</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div className="py-2 border-b border-stone-200/40 dark:border-white/5">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">
                Degrees & Certifications
              </span>
              <span className="font-semibold text-stone-800 dark:text-stone-200 text-sm">
                {teacher.qualifications}
              </span>
            </div>

            <div className="py-2 border-b border-stone-200/40 dark:border-white/5">
              <span className="text-stone-400 block text-[10px] uppercase font-bold">
                Domain Specialization
              </span>
              <span className="font-medium text-stone-800 dark:text-stone-200">
                {teacher.specialization}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 space-y-4">
          <h3 className="font-bold text-sm text-stone-900 dark:text-white flex items-center gap-2">
            <BookOpen size={18} className="text-emerald-500" />
            <span>Assigned Teaching Load & Classes</span>
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1.5">
                Active Subjects Taught
              </span>
              <div className="flex flex-wrap gap-1.5">
                {teacher.subjectsTaught.map((sub, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-300 font-semibold"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-stone-400 block text-[10px] uppercase font-bold mb-1.5">
                Assigned Class Roster
              </span>
              <div className="flex flex-wrap gap-1.5">
                {teacher.assignedClasses.map((cls, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-semibold"
                  >
                    {cls}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
