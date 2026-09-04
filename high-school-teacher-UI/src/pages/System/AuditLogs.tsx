import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Clock, 
  User, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Code, 
  Terminal, 
  Database,
  X,
  Sparkles,
  Layers
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: "Super Admin" | "Teacher" | "Registrar" | "System";
  actorEmail: string;
  actorAvatar?: string;
  action: string;
  category: "Auth" | "Academic" | "Student" | "Faculty" | "System";
  severity: "info" | "warning" | "critical";
  targetResource: string;
  ipAddress: string;
  status: "Success" | "Failed";
  details: Record<string, any>;
}

const INITIAL_LOGS: AuditLogEntry[] = [
  {
    id: "log-1092",
    timestamp: "2026-03-04 10:24:18",
    actorName: "Dr. Sarah Jenkins",
    actorRole: "Teacher",
    actorEmail: "sarah.jenkins@oakridge.edu",
    actorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    action: "GRADE_MODERATION_UPDATE",
    category: "Academic",
    severity: "info",
    targetResource: "Exam: MATH-401 (Calculus)",
    ipAddress: "192.168.1.104",
    status: "Success",
    details: { examId: "EX-2026-T2-MID", subject: "MATH-401", updatedMarksCount: 28, meanScore: 88.4 },
  },
  {
    id: "log-1091",
    timestamp: "2026-03-04 09:12:05",
    actorName: "Principal Vance",
    actorRole: "Super Admin",
    actorEmail: "admin@oakridge.edu",
    actorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    action: "STUDENT_LEAVE_APPROVED",
    category: "Student",
    severity: "info",
    targetResource: "Student: Chloe Dupont (STD-2025-018)",
    ipAddress: "192.168.1.2",
    status: "Success",
    details: { leaveId: "lr-2", days: 3, category: "School Representative", approvedBy: "Principal Vance" },
  },
  {
    id: "log-1090",
    timestamp: "2026-03-04 08:32:44",
    actorName: "Unknown Session",
    actorRole: "System",
    actorEmail: "sec-monitor@oakridge.edu",
    action: "AUTH_LOGIN_FAILED",
    category: "Auth",
    severity: "warning",
    targetResource: "Endpoint: /api/v1/auth/login",
    ipAddress: "203.0.113.45",
    status: "Failed",
    details: { reason: "Invalid credentials (attempt 3)", username: "staff_payroll", location: "Toronto, CA" },
  },
  {
    id: "log-1089",
    timestamp: "2026-03-03 16:45:00",
    actorName: "Dean of Studies",
    actorRole: "Super Admin",
    actorEmail: "dean@oakridge.edu",
    actorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    action: "FACULTY_ALLOCATION_CREATED",
    category: "Faculty",
    severity: "info",
    targetResource: "Teacher: David Kim -> CS-101",
    ipAddress: "192.168.1.5",
    status: "Success",
    details: { teacherId: "tch-4", department: "Computer Science", class: "Grade 10A", hours: 4 },
  },
  {
    id: "log-1088",
    timestamp: "2026-03-03 11:20:12",
    actorName: "Registrar Office",
    actorRole: "Registrar",
    actorEmail: "registrar@oakridge.edu",
    action: "TRANSCRIPT_EXPORT_BATCH",
    category: "Student",
    severity: "info",
    targetResource: "Class: Grade 12 (Graduation Tier)",
    ipAddress: "192.168.1.18",
    status: "Success",
    details: { batchSize: 112, format: "PDF_DIGITAL_SIGNED", generatedFiles: 112 },
  },
  {
    id: "log-1087",
    timestamp: "2026-03-02 23:00:01",
    actorName: "Automated Scheduler",
    actorRole: "System",
    actorEmail: "cron@oakridge.edu",
    action: "DATABASE_SNAPSHOT_BACKUP",
    category: "System",
    severity: "info",
    targetResource: "Database: Postgres Primary Replica",
    ipAddress: "10.0.0.1",
    status: "Success",
    details: { sizeBytes: 104857600, durationMs: 4200, storageBucket: "gcs-school-backups" },
  },
];

