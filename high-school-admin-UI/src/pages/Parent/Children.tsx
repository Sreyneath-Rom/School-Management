// src/pages/Parent/Children.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { Plus, ArrowRight, X, Sparkles } from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

const SEAM_B = "shadow-[0_1px_0_var(--neu-shadow-dark)]";
const SEAM_T = "shadow-[0_-1px_0_var(--neu-shadow-dark)]";

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

// Inputs inherit the sunken-well look from globals.css (.neu-inset).
const inputBase =
  "w-full px-3 py-2 rounded-xl text-xs text-fg focus:outline-none focus:ring-2 focus:ring-brand-500";
const labelBase = "block font-semibold text-fg-muted mb-1";

export default function Children() {
  const { showToast } = useToast();
  const [children, setChildren] = useState<ChildData[]>(INITIAL_CHILDREN);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Registered Wards & Children"
          subtitle="Manage parent association, emergency medical disclosures, and monitor educational trajectory."
        />
        <button
          onClick={() => setIsLinkModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl theme-button-primary text-xs font-semibold cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Link Sibling / Ward</span>
        </button>
      </div>

      {/* Children cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {children.map((child) => (
          <div
            key={child.id}
            className="rounded-2xl glass-sm p-6 hover:shadow-(--glass-strong-shadow) transition-shadow duration-300 flex flex-col justify-between space-y-5"
          >
            <div>
              {/* Header profile */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  {/* Avatar — brand ring only, no local elevation
                      (the card already provides the raised surface) */}
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/30 shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-fg">{child.name}</h3>
                    <div className="text-xs text-fg-muted font-medium">
                      {child.classSection} • Roll ID:{" "}
                      <span className="font-mono text-brand-600 dark:text-brand-400">
                        {child.rollNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-fg-muted/70 mt-0.5">
                      DOB: {child.dob} ({child.gender})
                    </div>
                  </div>
                </div>

                {/* Grade chip — brand tint, matches chips elsewhere */}
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/25 shrink-0">
                  {child.gradeLevel}
                </span>
              </div>

              {/* Performance metrics bar */}
              <div className="grid grid-cols-3 gap-2.5 mt-5 p-3 rounded-xl shadow-sunken text-center text-xs">
                <div>
                  <div className="text-fg-muted/70 text-[11px]">Current GPA</div>
                  <div className="text-base font-extrabold text-fg mt-0.5">{child.gpa}</div>
                </div>
                <div>
                  <div className="text-fg-muted/70 text-[11px]">Attendance</div>
                  <div className="text-base font-extrabold text-success mt-0.5">
                    {child.attendancePct}%
                  </div>
                </div>
                <div>
                  <div className="text-fg-muted/70 text-[11px]">Courses</div>
                  <div className="text-base font-extrabold text-fg mt-0.5">
                    {child.enrolledSubjects} Active
                  </div>
                </div>
              </div>

              {/* Advisor & health info */}
              <div className="mt-4 space-y-2 text-xs text-fg-muted">
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted/70">Class Advisor:</span>
                  <span className="font-semibold text-fg">{child.classAdvisor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-fg-muted/70">Blood Group / Allergy:</span>
                  <span className="font-semibold text-fg">
                    {child.bloodGroup} • {child.allergies}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className={`flex items-center justify-between pt-4 ${SEAM_T}`}>
              <Link
                to="/students/leave-requests"
                className="text-xs font-semibold text-fg-muted hover:text-brand-600 dark:hover:text-brand-300 transition"
              >
                Request Leave
              </Link>

              <Link
                to={`/parent/children/${child.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl theme-button-primary text-xs font-semibold"
              >
                <span>View Full Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Link ward modal */}
      {isLinkModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 theme-overlay backdrop-blur-sm animate-in fade-in duration-150"
          role="presentation"
          onMouseDown={(e) => { if (e.target === e.currentTarget) setIsLinkModalOpen(false) }}
        >
          <div className="w-full max-w-md rounded-2xl glass-strong p-6 space-y-4 animate-in zoom-in-95 duration-150" role="dialog" aria-modal="true">
            <div className={`flex items-center justify-between pb-3 ${SEAM_B}`}>
              <h3 className="text-base font-bold text-fg flex items-center gap-2">
                <Sparkles size={18} className="text-brand-600 dark:text-brand-400" />
                <span>Link Sibling / New Ward</span>
              </h3>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                aria-label="Close"
                className="p-1 rounded-lg text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleLinkSubmit} className="space-y-3 text-xs">
              <div>
                <label className={labelBase}>Student Roll / Admission ID *</label>
                <input
                  type="text"
                  required
                  value={linkStudentId}
                  onChange={(e) => setLinkStudentId(e.target.value)}
                  placeholder="e.g. STD-2025-092"
                  className={`${inputBase} font-mono`}
                />
              </div>

              <div>
                <label className={labelBase}>Parent Access PIN / Verification Code *</label>
                <input
                  type="password"
                  required
                  value={linkPin}
                  onChange={(e) => setLinkPin(e.target.value)}
                  placeholder="Issued by registrar office"
                  className={inputBase}
                />
              </div>

              <div>
                <label className={labelBase}>Relationship to Student</label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  className={`${inputBase} cursor-pointer`}
                >
                  <option value="Mother">Mother</option>
                  <option value="Father">Father</option>
                  <option value="Legal Guardian">Legal Guardian</option>
                </select>
              </div>

              <div className={`flex items-center justify-end gap-2 pt-3 ${SEAM_T}`}>
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  className="glass-sm glass-interactive px-4 py-2 rounded-xl text-fg-muted hover:text-fg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl theme-button-primary font-semibold cursor-pointer"
                >
                  Confirm &amp; Link Ward
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}