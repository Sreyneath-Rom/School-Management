import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Users, 
  BookOpen, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Building, 
  CheckCircle2, 
  Trash2, 
  Edit3, 
  AlertCircle,
  Sparkles,
  Calendar,
  X
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  teacherEmail: string;
  avatar: string;
  department: string;
  subject: string;
  subjectCode: string;
  classSection: string;
  gradeLevel: string;
  room: string;
  weeklyHours: number;
  role: "Lead Teacher" | "Subject Head" | "Assistant";
  status: "Active" | "Pending";
}

const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-1",
    teacherId: "tch-1",
    teacherName: "Dr. Sarah Jenkins",
    teacherEmail: "sarah.jenkins@oakridge.edu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    department: "Mathematics",
    subject: "Advanced Calculus",
    subjectCode: "MATH-401",
    classSection: "Grade 12A",
    gradeLevel: "Grade 12",
    room: "Room 302",
    weeklyHours: 6,
    role: "Subject Head",
    status: "Active",
  },
  {
    id: "asg-2",
    teacherId: "tch-1",
    teacherName: "Dr. Sarah Jenkins",
    teacherEmail: "sarah.jenkins@oakridge.edu",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    department: "Mathematics",
    subject: "AP Statistics",
    subjectCode: "MATH-402",
    classSection: "Grade 11B",
    gradeLevel: "Grade 11",
    room: "Room 302",
    weeklyHours: 5,
    role: "Lead Teacher",
    status: "Active",
  },
  {
    id: "asg-3",
    teacherId: "tch-2",
    teacherName: "Prof. Marcus Thorne",
    teacherEmail: "marcus.thorne@oakridge.edu",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    department: "Science",
    subject: "Quantum Physics & Mechanics",
    subjectCode: "PHYS-301",
    classSection: "Grade 11A",
    gradeLevel: "Grade 11",
    room: "Science Lab B",
    weeklyHours: 6,
    role: "Subject Head",
    status: "Active",
  },
  {
    id: "asg-4",
    teacherId: "tch-3",
    teacherName: "Elena Rostova",
    teacherEmail: "elena.rostova@oakridge.edu",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    department: "Languages",
    subject: "World Literature & Composition",
    subjectCode: "ENG-201",
    classSection: "Grade 10B",
    gradeLevel: "Grade 10",
    room: "Room 105",
    weeklyHours: 5,
    role: "Lead Teacher",
    status: "Active",
  },
  {
    id: "asg-5",
    teacherId: "tch-4",
    teacherName: "David Kim",
    teacherEmail: "david.kim@oakridge.edu",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    department: "Computer Science",
    subject: "Data Structures & Python",
    subjectCode: "CS-101",
    classSection: "Grade 10A",
    gradeLevel: "Grade 10",
    room: "Computer Lab 1",
    weeklyHours: 4,
    role: "Lead Teacher",
    status: "Active",
  },
  {
    id: "asg-6",
    teacherId: "tch-5",
    teacherName: "Amina Al-Mansoor",
    teacherEmail: "amina.mansoor@oakridge.edu",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    department: "Humanities",
    subject: "Modern World History",
    subjectCode: "HIST-202",
    classSection: "Grade 9A",
    gradeLevel: "Grade 9",
    room: "Room 204",
    weeklyHours: 4,
    role: "Lead Teacher",
    status: "Active",
  },
  {
    id: "asg-7",
    teacherId: "tch-6",
    teacherName: "Julian Hayes",
    teacherEmail: "julian.hayes@oakridge.edu",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    department: "Arts",
    subject: "Studio Art & Design",
    subjectCode: "ART-101",
    classSection: "Grade 9B",
    gradeLevel: "Grade 9",
    room: "Art Studio 2",
    weeklyHours: 4,
    role: "Assistant",
    status: "Pending",
  },
];

