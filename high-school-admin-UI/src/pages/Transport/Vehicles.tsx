import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Truck, 
  Plus, 
  Search, 
  ShieldCheck, 
  Wrench, 
  Calendar, 
  Fuel, 
  CheckCircle2, 
  Edit3
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface BusVehicle {
  id: string;
  vehicleNo: string;
  model: string;
  plateNumber: string;
  capacity: number;
  fuelType: "Diesel" | "Electric" | "Hybrid";
  insuranceExpiry: string;
  lastServiceDate: string;
  status: "Operational" | "In Maintenance" | "Reserve";
}

export default function Vehicles() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [vehicles, setVehicles] = useState<BusVehicle[]>([
    {
      id: "veh-1",
      vehicleNo: "BUS-04",
      model: "Yellow Bird School Cruiser 45",
      plateNumber: "MA-892-TX",
      capacity: 45,
      fuelType: "Diesel",
      insuranceExpiry: "2026-11-30",
      lastServiceDate: "2026-01-15",
      status: "Operational",
    },
    {
      id: "veh-2",
      vehicleNo: "BUS-08",
      model: "Mercedes-Benz Sprinter Mini",
      plateNumber: "MA-441-BV",
      capacity: 32,
      fuelType: "Diesel",
      insuranceExpiry: "2026-09-15",
      lastServiceDate: "2026-02-01",
      status: "Operational",
    },
    {
      id: "veh-3",
      vehicleNo: "BUS-12",
      model: "Bluebird EcoTransit Electric",
      plateNumber: "MA-773-EV",
      capacity: 48,
      fuelType: "Electric",
      insuranceExpiry: "2027-01-20",
      lastServiceDate: "2026-02-10",
      status: "Operational",
    },
    {
      id: "veh-4",
      vehicleNo: "BUS-02",
      model: "Ford Transit Shuttle",
      plateNumber: "MA-112-FD",
      capacity: 24,
      fuelType: "Hybrid",
      insuranceExpiry: "2026-06-18",
      lastServiceDate: "2026-02-25",
      status: "In Maintenance",
    },
  ]);

  const [formData, setFormData] = useState({
    vehicleNo: "",
    model: "",
    plateNumber: "",
    capacity: 40,
    fuelType: "Diesel" as BusVehicle["fuelType"],
    insuranceExpiry: "2027-01-01",
  });

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    const newVeh: BusVehicle = {
      id: `veh-${Date.now()}`,
      vehicleNo: formData.vehicleNo,
      model: formData.model,
      plateNumber: formData.plateNumber,
      capacity: Number(formData.capacity),
      fuelType: formData.fuelType,
      insuranceExpiry: formData.insuranceExpiry,
      lastServiceDate: new Date().toISOString().split("T")[0],
      status: "Operational",
    };
    setVehicles((prev) => [newVeh, ...prev]);
    setModalOpen(false);
    showToast("Vehicle registered to school fleet", "success");
  };

  const filtered = vehicles.filter(
    (v) =>
      v.vehicleNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Fleet Vehicles & Buses"
          subtitle="Manage campus buses, inspection schedules, insurance certifications, and fuel categories."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Fleet Vehicle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((v) => (
          <div
            key={v.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <Truck size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {v.vehicleNo}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium">
                      {v.model}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    v.status === "Operational"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {v.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">License Plate:</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white">
                    {v.plateNumber}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Passenger Capacity:</span>
                  <span className="font-semibold">{v.capacity} Passengers</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Powertrain:</span>
                  <span className="font-medium text-brand-600 dark:text-brand-400">
                    {v.fuelType}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Insurance Valid Until:</span>
                  <span className="font-mono">{v.insuranceExpiry}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Last Service: {v.lastServiceDate}
              </span>
              <button
                type="button"
                onClick={() => showToast(`Edit vehicle ${v.vehicleNo}`, "info")}
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
              Register Fleet Vehicle
            </h3>
            <form onSubmit={handleAddVehicle} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Vehicle Number *
                  </label>
                  <input
                    type="text"
                    placeholder="BUS-05"
                    value={formData.vehicleNo}
                    onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Plate Number *
                  </label>
                  <input
                    type="text"
                    placeholder="MA-552-XY"
                    value={formData.plateNumber}
                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Model & Manufacturer
                </label>
                <input
                  type="text"
                  placeholder="Mercedes Sprinter 32"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Seat Capacity
                  </label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Fuel Type
                  </label>
                  <select
                    value={formData.fuelType}
                    onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric (EV)</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
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
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
