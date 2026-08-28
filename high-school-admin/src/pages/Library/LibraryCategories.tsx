import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  FolderTree, 
  Plus, 
  BookOpen, 
  Layers, 
  Search, 
  Edit3, 
  CheckCircle2 
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface CategoryItem {
  id: string;
  name: string;
  code: string;
  description: string;
  totalTitles: number;
  totalCopies: number;
  activeBorrows: number;
  sectionCode: string;
}

export default function LibraryCategories() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);

  const [categories, setCategories] = useState<CategoryItem[]>([
    {
      id: "cat-1",
      name: "Science & Biology",
      code: "SCI",
      description: "Genetics, cellular biology, botany, zoology, biochemistry treatises.",
      totalTitles: 142,
      totalCopies: 450,
      activeBorrows: 84,
      sectionCode: "Wing A (A1 - A8)",
    },
    {
      id: "cat-2",
      name: "Mathematics & Statistics",
      code: "MTH",
      description: "Calculus, linear algebra, discrete math, statistics and probability.",
      totalTitles: 98,
      totalCopies: 320,
      activeBorrows: 62,
      sectionCode: "Wing B (B1 - B6)",
    },
    {
      id: "cat-3",
      name: "Computer Science & Robotics",
      code: "CS",
      description: "Algorithms, Java, Python, AI/ML, web development, hardware engineering.",
      totalTitles: 115,
      totalCopies: 290,
      activeBorrows: 95,
      sectionCode: "Wing C (C1 - C5)",
    },
    {
      id: "cat-4",
      name: "Literature & World Classics",
      code: "LIT",
      description: "American literature, world classics, drama, poetry, literary criticism.",
      totalTitles: 340,
      totalCopies: 890,
      activeBorrows: 140,
      sectionCode: "Wing D (D1 - D12)",
    },
    {
      id: "cat-5",
      name: "History & Social Sciences",
      code: "HIS",
      description: "World history, political economy, geography, civil rights, sociology.",
      totalTitles: 210,
      totalCopies: 540,
      activeBorrows: 76,
      sectionCode: "Wing E (E1 - E8)",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    sectionCode: "Wing F",
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const newCat: CategoryItem = {
      id: `cat-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      description: formData.description,
      totalTitles: 0,
      totalCopies: 0,
      activeBorrows: 0,
      sectionCode: formData.sectionCode,
    };
    setCategories((prev) => [newCat, ...prev]);
    setModalOpen(false);
    showToast("Library category created successfully", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Library Classification & Categories"
          subtitle="Dewey-inspired taxonomy, wing shelving sections, title volumes, and circulation metrics."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
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
                      {cat.name}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono">
                      Code: {cat.code} • {cat.sectionCode}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-3">
                {cat.description}
              </p>

              <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-center">
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Titles</div>
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {cat.totalTitles}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Total Copies</div>
                  <div className="text-sm font-bold text-stone-800 dark:text-stone-200">
                    {cat.totalCopies}
                  </div>
                </div>
                <div className="p-2 rounded-xl bg-stone-50/50 dark:bg-white/5">
                  <div className="text-[10px] text-stone-400 font-bold uppercase">Borrowed</div>
                  <div className="text-sm font-bold text-brand-600 dark:text-brand-400">
                    {cat.activeBorrows}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-end">
              <button
                type="button"
                onClick={() => showToast(`Edit category ${cat.name}`, "info")}
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
              Add Category
            </h3>
            <form onSubmit={handleCreateCategory} className="space-y-4">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Code *
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Wing / Shelf Section
                  </label>
                  <input
                    type="text"
                    value={formData.sectionCode}
                    onChange={(e) => setFormData({ ...formData, sectionCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
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
