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
  DollarSign, 
  Send,
  Edit3,
  Trash2,
  X
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
      gradeLevel: "Grade 11-B",
      title: "Semester 2 Tuition & Arts Studio",
      totalAmount: 3800,
      paidAmount: 2000,
      dueDate: "2026-03-01",
      status: "Partial",
    },
    {
      id: "inv-3",
      invoiceNo: "INV-2026-003",
      studentName: "Liam Johnson",
      studentId: "STU-003",
      gradeLevel: "Grade 10-A",
      title: "Semester 2 Tuition & Athletic Program",
      totalAmount: 4100,
      paidAmount: 0,
      dueDate: "2026-03-15",
      status: "Pending",
    },
    {
      id: "inv-4",
      invoiceNo: "INV-2026-004",
      studentName: "Lucas Vance",
      studentId: "STU-041",
      gradeLevel: "Grade 11-A",
      title: "Semester 1 Arrears & Library Fee",
      totalAmount: 850,
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

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<InvoiceItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    gradeLevel: "Grade 10-A",
    title: "",
    totalAmount: 3500,
    paidAmount: 0,
    dueDate: new Date().toISOString().split("T")[0],
    status: "Pending" as InvoiceItem["status"],
  });

  const handleOpenCreate = () => {
    setFormData({
      studentName: "",
      studentId: "",
      gradeLevel: "Grade 10-A",
      title: "",
      totalAmount: 3500,
      paidAmount: 0,
      dueDate: new Date().toISOString().split("T")[0],
      status: "Pending",
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (inv: InvoiceItem) => {
    setEditingInvoice(inv);
    setFormData({
      studentName: inv.studentName,
      studentId: inv.studentId,
      gradeLevel: inv.gradeLevel,
      title: inv.title,
      totalAmount: inv.totalAmount,
      paidAmount: inv.paidAmount,
      dueDate: inv.dueDate,
      status: inv.status,
    });
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || !formData.title.trim()) {
      showToast("Please provide student name and invoice title", "error");
      return;
    }

    if (editingInvoice) {
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === editingInvoice.id
            ? {
                ...i,
                studentName: formData.studentName.trim(),
                studentId: formData.studentId.trim() || i.studentId,
                gradeLevel: formData.gradeLevel,
                title: formData.title.trim(),
                totalAmount: Number(formData.totalAmount),
                paidAmount: Number(formData.paidAmount),
                dueDate: formData.dueDate,
                status: formData.status,
              }
            : i
        )
      );
      showToast(`Updated invoice ${editingInvoice.invoiceNo}`, "success");
      setEditingInvoice(null);
    } else {
      const nextNum = invoices.length + 1;
      const newInvoice: InvoiceItem = {
        id: `inv-${Date.now()}`,
        invoiceNo: `INV-2026-${String(nextNum).padStart(3, "0")}`,
        studentName: formData.studentName.trim(),
        studentId: formData.studentId.trim() || `STU-${String(nextNum).padStart(3, "0")}`,
        gradeLevel: formData.gradeLevel,
        title: formData.title.trim(),
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount),
        dueDate: formData.dueDate,
        status: formData.status,
      };
      setInvoices([newInvoice, ...invoices]);
      showToast(`Created invoice ${newInvoice.invoiceNo}`, "success");
      setIsCreateOpen(false);
    }
  };

  const handleDeleteInvoice = (id: string, invoiceNo: string) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoiceNo}?`)) {
      setInvoices((prev) => prev.filter((i) => i.id !== id));
      showToast(`Invoice ${invoiceNo} deleted`, "info");
    }
  };

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
            onClick={() => showToast("Payment reminders sent to outstanding accounts", "info")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/15 text-stone-700 dark:text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <Send size={14} />
            <span>Send Reminders</span>
          </button>
          <button
            onClick={handleOpenCreate}
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

      {/* Filters */}
      <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={15} />
          <input
            type="text"
            placeholder="Search invoice #, student or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-stone-500 shrink-0">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="All">All Invoices</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/70 dark:border-white/10 bg-stone-50/50 dark:bg-white/[0.02] text-[11px] font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                <th className="p-3.5 pl-4">Invoice #</th>
                <th className="p-3.5">Student</th>
                <th className="p-3.5">Description</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5 text-right">Paid</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50 dark:divide-white/5 text-xs text-stone-700 dark:text-stone-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-stone-400">
                    No invoices match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((inv) => (
                  <tr key={inv.id} className="hover:bg-stone-500/5 transition">
                    <td className="p-3.5 pl-4 font-mono font-semibold text-stone-900 dark:text-white">
                      {inv.invoiceNo}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-900 dark:text-white">
                        {inv.studentName}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        {inv.studentId} • {inv.gradeLevel}
                      </div>
                    </td>
                    <td className="p-3.5 font-medium">{inv.title}</td>
                    <td className="p-3.5 text-right font-bold text-stone-900 dark:text-white">
                      ${inv.totalAmount.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                      ${inv.paidAmount.toLocaleString()}
                    </td>
                    <td className="p-3.5 text-stone-500 dark:text-stone-400">{inv.dueDate}</td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          inv.status === "Paid"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                            : inv.status === "Partial"
                            ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                            : inv.status === "Overdue"
                            ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                            : "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => showToast(`Downloaded invoice ${inv.invoiceNo} receipt`, "success")}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition cursor-pointer"
                          title="Download Invoice PDF"
                        >
                          <Download size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(inv)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 transition cursor-pointer"
                          title="Edit Invoice"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteInvoice(inv.id, inv.invoiceNo)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 transition cursor-pointer"
                          title="Delete Invoice"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Invoice Modal */}
      {(isCreateOpen || editingInvoice) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-200/60 dark:border-white/10">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                {editingInvoice ? `Edit Invoice (${editingInvoice.invoiceNo})` : "Generate New Fee Invoice"}
              </h3>
              <button
                onClick={() => {
                  setIsCreateOpen(false);
                  setEditingInvoice(null);
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveInvoice} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lucas Vance"
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. STU-041"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Grade & Section
                  </label>
                  <select
                    value={formData.gradeLevel}
                    onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Grade 10-A">Grade 10-A</option>
                    <option value="Grade 10-B">Grade 10-B</option>
                    <option value="Grade 11-A">Grade 11-A</option>
                    <option value="Grade 11-B">Grade 11-B</option>
                    <option value="Grade 12-A">Grade 12-A</option>
                    <option value="Grade 12-B">Grade 12-B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Invoice Title / Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Semester 2 Tuition & STEM Lab Fee"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Total Due ($) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    required
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Paid So Far ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="10"
                    value={formData.paidAmount}
                    onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Due Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-stone-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setEditingInvoice(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-white/5 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
                >
                  {editingInvoice ? "Save Changes" : "Create Invoice"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
