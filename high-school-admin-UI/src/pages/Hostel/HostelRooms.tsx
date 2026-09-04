import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Building2, 
  Plus, 
  Search, 
  Bed, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Edit3
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface DormRoom {
  id: string;
  roomNumber: string;
  block: "Block A (Boys Dorm)" | "Block B (Girls Dorm)" | "Block C (Senior Honors)";
  floor: string;
  roomType: "Single Occupancy" | "Double Occupancy" | "Quad Suite";
  capacity: number;
  occupiedBeds: number;
  monthlyFee: number;
  amenities: string[];
  status: "Available" | "Full" | "Maintenance";
}

export default function HostelRooms() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [blockFilter, setBlockFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const [rooms, setRooms] = useState<DormRoom[]>([
    {
      id: "hr-1",
      roomNumber: "A-201",
      block: "Block A (Boys Dorm)",
      floor: "2nd Floor",
      roomType: "Double Occupancy",
      capacity: 2,
      occupiedBeds: 2,
      monthlyFee: 650,
      amenities: ["Ensuite Bath", "AC", "Study Desk", "Wi-Fi 6"],
      status: "Full",
    },
    {
      id: "hr-2",
      roomNumber: "A-202",
      block: "Block A (Boys Dorm)",
      floor: "2nd Floor",
      roomType: "Double Occupancy",
      capacity: 2,
      occupiedBeds: 1,
      monthlyFee: 650,
      amenities: ["Ensuite Bath", "AC", "Study Desk", "Wi-Fi 6"],
      status: "Available",
    },
    {
      id: "hr-3",
      roomNumber: "B-104",
      block: "Block B (Girls Dorm)",
      floor: "1st Floor",
      roomType: "Quad Suite",
      capacity: 4,
      occupiedBeds: 3,
      monthlyFee: 450,
      amenities: ["Shared Bath", "Ceiling Fan", "Study Desks", "Wi-Fi 6"],
      status: "Available",
    },
    {
      id: "hr-4",
      roomNumber: "C-301",
      block: "Block C (Senior Honors)",
      floor: "3rd Floor",
      roomType: "Single Occupancy",
      capacity: 1,
      occupiedBeds: 1,
      monthlyFee: 950,
      amenities: ["Private Balcony", "Ensuite Bath", "AC", "High-speed LAN"],
      status: "Full",
    },
    {
      id: "hr-5",
      roomNumber: "B-205",
      block: "Block B (Girls Dorm)",
      floor: "2nd Floor",
      roomType: "Double Occupancy",
      capacity: 2,
      occupiedBeds: 0,
      monthlyFee: 650,
      amenities: ["Ensuite Bath", "AC", "Study Desk"],
      status: "Available",
    },
  ]);

  const [formData, setFormData] = useState({
    roomNumber: "",
    block: "Block A (Boys Dorm)" as DormRoom["block"],
    floor: "1st Floor",
    roomType: "Double Occupancy" as DormRoom["roomType"],
    capacity: 2,
    monthlyFee: 650,
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: DormRoom = {
      id: `hr-${Date.now()}`,
      roomNumber: formData.roomNumber,
      block: formData.block,
      floor: formData.floor,
      roomType: formData.roomType,
      capacity: Number(formData.capacity),
      occupiedBeds: 0,
      monthlyFee: Number(formData.monthlyFee),
      amenities: ["AC", "Study Desk", "Wi-Fi 6"],
      status: "Available",
    };
    setRooms((prev) => [newRoom, ...prev]);
    setModalOpen(false);
    showToast("Hostel room added to inventory", "success");
  };

  const filtered = rooms.filter((r) => {
    const matchesSearch =
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.block.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBlock = blockFilter === "All" || r.block === blockFilter;
    return matchesSearch && matchesBlock;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Hostel & Residential Dorms"
          subtitle="Configure dormitory blocks, room tiers, bed capacities, amenities, and boarding rates."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add Hostel Room</span>
        </button>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3.5 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="flex items-center gap-2 flex-1 w-full">
          <Search size={16} className="text-stone-400" />
          <input
            type="text"
            placeholder="Search room number or block..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
          />
        </div>

        <select
          value={blockFilter}
          onChange={(e) => setBlockFilter(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none w-full sm:w-auto font-medium"
        >
          <option value="All">All Dorm Blocks</option>
          <option value="Block A (Boys Dorm)">Block A (Boys Dorm)</option>
          <option value="Block B (Girls Dorm)">Block B (Girls Dorm)</option>
          <option value="Block C (Senior Honors)">Block C (Senior Honors)</option>
        </select>
      </div>

      {/* Grid */}
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
                    <Bed size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      Room {r.roomNumber}
                    </h3>
                    <div className="text-xs text-stone-500 font-medium">
                      {r.block} • {r.floor}
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                    r.status === "Available"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      : r.status === "Full"
                      ? "bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300"
                      : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {r.status}
                </span>
              </div>

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Tier / Layout:</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {r.roomType}
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Bed Occupancy:</span>
                  <span className="font-bold text-brand-600 dark:text-brand-400">
                    {r.occupiedBeds} / {r.capacity} Occupied
                  </span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-300">
                  <span className="text-stone-500">Boarding Rate:</span>
                  <span className="font-black text-stone-900 dark:text-white">
                    ${r.monthlyFee}/mo
                  </span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-1">
                {r.amenities.map((am, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded-md bg-stone-100 dark:bg-white/5 text-[10px] text-stone-600 dark:text-stone-300"
                  >
                    {am}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-stone-500">
                {r.capacity - r.occupiedBeds} Vacant Bed(s)
              </span>
              <button
                type="button"
                onClick={() => showToast(`Edit Room ${r.roomNumber}`, "info")}
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
              Add Dorm Room
            </h3>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    placeholder="A-305"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Floor
                  </label>
                  <input
                    type="text"
                    placeholder="3rd Floor"
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Hostel Block
                </label>
                <select
                  value={formData.block}
                  onChange={(e) => setFormData({ ...formData, block: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Block A (Boys Dorm)">Block A (Boys Dorm)</option>
                  <option value="Block B (Girls Dorm)">Block B (Girls Dorm)</option>
                  <option value="Block C (Senior Honors)">Block C (Senior Honors)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Room Type
                  </label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Single Occupancy">Single Occupancy</option>
                    <option value="Double Occupancy">Double Occupancy</option>
                    <option value="Quad Suite">Quad Suite</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Monthly Fee ($)
                  </label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: Number(e.target.value) })}
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
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
