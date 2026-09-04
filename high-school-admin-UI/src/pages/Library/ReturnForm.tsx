import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  RotateCcw, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  BookOpen, 
  User 
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface ReturnItem {
  id: string;
  ticketId: string;
  bookTitle: string;
  isbn: string;
  borrowerName: string;
  borrowerId: string;
  borrowDate: string;
  dueDate: string;
  daysLate: number;
  fineAmount: number;
  condition: "Good" | "Minor Wear" | "Damaged";
}

export default function ReturnForm() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const [returns, setReturns] = useState<ReturnItem[]>([
    {
      id: "ret-1",
      ticketId: "TKT-LIB-2026-083",
      bookTitle: "To Kill a Mockingbird",
      isbn: "978-0060935467",
      borrowerName: "Noah Patel",
      borrowerId: "STU-005",
      borrowDate: "2026-02-05",
      dueDate: "2026-02-19",
      daysLate: 11,
      fineAmount: 5.5,
      condition: "Good",
    },
    {
      id: "ret-2",
      ticketId: "TKT-LIB-2026-084",
      bookTitle: "Modern World History",
      isbn: "978-0190491826",
      borrowerName: "Emma Watson",
      borrowerId: "STU-006",
      borrowDate: "2026-02-10",
      dueDate: "2026-02-24",
      daysLate: 6,
      fineAmount: 3.0,
      condition: "Minor Wear",
    },
  ]);

  const handleProcessReturn = (id: string) => {
    setReturns((prev) => prev.filter((r) => r.id !== id));
    showToast("Book returned and accession ledger reconciled", "success");
  };

  const filtered = returns.filter(
    (r) =>
      r.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.ticketId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Book Check-In & Returns"
          subtitle="Inspect returned volumes, assess book condition, calculate overdue penalty fines, and restock shelves."
        />
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search return ticket, book title, or student..."
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
                <th className="p-3.5">Ticket #</th>
                <th className="p-3.5">Book Title & ISBN</th>
                <th className="p-3.5">Patron / Student</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Overdue Days</th>
                <th className="p-3.5">Fine Assessed</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5 font-mono font-bold text-stone-900 dark:text-white">
                    {r.ticketId}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {r.bookTitle}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{r.isbn}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-800 dark:text-stone-200">
                      {r.borrowerName}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{r.borrowerId}</div>
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300">
                    {r.dueDate}
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {r.daysLate} days late
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-rose-600 dark:text-rose-400">
                    ${r.fineAmount.toFixed(2)}
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleProcessReturn(r.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-xs transition cursor-pointer"
                    >
                      <RotateCcw size={13} />
                      <span>Check In</span>
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-stone-400">
                    No pending returns at this time. All library loans are accounted for.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