export default function TeacherAssignments() {
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState<Assignment[]>(INITIAL_ASSIGNMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    teacherName: "Dr. Sarah Jenkins",
    department: "Mathematics",
    subject: "Linear Algebra",
    subjectCode: "MATH-302",
    classSection: "Grade 11A",
    gradeLevel: "Grade 11",
    room: "Room 304",
    weeklyHours: 5,
    role: "Lead Teacher" as Assignment["role"],
  });

  const departments = ["All", "Mathematics", "Science", "Languages", "Computer Science", "Humanities", "Arts"];
  const gradeLevels = ["All", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];

  const filtered = assignments.filter((a) => {
    const matchesSearch = 
      a.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.classSection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === "All" || a.department === deptFilter;
    const matchesGrade = gradeFilter === "All" || a.gradeLevel === gradeFilter;
    return matchesSearch && matchesDept && matchesGrade;
  });

  const totalTeachers = new Set(assignments.map(a => a.teacherId)).size;
  const totalHours = assignments.reduce((acc, curr) => acc + curr.weeklyHours, 0);

  const handleOpenCreate = () => {
    setEditingAssignment(null);
    setFormData({
      teacherName: "Dr. Sarah Jenkins",
      department: "Mathematics",
      subject: "Linear Algebra",
      subjectCode: "MATH-302",
      classSection: "Grade 11A",
      gradeLevel: "Grade 11",
      room: "Room 304",
      weeklyHours: 5,
      role: "Lead Teacher",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (asg: Assignment) => {
    setEditingAssignment(asg);
    setFormData({
      teacherName: asg.teacherName,
      department: asg.department,
      subject: asg.subject,
      subjectCode: asg.subjectCode,
      classSection: asg.classSection,
      gradeLevel: asg.gradeLevel,
      room: asg.room,
      weeklyHours: asg.weeklyHours,
      role: asg.role,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, name: string) => {
    setAssignments(prev => prev.filter(a => a.id !== id));
    showToast(`Assignment for ${name} removed`, "success");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAssignment) {
      setAssignments(prev => prev.map(a => a.id === editingAssignment.id ? {
        ...a,
        teacherName: formData.teacherName,
        department: formData.department,
        subject: formData.subject,
        subjectCode: formData.subjectCode,
        classSection: formData.classSection,
        gradeLevel: formData.gradeLevel,
        room: formData.room,
        weeklyHours: Number(formData.weeklyHours),
        role: formData.role,
      } : a));
      showToast("Assignment updated successfully", "success");
    } else {
      const newAsg: Assignment = {
        id: `asg-${Date.now()}`,
        teacherId: `tch-${Date.now()}`,
        teacherName: formData.teacherName,
        teacherEmail: `${formData.teacherName.toLowerCase().replace(/[^a-z]/g, "")}@oakridge.edu`,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        department: formData.department,
        subject: formData.subject,
        subjectCode: formData.subjectCode,
        classSection: formData.classSection,
        gradeLevel: formData.gradeLevel,
        room: formData.room,
        weeklyHours: Number(formData.weeklyHours),
        role: formData.role,
        status: "Active",
      };
      setAssignments(prev => [newAsg, ...prev]);
      showToast("New teacher assignment created", "success");
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Teacher Assignments"
          subtitle="Configure subject allocation, classroom scheduling, and period workloads across faculty."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>New Assignment</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Users size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{totalTeachers}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Assigned Faculty</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{assignments.length}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Active Allocations</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{totalHours}h</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Weekly Scheduled</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">100%</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Core Subject Coverage</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search by teacher, subject, section, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 text-xs">
            <Filter size={14} className="text-stone-400" />
            <select
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="bg-transparent text-stone-700 dark:text-stone-300 font-medium focus:outline-none cursor-pointer"
            >
              {departments.map((d) => (
                <option key={d} value={d} className="dark:bg-stone-900">{d} Dept</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200/50 dark:border-white/5 text-xs">
            <select
              value={gradeFilter}
              onChange={(e) => setGradeFilter(e.target.value)}
              className="bg-transparent text-stone-700 dark:text-stone-300 font-medium focus:outline-none cursor-pointer"
            >
              {gradeLevels.map((g) => (
                <option key={g} value={g} className="dark:bg-stone-900">{g}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <div className="rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/70 dark:border-white/10 bg-stone-50/50 dark:bg-white/[0.02] text-[11px] font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                <th className="py-3.5 px-4">Faculty Member</th>
                <th className="py-3.5 px-4">Subject & Code</th>
                <th className="py-3.5 px-4">Class & Room</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4 text-center">Periods/Wk</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50 dark:divide-white/5 text-xs text-stone-700 dark:text-stone-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No teacher assignments matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-stone-500/5 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.avatar}
                          alt={item.teacherName}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 dark:border-white/10 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-stone-900 dark:text-white">{item.teacherName}</div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">{item.department}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900 dark:text-white">{item.subject}</div>
                      <div className="text-[11px] font-mono text-stone-400">{item.subjectCode}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-white/5 text-stone-800 dark:text-stone-200 font-medium">
                        <span>{item.classSection}</span>
                        <span className="text-stone-400">•</span>
                        <span className="text-stone-500 dark:text-stone-400">{item.room}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${
                        item.role === 'Subject Head'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : item.role === 'Lead Teacher'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}>
                        {item.role}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="font-semibold text-stone-900 dark:text-white">{item.weeklyHours}h</span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400 hover:text-brand-600 transition cursor-pointer"
                          title="Edit Allocation"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.teacherName)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-stone-400 hover:text-red-600 transition cursor-pointer"
                          title="Remove Allocation"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg rounded-2xl glass border border-stone-200/80 dark:border-white/10 p-6 shadow-2xl bg-white dark:bg-stone-900 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Sparkles size={18} className="text-brand-500" />
                <span>{editingAssignment ? "Edit Teacher Assignment" : "Assign Teacher to Class"}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Teacher Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  placeholder="e.g. Dr. Sarah Jenkins"
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  >
                    {departments.filter(d => d !== "All").map(d => (
                      <option key={d} value={d} className="dark:bg-stone-900">{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Assignment Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  >
                    <option value="Lead Teacher" className="dark:bg-stone-900">Lead Teacher</option>
                    <option value="Subject Head" className="dark:bg-stone-900">Subject Head</option>
                    <option value="Assistant" className="dark:bg-stone-900">Assistant</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. AP Chemistry"
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subjectCode}
                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                    placeholder="e.g. CHEM-301"
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Class Section
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.classSection}
                    onChange={(e) => setFormData({ ...formData, classSection: e.target.value })}
                    placeholder="e.g. Grade 10B"
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    placeholder="e.g. Lab 2"
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Weekly Hours
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    required
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/5 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
                >
                  {editingAssignment ? "Save Changes" : "Confirm Allocation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
