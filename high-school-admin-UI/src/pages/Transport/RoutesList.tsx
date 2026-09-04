import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Bus, 
  Plus, 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  CheckCircle2, 
  Navigation,
  Edit3
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface TransportRoute {
  id: string;
  routeName: string;
  routeCode: string;
  startPoint: string;
  endPoint: string;
  stopsCount: number;
  totalDistanceKm: number;
  assignedBus: string;
  driverName: string;
  studentCapacity: number;
  enrolledStudents: number;
  departureMorning: string;
  status: "Active" | "Maintenance";
}

export default function RoutesList() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [routes, setRoutes] = useState<TransportRoute[]>([
    {
      id: "rt-1",
      routeName: "North Metro & Highland Park Express",
      routeCode: "R-101",
      startPoint: "Highland Metro Station",
      endPoint: "Oakridge Campus Main Gate",
      stopsCount: 8,
      totalDistanceKm: 14.5,
      assignedBus: "Bus #04 (Yellow Bird 45-seater)",
      driverName: "Robert Miller",
      studentCapacity: 45,
      enrolledStudents: 42,
      departureMorning: "06:45 AM",
      status: "Active",
    },
    {
      id: "rt-2",
      routeName: "Westside Suburbs & Riverside Loop",
      routeCode: "R-102",
      startPoint: "Riverside Center",
      endPoint: "Oakridge Campus Main Gate",
      stopsCount: 6,
      totalDistanceKm: 18.2,
      assignedBus: "Bus #08 (Mercedes Sprinter 32-seater)",
      driverName: "David Jenkins",
      studentCapacity: 32,
      enrolledStudents: 30,
      departureMorning: "06:50 AM",
      status: "Active",
    },
    {
      id: "rt-3",
      routeName: "South Hills & Lakeview Corridor",
      routeCode: "R-103",
      startPoint: "Lakeview Community Plaza",
      endPoint: "Oakridge Campus Main Gate",
      stopsCount: 10,
      totalDistanceKm: 22.0,
      assignedBus: "Bus #12 (Bluebird Transit 48-seater)",
      driverName: "Carlos Ramirez",
      studentCapacity: 48,
      enrolledStudents: 47,
      departureMorning: "06:30 AM",
      status: "Active",
    },
  ]);

  const [formData, setFormData] = useState({
    routeName: "",
    routeCode: "",
    startPoint: "",
    endPoint: "Oakridge Campus",
    stopsCount: 5,
    totalDistanceKm: 12,
    assignedBus: "Bus #01",
    driverName: "John Doe",
    studentCapacity: 40,
    departureMorning: "07:00 AM",
  });

  const handleAddRoute = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoute: TransportRoute = {
      id: `rt-${Date.now()}`,
      routeName: formData.routeName,
      routeCode: formData.routeCode,
      startPoint: formData.startPoint,
      endPoint: formData.endPoint,
      stopsCount: Number(formData.stopsCount),
      totalDistanceKm: Number(formData.totalDistanceKm),
      assignedBus: formData.assignedBus,
      driverName: formData.driverName,
      studentCapacity: Number(formData.studentCapacity),
      enrolledStudents: 0,
      departureMorning: formData.departureMorning,
      status: "Active",
    };
    setRoutes((prev) => [newRoute, ...prev]);
    setModalOpen(false);
    showToast("Transport route created successfully", "success");
  };

  const filtered = routes.filter(
    (r) =>
      r.routeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.routeCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.driverName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Transport Routes & GPS Waypoints"
          subtitle="Manage morning and afternoon bus corridors, designated stop schedules, and vehicle allocations."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Create Route</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    <Bus size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {r.routeName}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono">
                      Route: {r.routeCode} • Departs: {r.departureMorning}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                  <MapPin size={13} className="text-brand-500 shrink-0" />
                  <span className="truncate">
                    {r.startPoint} → {r.endPoint}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Stops / Distance:</span>
                  <span className="font-medium">
                    {r.stopsCount} stops ({r.totalDistanceKm} km)
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Driver / Vehicle:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {r.driverName} ({r.assignedBus.split("(")[0]})
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-400 font-bold uppercase block">
                  Capacity
                </span>
                <span className="text-xs font-black text-brand-600 dark:text-brand-400">
                  {r.enrolledStudents} / {r.studentCapacity} Seats Filled
                </span>
              </div>

              <button
                type="button"
                onClick={() => showToast(`Edit ${r.routeCode} corridor`, "info")}
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
              Add Transport Corridor
            </h3>
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Route Name *
                </label>
                <input
                  type="text"
                  value={formData.routeName}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Route Code *
                  </label>
                  <input
                    type="text"
                    value={formData.routeCode}
                    onChange={(e) => setFormData({ ...formData, routeCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Morning Departure
                  </label>
                  <input
                    type="text"
                    value={formData.departureMorning}
                    onChange={(e) => setFormData({ ...formData, departureMorning: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Start Waypoint
                  </label>
                  <input
                    type="text"
                    value={formData.startPoint}
                    onChange={(e) => setFormData({ ...formData, startPoint: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Assigned Driver
                  </label>
                  <input
                    type="text"
                    value={formData.driverName}
                    onChange={(e) => setFormData({ ...formData, driverName: e.target.value })}
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
                  Save Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
