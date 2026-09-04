import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Building2, 
  Plus, 
  Search, 
  Bed, 
  User, 
  Calendar, 
  CheckCircle2, 
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface ResidentAllocation {
  id: string;
  studentName: string;
  studentId: string;
  gradeLevel: string;
  block: string;
  roomNumber: string;
  bedNumber: string;
  allocatedDate: string;
  emergencyContact: string;
  guardianName: string;
  status: "Active" | "Vacating" | "Checked Out";
}

export default function RoomAllocation() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [allocations, setAllocations] = useState<ResidentAllocation[]>([
    {
      id: "all-1",
      studentName: "Ethan Walker",
      studentId: "STU-001",
      gradeLevel: "Grade 10-A",
      block: "Block A (Boys)",
      roomNumber: "A-201",
      bedNumber: "Bed #1",
      allocatedDate: "2025-08-25",
      emergencyContact: "+1 (555) 876-5432",
      guardianName: "Arthur Walker",
      status: "Active",
    },
    {
      id: "all-2",
      studentName: "Liam Chen",
      studentId: "STU-003",
      gradeLevel: "Grade 10-A",
      block: "Block A (Boys)",
      roomNumber: "A-201",
      bedNumber: "Bed #2",
      allocatedDate: "2025-08-25",
      emergencyContact: "+1 (555) 333-2211",
      guardianName: "Hao Chen",
      status: "Active",
    },
    {
      id: "all-3",
      studentName: "Sophia Martinez",
      studentId: "STU-002",
      gradeLevel: "Grade 10-A",
      block: "Block B (Girls)",
      roomNumber: "B-104",
      bedNumber: "Bed #3",
      allocatedDate: "2025-08-25",
      emergencyContact: "+1 (555) 987-6543",
      guardianName: "Carlos Martinez",
      status: "Active",
    },
  ]);

  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "STU-007",
    gradeLevel: "Grade 10-A",
    block: "Block A (Boys)",
    roomNumber: "A-202",
    bedNumber: "Bed #2",
    guardianName: "Parent Name",
  });

  const handleAddAllocation = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlloc: ResidentAllocation = {
      id: `all-${Date.now()}`,
      studentName: formData.studentName,
      studentId: formData.studentId,
      gradeLevel: formData.gradeLevel,
      block: formData.block,
      roomNumber: formData.roomNumber,
      bedNumber: formData.bedNumber,
      allocatedDate: new Date().toISOString().split("T")[0],
      emergencyContact: "+1 (555) 000-1122",
      guardianName: formData.guardianName,
      status: "Active",
    };
    setAllocations((prev) => [newAlloc, ...prev]);
    setModalOpen(false);
    showToast("Student allocated to dormitory bed", "success");
  };

  const filtered = allocations.filter(
    (a) =>
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.studentId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Hostel Bed Allocation & Residents"
          subtitle="Assign boarding students to dormitory suites, manage roommates, and track resident checkout dates."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Allocate Resident Bed</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search resident student, room number, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5">Resident Student</th>
                <th className="p-3.5">Dorm Block</th>
                <th className="p-3.5">Room & Bed #</th>
                <th className="p-3.5">Allocation Date</th>
                <th className="p-3.5">Guardian / Emergency</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {a.studentName}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {a.gradeLevel} • {a.studentId}
                    </div>
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300 font-medium">
                    {a.block}
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-stone-900 dark:text-white">
                      {a.roomNumber}
                    </span>
                    <span className="text-[11px] text-brand-600 dark:text-brand-400 font-semibold ml-1.5">
                      ({a.bedNumber})
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300">
                    {a.allocatedDate}
                  </td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300">
                    <div className="font-medium">{a.guardianName}</div>
                    <div className="text-[10px] font-mono text-stone-400">{a.emergencyContact}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      {a.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => showToast(`Dorm Pass printed for ${a.studentName}`, "success")}
                      className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      Dorm Pass
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Allocate Dorm Bed
            </h3>
            <form onSubmit={handleAddAllocation} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Hostel Block
                  </label>
                  <select
                    value={formData.block}
                    onChange={(e) => setFormData({ ...formData, block: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Block A (Boys)">Block A (Boys)</option>
                    <option value="Block B (Girls)">Block B (Girls)</option>
                    <option value="Block C (Senior Honors)">Block C (Senior Honors)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Room Number
                  </label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Bed Designation
                </label>
                <input
                  type="text"
                  placeholder="Bed #1"
                  value={formData.bedNumber}
                  onChange={(e) => setFormData({ ...formData, bedNumber: e.target.value })}
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
                  Allocate Bed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
