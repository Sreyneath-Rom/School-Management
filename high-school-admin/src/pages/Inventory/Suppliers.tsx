import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Building2, 
  Plus, 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  CheckCircle2, 
  Edit3 
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface VendorSupplier {
  id: string;
  vendorName: string;
  contactPerson: string;
  category: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  totalOrdersFulfilled: number;
  status: "Preferred Partner" | "Active" | "Under Review";
}

export default function Suppliers() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [suppliers, setSuppliers] = useState<VendorSupplier[]>([
    {
      id: "sup-1",
      vendorName: "Global Scientific Instruments Ltd",
      contactPerson: "Dr. Arthur Vance",
      category: "Laboratory & Chemistry Supplies",
      email: "orders@globalsci.com",
      phone: "+1 (555) 902-1144",
      address: "45 Technology Park, Suite 200, Boston, MA",
      rating: 4.9,
      totalOrdersFulfilled: 42,
      status: "Preferred Partner",
    },
    {
      id: "sup-2",
      vendorName: "Apex EduTech Solutions",
      contactPerson: "Miranda Cole",
      category: "Robotics, Laptops & IT Hardware",
      email: "sales@apexedutech.io",
      phone: "+1 (555) 883-2211",
      address: "100 Innovation Way, Cambridge, MA",
      rating: 4.8,
      totalOrdersFulfilled: 28,
      status: "Preferred Partner",
    },
    {
      id: "sup-3",
      vendorName: "Champion Athletic Gear",
      contactPerson: "Gareth Bale",
      category: "Sports & Gymnasium Equipment",
      email: "dispatch@championathletic.com",
      phone: "+1 (555) 771-3399",
      address: "88 Stadium Boulevard, Waltham, MA",
      rating: 4.7,
      totalOrdersFulfilled: 35,
      status: "Active",
    },
    {
      id: "sup-4",
      vendorName: "Metro Office Supplies",
      contactPerson: "Rachel Green",
      category: "Paper, Stationery & Toners",
      email: "help@metro-supplies.com",
      phone: "+1 (555) 442-9900",
      address: "12 Logistics Dr, Framingham, MA",
      rating: 4.6,
      totalOrdersFulfilled: 64,
      status: "Active",
    },
  ]);

  const [formData, setFormData] = useState({
    vendorName: "",
    contactPerson: "",
    category: "Laboratory & Chemistry Supplies",
    email: "",
    phone: "",
    address: "",
  });

  const handleAddSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    const newSup: VendorSupplier = {
      id: `sup-${Date.now()}`,
      vendorName: formData.vendorName,
      contactPerson: formData.contactPerson,
      category: formData.category,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      rating: 5.0,
      totalOrdersFulfilled: 1,
      status: "Active",
    };
    setSuppliers((prev) => [newSup, ...prev]);
    setModalOpen(false);
    showToast("Vendor supplier profile registered", "success");
  };

  const filtered = suppliers.filter(
    (s) =>
      s.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Procurement Vendors & Suppliers"
          subtitle="Maintain school vendor contracts, contact details, product catalogs, and performance ratings."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Vendor Supplier</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {s.vendorName}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium">
                      Contact: {s.contactPerson}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    s.status === "Preferred Partner"
                      ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                      : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                  }`}
                >
                  {s.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Domain / Goods:</span>
                  <span className="font-medium text-brand-600 dark:text-brand-400">
                    {s.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Mail size={13} className="text-stone-400" />
                  <span>{s.email}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Phone size={13} className="text-stone-400" />
                  <span className="font-mono">{s.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <MapPin size={13} className="text-stone-400 shrink-0" />
                  <span className="truncate">{s.address}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star size={15} fill="currentColor" /> {s.rating}
                <span className="text-[11px] font-normal text-stone-400 ml-1">
                  ({s.totalOrdersFulfilled} Purchase Orders)
                </span>
              </div>

              <button
                type="button"
                onClick={() => showToast(`Edit vendor ${s.vendorName}`, "info")}
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
              Register Vendor Supplier
            </h3>
            <form onSubmit={handleAddSupplier} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Company / Vendor Name *
                </label>
                <input
                  type="text"
                  value={formData.vendorName}
                  onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Office Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
