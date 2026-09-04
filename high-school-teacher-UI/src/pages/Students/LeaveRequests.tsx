import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Filter, 
  FileText, 
  Plus, 
  User, 
  Paperclip,
  Check,
  X,
  Eye,
  CalendarDays
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface LeaveRequest {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  rollNumber: string;
  gradeClass: string;
  leaveType: "Medical" | "Family Emergency" | "School Representative" | "Personal";
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  hasAttachment: boolean;
  attachmentName?: string;
  submittedBy: string; // e.g. "Parent (Helen Davis)" or "Student"
  submittedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  adminRemarks?: string;
}

const INITIAL_REQUESTS: LeaveRequest[] = [
  {
    id: "lr-1",
    studentId: "stu-101",
    studentName: "Lucas Vance",
    studentAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    rollNumber: "STD-2025-041",
    gradeClass: "Grade 11A",
    leaveType: "Medical",
    startDate: "2026-03-05",
    endDate: "2026-03-07",
    daysCount: 3,
    reason: "Severe viral fever and advised strict rest by pediatrician.",
    hasAttachment: true,
    attachmentName: "doctor_certificate_mar2026.pdf",
    submittedBy: "Parent (Helen Vance)",
    submittedAt: "2026-03-04 18:30",
    status: "Pending",
  },
  {
    id: "lr-2",
    studentId: "stu-102",
    studentName: "Chloe Dupont",
    studentAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    rollNumber: "STD-2025-018",
    gradeClass: "Grade 10B",
    leaveType: "School Representative",
    startDate: "2026-03-08",
    endDate: "2026-03-10",
    daysCount: 3,
    reason: "Selected for the National Interscholastic Robotics Olympiad finals in Chicago.",
    hasAttachment: true,
    attachmentName: "robotics_invitation_letter.pdf",
    submittedBy: "Coach / Student",
    submittedAt: "2026-03-03 11:20",
    status: "Approved",
    adminRemarks: "Approved by Principal. Excused from regular quizzes; make-up allowed.",
  },
  {
    id: "lr-3",
    studentId: "stu-103",
    studentName: "Ethan Miller",
    studentAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rollNumber: "STD-2025-089",
    gradeClass: "Grade 12A",
    leaveType: "Family Emergency",
    startDate: "2026-03-06",
    endDate: "2026-03-06",
    daysCount: 1,
    reason: "Attending memorial service out of town with family.",
    hasAttachment: false,
    submittedBy: "Parent (Robert Miller)",
    submittedAt: "2026-03-04 09:15",
    status: "Pending",
  },
  {
    id: "lr-4",
    studentId: "stu-104",
    studentName: "Sophia Chen",
    studentAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rollNumber: "STD-2025-032",
    gradeClass: "Grade 9A",
    leaveType: "Personal",
    startDate: "2026-02-28",
    endDate: "2026-03-01",
    daysCount: 2,
    reason: "Attending older sister's university graduation ceremony in Boston.",
    hasAttachment: false,
    submittedBy: "Parent (Grace Chen)",
    submittedAt: "2026-02-25 14:10",
    status: "Approved",
    adminRemarks: "Approved. All coursework to be submitted prior.",
  },
  {
    id: "lr-5",
    studentId: "stu-105",
    studentName: "Noah Patel",
    studentAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rollNumber: "STD-2025-067",
    gradeClass: "Grade 11B",
    leaveType: "Personal",
    startDate: "2026-03-02",
    endDate: "2026-03-05",
    daysCount: 4,
    reason: "Vacation extension beyond mid-term break without prior authorization.",
    hasAttachment: false,
    submittedBy: "Student",
    submittedAt: "2026-02-28 20:45",
    status: "Rejected",
    adminRemarks: "Leaves during examination revision week cannot be approved for leisure.",
  },
];

