import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  DollarSign, 
  Plus, 
  Search, 
  CheckCircle2, 
  Layers, 
  Edit3, 
  Calendar, 
  Sparkles,
  CreditCard
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface FeeStructureItem {
  id: string;
  gradeLevel: string;
  category: string;
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  activityFee: number;
  totalAnnual: number;
  installmentPlan: "Full / Term" | "Monthly" | "Biannual";
  status: "Active" | "Archived";
}

export default function FeeStructure() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [structures, setStructures] = useState<FeeStructureItem[]>([
    {
      id: "fee-1",
      gradeLevel: "Grade 9",
      category: "Standard Curriculum",
      tuitionFee: 3200,
      labFee: 350,
      libraryFee: 150,
      activityFee: 200,
      totalAnnual: 3900,
      installmentPlan: "Full / Term",
      status: "Active",
    },
    {
      id: "fee-2",
      gradeLevel: "Grade 10",
      category: "Standard Curriculum",
      tuitionFee: 3500,
      labFee: 450,
      libraryFee: 150,
      activityFee: 250,
      totalAnnual: 4350,
      installmentPlan: "Full / Term",
      status: "Active",
    },
    {
      id: "fee-3",
      gradeLevel: "Grade 11 - 12 (STEM & AP)",
      category: "Advanced STEM Track",
      tuitionFee: 4200,
      labFee: 650,
      libraryFee: 200,
      activityFee: 300,
      totalAnnual: 5350,
      installmentPlan: "Full / Term",
      status: "Active",
    },
    {
      id: "fee-4",
      gradeLevel: "Grade 11 - 12 (Arts & Humanities)",
      category: "Humanities Track",
      tuitionFee: 3800,
      labFee: 250,
      libraryFee: 200,
      activityFee: 300,
      totalAnnual: 4550,
      installmentPlan: "Full / Term",
      status: "Active",
    },
  ]);

  const [formData, setFormData] = useState({
    gradeLevel: "Grade 10",
    category: "Standard Curriculum",
    tuitionFee: 3500,
    labFee: 400,
    libraryFee: 150,
    activityFee: 200,
    installmentPlan: "Full / Term" as FeeStructureItem["installmentPlan"],
  });

  const handleAddStructure = (e: React.FormEvent) => {
    e.preventDefault();
    const total =
      Number(formData.tuitionFee) +
      Number(formData.labFee) +
      Number(formData.libraryFee) +
      Number(formData.activityFee);
    const newItem: FeeStructureItem = {
      id: `fee-${Date.now()}`,
      gradeLevel: formData.gradeLevel,
      category: formData.category,
      tuitionFee: Number(formData.tuitionFee),
      labFee: Number(formData.labFee),
      libraryFee: Number(formData.libraryFee),
      activityFee: Number(formData.activityFee),
      totalAnnual: total,
      installmentPlan: formData.installmentPlan,
      status: "Active",
    };
    setStructures((prev) => [newItem, ...prev]);
    setModalOpen(false);
    showToast("Fee structure plan created", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Fee Structures & Tuition Rates"
          subtitle="Configure annual tuition fees, laboratory levies, installment payment schedules, and tier rates."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>New Fee Structure</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {structures.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <DollarSign size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {item.gradeLevel}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium">
                      {item.category} • {item.installmentPlan}
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                  {item.status}
                </span>
              </div>

              {/* Fee components breakdown */}
              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Core Tuition Fee:</span>
                  <span className="font-semibold text-stone-900 dark:text-white">
                    ${item.tuitionFee.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Science & Lab Levy:</span>
                  <span className="font-medium">${item.labFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Library & Tech Access:</span>
                  <span className="font-medium">${item.libraryFee.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Student Activities & Sports:</span>
                  <span className="font-medium">${item.activityFee.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase block">
                  Total Annual Fee
                </span>
                <span className="text-lg font-black text-brand-600 dark:text-brand-400">
                  ${item.totalAnnual.toLocaleString()}
                </span>
              </div>

              <button
                type="button"
                onClick={() => showToast(`Edit ${item.gradeLevel} fee structure`, "info")}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition cursor-pointer"
              >
                <Edit3 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Create Fee Structure Tier
            </h3>
            <form onSubmit={handleAddStructure} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Grade Level *
                  </label>
                  <input
                    type="text"
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Track / Category
                  </label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Tuition Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.tuitionFee}
                    onChange={(e) => setFormData({ ...formData, tuitionFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Lab Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.labFee}
                    onChange={(e) => setFormData({ ...formData, labFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Library Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.libraryFee}
                    onChange={(e) => setFormData({ ...formData, libraryFee: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Activity Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.activityFee}
                    onChange={(e) => setFormData({ ...formData, activityFee: Number(e.target.value) })}
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
                  Save Structure
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
