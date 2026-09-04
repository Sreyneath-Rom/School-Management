import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  ArrowRightLeft, 
  Search, 
  CheckCircle2, 
  Calendar, 
  User, 
  BookOpen, 
  Clock, 
  Barcode, 
  Plus
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface CirculationIssue {
  id: string;
  issueTicket: string;
  bookTitle: string;
  isbn: string;
  memberName: string;
  memberId: string;
  memberType: "Student" | "Teacher";
  borrowDate: string;
  dueDate: string;
  status: "Issued" | "Returned" | "Overdue";
}

export default function BorrowForm() {
  const { showToast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [issues, setIssues] = useState<CirculationIssue[]>([
    {
      id: "iss-1",
      issueTicket: "TKT-LIB-2026-081",
      bookTitle: "Campbell Biology (11th Edition)",
      isbn: "978-0134093413",
      memberName: "Ethan Walker",
      memberId: "STU-001",
      memberType: "Student",
      borrowDate: "2026-02-20",
      dueDate: "2026-03-06",
      status: "Issued",
    },
    {
      id: "iss-2",
      issueTicket: "TKT-LIB-2026-082",
      bookTitle: "Calculus: Early Transcendentals",
      isbn: "978-1285740621",
      memberName: "Prof. Marcus Kane",
      memberId: "FAC-MTH-03",
      memberType: "Teacher",
      borrowDate: "2026-02-15",
      dueDate: "2026-03-15",
      status: "Issued",
    },
    {
      id: "iss-3",
      issueTicket: "TKT-LIB-2026-083",
      bookTitle: "To Kill a Mockingbird",
      isbn: "978-0060935467",
      memberName: "Noah Patel",
      memberId: "STU-005",
      memberType: "Student",
      borrowDate: "2026-02-05",
      dueDate: "2026-02-19",
      status: "Overdue",
    },
  ]);

  const [formData, setFormData] = useState({
    bookTitle: "Building Java Programs",
    isbn: "978-0134685991",
    memberName: "Sophia Martinez",
    memberId: "STU-002",
    memberType: "Student" as CirculationIssue["memberType"],
    days: 14,
  });

  const handleIssueBook = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + Number(formData.days));

    const newIssue: CirculationIssue = {
      id: `iss-${Date.now()}`,
      issueTicket: `TKT-LIB-2026-0${Math.floor(100 + Math.random() * 900)}`,
      bookTitle: formData.bookTitle,
      isbn: formData.isbn,
      memberName: formData.memberName,
      memberId: formData.memberId,
      memberType: formData.memberType,
      borrowDate: today.toISOString().split("T")[0],
      dueDate: dueDate.toISOString().split("T")[0],
      status: "Issued",
    };
    setIssues((prev) => [newIssue, ...prev]);
    setModalOpen(false);
    showToast("Book successfully issued to member", "success");
  };

  const filtered = issues.filter(
    (i) =>
      i.bookTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.issueTicket.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Book Circulation & Checkout"
          subtitle="Process student and faculty book checkouts, barcode scanning, and loan period validation."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Checkout / Issue Book</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search checkout ticket, book title, or member name..."
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
                <th className="p-3.5">Issued To Member</th>
                <th className="p-3.5">Borrow Date</th>
                <th className="p-3.5">Due Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.map((i) => (
                <tr
                  key={i.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5 font-mono font-bold text-stone-900 dark:text-white">
                    {i.issueTicket}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {i.bookTitle}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{i.isbn}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-800 dark:text-stone-200">
                      {i.memberName}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {i.memberType} • {i.memberId}
                    </div>
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300">
                    {i.borrowDate}
                  </td>
                  <td className="p-3.5 font-mono text-stone-900 dark:text-white font-medium">
                    {i.dueDate}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        i.status === "Issued"
                          ? "bg-brand-500/15 text-brand-700 dark:text-brand-300"
                          : i.status === "Overdue"
                          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                      }`}
                    >
                      {i.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setIssues((prev) =>
                          prev.map((item) =>
                            item.id === i.id ? { ...item, status: "Returned" } : item
                          )
                        );
                        showToast(`Book returned successfully`, "success");
                      }}
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                    >
                      Mark Returned
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
              Issue Book to Patron
            </h3>
            <form onSubmit={handleIssueBook} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Book Title *
                </label>
                <input
                  type="text"
                  value={formData.bookTitle}
                  onChange={(e) => setFormData({ ...formData, bookTitle: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    ISBN
                  </label>
                  <input
                    type="text"
                    value={formData.isbn}
                    onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Member Type
                  </label>
                  <select
                    value={formData.memberType}
                    onChange={(e) => setFormData({ ...formData, memberType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher / Faculty</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Member Name *
                  </label>
                  <input
                    type="text"
                    value={formData.memberName}
                    onChange={(e) => setFormData({ ...formData, memberName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Member ID
                  </label>
                  <input
                    type="text"
                    value={formData.memberId}
                    onChange={(e) => setFormData({ ...formData, memberId: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Loan Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
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
                  Complete Checkout
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