export default function LeaveRequests() {
  const { showToast } = useToast();
  const [requests, setRequests] = useState<LeaveRequest[]>(INITIAL_REQUESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusTab, setStatusTab] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [typeFilter, setTypeFilter] = useState("All");

  // Detail Modal & Action Dialog
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New Request Form State
  const [newForm, setNewForm] = useState({
    studentName: "",
    rollNumber: "",
    gradeClass: "Grade 10A",
    leaveType: "Medical" as LeaveRequest["leaveType"],
    startDate: "2026-03-10",
    endDate: "2026-03-11",
    reason: "",
    submittedBy: "Parent",
  });

  const filtered = requests.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = statusTab === "All" || r.status === statusTab;
    const matchesType = typeFilter === "All" || r.leaveType === typeFilter;
    return matchesSearch && matchesTab && matchesType;
  });

  const pendingCount = requests.filter(r => r.status === "Pending").length;
  const approvedCount = requests.filter(r => r.status === "Approved").length;
  const onLeaveToday = requests.filter(r => r.status === "Approved" && r.daysCount > 0).length;

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Approved", adminRemarks: "Approved by administration." } : r));
    showToast("Leave request approved", "success");
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: "Approved", adminRemarks: "Approved by administration." } : null);
    }
  };

  const handleReject = (id: string) => {
    const reason = prompt("Enter reason for rejection (optional):", "Incomplete documentation or schedule conflict");
    if (reason === null) return;
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: "Rejected", adminRemarks: reason || "Declined by administration." } : r));
    showToast("Leave request rejected", "info");
    if (selectedRequest?.id === id) {
      setSelectedRequest(prev => prev ? { ...prev, status: "Rejected", adminRemarks: reason || "Declined by administration." } : null);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const start = new Date(newForm.startDate);
    const end = new Date(newForm.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const newReq: LeaveRequest = {
      id: `lr-${Date.now()}`,
      studentId: `stu-${Date.now()}`,
      studentName: newForm.studentName,
      studentAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      rollNumber: newForm.rollNumber || "STD-2025-099",
      gradeClass: newForm.gradeClass,
      leaveType: newForm.leaveType,
      startDate: newForm.startDate,
      endDate: newForm.endDate,
      daysCount: diffDays,
      reason: newForm.reason,
      hasAttachment: false,
      submittedBy: `${newForm.submittedBy} Direct`,
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: "Pending",
    };

    setRequests(prev => [newReq, ...prev]);
    setIsNewModalOpen(false);
    showToast("Leave request recorded successfully", "success");
    setNewForm({
      studentName: "",
      rollNumber: "",
      gradeClass: "Grade 10A",
      leaveType: "Medical",
      startDate: "2026-03-10",
      endDate: "2026-03-11",
      reason: "",
      submittedBy: "Parent",
    });
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Student Leave Requests"
          subtitle="Review, approve, and track student absence applications and medical certificates."
        />
        <button
          onClick={() => setIsNewModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Record Leave Request</span>
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{pendingCount}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Pending Approvals</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{approvedCount}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Approved This Term</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <CalendarDays size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{onLeaveToday}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">On Leave Active</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-stone-500/10 text-stone-600 dark:text-stone-400 flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">{requests.length}</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Total Applications</div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(["All", "Pending", "Approved", "Rejected"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 ${
                statusTab === tab
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search size={15} className="absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search student, roll, or reason..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-stone-100 dark:bg-white/5 rounded-xl text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-stone-100 dark:bg-white/5 text-xs text-stone-600 dark:text-stone-400 shrink-0">
            <Filter size={13} />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All" className="dark:bg-stone-900">All Types</option>
              <option value="Medical" className="dark:bg-stone-900">Medical</option>
              <option value="Family Emergency" className="dark:bg-stone-900">Family Emergency</option>
              <option value="School Representative" className="dark:bg-stone-900">Representative</option>
              <option value="Personal" className="dark:bg-stone-900">Personal</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200/70 dark:border-white/10 bg-stone-50/50 dark:bg-white/[0.02] text-[11px] font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase">
                <th className="py-3.5 px-4">Student</th>
                <th className="py-3.5 px-4">Leave Category</th>
                <th className="py-3.5 px-4">Period & Duration</th>
                <th className="py-3.5 px-4">Reason Details</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50 dark:divide-white/5 text-xs text-stone-700 dark:text-stone-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-stone-400">
                    No leave requests match the current selection.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-stone-500/5 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.studentAvatar}
                          alt={req.studentName}
                          className="w-9 h-9 rounded-full object-cover border border-stone-200 dark:border-white/10 shrink-0"
                        />
                        <div>
                          <div className="font-semibold text-stone-900 dark:text-white">{req.studentName}</div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            {req.gradeClass} • <span className="font-mono">{req.rollNumber}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                        req.leaveType === 'Medical'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : req.leaveType === 'School Representative'
                          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                          : req.leaveType === 'Family Emergency'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300'
                      }`}>
                        {req.leaveType}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900 dark:text-white">
                        {req.startDate} {req.startDate !== req.endDate && `to ${req.endDate}`}
                      </div>
                      <div className="text-[11px] text-stone-500 dark:text-stone-400">
                        {req.daysCount} {req.daysCount === 1 ? 'day' : 'days'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-1 text-stone-600 dark:text-stone-300">{req.reason}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-400">
                        <span>By {req.submittedBy}</span>
                        {req.hasAttachment && (
                          <span className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400">
                            <Paperclip size={10} /> Document attached
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : req.status === 'Pending'
                          ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {req.status === 'Approved' && <CheckCircle2 size={12} />}
                        {req.status === 'Pending' && <Clock size={12} />}
                        {req.status === 'Rejected' && <XCircle size={12} />}
                        <span>{req.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedRequest(req);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-400 hover:text-brand-600 transition cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={15} />
                        </button>
                        {req.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleApprove(req.id)}
                              className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 transition cursor-pointer"
                              title="Approve Leave"
                            >
                              <Check size={15} />
                            </button>
                            <button
                              onClick={() => handleReject(req.id)}
                              className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 dark:bg-red-900/20 dark:hover:bg-red-900/40 transition cursor-pointer"
                              title="Reject Leave"
                            >
                              <X size={15} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {isDetailOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass border border-stone-200/80 dark:border-white/10 p-6 shadow-2xl bg-white dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <FileText size={18} className="text-brand-500" />
                <span>Leave Application Details</span>
              </h3>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-stone-50 dark:bg-white/5">
                <img
                  src={selectedRequest.studentAvatar}
                  alt={selectedRequest.studentName}
                  className="w-11 h-11 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-sm text-stone-900 dark:text-white">{selectedRequest.studentName}</div>
                  <div className="text-stone-500">{selectedRequest.gradeClass} • Roll: {selectedRequest.rollNumber}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-stone-600 dark:text-stone-300">
                <div>
                  <span className="text-stone-400 block text-[11px]">Leave Type</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{selectedRequest.leaveType}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Total Days</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{selectedRequest.daysCount} Day(s)</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">Start Date</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{selectedRequest.startDate}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[11px]">End Date</span>
                  <span className="font-semibold text-stone-900 dark:text-white">{selectedRequest.endDate}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 dark:bg-white/5">
                <div className="text-stone-400 text-[11px] mb-1">Stated Reason</div>
                <div className="text-stone-800 dark:text-stone-100">{selectedRequest.reason}</div>
              </div>

              {selectedRequest.hasAttachment && (
                <div className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 dark:border-white/10 bg-brand-50/30 dark:bg-brand-900/10">
                  <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
                    <Paperclip size={14} className="text-brand-600 dark:text-brand-400" />
                    <span className="font-medium text-[11px]">{selectedRequest.attachmentName}</span>
                  </div>
                  <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold cursor-pointer">View</span>
                </div>
              )}

              {selectedRequest.adminRemarks && (
                <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-900/30">
                  <div className="text-amber-800 dark:text-amber-300 font-semibold text-[11px] mb-0.5">Admin Remark</div>
                  <div className="text-stone-700 dark:text-stone-300">{selectedRequest.adminRemarks}</div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-white/10">
              {selectedRequest.status === "Pending" ? (
                <>
                  <button
                    onClick={() => {
                      handleReject(selectedRequest.id);
                    }}
                    className="px-3.5 py-1.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                    }}
                    className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition"
                  >
                    Approve Leave
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-200 text-xs font-semibold transition"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Record Leave Modal */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass border border-stone-200/80 dark:border-white/10 p-6 shadow-2xl bg-white dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Plus size={18} className="text-brand-500" />
                <span>Record New Leave Request</span>
              </h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Student Full Name</label>
                <input
                  type="text"
                  required
                  value={newForm.studentName}
                  onChange={(e) => setNewForm({ ...newForm, studentName: e.target.value })}
                  placeholder="e.g. Brandon Walsh"
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Class Section</label>
                  <select
                    value={newForm.gradeClass}
                    onChange={(e) => setNewForm({ ...newForm, gradeClass: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  >
                    <option value="Grade 9A" className="dark:bg-stone-900">Grade 9A</option>
                    <option value="Grade 9B" className="dark:bg-stone-900">Grade 9B</option>
                    <option value="Grade 10A" className="dark:bg-stone-900">Grade 10A</option>
                    <option value="Grade 10B" className="dark:bg-stone-900">Grade 10B</option>
                    <option value="Grade 11A" className="dark:bg-stone-900">Grade 11A</option>
                    <option value="Grade 12A" className="dark:bg-stone-900">Grade 12A</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Category</label>
                  <select
                    value={newForm.leaveType}
                    onChange={(e) => setNewForm({ ...newForm, leaveType: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  >
                    <option value="Medical" className="dark:bg-stone-900">Medical</option>
                    <option value="Family Emergency" className="dark:bg-stone-900">Family Emergency</option>
                    <option value="School Representative" className="dark:bg-stone-900">School Representative</option>
                    <option value="Personal" className="dark:bg-stone-900">Personal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={newForm.startDate}
                    onChange={(e) => setNewForm({ ...newForm, startDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={newForm.endDate}
                    onChange={(e) => setNewForm({ ...newForm, endDate: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">Reason for Absence</label>
                <textarea
                  rows={3}
                  required
                  value={newForm.reason}
                  onChange={(e) => setNewForm({ ...newForm, reason: e.target.value })}
                  placeholder="Provide clinical or domestic explanation for absence..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200 dark:border-white/10">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold shadow-md shadow-brand-500/20"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
