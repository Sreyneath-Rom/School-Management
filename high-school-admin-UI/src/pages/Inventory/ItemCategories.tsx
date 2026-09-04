import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Boxes, 
  Plus, 
  Search, 
  FolderTree, 
  Layers, 
  Edit3, 
  CheckCircle2 
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface InventoryCategoryItem {
  id: string;
  name: string;
  code: string;
  totalSKUs: number;
  totalValuation: number;
  description: string;
}

export default function ItemCategories() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const [categories, setCategories] = useState<InventoryCategoryItem[]>([
    {
      id: "ic-1",
      name: "Laboratory & Science",
      code: "LAB",
      totalSKUs: 38,
      totalValuation: 42500,
      description: "Microscopes, test tubes, reagents, safety goggles, titration apparatus.",
    },
    {
      id: "ic-2",
      name: "IT & Robotics",
      code: "ITR",
      totalSKUs: 29,
      totalValuation: 68000,
      description: "Arduino microcontrollers, laptops, tablets, soldering stations, robotics kits.",
    },
    {
      id: "ic-3",
      name: "Sports & Athletics",
      code: "SPT",
      totalSKUs: 45,
      totalValuation: 18400,
      description: "Basketballs, soccer nets, track hurdles, tennis racquets, jerseys.",
    },
    {
      id: "ic-4",
      name: "Office & Stationery",
      code: "OFF",
      totalSKUs: 64,
      totalValuation: 9200,
      description: "A4 paper reams, toner cartridges, markers, staplers, dry erase boards.",
    },
    {
      id: "ic-5",
      name: "Health & Safety",
      code: "MED",
      totalSKUs: 18,
      totalValuation: 6500,
      description: "Defibrillators, first aid kits, sanitizers, thermal scanners.",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: InventoryCategoryItem = {
      id: `ic-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      totalSKUs: 0,
      totalValuation: 0,
      description: formData.description,
    };
    setCategories((prev) => [newCat, ...prev]);
    setModalOpen(false);
    showToast("Inventory category added", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Inventory Classification & Categories"
          subtitle="Define asset classes, procurement departments, depreciation categories, and valuation groups."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Asset Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <FolderTree size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {c.name}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono">
                      Category Code: {c.code}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-3">
                {c.description}
              </p>

              <div className="grid grid-cols-2 gap-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-center">
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Total SKUs</div>
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {c.totalSKUs} Items
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Valuation</div>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    ${c.totalValuation.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => showToast(`Edit category ${c.name}`, "info")}
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
              Add Inventory Category
            </h3>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Code *
                </label>
                <input
                  type="text"
                  placeholder="MUS"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
