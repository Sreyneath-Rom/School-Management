import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  DollarSign, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Receipt, 
  Building2, 
  Calendar 
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface HostelFeeRecord {
  id: string;
  invoiceNo: string;
  studentName: string;
  studentId: string;
  roomNo: string;
  block: string;
  feePeriod: string;
  amount: number;
  paidAmount: number;
  dueDate: string;
  status: "Paid" | "Pending" | "Overdue";
}

export default function HostelFees() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [records, setRecords] = useState<HostelFeeRecord[]>([
    {
      id: "hf-1",
      invoiceNo: "H-INV-2026-081",
      studentName: "Ethan Walker",
      studentId: "STU-001",
      roomNo: "A-201",
      block: "Block A (Boys)",
      feePeriod: "Spring Semester 2026",
      amount: 3250,
      paidAmount: 3250,
      dueDate: "2026-02-15",
      status: "Paid",
    },
    {
      id: "hf-2",
      invoiceNo: "H-INV-2026-082",
      studentName: "Liam Chen",
      studentId: "STU-003",
      roomNo: "A-201",
      block: "Block A (Boys)",
      feePeriod: "Spring Semester 2026",
      amount: 3250,
      paidAmount: 3250,
      dueDate: "2026-02-15",
      status: "Paid",
    },
    {
      id: "hf-3",
      invoiceNo: "H-INV-2026-083",
      studentName: "Sophia Martinez",
      studentId: "STU-002",
      roomNo: "B-104",
      block: "Block B (Girls)",
      feePeriod: "Spring Semester 2026",
      amount: 2250,
      paidAmount: 2250,
      dueDate: "2026-02-15",
      status: "Paid",
    },
    {
      id: "hf-4",
      invoiceNo: "H-INV-2026-084",
      studentName: "Noah Patel",
      studentId: "STU-005",
      roomNo: "A-202",
      block: "Block A (Boys)",
      feePeriod: "Spring Semester 2026",
      amount: 3250,
      paidAmount: 0,
      dueDate: "2026-02-01",
      status: "Overdue",
    },
  ]);

  const filtered = records.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = records.reduce((acc, r) => acc + r.paidAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Hostel & Boarding Dues Ledger"
          subtitle="Collect dormitory room rent, meal plan subscriptions, and track overdue lodging payments."
        />
        <button
          onClick={() => showToast("Dispatched hostel fee reminders", "info")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Receipt size={16} />
          <span>Generate Hostel Invoices</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 w-full">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search student, room number, or invoice..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none w-full sm:w-auto"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Resident / ID</th>
                <th className="p-3.5">Room & Block</th>
                <th className="p-3.5">Billing Period</th>
                <th className="p-3.5">Total Dues</th>
                <th className="p-3.5">Paid</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5 font-mono font-bold text-stone-900 dark:text-white">
                    {r.invoiceNo}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {r.studentName}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{r.studentId}</div>
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300 font-medium">
                    {r.roomNo} ({r.block})
                  </td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300">
                    {r.feePeriod}
                  </td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-white">
                    ${r.amount.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    ${r.paidAmount.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300">
                    {r.dueDate}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        r.status === "Paid"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : r.status === "Overdue"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {r.status}
                    </span>
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
