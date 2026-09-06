import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  CreditCard, 
  Plus, 
  Search, 
  CheckCircle2, 
  DollarSign, 
  Receipt, 
  Calendar, 
  User, 
  ArrowUpRight,
  FileDown,
  Edit3,
  Trash2,
  X
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface PaymentEntry {
  id: string;
  receiptNo: string;
  studentName: string;
  studentId: string;
  amount: number;
  paymentMethod: "Credit Card" | "Bank Transfer" | "Cash" | "Online Portal";
  date: string;
  invoiceRef: string;
  collectedBy: string;
  status: "Completed" | "Pending Verification" | "Voided";
}

export default function Payments() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<PaymentEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [payments, setPayments] = useState<PaymentEntry[]>([
    {
      id: "pay-1",
      receiptNo: "REC-2026-0491",
      studentName: "Ethan Walker",
      studentId: "STU-001",
      amount: 4350,
      paymentMethod: "Credit Card",
      date: "2026-02-10 10:24 AM",
      invoiceRef: "INV-2026-001",
      collectedBy: "Accountant Desk 1",
      status: "Completed",
    },
    {
      id: "pay-2",
      receiptNo: "REC-2026-0492",
      studentName: "Sophia Martinez",
      studentId: "STU-002",
      amount: 2000,
      paymentMethod: "Bank Transfer",
      date: "2026-02-12 02:15 PM",
      invoiceRef: "INV-2026-002",
      collectedBy: "Online Wire Integration",
      status: "Completed",
    },
    {
      id: "pay-3",
      receiptNo: "REC-2026-0493",
      studentName: "Lucas Vance",
      studentId: "STU-041",
      amount: 850,
      paymentMethod: "Cash",
      date: "2026-02-18 11:40 AM",
      invoiceRef: "INV-2026-004",
      collectedBy: "Bursar Counter 2",
      status: "Completed",
    },
    {
      id: "pay-4",
      receiptNo: "REC-2026-0494",
      studentName: "Chloe Bennett",
      studentId: "STU-018",
      amount: 1450,
      paymentMethod: "Online Portal",
      date: "2026-02-25 09:12 AM",
      invoiceRef: "INV-2026-006",
      collectedBy: "Payment Gateway",
      status: "Pending Verification",
    },
  ]);

  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "STU-001",
    amount: 500,
    paymentMethod: "Credit Card" as PaymentEntry["paymentMethod"],
    invoiceRef: "INV-2026-001",
    status: "Completed" as PaymentEntry["status"],
  });

  const handleOpenCreate = () => {
    setEditingPayment(null);
    setFormData({
      studentName: "",
      studentId: "STU-001",
      amount: 500,
      paymentMethod: "Credit Card",
      invoiceRef: "INV-2026-001",
      status: "Completed",
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (payment: PaymentEntry) => {
    setEditingPayment(payment);
    setFormData({
      studentName: payment.studentName,
      studentId: payment.studentId,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      invoiceRef: payment.invoiceRef,
      status: payment.status,
    });
    setModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || Number(formData.amount) <= 0) {
      showToast("Please provide a valid student name and payment amount", "error");
      return;
    }

    if (editingPayment) {
      setPayments((prev) =>
        prev.map((p) =>
          p.id === editingPayment.id
            ? {
                ...p,
                studentName: formData.studentName.trim(),
                studentId: formData.studentId.trim(),
                amount: Number(formData.amount),
                paymentMethod: formData.paymentMethod,
                invoiceRef: formData.invoiceRef.trim(),
                status: formData.status,
              }
            : p
        )
      );
      showToast(`Updated payment receipt ${editingPayment.receiptNo}`, "success");
    } else {
      const newEntry: PaymentEntry = {
        id: `pay-${Date.now()}`,
        receiptNo: `REC-2026-0${Math.floor(100 + Math.random() * 900)}`,
        studentName: formData.studentName.trim(),
        studentId: formData.studentId.trim(),
        amount: Number(formData.amount),
        paymentMethod: formData.paymentMethod,
        date: new Date().toLocaleString(),
        invoiceRef: formData.invoiceRef.trim(),
        collectedBy: "Admin Portal",
        status: formData.status,
      };
      setPayments((prev) => [newEntry, ...prev]);
      showToast("Fee payment processed and official receipt generated", "success");
    }
    setModalOpen(false);
    setEditingPayment(null);
  };

  const handleDeletePayment = (id: string, receiptNo: string) => {
    if (window.confirm(`Are you sure you want to void/delete receipt ${receiptNo}?`)) {
      setPayments((prev) => prev.filter((p) => p.id !== id));
      showToast(`Payment receipt ${receiptNo} deleted`, "info");
    }
  };

  const filtered = payments.filter((p) =>
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.invoiceRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCollected = payments
    .filter((p) => p.status === "Completed")
    .reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Payment Processing & Collection"
          subtitle="Collect student tuition payments, generate instant payment receipts, and reconcile invoices."
        />
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Record New Payment</span>
        </button>
      </div>

      {/* Summary Banner */}
      <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <DollarSign size={20} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Reconciled Collections (Today)</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              ${totalCollected.toLocaleString()}
            </div>
          </div>
        </div>
        <div className="text-xs text-stone-500">
          Showing <span className="font-semibold text-stone-900 dark:text-white">{filtered.length}</span> recorded transactions
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search receipt number, student name, or invoice ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none text-xs w-full focus:outline-none text-stone-800 dark:text-stone-200"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/70 dark:border-white/10 bg-stone-50/50 dark:bg-white/[0.02] text-[11px] font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                <th className="p-3.5 pl-4">Receipt #</th>
                <th className="p-3.5">Student</th>
                <th className="p-3.5 text-right">Amount</th>
                <th className="p-3.5">Method</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Invoice Ref</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50 dark:divide-white/5 text-xs text-stone-700 dark:text-stone-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-stone-400">
                    No payment entries match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-500/5 transition">
                    <td className="p-3.5 pl-4 font-mono font-semibold text-stone-900 dark:text-white">
                      {p.receiptNo}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-900 dark:text-white">
                        {p.studentName}
                      </div>
                      <div className="text-[11px] text-stone-400">{p.studentId}</div>
                    </td>
                    <td className="p-3.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ${p.amount.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300">
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3.5 text-stone-500 font-mono text-[11px]">{p.date}</td>
                    <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300 font-medium">
                      {p.invoiceRef}
                    </td>
                    <td className="p-3.5 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === "Completed"
                            ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                            : p.status === "Voided"
                            ? "bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30"
                            : "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => showToast(`Receipt ${p.receiptNo} downloaded`, "success")}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition cursor-pointer"
                          title="Print Receipt"
                        >
                          <Receipt size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 transition cursor-pointer"
                          title="Edit Payment"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePayment(p.id, p.receiptNo)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 transition cursor-pointer"
                          title="Void / Delete Payment"
                        >
                          <Trash2 size={14} />
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

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200/60 dark:border-white/10">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                {editingPayment ? `Edit Payment (${editingPayment.receiptNo})` : "Process Fee Payment"}
              </h3>
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingPayment(null);
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Ethan Walker"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={formData.studentId}
                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Invoice Ref *
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceRef}
                    onChange={(e) => setFormData({ ...formData, invoiceRef: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Amount Paid ($) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
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
                    <option value="Completed">Completed</option>
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Voided">Voided</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Credit Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">Bank Wire / ACH Transfer</option>
                  <option value="Cash">Cash at Bursar Window</option>
                  <option value="Online Portal">Parent Online Portal</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setModalOpen(false);
                    setEditingPayment(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition cursor-pointer"
                >
                  {editingPayment ? "Save Changes" : "Issue Receipt"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
