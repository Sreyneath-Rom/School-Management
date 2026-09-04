import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search, 
  Calendar, 
  User, 
  Check, 
  X, 
  AlertCircle,
  Save
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface FacultyAttendanceRecord {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  checkIn: string;
  checkOut: string;
  status: "Present" | "Late" | "Absent" | "On Leave";
  notes?: string;
}

export default function TeacherAttendance() {
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState("2026-03-02");
  const [deptFilter, setDeptFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const [records, setRecords] = useState<FacultyAttendanceRecord[]>([
    {
      id: "fa-1",
      employeeId: "FAC-SCI-01",
      name: "Dr. John Whitfield",
      department: "Science",
      checkIn: "07:45 AM",
      checkOut: "04:15 PM",
      status: "Present",
    },
    {
      id: "fa-2",
      employeeId: "FAC-MTH-03",
      name: "Prof. Marcus Kane",
      department: "Mathematics",
      checkIn: "07:55 AM",
      checkOut: "--",
      status: "Present",
    },
    {
      id: "fa-3",
      employeeId: "FAC-HUM-02",
      name: "Sarah Parker",
      department: "Humanities",
      checkIn: "08:18 AM",
      checkOut: "--",
      status: "Late",
      notes: "Traffic on Route 9",
    },
    {
      id: "fa-4",
      employeeId: "FAC-ART-01",
      name: "Liam Walker",
      department: "Fine Arts",
      checkIn: "--",
      checkOut: "--",
      status: "On Leave",
      notes: "Approved Medical Leave",
    },
    {
      id: "fa-5",
      employeeId: "FAC-CS-04",
      name: "Elena Vance",
      department: "Technology",
      checkIn: "07:30 AM",
      checkOut: "04:30 PM",
      status: "Present",
    },
    {
      id: "fa-6",
      employeeId: "FAC-ENG-02",
      name: "Claire Bennett",
      department: "Languages",
      checkIn: "07:50 AM",
      checkOut: "--",
      status: "Present",
    },
  ]);

  const handleStatusChange = (
    id: string,
    status: FacultyAttendanceRecord["status"]
  ) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleSaveAll = () => {
    showToast("Faculty attendance updated and synchronized with payroll logs", "success");
  };

  const filteredRecords = records.filter((r) => {
    const matchesDept = deptFilter === "All" || r.department === deptFilter;
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const presentCount = records.filter((r) => r.status === "Present").length;
  const lateCount = records.filter((r) => r.status === "Late").length;
  const leaveCount = records.filter((r) => r.status === "On Leave" || r.status === "Absent").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Teacher Attendance & Duty Register"
          subtitle="Record daily faculty check-ins, biometric timestamps, duty logs, and leave tracking."
        />
        <div className="flex items-center gap-3 shrink-0">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={handleSaveAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Save size={16} />
            <span>Save Attendance</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">On Duty / Present</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {presentCount} Faculty Members
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Late Check-Ins</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {lateCount} Logged
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <XCircle size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">On Leave / Absent</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {leaveCount} Teachers
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Table */}
      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search faculty name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none"
          >
            <option value="All">All Departments</option>
            <option value="Science">Science</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Humanities">Humanities</option>
            <option value="Technology">Technology</option>
            <option value="Languages">Languages</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5">Faculty Name & ID</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Biometric Check-In</th>
                <th className="p-3.5">Check-Out</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Action Marker</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filteredRecords.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900 dark:text-white">{r.name}</div>
                    <div className="text-[11px] font-mono text-stone-400">{r.employeeId}</div>
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300 font-medium">
                    {r.department}
                  </td>
                  <td className="p-3.5 font-mono text-stone-700 dark:text-stone-300">
                    {r.checkIn}
                  </td>
                  <td className="p-3.5 font-mono text-stone-700 dark:text-stone-300">
                    {r.checkOut}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        r.status === "Present"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : r.status === "Late"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(r.id, "Present")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          r.status === "Present"
                            ? "bg-emerald-600 text-white"
                            : "bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 hover:bg-emerald-500 hover:text-white"
                        }`}
                      >
                        Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(r.id, "Late")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          r.status === "Late"
                            ? "bg-amber-600 text-white"
                            : "bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 hover:bg-amber-500 hover:text-white"
                        }`}
                      >
                        Late
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(r.id, "On Leave")}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer ${
                          r.status === "On Leave"
                            ? "bg-rose-600 text-white"
                            : "bg-stone-100 dark:bg-white/10 text-stone-600 dark:text-stone-300 hover:bg-rose-500 hover:text-white"
                        }`}
                      >
                        Leave
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
