import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  BookMarked, 
  Plus, 
  Search, 
  BookOpen, 
  User, 
  Clock, 
  CheckCircle, 
  Layers,
  GraduationCap
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface ClassSubjectMapping {
  id: string;
  className: string;
  gradeLevel: string;
  subjectName: string;
  subjectCode: string;
  teacherName: string;
  weeklyHours: number;
  credits: number;
  type: "Core" | "Elective" | "AP";
}

export default function ClassSubjects() {
  const { showToast } = useToast();
  const [selectedClass, setSelectedClass] = useState("Grade 11-A (Science Track)");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [mappings, setMappings] = useState<ClassSubjectMapping[]>([
    // Grade 11-A (Science Track)
    {
      id: "cs-1",
      className: "Grade 11-A (Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Advanced Mathematics (គណិតវិទ្យាកម្រិតខ្ពស់)",
      subjectCode: "MTH-1012",
      teacherName: "Prof. Marcus Kane",
      weeklyHours: 6,
      credits: 6,
      type: "Core",
    },
    {
      id: "cs-2",
      className: "Grade 11-A (Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Physics (រូបវិទ្យា)",
      subjectCode: "PHY-1012",
      teacherName: "Dr. Vicheth Keo",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-3",
      className: "Grade 11-A (Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Chemistry (គីមីវិទ្យា)",
      subjectCode: "CHM-1012",
      teacherName: "Dr. Chanthy Suon",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-4",
      className: "Grade 11-A (Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Biology (ជីវវិទ្យា)",
      subjectCode: "BIO-1012",
      teacherName: "Dr. Alice Liu",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-5",
      className: "Grade 11-A (Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Earth & Environmental Science (ផែនដី និងបរិស្ថានវិទ្យា)",
      subjectCode: "EES-1012",
      teacherName: "Rathana Seng",
      weeklyHours: 3,
      credits: 3,
      type: "Core",
    },
    {
      id: "cs-6",
      className: "Grade 11-A (Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Advanced Khmer Literature (ភាសាខ្មែរ និងអក្សរសិល្ប៍)",
      subjectCode: "KHM-1012",
      teacherName: "Sokha Chea",
      weeklyHours: 5,
      credits: 5,
      type: "Core",
    },
    {
      id: "cs-7",
      className: "Grade 11-A (Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Foreign Language - English (ភាសាអង់គ្លេស)",
      subjectCode: "ENG-1012",
      teacherName: "Panha Sin",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-8",
      className: "Grade 11-A (Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "ICT & Coding (បច្ចេកវិទ្យាព័ត៌មាន)",
      subjectCode: "ICT-1012",
      teacherName: "Elena Vance",
      weeklyHours: 3,
      credits: 3,
      type: "Elective",
    },

    // Grade 11-B (Social Science Track)
    {
      id: "cs-9",
      className: "Grade 11-B (Social Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Advanced Khmer Literature (ភាសាខ្មែរ និងអក្សរសិល្ប៍)",
      subjectCode: "KHM-1012",
      teacherName: "Sokha Chea",
      weeklyHours: 6,
      credits: 6,
      type: "Core",
    },
    {
      id: "cs-10",
      className: "Grade 11-B (Social Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "History (ប្រវត្តិវិទ្យា)",
      subjectCode: "HIS-1012",
      teacherName: "Vannak Yin",
      weeklyHours: 5,
      credits: 5,
      type: "Core",
    },
    {
      id: "cs-11",
      className: "Grade 11-B (Social Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Geography (ភូមិវិទ្យា)",
      subjectCode: "GEO-1012",
      teacherName: "Sokly Meas",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-12",
      className: "Grade 11-B (Social Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Moral-Civics (សីលធម៌-ពលរដ្ឋវិជ្ជា)",
      subjectCode: "MOR-1012",
      teacherName: "Chhayrith Bun",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-13",
      className: "Grade 11-B (Social Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Mathematics (គណិតវិទ្យា)",
      subjectCode: "MTH-1012",
      teacherName: "Rithy Chan",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-14",
      className: "Grade 11-B (Social Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "Foreign Language - English (ភាសាអង់គ្លេស)",
      subjectCode: "ENG-1012",
      teacherName: "Panha Sin",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-15",
      className: "Grade 11-B (Social Science Track)",
      gradeLevel: "Grade 11",
      subjectName: "ICT (បច្ចេកវិទ្យាព័ត៌មាន)",
      subjectCode: "ICT-1012",
      teacherName: "Elena Vance",
      weeklyHours: 3,
      credits: 3,
      type: "Elective",
    },

    // Grade 9-A (Lower Secondary - Dip. 9 Preparation)
    {
      id: "cs-16",
      className: "Grade 9-A (Dip. 9 Prep)",
      gradeLevel: "Grade 9",
      subjectName: "Khmer Literature (ភាសាខ្មែរ)",
      subjectCode: "KHM-709",
      teacherName: "Bopha Vong",
      weeklyHours: 5,
      credits: 5,
      type: "Core",
    },
    {
      id: "cs-17",
      className: "Grade 9-A (Dip. 9 Prep)",
      gradeLevel: "Grade 9",
      subjectName: "Mathematics (គណិតវិទ្យា)",
      subjectCode: "MTH-709",
      teacherName: "Dara Heng",
      weeklyHours: 5,
      credits: 5,
      type: "Core",
    },
    {
      id: "cs-18",
      className: "Grade 9-A (Dip. 9 Prep)",
      gradeLevel: "Grade 9",
      subjectName: "General Science (វិទ្យាសាស្ត្រទូទៅ)",
      subjectCode: "SCI-709",
      teacherName: "Sovannara Kem",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-19",
      className: "Grade 9-A (Dip. 9 Prep)",
      gradeLevel: "Grade 9",
      subjectName: "Social Studies (សិក្សាសង្គម)",
      subjectCode: "SOC-709",
      teacherName: "Vicheka Nhem",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-20",
      className: "Grade 9-A (Dip. 9 Prep)",
      gradeLevel: "Grade 9",
      subjectName: "English (ភាសាអង់គ្លេស)",
      subjectCode: "ENG-709",
      teacherName: "Kosal Mom",
      weeklyHours: 3,
      credits: 3,
      type: "Core",
    },
    {
      id: "cs-21",
      className: "Grade 9-A (Dip. 9 Prep)",
      gradeLevel: "Grade 9",
      subjectName: "Life Skills & PE (បំណិនជីវិត និងអប់រំកាយ)",
      subjectCode: "LPE-709",
      teacherName: "Sambath Ouch",
      weeklyHours: 2,
      credits: 2,
      type: "Core",
    },

    // Grade 12-A (Bac II Science Track)
    {
      id: "cs-22",
      className: "Grade 12-A (Bac II Science)",
      gradeLevel: "Grade 12",
      subjectName: "Advanced Mathematics (គណិតវិទ្យាកម្រិតខ្ពស់)",
      subjectCode: "MTH-1012",
      teacherName: "Prof. Marcus Kane",
      weeklyHours: 6,
      credits: 6,
      type: "Core",
    },
    {
      id: "cs-23",
      className: "Grade 12-A (Bac II Science)",
      gradeLevel: "Grade 12",
      subjectName: "Physics (រូបវិទ្យា)",
      subjectCode: "PHY-1012",
      teacherName: "Dr. Vicheth Keo",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-24",
      className: "Grade 12-A (Bac II Science)",
      gradeLevel: "Grade 12",
      subjectName: "Chemistry (គីមីវិទ្យា)",
      subjectCode: "CHM-1012",
      teacherName: "Dr. Chanthy Suon",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-25",
      className: "Grade 12-A (Bac II Science)",
      gradeLevel: "Grade 12",
      subjectName: "Biology (ជីវវិទ្យា)",
      subjectCode: "BIO-1012",
      teacherName: "Dr. Alice Liu",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
    {
      id: "cs-26",
      className: "Grade 12-A (Bac II Science)",
      gradeLevel: "Grade 12",
      subjectName: "Advanced Khmer Literature (ភាសាខ្មែរ)",
      subjectCode: "KHM-1012",
      teacherName: "Sokha Chea",
      weeklyHours: 5,
      credits: 5,
      type: "Core",
    },
    {
      id: "cs-27",
      className: "Grade 12-A (Bac II Science)",
      gradeLevel: "Grade 12",
      subjectName: "Foreign Language - English (ភាសាអង់គ្លេស)",
      subjectCode: "ENG-1012",
      teacherName: "Panha Sin",
      weeklyHours: 4,
      credits: 4,
      type: "Core",
    },
  ]);

  const [formData, setFormData] = useState({
    subjectName: "Physics Honors",
    subjectCode: "SCI-401",
    teacherName: "Dr. Alice Liu",
    weeklyHours: 5,
    credits: 4,
    type: "Core" as ClassSubjectMapping["type"],
  });

  const filteredMappings = mappings.filter((m) => {
    const matchesClass = selectedClass === "All" || m.className === selectedClass;
    const matchesSearch =
      m.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.teacherName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subjectCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesClass && matchesSearch;
  });

  const totalCredits = filteredMappings.reduce((sum, item) => sum + item.credits, 0);
  const totalWeeklyHours = filteredMappings.reduce((sum, item) => sum + item.weeklyHours, 0);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    const newMapping: ClassSubjectMapping = {
      id: `cs-${Date.now()}`,
      className: selectedClass === "All" ? "Grade 10-A" : selectedClass,
      gradeLevel: "Grade 10",
      subjectName: formData.subjectName,
      subjectCode: formData.subjectCode,
      teacherName: formData.teacherName,
      weeklyHours: Number(formData.weeklyHours) || 4,
      credits: Number(formData.credits) || 3,
      type: formData.type,
    };
    setMappings((prev) => [newMapping, ...prev]);
    setModalOpen(false);
    showToast("Subject mapped to class successfully", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Class Subjects Curriculum"
          subtitle="Assign subjects, faculty instructors, credit weights, and weekly hour allocations by class."
        />
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Classes</option>
            <option value="Grade 7-A (អនុវិទ្យាល័យ)">Grade 7-A (អនុវិទ្យាល័យ)</option>
            <option value="Grade 8-A (អនុវិទ្យាល័យ)">Grade 8-A (អនុវិទ្យាល័យ)</option>
            <option value="Grade 9-A (Dip. 9 Prep)">Grade 9-A (ត្រៀមឌីប្លូម Dip. 9)</option>
            <option value="Grade 10-A (មូលដ្ឋាន)">Grade 10-A (មូលដ្ឋានវិទ្យាល័យ)</option>
            <option value="Grade 11-A (Science Track)">Grade 11-A (ថ្នាក់វិទ្យាសាស្ត្រ Science Track)</option>
            <option value="Grade 11-B (Social Science Track)">Grade 11-B (ថ្នាក់វិទ្យាសាស្ត្រសង្គម Social Science)</option>
            <option value="Grade 12-A (Bac II Science)">Grade 12-A (ត្រៀមបាក់ឌុប Bac II Science)</option>
            <option value="Grade 12-B (Bac II Social)">Grade 12-B (ត្រៀមបាក់ឌុប Bac II Social)</option>
          </select>

          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Assign Subject</span>
          </button>
        </div>
      </div>

      {/* Summary KPI header */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <BookMarked size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Assigned Subjects</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {filteredMappings.length} Subjects
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <GraduationCap size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Total Credit Value</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {totalCredits} Credits
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Weekly Class Hours</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {totalWeeklyHours} hrs / week
            </div>
          </div>
        </div>
      </div>

      {/* Subject Table */}
      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-4 border-b border-stone-200/50 dark:border-white/10 flex items-center gap-3">
          <Search size={16} className="text-stone-400" />
          <input
            type="text"
            placeholder="Filter subject title, instructor, or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5">Subject & Code</th>
                <th className="p-3.5">Class / Grade</th>
                <th className="p-3.5">Assigned Instructor</th>
                <th className="p-3.5">Type</th>
                <th className="p-3.5">Credits</th>
                <th className="p-3.5">Weekly Hours</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filteredMappings.map((mapping) => (
                <tr
                  key={mapping.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5 font-semibold text-stone-900 dark:text-white">
                    <div>{mapping.subjectName}</div>
                    <div className="text-[11px] font-mono text-stone-400 font-normal">
                      {mapping.subjectCode}
                    </div>
                  </td>
                  <td className="p-3.5 font-medium text-stone-700 dark:text-stone-300">
                    <span className="px-2 py-0.5 rounded-lg bg-stone-100 dark:bg-white/10 text-[11px]">
                      {mapping.className}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-stone-400" />
                      <span>{mapping.teacherName}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        mapping.type === "Core"
                          ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                          : mapping.type === "AP"
                          ? "bg-purple-500/15 text-purple-700 dark:text-purple-300"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {mapping.type}
                    </span>
                  </td>
                  <td className="p-3.5 font-semibold text-stone-800 dark:text-stone-200">
                    {mapping.credits} Credits
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300">
                    {mapping.weeklyHours} hrs
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setMappings((prev) => prev.filter((item) => item.id !== mapping.id));
                        showToast("Subject unassigned from class", "info");
                      }}
                      className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Map Subject to {selectedClass}
            </h3>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Subject Title *
                </label>
                <input
                  type="text"
                  value={formData.subjectName}
                  onChange={(e) => setFormData({ ...formData, subjectName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    value={formData.subjectCode}
                    onChange={(e) => setFormData({ ...formData, subjectCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Core">Core</option>
                    <option value="Elective">Elective</option>
                    <option value="AP">AP / Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Assigned Teacher *
                </label>
                <input
                  type="text"
                  value={formData.teacherName}
                  onChange={(e) => setFormData({ ...formData, teacherName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Credits
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={formData.credits}
                    onChange={(e) => setFormData({ ...formData, credits: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Weekly Hours
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formData.weeklyHours}
                    onChange={(e) => setFormData({ ...formData, weeklyHours: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
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
                  Save Subject Mapping
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
