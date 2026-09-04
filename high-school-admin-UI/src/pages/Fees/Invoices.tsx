import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Receipt, 
  Plus, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Download, 
  Eye, 
  DollarSign, 
  Send
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface InvoiceItem {
  id: string;
  invoiceNo: string;
  studentName: string;
  studentId: string;
  gradeLevel: string;
  title: string;
  totalAmount: number;
  paidAmount: number;
  dueDate: string;
  status: "Paid" | "Partial" | "Overdue" | "Pending";
}

export default function Invoices() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [invoices, setInvoices] = useState<InvoiceItem[]>([
    {
      id: "inv-1",
      invoiceNo: "INV-2026-001",
      studentName: "Ethan Walker",
      studentId: "STU-001",
      gradeLevel: "Grade 10-A",
      title: "Semester 2 Tuition & STEM Lab",
      totalAmount: 4350,
      paidAmount: 4350,
      dueDate: "2026-02-15",
      status: "Paid",
    },
    {
      id: "inv-2",
      invoiceNo: "INV-2026-002",
      studentName: "Sophia Martinez",
      studentId: "STU-002",
      gradeLevel: "Grade 10-A",
      title: "Semester 2 Tuition & STEM Lab",
      totalAmount: 4350,
      paidAmount: 4350,
      dueDate: "2026-02-15",
      status: "Paid",
    },
    {
      id: "inv-3",
      invoiceNo: "INV-2026-003",
      studentName: "Liam Chen",
      studentId: "STU-003",
      gradeLevel: "Grade 10-A",
      title: "Semester 2 Tuition & Arts Track",
      totalAmount: 4350,
      paidAmount: 2000,
      dueDate: "2026-03-15",
      status: "Partial",
    },
    {
      id: "inv-4",
      invoiceNo: "INV-2026-004",
      studentName: "Noah Patel",
      studentId: "STU-005",
      gradeLevel: "Grade 10-A",
      title: "Semester 2 Tuition & Activities",
      totalAmount: 4350,
      paidAmount: 0,
      dueDate: "2026-02-01",
      status: "Overdue",
    },
    {
      id: "inv-5",
      invoiceNo: "INV-2026-005",
      studentName: "Emma Watson",
      studentId: "STU-006",
      gradeLevel: "Grade 10-A",
      title: "Term 3 Advanced Registration",
      totalAmount: 2150,
      paidAmount: 0,
      dueDate: "2026-04-10",
      status: "Pending",
    },
  ]);

  const filtered = invoices.filter((inv) => {
    const matchesSearch =
      inv.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inv.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((acc, i) => acc + i.totalAmount, 0);
  const totalCollected = invoices.reduce((acc, i) => acc + i.paidAmount, 0);
  const totalOutstanding = totalBilled - totalCollected;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Student Fee Invoices"
          subtitle="Generate, send, and track tuition invoices, partial payments, and overdue billing."
        />
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => showToast("Sending payment reminders to overdue students", "info")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/15 text-stone-700 dark:text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <Send size={14} />
            <span>Send Reminders</span>
          </button>
          <button
            onClick={() => showToast("New Invoice Generator modal opened", "info")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Generate Invoices</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <DollarSign size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Total Billed</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              ${totalBilled.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Total Collected</div>
            <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
              ${totalCollected.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertCircle size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Outstanding Balance</div>
            <div className="text-lg font-bold text-rose-600 dark:text-rose-400">
              ${totalOutstanding.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 w-full">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search invoice number, student name, or ID..."
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
            <option value="Partial">Partial</option>
            <option value="Overdue">Overdue</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5">Invoice #</th>
                <th className="p-3.5">Student / Grade</th>
                <th className="p-3.5">Invoice Description</th>
                <th className="p-3.5">Amount (Total)</th>
                <th className="p-3.5">Paid</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.map((inv) => (
                <tr
                  key={inv.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5 font-mono font-bold text-stone-900 dark:text-white">
                    {inv.invoiceNo}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {inv.studentName}
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {inv.gradeLevel} • {inv.studentId}
                    </div>
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300">
                    {inv.title}
                  </td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-white">
                    ${inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="p-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                    ${inv.paidAmount.toLocaleString()}
                  </td>
                  <td className="p-3.5 text-stone-600 dark:text-stone-300 font-medium">
                    {inv.dueDate}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        inv.status === "Paid"
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : inv.status === "Partial"
                          ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                          : inv.status === "Overdue"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => showToast(`Downloaded ${inv.invoiceNo}`, "success")}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition cursor-pointer"
                      title="Download Invoice PDF"
                    >
                      <Download size={15} />
                    </button>
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
