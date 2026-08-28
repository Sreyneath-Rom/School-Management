import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  CalendarRange, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Archive, 
  MoreVertical, 
  Calendar, 
  Edit3, 
  Trash2, 
  AlertCircle 
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: "Active" | "Upcoming" | "Archived";
  termsCount: number;
  classesCount: number;
  studentsCount: number;
  isCurrent: boolean;
}

export default function AcademicYears() {
  const { showToast } = useToast();
  const [years, setYears] = useState<AcademicYear[]>([
    {
      id: "ay-1",
      name: "2025 - 2026",
      startDate: "2025-08-15",
      endDate: "2026-06-20",
      status: "Active",
      termsCount: 3,
      classesCount: 48,
      studentsCount: 1284,
      isCurrent: true,
    },
    {
      id: "ay-2",
      name: "2026 - 2027",
      startDate: "2026-08-20",
      endDate: "2027-06-25",
      status: "Upcoming",
      termsCount: 3,
      classesCount: 50,
      studentsCount: 0,
      isCurrent: false,
    },
    {
      id: "ay-3",
      name: "2024 - 2025",
      startDate: "2024-08-18",
      endDate: "2025-06-18",
      status: "Archived",
      termsCount: 3,
      classesCount: 46,
      studentsCount: 1210,
      isCurrent: false,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    termsCount: 3,
  });

  const handleSetActive = (id: string) => {
    setYears((prev) =>
      prev.map((y) => ({
        ...y,
        isCurrent: y.id === id,
        status: y.id === id ? "Active" : y.status === "Active" ? "Archived" : y.status,
      }))
    );
    showToast("Academic Year set to Active successfully", "success");
  };

  const handleCreateYear = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.startDate || !formData.endDate) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const newYear: AcademicYear = {
      id: `ay-${Date.now()}`,
      name: formData.name,
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: "Upcoming",
      termsCount: Number(formData.termsCount) || 3,
      classesCount: 0,
      studentsCount: 0,
      isCurrent: false,
    };

    setYears((prev) => [newYear, ...prev]);
    setModalOpen(false);
    setFormData({ name: "", startDate: "", endDate: "", termsCount: 3 });
    showToast("New Academic Year created successfully", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Academic Years"
          subtitle="Configure school academic sessions, session timelines, and active term cycles."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Academic Year</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Current Active Year</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {years.find((y) => y.isCurrent)?.name || "Not set"}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Upcoming Sessions</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {years.filter((y) => y.status === "Upcoming").length} Planned
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-stone-500/10 text-stone-600 dark:text-stone-400">
            <Archive size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Archived Sessions</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {years.filter((y) => y.status === "Archived").length} Historical
            </div>
          </div>
        </div>
      </div>

      {/* Years Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {years.map((year) => (
          <div
            key={year.id}
            className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
              year.isCurrent
                ? "glass-strong border-brand-500/50 shadow-lg shadow-brand-500/5 ring-1 ring-brand-500/30"
                : "glass-sm border-stone-200/70 dark:border-white/10"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      year.isCurrent
                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                        : "bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    <CalendarRange size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {year.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5 text-xs text-stone-500">
                      <Calendar size={13} />
                      <span>
                        {year.startDate} to {year.endDate}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    year.status === "Active"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      : year.status === "Upcoming"
                      ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30"
                      : "bg-stone-500/15 text-stone-700 dark:text-stone-300 border border-stone-500/30"
                  }`}
                >
                  {year.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-200/50 dark:border-white/10 my-3 text-center">
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-xs text-stone-400 font-medium">Terms</div>
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {year.termsCount}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-xs text-stone-400 font-medium">Classes</div>
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {year.classesCount}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-xs text-stone-400 font-medium">Students</div>
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {year.studentsCount}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-2">
              {!year.isCurrent ? (
                <button
                  type="button"
                  onClick={() => handleSetActive(year.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-500 hover:text-white text-stone-700 dark:text-stone-200 transition cursor-pointer"
                >
                  Set as Current
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> Active Session
                </span>
              )}

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => showToast("Edit academic session opened", "info")}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition cursor-pointer"
                  title="Edit details"
                >
                  <Edit3 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Add New Academic Year
            </h3>
            <form onSubmit={handleCreateYear} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Session Name / Identifier *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2027 - 2028"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Terms in Session
                </label>
                <select
                  value={formData.termsCount}
                  onChange={(e) => setFormData({ ...formData, termsCount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value={2}>2 Semesters</option>
                  <option value={3}>3 Trimesters</option>
                  <option value={4}>4 Quarters</option>
                </select>
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
                  Save Academic Year
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
