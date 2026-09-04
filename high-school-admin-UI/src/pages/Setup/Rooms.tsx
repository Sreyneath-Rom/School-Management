import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  DoorOpen, 
  Plus, 
  Search, 
  Users, 
  Monitor, 
  FlaskConical, 
  BookOpen, 
  Volume2, 
  CheckCircle, 
  AlertCircle, 
  Wrench,
  Edit3,
  Trash2
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface RoomItem {
  id: string;
  name: string;
  code: string;
  building: string;
  floor: string;
  type: "Classroom" | "Science Lab" | "Computer Lab" | "Auditorium" | "Library Wing";
  capacity: number;
  amenities: string[];
  status: "Available" | "Occupied" | "Maintenance";
  currentClass?: string;
}

export default function Rooms() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);

  const [rooms, setRooms] = useState<RoomItem[]>([
    {
      id: "rm-1",
      name: "Room 101 (Humanities)",
      code: "R-101",
      building: "Main Academic Hall",
      floor: "1st Floor",
      type: "Classroom",
      capacity: 35,
      amenities: ["Interactive Smartboard", "AC", "Projector"],
      status: "Occupied",
      currentClass: "Grade 10-A (History)",
    },
    {
      id: "rm-2",
      name: "Biology Lab 302",
      code: "LAB-BIO",
      building: "Science Wing",
      floor: "3rd Floor",
      type: "Science Lab",
      capacity: 28,
      amenities: ["Microscopes", "Fume Hood", "Chemical Sinks", "Projector"],
      status: "Available",
    },
    {
      id: "rm-3",
      name: "Computer Lab Alpha",
      code: "LAB-CS1",
      building: "Technology Center",
      floor: "2nd Floor",
      type: "Computer Lab",
      capacity: 32,
      amenities: ["32 iMac Workstations", "Gigabit LAN", "Dual Projectors"],
      status: "Occupied",
      currentClass: "Grade 11-A (AP Computer Science)",
    },
    {
      id: "rm-4",
      name: "Grand Auditorium",
      code: "AUD-MAIN",
      building: "Arts & Performing Complex",
      floor: "Ground Floor",
      type: "Auditorium",
      capacity: 450,
      amenities: ["Pro Stage Lighting", "Surround Sound", "Dual 4K Projectors"],
      status: "Available",
    },
    {
      id: "rm-5",
      name: "Chemistry Lab 301",
      code: "LAB-CHEM",
      building: "Science Wing",
      floor: "3rd Floor",
      type: "Science Lab",
      capacity: 30,
      amenities: ["Gas Valves", "Emergency Shower", "Fume Hoods"],
      status: "Maintenance",
    },
    {
      id: "rm-6",
      name: "Room 204 (Mathematics)",
      code: "R-204",
      building: "Main Academic Hall",
      floor: "2nd Floor",
      type: "Classroom",
      capacity: 35,
      amenities: ["Interactive Smartboard", "AC", "Math Graph Boards"],
      status: "Available",
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    building: "Main Academic Hall",
    floor: "1st Floor",
    type: "Classroom" as RoomItem["type"],
    capacity: 30,
    amenitiesText: "Interactive Smartboard, AC",
  });

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.building.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: RoomItem = {
      id: `rm-${Date.now()}`,
      name: formData.name,
      code: formData.code,
      building: formData.building,
      floor: formData.floor,
      type: formData.type,
      capacity: Number(formData.capacity) || 30,
      amenities: formData.amenitiesText.split(",").map((s) => s.trim()).filter(Boolean),
      status: "Available",
    };
    setRooms((prev) => [newRoom, ...prev]);
    setModalOpen(false);
    setFormData({
      name: "",
      code: "",
      building: "Main Academic Hall",
      floor: "1st Floor",
      type: "Classroom",
      capacity: 30,
      amenitiesText: "Interactive Smartboard, AC",
    });
    showToast("Room added successfully", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Rooms & Facilities"
          subtitle="Manage campus classrooms, science labs, tech workshops, and seating capacities."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add New Room</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search room name, code, or building..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Types</option>
            <option value="Classroom">Classroom</option>
            <option value="Science Lab">Science Lab</option>
            <option value="Computer Lab">Computer Lab</option>
            <option value="Auditorium">Auditorium</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl bg-stone-100/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredRooms.map((room) => (
          <div
            key={room.id}
            className="rounded-2xl p-5 glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col justify-between hover:shadow-md transition"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
                    {room.type === "Science Lab" ? (
                      <FlaskConical size={20} />
                    ) : room.type === "Computer Lab" ? (
                      <Monitor size={20} />
                    ) : (
                      <DoorOpen size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-stone-900 dark:text-white">
                      {room.name}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono">
                      {room.code} • {room.building} ({room.floor})
                    </div>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                    room.status === "Available"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                      : room.status === "Occupied"
                      ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                      : "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                  }`}
                >
                  {room.status}
                </span>
              </div>

              {room.currentClass && (
                <div className="mb-3 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  <span>Current: <strong>{room.currentClass}</strong></span>
                </div>
              )}

              <div className="space-y-2 py-3 border-y border-stone-200/50 dark:border-white/10 text-xs">
                <div className="flex items-center justify-between text-stone-600 dark:text-stone-300">
                  <span className="flex items-center gap-1.5 text-stone-500">
                    <Users size={13} /> Seating Capacity:
                  </span>
                  <span className="font-bold text-stone-900 dark:text-white">
                    {room.capacity} seats
                  </span>
                </div>
                <div>
                  <div className="text-stone-500 mb-1">Equipment & Amenities:</div>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.map((a, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300"
                      >
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between gap-2">
              <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
                {room.type}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => showToast(`Edit ${room.name}`, "info")}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition cursor-pointer"
                >
                  <Edit3 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Add New Room / Lab
            </h3>
            <form onSubmit={handleCreateRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Room Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Physics Lab 303"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Room Code *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. LAB-PHY"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Classroom">Classroom</option>
                    <option value="Science Lab">Science Lab</option>
                    <option value="Computer Lab">Computer Lab</option>
                    <option value="Auditorium">Auditorium</option>
                    <option value="Library Wing">Library Wing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Building
                  </label>
                  <input
                    type="text"
                    value={formData.building}
                    onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Capacity (Seats)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="1000"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.amenitiesText}
                  onChange={(e) => setFormData({ ...formData, amenitiesText: e.target.value })}
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