export default function AuditLogs() {
  const { showToast } = useToast();
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_LOGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");

  // Raw inspect modal
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);

  const filtered = logs.filter((l) => {
    const matchesSearch =
      l.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.actorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.targetResource.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ipAddress.includes(searchTerm);
    const matchesCat = categoryFilter === "All" || l.category === categoryFilter;
    const matchesSev = severityFilter === "All" || l.severity === severityFilter;
    return matchesSearch && matchesCat && matchesSev;
  });

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `school_audit_logs_${new Date().toISOString().substring(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Audit logs JSON exported successfully", "success");
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="System Audit Trail"
          subtitle="Immutable operational telemetry, authentication logs, record edits, and compliance monitoring."
        />
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold shadow-sm hover:opacity-90 transition cursor-pointer self-start sm:self-auto"
        >
          <Download size={15} />
          <span>Export Logs (JSON)</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
            <Database size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">14,892</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Total Events Logged</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <AlertTriangle size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">1 Warning</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Security Anomalies</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">100%</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">FERPA / GDPR Compliant</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-white">90 Days</div>
            <div className="text-xs text-stone-500 dark:text-stone-400">Retention Window</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Search action event, actor name, IP address, or resource..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-transparent text-xs text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-white/5 text-xs text-stone-700 dark:text-stone-300">
            <Filter size={13} className="text-stone-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All" className="dark:bg-stone-900">All Categories</option>
              <option value="Auth" className="dark:bg-stone-900">Authentication</option>
              <option value="Academic" className="dark:bg-stone-900">Academic & Grades</option>
              <option value="Student" className="dark:bg-stone-900">Student Records</option>
              <option value="Faculty" className="dark:bg-stone-900">Faculty & Staff</option>
              <option value="System" className="dark:bg-stone-900">System Infrastructure</option>
            </select>
          </div>

          <div className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-white/5 text-xs text-stone-700 dark:text-stone-300">
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="All" className="dark:bg-stone-900">All Severity</option>
              <option value="info" className="dark:bg-stone-900">Info</option>
              <option value="warning" className="dark:bg-stone-900">Warning</option>
              <option value="critical" className="dark:bg-stone-900">Critical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-stone-200/70 dark:border-white/10 bg-stone-50/50 dark:bg-white/[0.02] text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp & ID</th>
                <th className="py-3.5 px-4">Operator / Actor</th>
                <th className="py-3.5 px-4">Action Event</th>
                <th className="py-3.5 px-4">Resource Target</th>
                <th className="py-3.5 px-4">IP & Network</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50 dark:divide-white/5 text-stone-700 dark:text-stone-200">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-stone-400">
                    No audit records match the selected parameters.
                  </td>
                </tr>
              ) : (
                filtered.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-500/5 transition">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono text-stone-900 dark:text-white font-medium">{log.timestamp}</div>
                      <div className="text-[10px] text-stone-400 font-mono">{log.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        {log.actorAvatar ? (
                          <img
                            src={log.actorAvatar}
                            alt={log.actorName}
                            className="w-7 h-7 rounded-full object-cover shrink-0"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-stone-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                            <Terminal size={13} className="text-stone-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-stone-900 dark:text-white">{log.actorName}</div>
                          <div className="text-[10px] text-stone-400">{log.actorRole}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono font-semibold text-stone-900 dark:text-white">
                        {log.action}
                      </span>
                      <div className="text-[10px] text-stone-400">{log.category}</div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs truncate text-stone-800 dark:text-stone-200 font-medium">
                      {log.targetResource}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                      {log.ipAddress}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status === 'Success'
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                      }`}>
                        {log.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedEntry(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 font-medium text-[11px] transition cursor-pointer"
                      >
                        <Code size={12} />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Payload Inspection Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl rounded-2xl glass border border-stone-200/80 dark:border-white/10 p-6 shadow-2xl bg-white dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2 font-mono">
                <Terminal size={16} className="text-brand-500" />
                <span>Audit Entry: {selectedEntry.id}</span>
              </h3>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 dark:bg-white/5">
                <div>
                  <span className="text-stone-400 block text-[10px]">Action Event</span>
                  <span className="font-mono font-bold text-stone-900 dark:text-white">{selectedEntry.action}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Executed At</span>
                  <span className="font-mono text-stone-900 dark:text-white">{selectedEntry.timestamp}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Actor Email</span>
                  <span className="font-medium text-stone-900 dark:text-white">{selectedEntry.actorEmail}</span>
                </div>
                <div>
                  <span className="text-stone-400 block text-[10px]">Client Network IP</span>
                  <span className="font-mono text-stone-900 dark:text-white">{selectedEntry.ipAddress}</span>
                </div>
              </div>

              <div>
                <span className="text-stone-500 font-semibold block mb-1">Raw Payload Object (JSON)</span>
                <pre className="p-3.5 rounded-xl bg-stone-950 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60 leading-relaxed border border-stone-800">
                  {JSON.stringify(selectedEntry.details, null, 2)}
                </pre>
              </div>
            </div>

            <div className="flex items-center justify-end pt-3 border-t border-stone-200 dark:border-white/10">
              <button
                onClick={() => setSelectedEntry(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-200 text-xs font-semibold"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
