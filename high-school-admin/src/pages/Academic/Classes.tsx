import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  School, 
  Plus, 
  Search, 
  Users, 
  User, 
  DoorOpen, 
  BookOpen, 
  Layers, 
  CheckCircle,
  Edit3,
  CalendarDays
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";
import { Link } from "react-router-dom";

interface ClassItem {
  id: string;
  name: string;
  gradeLevel: string;
  section: string;
  room: string;
  classTeacher: string;
  studentCount: number;
  maxCapacity: number;
  subjectsCount: number;
  schedulePeriod: string;
}

export default function Classes() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const [classes, setClasses] = useState<ClassItem[]>([
    {
      id: "cls-1",
      name: "Grade 10-A",
      gradeLevel: "Grade 10",
      section: "A",
      room: "Room 101",
      classTeacher: "Dr. John Whitfield",
      studentCount: 32,
      maxCapacity: 35,
      subjectsCount: 7,
      schedulePeriod: "08:00 - 15:30",
    },
    {
      id: "cls-2",
      name: "Grade 10-B",
      gradeLevel: "Grade 10",
      section: "B",
      room: "Room 102",
      classTeacher: "Sarah Parker",
      studentCount: 30,
      maxCapacity: 35,
      subjectsCount: 7,
      schedulePeriod: "08:00 - 15:30",
    },
    {
      id: "cls-3",
      name: "Grade 11-A (Advanced STEM)",
      gradeLevel: "Grade 11",
      section: "A",
      room: "Lab 201",
      classTeacher: "Prof. Marcus Kane",
      studentCount: 28,
      maxCapacity: 30,
      subjectsCount: 8,
      schedulePeriod: "08:00 - 16:00",
    },
    {
      id: "cls-4",
      name: "Grade 11-B (Humanities)",
      gradeLevel: "Grade 11",
      section: "B",
      room: "Room 203",
      classTeacher: "David Miller",
      studentCount: 29,
      maxCapacity: 32,
      subjectsCount: 6,
      schedulePeriod: "08:00 - 15:30",
    },
    {
      id: "cls-5",
      name: "Grade 12-A (Honors)",
      gradeLevel: "Grade 12",
      section: "A",
      room: "Room 301",
      classTeacher: "Elena Vance",
      studentCount: 26,
      maxCapacity: 30,
      subjectsCount: 8,
      schedulePeriod: "08:00 - 16:00",
    },
    {
      id: "cls-6",
      name: "Grade 9-A",
      gradeLevel: "Grade 9",
      section: "A",
      room: "Room 001",
      classTeacher: "Claire Bennett",
      studentCount: 34,
      maxCapacity: 35,
      subjectsCount: 6,
      schedulePeriod: "08:00 - 15:00",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    gradeLevel: "Grade 10",
    section: "A",
    room: "Room 101",
    classTeacher: "Dr. John Whitfield",
    maxCapacity: 35,
  });

  const filteredClasses = classes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.classTeacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.room.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === "All" || c.gradeLevel === gradeFilter;
    return matchesSearch && matchesGrade;
  });

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    const newCls: ClassItem = {
      id: `cls-${Date.now()}`,
      name: formData.name || `${formData.gradeLevel}-${formData.section}`,
      gradeLevel: formData.gradeLevel,
      section: formData.section,
      room: formData.room,
      classTeacher: formData.classTeacher,
      studentCount: 0,
      maxCapacity: Number(formData.maxCapacity) || 35,
      subjectsCount: 6,
      schedulePeriod: "08:00 - 15:30",
    };
    setClasses((prev) => [newCls, ...prev]);
    setModalOpen(false);
    setFormData({
      name: "",
      gradeLevel: "Grade 10",
      section: "A",
      room: "Room 101",
      classTeacher: "Dr. John Whitfield",
      maxCapacity: 35,
    });
    showToast("Class created successfully", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Classes & Sections"
          subtitle="Manage class divisions, homeroom instructors, student roster limits, and schedules."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Create New Class</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search class name, homeroom teacher, or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Grades</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
        </div>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClasses.map((cls) => {
          const fillPercentage = Math.round((cls.studentCount / cls.maxCapacity) * 100);
          return (
            <div
              key={cls.id}
              className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                      <School size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-stone-900 dark:text-white">
                        {cls.name}
                      </h3>
                      <div className="text-xs text-stone-500 font-medium">
                        {cls.gradeLevel} • Section {cls.section}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                    Active
                  </span>
                </div>

                <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <User size={13} /> Class Teacher:
                    </span>
                    <span className="font-semibold text-stone-900 dark:text-white">
                      {cls.classTeacher}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <DoorOpen size={13} /> Assigned Room:
                    </span>
                    <span className="font-medium">{cls.room}</span>
                  </div>

                  <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                    <span className="flex items-center gap-1.5 text-stone-500">
                      <BookOpen size={13} /> Subjects:
                    </span>
                    <span className="font-medium">{cls.subjectsCount} Subjects</span>
                  </div>

                  {/* Student Capacity Progress Bar */}
                  <div className="pt-1.5">
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-stone-500">Student Capacity</span>
                      <span className="font-bold text-stone-800 dark:text-stone-200">
                        {cls.studentCount} / {cls.maxCapacity} ({fillPercentage}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-stone-200/70 dark:bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          fillPercentage > 90
                            ? "bg-amber-500"
                            : fillPercentage > 75
                            ? "bg-brand-500"
                            : "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between gap-2">
                <Link
                  to="/academic/schedules"
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-500 hover:text-white text-stone-700 dark:text-stone-200 transition cursor-pointer flex items-center gap-1"
                >
                  <CalendarDays size={13} /> Schedule
                </Link>

                <div className="flex items-center gap-1">
                  <Link
                    to="/academic/class-subjects"
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Manage Subjects →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Create New Class
            </h3>
            <form onSubmit={handleCreateClass} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Class Label (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Grade 10-A (Honors)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Grade Level
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Grade 9">Grade 9</option>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Section
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. A, B, C"
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Assigned Room
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Max Capacity
                  </label>
                  <input
                    type="number"
                    min="10"
                    max="60"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Class Homeroom Teacher
                </label>
                <input
                  type="text"
                  value={formData.classTeacher}
                  onChange={(e) => setFormData({ ...formData, classTeacher: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition cursor-pointer"
                >
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
