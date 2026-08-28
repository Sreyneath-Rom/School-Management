import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Clock, 
  Plus, 
  CheckCircle2, 
  Calendar, 
  Edit3, 
  FileText, 
  Award,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface TermItem {
  id: string;
  name: string;
  academicYear: string;
  startDate: string;
  endDate: string;
  gradingDeadline: string;
  status: "Active" | "Completed" | "Upcoming";
  examCount: number;
  weightPercentage: number;
}

export default function Terms() {
  const { showToast } = useToast();
  const [selectedYear, setSelectedYear] = useState("2025 - 2026");
  const [terms, setTerms] = useState<TermItem[]>([
    {
      id: "term-1",
      name: "Term 1 (Fall Semester)",
      academicYear: "2025 - 2026",
      startDate: "2025-08-15",
      endDate: "2025-11-20",
      gradingDeadline: "2025-11-28",
      status: "Completed",
      examCount: 4,
      weightPercentage: 30,
    },
    {
      id: "term-2",
      name: "Term 2 (Winter Trimester)",
      academicYear: "2025 - 2026",
      startDate: "2025-12-01",
      endDate: "2026-03-15",
      gradingDeadline: "2026-03-25",
      status: "Active",
      examCount: 6,
      weightPercentage: 35,
    },
    {
      id: "term-3",
      name: "Term 3 (Spring Trimester)",
      academicYear: "2025 - 2026",
      startDate: "2026-03-20",
      endDate: "2026-06-20",
      gradingDeadline: "2026-06-28",
      status: "Upcoming",
      examCount: 5,
      weightPercentage: 35,
    },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    gradingDeadline: "",
    weightPercentage: 35,
  });

  const handleSetActive = (id: string) => {
    setTerms((prev) =>
      prev.map((t) => ({
        ...t,
        status: t.id === id ? "Active" : t.status === "Active" ? "Completed" : t.status,
      }))
    );
    showToast("Active term updated successfully", "success");
  };

  const handleCreateTerm = (e: React.FormEvent) => {
    e.preventDefault();
    const newTerm: TermItem = {
      id: `term-${Date.now()}`,
      name: formData.name,
      academicYear: selectedYear,
      startDate: formData.startDate,
      endDate: formData.endDate,
      gradingDeadline: formData.gradingDeadline,
      status: "Upcoming",
      examCount: 0,
      weightPercentage: Number(formData.weightPercentage) || 30,
    };
    setTerms((prev) => [...prev, newTerm]);
    setModalOpen(false);
    setFormData({ name: "", startDate: "", endDate: "", gradingDeadline: "", weightPercentage: 35 });
    showToast("Term created successfully", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Terms & Semesters"
          subtitle="Configure grading cycles, examination windows, and term evaluation weights."
        />
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="2025 - 2026">Academic Year: 2025 - 2026</option>
            <option value="2026 - 2027">Academic Year: 2026 - 2027</option>
          </select>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Term</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {terms.map((term) => (
          <div
            key={term.id}
            className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
              term.status === "Active"
                ? "glass-strong border-brand-500/50 shadow-lg shadow-brand-500/5 ring-1 ring-brand-500/30"
                : "glass-sm border-stone-200/70 dark:border-white/10"
            }`}
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`p-2.5 rounded-xl ${
                      term.status === "Active"
                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/25"
                        : "bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300"
                    }`}
                  >
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {term.name}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium">
                      {term.academicYear}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    term.status === "Active"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      : term.status === "Upcoming"
                      ? "bg-sky-500/15 text-sky-700 dark:text-sky-300 border border-sky-500/30"
                      : "bg-stone-500/15 text-stone-700 dark:text-stone-300 border border-stone-500/30"
                  }`}
                >
                  {term.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Calendar size={13} /> Duration:
                  </span>
                  <span className="font-medium">
                    {term.startDate} – {term.endDate}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Award size={13} /> Grading Cutoff:
                  </span>
                  <span className="font-medium text-amber-600 dark:text-amber-400">
                    {term.gradingDeadline}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <FileText size={13} /> Term GPA Weight:
                  </span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {term.weightPercentage}%
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-2">
              {term.status !== "Active" ? (
                <button
                  type="button"
                  onClick={() => handleSetActive(term.id)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/10 hover:bg-brand-500 hover:text-white text-stone-700 dark:text-stone-200 transition cursor-pointer"
                >
                  Set as Current Term
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 size={14} /> In Progress
                </span>
              )}

              <button
                type="button"
                onClick={() => showToast("Edit term opened", "info")}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition cursor-pointer"
              >
                <Edit3 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Add New Term
            </h3>
            <form onSubmit={handleCreateTerm} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Term Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Term 4 (Summer Intensive)"
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Grading Cutoff *
                  </label>
                  <input
                    type="date"
                    value={formData.gradingDeadline}
                    onChange={(e) => setFormData({ ...formData, gradingDeadline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Weight (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.weightPercentage}
                    onChange={(e) => setFormData({ ...formData, weightPercentage: Number(e.target.value) })}
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
                  Save Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
