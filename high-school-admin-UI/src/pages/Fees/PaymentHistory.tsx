import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  History, 
  Search, 
  Download, 
  CreditCard, 
  Filter, 
  CheckCircle2, 
  FileText,
  Plus,
  Edit3,
  Trash2,
  X
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface TransactionLog {
  id: string;
  txId: string;
  studentName: string;
  studentId: string;
  amount: number;
  paymentType: string;
  method: string;
  gatewayRef: string;
  date: string;
  status: "Settled" | "Reconciled" | "Refunded";
}

export default function PaymentHistory() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<TransactionLog | null>(null);

  const [transactions, setTransactions] = useState<TransactionLog[]>([
    {
      id: "tx-1",
      txId: "TXN-90281-2026",
      studentName: "Ethan Walker",
      studentId: "STU-001",
      amount: 4350,
      paymentType: "Tuition Term 2",
      method: "Credit Card (Stripe)",
      gatewayRef: "ch_3N9q8v2eZvKYlo2C",
      date: "2026-02-10 10:24 AM",
      status: "Settled",
    },
    {
      id: "tx-2",
      txId: "TXN-90282-2026",
      studentName: "Sophia Martinez",
      studentId: "STU-002",
      amount: 4350,
      paymentType: "Tuition Term 2",
      method: "Bank Transfer (ACH)",
      gatewayRef: "ach_88319201",
      date: "2026-02-12 02:15 PM",
      status: "Settled",
    },
    {
      id: "tx-3",
      txId: "TXN-90283-2026",
      studentName: "Liam Chen",
      studentId: "STU-003",
      amount: 2000,
      paymentType: "Installment 1 of 2",
      method: "Cash Window",
      gatewayRef: "CSH-REG-01",
      date: "2026-02-14 11:00 AM",
      status: "Reconciled",
    },
    {
      id: "tx-4",
      txId: "TXN-90284-2026",
      studentName: "Lucas Vance",
      studentId: "STU-041",
      amount: 850,
      paymentType: "Library Late Fees",
      method: "Cash Window",
      gatewayRef: "CSH-REG-02",
      date: "2026-02-18 11:40 AM",
      status: "Settled",
    },
  ]);

  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "STU-001",
    amount: 1500,
    paymentType: "Tuition Fee",
    method: "Credit Card (Stripe)",
    gatewayRef: "MANUAL-TXN-01",
    status: "Settled" as TransactionLog["status"],
  });

  const handleOpenCreate = () => {
    setEditingTx(null);
    setFormData({
      studentName: "",
      studentId: "STU-001",
      amount: 1500,
      paymentType: "Tuition Fee",
      method: "Credit Card (Stripe)",
      gatewayRef: `MANUAL-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Settled",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (tx: TransactionLog) => {
    setEditingTx(tx);
    setFormData({
      studentName: tx.studentName,
      studentId: tx.studentId,
      amount: tx.amount,
      paymentType: tx.paymentType,
      method: tx.method,
      gatewayRef: tx.gatewayRef,
      status: tx.status,
    });
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentName.trim() || Number(formData.amount) <= 0) {
      showToast("Please provide valid student name and amount", "error");
      return;
    }

    if (editingTx) {
      setTransactions((prev) =>
        prev.map((t) =>
          t.id === editingTx.id
            ? {
                ...t,
                studentName: formData.studentName.trim(),
                studentId: formData.studentId.trim(),
                amount: Number(formData.amount),
                paymentType: formData.paymentType.trim(),
                method: formData.method,
                gatewayRef: formData.gatewayRef.trim(),
                status: formData.status,
              }
            : t
        )
      );
      showToast(`Updated transaction ${editingTx.txId}`, "success");
    } else {
      const nextNum = transactions.length + 1;
      const newTx: TransactionLog = {
        id: `tx-${Date.now()}`,
        txId: `TXN-9028${nextNum}-2026`,
        studentName: formData.studentName.trim(),
        studentId: formData.studentId.trim(),
        amount: Number(formData.amount),
        paymentType: formData.paymentType.trim(),
        method: formData.method,
        gatewayRef: formData.gatewayRef.trim(),
        date: new Date().toLocaleString(),
        status: formData.status,
      };
      setTransactions([newTx, ...transactions]);
      showToast(`Recorded transaction ${newTx.txId}`, "success");
    }
    setIsModalOpen(false);
    setEditingTx(null);
  };

  const handleDelete = (id: string, txId: string) => {
    if (window.confirm(`Delete transaction record ${txId}?`)) {
      setTransactions((prev) => prev.filter((t) => t.id !== id));
      showToast(`Transaction record ${txId} removed`, "info");
    }
  };

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gatewayRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod =
      methodFilter === "All" ||
      (methodFilter === "Card" && t.method.includes("Card")) ||
      (methodFilter === "Transfer" && t.method.includes("Transfer")) ||
      (methodFilter === "Cash" && t.method.includes("Cash"));
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Payment Audit History & Reconciliation"
          subtitle="Complete historical audit trail of all verified financial payments, gateway logs, and settlement statuses."
        />
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => showToast("Financial audit log exported as CSV", "success")}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/15 text-stone-700 dark:text-stone-200 text-xs font-semibold transition cursor-pointer"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Record Ledger Entry</span>
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 shadow-xs">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="relative w-full sm:w-80">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search transaction ID, student, or gateway ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200/50 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 w-full sm:w-auto"
          >
            <option value="All">All Methods</option>
            <option value="Card">Card (Stripe)</option>
            <option value="Transfer">Bank Transfer</option>
            <option value="Cash">Cash Window</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5 pl-4">Transaction ID</th>
                <th className="p-3.5">Student / ID</th>
                <th className="p-3.5">Purpose / Fee Type</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment Method & Ref</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-stone-400">
                    No transactions match your query.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                  >
                    <td className="p-3.5 pl-4 font-mono font-bold text-stone-900 dark:text-white">
                      {t.txId}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-900 dark:text-white">
                        {t.studentName}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">{t.studentId}</div>
                    </td>
                    <td className="p-3.5 text-stone-700 dark:text-stone-300 font-medium">
                      {t.paymentType}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                      ${t.amount.toLocaleString()}
                    </td>
                    <td className="p-3.5">
                      <div className="font-semibold text-stone-800 dark:text-stone-200">
                        {t.method}
                      </div>
                      <div className="text-[10px] text-stone-400 font-mono">{t.gatewayRef}</div>
                    </td>
                    <td className="p-3.5 text-stone-500 font-mono text-[11px]">{t.date}</td>
                    <td className="p-3.5 text-center">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        t.status === "Settled" 
                          ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                          : t.status === "Reconciled"
                          ? "bg-blue-500/15 text-blue-700 dark:text-blue-300"
                          : "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-3.5 pr-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(t)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-brand-600 transition cursor-pointer"
                          title="Edit Transaction"
                        >
                          <Edit3 size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(t.id, t.txId)}
                          className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 transition cursor-pointer"
                          title="Delete Record"
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200/60 dark:border-white/10">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                {editingTx ? `Edit Transaction (${editingTx.txId})` : "Record Financial Transaction"}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingTx(null);
                }}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 dark:hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Student Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  placeholder="e.g. Ethan Walker"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                    Amount ($) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Purpose / Fee Type *
                </label>
                <input
                  type="text"
                  required
                  value={formData.paymentType}
                  onChange={(e) => setFormData({ ...formData, paymentType: e.target.value })}
                  placeholder="e.g. Tuition Term 2, Library Late Fees"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Method
                  </label>
                  <select
                    value={formData.method}
                    onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Credit Card (Stripe)">Credit Card (Stripe)</option>
                    <option value="Bank Transfer (ACH)">Bank Transfer (ACH)</option>
                    <option value="Cash Window">Cash Window</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Settlement Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Settled">Settled</option>
                    <option value="Reconciled">Reconciled</option>
                    <option value="Refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200/60 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingTx(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-white/10 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white shadow-md transition cursor-pointer"
                >
                  {editingTx ? "Save Changes" : "Record Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
