import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  History, 
  Search, 
  Download, 
  Calendar, 
  CreditCard, 
  Filter, 
  CheckCircle2, 
  FileText
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
      txId: "TXN-90284-2025",
      studentName: "Olivia Robinson",
      studentId: "STU-004",
      amount: 4350,
      paymentType: "Tuition Term 1",
      method: "Credit Card (Stripe)",
      gatewayRef: "ch_2M8q1v1eZvKYlo1A",
      date: "2025-10-05 09:12 AM",
      status: "Reconciled",
    },
  ]);

  const filtered = transactions.filter((t) => {
    const matchesSearch =
      t.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.txId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.gatewayRef.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesMethod = methodFilter === "All" || t.method.includes(methodFilter);
    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Financial Audit & Payment History"
          subtitle="Complete ledger of historical student fee receipts, gateway transaction references, and settlement records."
        />
        <button
          onClick={() => showToast("Exporting complete transaction audit CSV", "info")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Download size={14} />
          <span>Export Ledger CSV</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 w-full">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search transaction ID, student, or gateway ref..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
            />
          </div>

          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none w-full sm:w-auto"
          >
            <option value="All">All Channels</option>
            <option value="Card">Credit Card</option>
            <option value="Transfer">Bank Transfer</option>
            <option value="Cash">Cash Window</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5">Transaction ID</th>
                <th className="p-3.5">Student / ID</th>
                <th className="p-3.5">Purpose / Fee Type</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Payment Method & Gateway Ref</th>
                <th className="p-3.5">Timestamp</th>
                <th className="p-3.5">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5 font-mono font-bold text-stone-900 dark:text-white">
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
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                      {t.status}
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
