import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Boxes, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Layers, 
  Tag, 
  Edit3, 
  ArrowDownToLine 
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface InventoryProduct {
  id: string;
  sku: string;
  name: string;
  category: string;
  department: string;
  stockQty: number;
  minThreshold: number;
  unitPrice: number;
  supplier: string;
  location: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

export default function InventoryItems() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const [items, setItems] = useState<InventoryProduct[]>([
    {
      id: "inv-1",
      sku: "LAB-BIO-001",
      name: "Binocular Optical Microscopes (1000x)",
      category: "Laboratory & Science",
      department: "Science Dept",
      stockQty: 24,
      minThreshold: 10,
      unitPrice: 320,
      supplier: "Global Scientific Instruments Ltd",
      location: "Lab Room 301, Cabinet A",
      status: "In Stock",
    },
    {
      id: "inv-2",
      sku: "CS-ROB-012",
      name: "Arduino STEM Robotics Starter Kits",
      category: "IT & Robotics",
      department: "Technology",
      stockQty: 35,
      minThreshold: 15,
      unitPrice: 85,
      supplier: "Apex EduTech Solutions",
      location: "Tech Lab 102",
      status: "In Stock",
    },
    {
      id: "inv-3",
      sku: "MED-FAK-004",
      name: "Emergency First Aid Kits (Comprehensive)",
      category: "Health & Safety",
      department: "Infirmary / Campus Wide",
      stockQty: 4,
      minThreshold: 8,
      unitPrice: 45,
      supplier: "Apex MedSupplies Co.",
      location: "Nurse Station & Gym",
      status: "Low Stock",
    },
    {
      id: "inv-4",
      sku: "SPT-BSK-009",
      name: "Official Competition Basketballs (Size 7)",
      category: "Sports & Athletics",
      department: "Athletics",
      stockQty: 18,
      minThreshold: 10,
      unitPrice: 38,
      supplier: "Champion Athletic Gear",
      location: "Gymnasium Store",
      status: "In Stock",
    },
    {
      id: "inv-5",
      sku: "OFF-PPR-A4",
      name: "Recycled White A4 Printer Paper (500-sheet ream)",
      category: "Office & Stationery",
      department: "Administrative Offices",
      stockQty: 50,
      minThreshold: 20,
      unitPrice: 6.5,
      supplier: "Metro Office Supplies",
      location: "Central Storage Room",
      status: "In Stock",
    },
  ]);

  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    category: "Laboratory & Science",
    department: "Science Dept",
    stockQty: 10,
    minThreshold: 5,
    unitPrice: 50,
    supplier: "Global Scientific Instruments Ltd",
    location: "Lab Store",
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = Number(formData.stockQty);
    const min = Number(formData.minThreshold);
    const newItem: InventoryProduct = {
      id: `inv-${Date.now()}`,
      sku: formData.sku,
      name: formData.name,
      category: formData.category,
      department: formData.department,
      stockQty: qty,
      minThreshold: min,
      unitPrice: Number(formData.unitPrice),
      supplier: formData.supplier,
      location: formData.location,
      status: qty === 0 ? "Out of Stock" : qty <= min ? "Low Stock" : "In Stock",
    };
    setItems((prev) => [newItem, ...prev]);
    setModalOpen(false);
    showToast("Inventory item registered in catalog", "success");
  };

  const filtered = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Campus Asset & Inventory Catalog"
          subtitle="Track stock levels, laboratory apparatus, sports gear, classroom electronics, and reorder alerts."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Asset / Item</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="flex items-center gap-2 flex-1 w-full">
          <Search size={16} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search item SKU, name, or supplier..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none w-full sm:w-auto font-medium"
        >
          <option value="All">All Categories</option>
          <option value="Laboratory & Science">Laboratory & Science</option>
          <option value="IT & Robotics">IT & Robotics</option>
          <option value="Sports & Athletics">Sports & Athletics</option>
          <option value="Health & Safety">Health & Safety</option>
          <option value="Office & Stationery">Office & Stationery</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <Boxes size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white line-clamp-1">
                      {item.name}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono">
                      SKU: {item.sku}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    item.status === "In Stock"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : item.status === "Low Stock"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Category:</span>
                  <span className="font-medium text-brand-600 dark:text-brand-400">
                    {item.category}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Storage Location:</span>
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {item.location}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Supplier:</span>
                  <span className="truncate max-w-[170px]">{item.supplier}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase block">
                  Available Quantity
                </span>
                <span className="text-sm font-black text-stone-900 dark:text-white">
                  {item.stockQty} Units{" "}
                  <span className="text-[11px] font-normal text-stone-400">
                    (Min: {item.minThreshold})
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => showToast(`Edit inventory item ${item.sku}`, "info")}
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
              Add Inventory Asset
            </h3>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Item Name *
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
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    placeholder="LAB-BIO-005"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Laboratory & Science">Laboratory & Science</option>
                    <option value="IT & Robotics">IT & Robotics</option>
                    <option value="Sports & Athletics">Sports & Athletics</option>
                    <option value="Health & Safety">Health & Safety</option>
                    <option value="Office & Stationery">Office & Stationery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.stockQty}
                    onChange={(e) => setFormData({ ...formData, stockQty: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Min Alert Threshold
                  </label>
                  <input
                    type="number"
                    value={formData.minThreshold}
                    onChange={(e) => setFormData({ ...formData, minThreshold: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Storage Location
                </label>
                <input
                  type="text"
                  placeholder="Room 302, Cabinet B"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
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
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
