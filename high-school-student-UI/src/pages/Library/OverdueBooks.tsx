import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  AlertTriangle, 
  Search, 
  Send, 
  Clock, 
  DollarSign, 
  User, 
  Mail, 
  BookOpen 
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface OverdueItem {
  id: string;
  bookTitle: string;
  isbn: string;
  borrowerName: string;
  borrowerEmail: string;
  borrowerType: "Student" | "Teacher";
  gradeOrDept: string;
  borrowDate: string;
  dueDate: string;
  overdueDays: number;
  fineAccrued: number;
  reminderSent: boolean;
}

export default function OverdueBooks() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");

  const [overdues, setOverdues] = useState<OverdueItem[]>([
    {
      id: "od-1",
      bookTitle: "To Kill a Mockingbird",
      isbn: "978-0060935467",
      borrowerName: "Noah Patel",
      borrowerEmail: "noah.patel@student.oakridge.edu",
      borrowerType: "Student",
      gradeOrDept: "Grade 10-A",
      borrowDate: "2026-02-05",
      dueDate: "2026-02-19",
      overdueDays: 11,
      fineAccrued: 5.5,
      reminderSent: true,
    },
    {
      id: "od-2",
      bookTitle: "Modern World History",
      isbn: "978-0190491826",
      borrowerName: "Emma Watson",
      borrowerEmail: "emma.watson@student.oakridge.edu",
      borrowerType: "Student",
      gradeOrDept: "Grade 10-A",
      borrowDate: "2026-02-10",
      dueDate: "2026-02-24",
      overdueDays: 6,
      fineAccrued: 3.0,
      reminderSent: false,
    },
    {
      id: "od-3",
      bookTitle: "Biochemistry Core Concepts",
      isbn: "978-0321832016",
      borrowerName: "Lucas Vance",
      borrowerEmail: "lucas.vance@student.oakridge.edu",
      borrowerType: "Student",
      gradeOrDept: "Grade 11-B",
      borrowDate: "2026-01-28",
      dueDate: "2026-02-11",
      overdueDays: 19,
      fineAccrued: 9.5,
      reminderSent: true,
    },
  ]);

  const handleSendReminder = (id: string, name: string) => {
    setOverdues((prev) =>
      prev.map((o) => (o.id === id ? { ...o, reminderSent: true } : o))
    );
    showToast(`Automated library return reminder email dispatched to ${name}`, "success");
  };

  const handleSendAll = () => {
    setOverdues((prev) => prev.map((o) => ({ ...o, reminderSent: true })));
    showToast("Dispatched overdue notifications to all patrons", "success");
  };

  const filtered = overdues.filter(
    (o) =>
      o.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.borrowerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFines = overdues.reduce((acc, curr) => acc + curr.fineAccrued, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Overdue Books & Fines Management"
          subtitle="Track overdue library books, automatically assess late fines, and dispatch reminder notices."
        />
        <button
          onClick={handleSendAll}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Send size={16} />
          <span>Notify All Patrons</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <AlertTriangle size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Overdue Titles</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              {overdues.length} Books Unreturned
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
            <DollarSign size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Accrued Late Fines</div>
            <div className="text-lg font-bold text-amber-600 dark:text-amber-400">
              ${totalFines.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="p-3 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
            <Mail size={22} />
          </div>
          <div>
            <div className="text-xs text-stone-500 font-medium">Daily Penalty Rate</div>
            <div className="text-lg font-bold text-stone-900 dark:text-white">
              $0.50 / day
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search overdue book title, borrower, or email..."
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
                <th className="p-3.5">Overdue Book Title & ISBN</th>
                <th className="p-3.5">Patron / Grade</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Days Late</th>
                <th className="p-3.5">Accrued Fine</th>
                <th className="p-3.5">Notice Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {o.bookTitle}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{o.isbn}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-800 dark:text-stone-200">
                      {o.borrowerName}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {o.gradeOrDept} • {o.borrowerEmail}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300 font-medium">
                    {o.dueDate}
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-rose-600 dark:text-rose-400">
                      {o.overdueDays} days late
                    </span>
                  </td>
                  <td className="p-3.5 font-bold text-amber-600 dark:text-amber-400">
                    ${o.fineAccrued.toFixed(2)}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        o.reminderSent
                          ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                          : "bg-stone-100 dark:bg-white/10 text-stone-500"
                      }`}
                    >
                      {o.reminderSent ? "Notice Sent" : "Pending Notice"}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => handleSendReminder(o.id, o.borrowerName)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                    >
                      <Send size={13} /> {o.reminderSent ? "Resend" : "Send Email"}
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
