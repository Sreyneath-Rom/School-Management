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
  FileDown
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
  status: "Completed" | "Pending Verification";
}

export default function Payments() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
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
      amount: 4350,
      paymentMethod: "Bank Transfer",
      date: "2026-02-12 02:15 PM",
      invoiceRef: "INV-2026-002",
      collectedBy: "Online Wire Integration",
      status: "Completed",
    },
    {
      id: "pay-3",
      receiptNo: "REC-2026-0493",
      studentName: "Liam Chen",
      studentId: "STU-003",
      amount: 2000,
      paymentMethod: "Cash",
      date: "2026-02-14 11:00 AM",
      invoiceRef: "INV-2026-003",
      collectedBy: "Cashier Window A",
      status: "Completed",
    },
  ]);

  const [formData, setFormData] = useState({
    studentName: "Noah Patel",
    studentId: "STU-005",
    amount: 4350,
    paymentMethod: "Credit Card" as PaymentEntry["paymentMethod"],
    invoiceRef: "INV-2026-004",
  });

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: PaymentEntry = {
      id: `pay-${Date.now()}`,
      receiptNo: `REC-2026-0${Math.floor(100 + Math.random() * 900)}`,
      studentName: formData.studentName,
      studentId: formData.studentId,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      date: new Date().toLocaleString(),
      invoiceRef: formData.invoiceRef,
      collectedBy: "Admin Portal",
      status: "Completed",
    };
    setPayments((prev) => [newEntry, ...prev]);
    setModalOpen(false);
    showToast("Fee payment processed and official receipt generated", "success");
  };

  const filtered = payments.filter((p) =>
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.receiptNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.invoiceRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Payment Processing & Collection"
          subtitle="Collect student tuition payments, generate instant payment receipts, and reconcile invoices."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Record New Payment</span>
        </button>
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
              className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5">Receipt #</th>
                <th className="p-3.5">Student / Candidate</th>
                <th className="p-3.5">Amount Paid</th>
                <th className="p-3.5">Payment Method</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Invoice Ref</th>
                <th className="p-3.5 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5 font-mono font-bold text-stone-900 dark:text-white">
                    {p.receiptNo}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {p.studentName}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{p.studentId}</div>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-600 dark:text-emerald-400 text-sm">
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
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => showToast(`Receipt ${p.receiptNo} downloaded`, "success")}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      <Receipt size={13} /> Print
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
              Process Fee Payment
            </h3>
            <form onSubmit={handleRecordPayment} className="space-y-4">
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
                    Invoice Ref *
                  </label>
                  <input
                    type="text"
                    value={formData.invoiceRef}
                    onChange={(e) => setFormData({ ...formData, invoiceRef: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Amount Paid ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Payment Method
                </label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Credit Card">Credit / Debit Card</option>
                  <option value="Bank Transfer">Bank Wire / ACH Transfer</option>
                  <option value="Cash">Cash at Bursar Window</option>
                  <option value="Online Portal">Parent Online Portal</option>
                </select>
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
                  Issue Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
