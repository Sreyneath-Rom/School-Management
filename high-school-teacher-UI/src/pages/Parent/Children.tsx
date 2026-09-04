import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { 
  Users, 
  Plus, 
  GraduationCap, 
  Award, 
  Calendar, 
  CheckCircle2, 
  ArrowRight, 
  Phone, 
  Mail, 
  FileText, 
  X,
  Sparkles
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface ChildData {
  id: string;
  name: string;
  avatar: string;
  gender: string;
  dob: string;
  gradeLevel: string;
  classSection: string;
  rollNumber: string;
  gpa: number;
  attendancePct: number;
  classAdvisor: string;
  advisorEmail: string;
  advisorPhone: string;
  bloodGroup: string;
  allergies: string;
  enrolledSubjects: number;
}

const INITIAL_CHILDREN: ChildData[] = [
  {
    id: "child-1",
    name: "Lucas Vance",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    gender: "Male",
    dob: "October 14, 2008",
    gradeLevel: "Grade 11",
    classSection: "Grade 11A",
    rollNumber: "STD-2025-041",
    gpa: 3.84,
    attendancePct: 96.8,
    classAdvisor: "Dr. Sarah Jenkins",
    advisorEmail: "sarah.jenkins@oakridge.edu",
    advisorPhone: "+1 (555) 234-8901",
    bloodGroup: "O+",
    allergies: "None recorded",
    enrolledSubjects: 6,
  },
  {
    id: "child-2",
    name: "Maya Vance",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    gender: "Female",
    dob: "August 22, 2010",
    gradeLevel: "Grade 9",
    classSection: "Grade 9B",
    rollNumber: "STD-2025-092",
    gpa: 3.92,
    attendancePct: 98.2,
    classAdvisor: "Elena Rostova",
    advisorEmail: "elena.rostova@oakridge.edu",
    advisorPhone: "+1 (555) 872-1244",
    bloodGroup: "A+",
    allergies: "Mild Penicillin allergy",
    enrolledSubjects: 7,
  },
];

export default function Children() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [children, setChildren] = useState<ChildData[]>(INITIAL_CHILDREN);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  // Link Form
  const [linkStudentId, setLinkStudentId] = useState("");
  const [linkPin, setLinkPin] = useState("");
  const [relationship, setRelationship] = useState("Mother");

  const handleLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkStudentId || !linkPin) {
      showToast("Please enter student ID and verification PIN", "error");
      return;
    }

    const mockChild: ChildData = {
      id: `child-${Date.now()}`,
      name: "Julian Vance",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      gender: "Male",
      dob: "March 11, 2012",
      gradeLevel: "Grade 7",
      classSection: "Grade 7A",
      rollNumber: linkStudentId.toUpperCase(),
      gpa: 3.75,
      attendancePct: 95.5,
      classAdvisor: "Amina Al-Mansoor",
      advisorEmail: "amina.mansoor@oakridge.edu",
      advisorPhone: "+1 (555) 432-8871",
      bloodGroup: "O+",
      allergies: "None",
      enrolledSubjects: 6,
    };

    setChildren([...children, mockChild]);
    setIsLinkModalOpen(false);
    setLinkStudentId("");
    setLinkPin("");
    showToast("Student profile linked to your parent account", "success");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Registered Wards & Children"
          subtitle="Manage parent association, emergency medical disclosures, and monitor educational trajectory."
        />
        <button
          onClick={() => setIsLinkModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Link Sibling / Ward</span>
        </button>
      </div>

      {/* Children Cards Roster */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <div
            key={child.id}
            className="rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 p-6 shadow-sm hover:border-brand-500/30 transition flex flex-col justify-between space-y-5 bg-white/40 dark:bg-stone-900/40"
          >
            <div>
              {/* Header Profile */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500/30 shadow-sm shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-stone-900 dark:text-white">
                      {child.name}
                    </h3>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                      {child.classSection} • Roll ID: <span className="font-mono text-brand-600 dark:text-brand-400">{child.rollNumber}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      DOB: {child.dob} ({child.gender})
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 border border-brand-200/50 dark:border-brand-800/40 shrink-0">
                  {child.gradeLevel}
                </span>
              </div>

              {/* Performance Metrics Bar */}
              <div className="grid grid-cols-3 gap-2.5 mt-5 p-3 rounded-xl bg-stone-50 dark:bg-white/5 text-center text-xs">
                <div>
                  <div className="text-stone-400 text-[11px]">Current GPA</div>
                  <div className="text-base font-extrabold text-stone-900 dark:text-white mt-0.5">
                    {child.gpa}
                  </div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Attendance</div>
                  <div className="text-base font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {child.attendancePct}%
                  </div>
                </div>
                <div>
                  <div className="text-stone-400 text-[11px]">Courses</div>
                  <div className="text-base font-extrabold text-stone-900 dark:text-white mt-0.5">
                    {child.enrolledSubjects} Active
                  </div>
                </div>
              </div>

              {/* Advisor & Health Info */}
              <div className="mt-4 space-y-2 text-xs text-stone-600 dark:text-stone-300">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Class Advisor:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{child.classAdvisor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">Blood Group / Allergy:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">{child.bloodGroup} • {child.allergies}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-stone-200/60 dark:border-white/5">
              <Link
                to="/students/leave-requests"
                className="text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-brand-600 transition"
              >
                Request Leave
              </Link>
              
              <Link
                to={`/parent/children/${child.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold hover:opacity-90 transition shadow-sm"
              >
                <span>View Full Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Link Ward Modal */}
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass border border-stone-200/80 dark:border-white/10 p-6 shadow-2xl bg-white dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-brand-500" />
                <span>Link Sibling / New Ward</span>
              </h3>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLinkSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Student Roll / Admission ID *
                </label>
                <input
                  type="text"
                  required
                  value={linkStudentId}
                  onChange={(e) => setLinkStudentId(e.target.value)}
                  placeholder="e.g. STD-2025-092"
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Parent Access PIN / Verification Code *
                </label>
                <input
                  type="password"
                  required
                  value={linkPin}
                  onChange={(e) => setLinkPin(e.target.value)}
                  placeholder="Issued by registrar office"
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Relationship to Student
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                >
                  <option value="Mother" className="dark:bg-stone-900">Mother</option>
                  <option value="Father" className="dark:bg-stone-900">Father</option>
                  <option value="Legal Guardian" className="dark:bg-stone-900">Legal Guardian</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20"
                >
                  Confirm & Link Ward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
