import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  User, 
  Plus, 
  Search, 
  Phone, 
  ShieldCheck, 
  Calendar, 
  Bus, 
  CheckCircle2,
  Award
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface DriverStaff {
  id: string;
  name: string;
  employeeId: string;
  phone: string;
  licenseNumber: string;
  licenseType: string;
  licenseExpiry: string;
  assignedRoute: string;
  experienceYears: number;
  status: "On Duty" | "Off Duty" | "On Leave";
}

export default function Drivers() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [drivers, setDrivers] = useState<DriverStaff[]>([
    {
      id: "dr-1",
      name: "Robert Miller",
      employeeId: "DRV-101",
      phone: "+1 (555) 492-8811",
      licenseNumber: "CDL-MA-99210",
      licenseType: "Commercial Driver License (Class B + Passenger)",
      licenseExpiry: "2028-05-12",
      assignedRoute: "R-101 (North Metro Express)",
      experienceYears: 12,
      status: "On Duty",
    },
    {
      id: "dr-2",
      name: "David Jenkins",
      employeeId: "DRV-102",
      phone: "+1 (555) 492-7722",
      licenseNumber: "CDL-MA-88123",
      licenseType: "Commercial Driver License (Class B + School Bus)",
      licenseExpiry: "2027-10-20",
      assignedRoute: "R-102 (Westside Suburbs)",
      experienceYears: 8,
      status: "On Duty",
    },
    {
      id: "dr-3",
      name: "Carlos Ramirez",
      employeeId: "DRV-103",
      phone: "+1 (555) 492-6633",
      licenseNumber: "CDL-MA-77341",
      licenseType: "Commercial Driver License (Class A)",
      licenseExpiry: "2029-01-15",
      assignedRoute: "R-103 (South Hills Corridor)",
      experienceYears: 15,
      status: "On Duty",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    licenseNumber: "",
    licenseType: "CDL Class B (Passenger)",
    licenseExpiry: "2028-01-01",
    assignedRoute: "R-104 (East Loop)",
    experienceYears: 5,
  });

  const handleAddDriver = (e: React.FormEvent) => {
    e.preventDefault();
    const newDr: DriverStaff = {
      id: `dr-${Date.now()}`,
      name: formData.name,
      employeeId: `DRV-10${drivers.length + 1}`,
      phone: formData.phone,
      licenseNumber: formData.licenseNumber,
      licenseType: formData.licenseType,
      licenseExpiry: formData.licenseExpiry,
      assignedRoute: formData.assignedRoute,
      experienceYears: Number(formData.experienceYears),
      status: "On Duty",
    };
    setDrivers((prev) => [newDr, ...prev]);
    setModalOpen(false);
    showToast("Driver profile registered", "success");
  };

  const filtered = drivers.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.assignedRoute.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Transport Drivers & Chauffeurs"
          subtitle="Maintain commercial driver licensing certifications, background checks, and assigned routes."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Driver</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((d) => (
          <div
            key={d.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {d.name}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono">
                      ID: {d.employeeId} • {d.experienceYears} Yrs Exp.
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                  {d.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Phone size={13} className="text-brand-500 shrink-0" />
                  <span>{d.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <Bus size={13} className="text-brand-500 shrink-0" />
                  <span className="font-medium text-stone-800 dark:text-stone-200">
                    {d.assignedRoute}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">License #:</span>
                  <span className="font-mono">{d.licenseNumber}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Valid Until:</span>
                  <span className="font-mono">{d.licenseExpiry}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between text-[11px] text-stone-500">
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck size={14} /> Background Verified
              </span>
              <button
                type="button"
                onClick={() => showToast(`Driver ${d.name} contact dialed`, "info")}
                className="text-brand-600 dark:text-brand-400 font-semibold hover:underline cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Add Driver Profile
            </h3>
            <form onSubmit={handleAddDriver} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Full Name *
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
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    value={formData.experienceYears}
                    onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    License Number *
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    License Expiry
                  </label>
                  <input
                    type="date"
                    value={formData.licenseExpiry}
                    onChange={(e) => setFormData({ ...formData, licenseExpiry: e.target.value })}
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
                  Save Driver
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
