import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Bus, 
  User, 
  Plus, 
  Search, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface AssignmentRecord {
  id: string;
  studentName: string;
  studentId: string;
  gradeLevel: string;
  routeName: string;
  pickupStop: string;
  pickupTimeMorning: string;
  dropTimeAfternoon: string;
  busNumber: string;
  emergencyContact: string;
  feeStatus: "Paid" | "Pending";
}

export default function TransportAssignments() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [assignments, setAssignments] = useState<AssignmentRecord[]>([
    {
      id: "asg-1",
      studentName: "Ethan Walker",
      studentId: "STU-001",
      gradeLevel: "Grade 10-A",
      routeName: "R-101 (North Metro Express)",
      pickupStop: "Highland Metro Stop #3",
      pickupTimeMorning: "07:15 AM",
      dropTimeAfternoon: "03:45 PM",
      busNumber: "BUS-04",
      emergencyContact: "+1 (555) 876-5432",
      feeStatus: "Paid",
    },
    {
      id: "asg-2",
      studentName: "Sophia Martinez",
      studentId: "STU-002",
      gradeLevel: "Grade 10-A",
      routeName: "R-102 (Westside Suburbs)",
      pickupStop: "Riverside Center Station",
      pickupTimeMorning: "07:10 AM",
      dropTimeAfternoon: "03:50 PM",
      busNumber: "BUS-08",
      emergencyContact: "+1 (555) 987-6543",
      feeStatus: "Paid",
    },
    {
      id: "asg-3",
      studentName: "Liam Chen",
      studentId: "STU-003",
      gradeLevel: "Grade 10-A",
      routeName: "R-101 (North Metro Express)",
      pickupStop: "Oakwood Plaza Stop #5",
      pickupTimeMorning: "07:22 AM",
      dropTimeAfternoon: "03:40 PM",
      busNumber: "BUS-04",
      emergencyContact: "+1 (555) 333-2211",
      feeStatus: "Paid",
    },
  ]);

  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "STU-005",
    gradeLevel: "Grade 10-A",
    routeName: "R-101 (North Metro Express)",
    pickupStop: "Pine Street Crossing",
    pickupTimeMorning: "07:18 AM",
    dropTimeAfternoon: "03:42 PM",
    busNumber: "BUS-04",
  });

  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const newAsg: AssignmentRecord = {
      id: `asg-${Date.now()}`,
      studentName: formData.studentName,
      studentId: formData.studentId,
      gradeLevel: formData.gradeLevel,
      routeName: formData.routeName,
      pickupStop: formData.pickupStop,
      pickupTimeMorning: formData.pickupTimeMorning,
      dropTimeAfternoon: formData.dropTimeAfternoon,
      busNumber: formData.busNumber,
      emergencyContact: "+1 (555) 000-0000",
      feeStatus: "Paid",
    };
    setAssignments((prev) => [newAsg, ...prev]);
    setModalOpen(false);
    showToast("Student allocated to transport route", "success");
  };

  const filtered = assignments.filter(
    (a) =>
      a.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.pickupStop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.routeName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Student Transport Assignments & Passes"
          subtitle="Allocate students to bus corridors, designate morning pickup stops, and generate transit ID cards."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Allocate Bus Seat</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search student, designated stop, or route..."
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
                <th className="p-3.5">Student / Class</th>
                <th className="p-3.5">Route & Bus Number</th>
                <th className="p-3.5">Designated Pickup Stop</th>
                <th className="p-3.5">Morning Pickup</th>
                <th className="p-3.5">Afternoon Drop</th>
                <th className="p-3.5">Fee Status</th>
                <th className="p-3.5 text-right">Transit Pass</th>
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
                  <td className="p-3.5">
                    <div className="font-medium text-stone-800 dark:text-stone-200">
                      {a.routeName}
                    </div>
                    <span className="font-bold text-[10px] text-brand-600 dark:text-brand-400">
                      {a.busNumber}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300 font-medium">
                    {a.pickupStop}
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300">
                    {a.pickupTimeMorning}
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300">
                    {a.dropTimeAfternoon}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      {a.feeStatus}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => showToast(`Transit Pass generated for ${a.studentName}`, "success")}
                      className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      Print Pass
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
              Allocate Route Seat
            </h3>
            <form onSubmit={handleAddAssignment} className="space-y-4">
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

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Transport Route
                </label>
                <select
                  value={formData.routeName}
                  onChange={(e) => setFormData({ ...formData, routeName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="R-101 (North Metro Express)">R-101 (North Metro Express)</option>
                  <option value="R-102 (Westside Suburbs)">R-102 (Westside Suburbs)</option>
                  <option value="R-103 (South Hills Corridor)">R-103 (South Hills Corridor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Pickup Stop *
                </label>
                <input
                  type="text"
                  value={formData.pickupStop}
                  onChange={(e) => setFormData({ ...formData, pickupStop: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Morning Pickup Time
                  </label>
                  <input
                    type="text"
                    value={formData.pickupTimeMorning}
                    onChange={(e) => setFormData({ ...formData, pickupTimeMorning: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Bus Assigned
                  </label>
                  <input
                    type="text"
                    value={formData.busNumber}
                    onChange={(e) => setFormData({ ...formData, busNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  Allocate Seat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
