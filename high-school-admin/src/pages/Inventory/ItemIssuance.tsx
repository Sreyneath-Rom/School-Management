import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  ArrowRightLeft, 
  Plus, 
  Search, 
  CheckCircle2, 
  Calendar, 
  User, 
  Boxes, 
  Clock, 
  ArrowDownToLine 
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface InventoryIssueRecord {
  id: string;
  issueNo: string;
  itemName: string;
  sku: string;
  issuedTo: string;
  department: string;
  quantity: number;
  issueDate: string;
  expectedReturnDate?: string;
  status: "Issued / Consumed" | "Borrowed (Pending Return)" | "Returned";
}

export default function ItemIssuance() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [records, setRecords] = useState<InventoryIssueRecord[]>([
    {
      id: "iss-1",
      issueNo: "DISP-2026-081",
      itemName: "Binocular Optical Microscopes (1000x)",
      sku: "LAB-BIO-001",
      issuedTo: "Dr. John Whitfield",
      department: "Science Department",
      quantity: 6,
      issueDate: "2026-02-18",
      expectedReturnDate: "2026-06-15",
      status: "Borrowed (Pending Return)",
    },
    {
      id: "iss-2",
      issueNo: "DISP-2026-082",
      itemName: "Arduino STEM Robotics Starter Kits",
      sku: "CS-ROB-012",
      issuedTo: "Elena Vance",
      department: "Technology",
      quantity: 15,
      issueDate: "2026-02-20",
      expectedReturnDate: "2026-05-30",
      status: "Borrowed (Pending Return)",
    },
    {
      id: "iss-3",
      issueNo: "DISP-2026-083",
      itemName: "Recycled White A4 Printer Paper (500-sheet ream)",
      sku: "OFF-PPR-A4",
      issuedTo: "Bursar Accounting Office",
      department: "Finance & Admin",
      quantity: 10,
      issueDate: "2026-02-22",
      status: "Issued / Consumed",
    },
  ]);

  const [formData, setFormData] = useState({
    itemName: "Arduino STEM Robotics Starter Kits",
    sku: "CS-ROB-012",
    issuedTo: "Prof. Marcus Kane",
    department: "Mathematics",
    quantity: 2,
    expectedReturnDate: "2026-04-10",
  });

  const handleIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord: InventoryIssueRecord = {
      id: `iss-${Date.now()}`,
      issueNo: `DISP-2026-0${Math.floor(100 + Math.random() * 900)}`,
      itemName: formData.itemName,
      sku: formData.sku,
      issuedTo: formData.issuedTo,
      department: formData.department,
      quantity: Number(formData.quantity),
      issueDate: new Date().toISOString().split("T")[0],
      expectedReturnDate: formData.expectedReturnDate,
      status: "Borrowed (Pending Return)",
    };
    setRecords((prev) => [newRecord, ...prev]);
    setModalOpen(false);
    showToast("Inventory asset issued and stock reduced", "success");
  };

  const filtered = records.filter(
    (r) =>
      r.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.issuedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.issueNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Asset Issuance & Department Dispatch"
          subtitle="Record hardware loans, classroom requisitions, consumable distributions, and tracking."
        />
        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Dispatch Asset</span>
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-3.5 border-b border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search dispatch number, item name, or recipient..."
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
                <th className="p-3.5">Dispatch Ref</th>
                <th className="p-3.5">Item & SKU</th>
                <th className="p-3.5">Issued To Faculty / Dept</th>
                <th className="p-3.5 text-center">Qty</th>
                <th className="p-3.5">Dispatch Date</th>
                <th className="p-3.5">Expected Return</th>
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
                    {r.issueNo}
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-white">
                      {r.itemName}
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">{r.sku}</div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-800 dark:text-stone-200">
                      {r.issuedTo}
                    </div>
                    <div className="text-[11px] text-stone-500">{r.department}</div>
                  </td>
                  <td className="p-3.5 text-center font-bold text-stone-900 dark:text-white">
                    {r.quantity}
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300">
                    {r.issueDate}
                  </td>
                  <td className="p-3.5 font-mono text-stone-600 dark:text-stone-300">
                    {r.expectedReturnDate || "Consumable (N/A)"}
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                        r.status === "Borrowed (Pending Return)"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          : "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
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

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl glass-strong border border-stone-200 dark:border-white/15 p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-4">
              Dispatch Asset
            </h3>
            <form onSubmit={handleIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Item Description *
                </label>
                <input
                  type="text"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Issued To Faculty *
                  </label>
                  <input
                    type="text"
                    value={formData.issuedTo}
                    onChange={(e) => setFormData({ ...formData, issuedTo: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Expected Return Date (if loan)
                </label>
                <input
                  type="date"
                  value={formData.expectedReturnDate}
                  onChange={(e) => setFormData({ ...formData, expectedReturnDate: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
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
                  Complete Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
