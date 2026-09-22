// src/pages/Exams/ExamSchedules.tsx
import { useCallback, useEffect, useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import {
  Calendar,
  Search,
  Clock,
  DoorOpen,
  User,
  RefreshCw,
  Info,
} from "lucide-react";
import { examService, type ExamScheduleRecord } from "@/services/examService";

export default function ExamSchedules() {
  const [schedules, setSchedules] = useState<ExamScheduleRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await examService.schedules();
      setSchedules(Array.isArray(data) ? data : []);
    } catch {
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = schedules.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.subject.toLowerCase().includes(q) ||
      s.supervisor.toLowerCase().includes(q) ||
      s.room.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Exam Timetables"
          subtitle="Paper schedule, rooms, and invigilator assignments."
        />
        <button
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl glass-sm glass-interactive text-fg text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Info banner — semantic info signal, tinted */}
      <div className="rounded-2xl border border-info/30 bg-info/10 p-4 flex items-start gap-3 text-xs">
        <Info size={16} className="text-info shrink-0 mt-0.5" />
        <p className="text-fg-muted">
          The exam schedules endpoint is part of the same stub module. Once the
          ExamSchedule model lands, this table will populate automatically.
        </p>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 rounded-2xl glass-sm">
        <div className="relative flex-1 w-full">
          <Search
            size={16}
            className="absolute left-3.5 top-3 text-fg-muted z-10 pointer-events-none"
          />
          {/* Inputs inherit the sunken-well look from globals.css (.neu-inset) */}
          <input
            type="text"
            placeholder="Search subject, invigilator, or room..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl text-fg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-16 text-center text-fg-muted text-sm rounded-2xl glass-sm">
          <RefreshCw size={16} className="inline animate-spin mr-2" />
          Loading schedules...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center rounded-2xl glass-sm">
          <Calendar className="mx-auto mb-3 h-10 w-10 text-fg-muted/60" />
          <p className="text-sm font-semibold text-fg">
            {schedules.length === 0 ? "No schedules yet" : "No matches"}
          </p>
          <p className="text-xs text-fg-muted mt-1">
            {schedules.length === 0
              ? "Schedules will appear here once the backend module is implemented."
              : "Try a different search."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-fg-muted font-semibold shadow-[0_1px_0_var(--neu-shadow-dark)]">
              <tr>
                <th className="p-3.5">Date &amp; time</th>
                <th className="p-3.5">Subject</th>
                <th className="p-3.5">Room</th>
                <th className="p-3.5">Invigilator</th>
                <th className="p-3.5 text-right">Max / Pass</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--neu-shadow-dark)">
              {filtered.map((slot) => (
                <tr
                  key={slot.id}
                  className="hover:shadow-sunken transition-shadow"
                >
                  <td className="p-3.5">
                    <div className="font-semibold text-fg flex items-center gap-1.5">
                      <Calendar
                        size={13}
                        className="text-brand-600 dark:text-brand-400"
                      />
                      {slot.date}
                    </div>
                    <div className="text-[11px] text-fg-muted flex items-center gap-1 mt-0.5">
                      <Clock size={12} />
                      {slot.timeSlot}
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-fg">{slot.subject}</td>
                  <td className="p-3.5">
                    {/* Room chip — sunken well */}
                    <span className="px-2 py-1 rounded-md text-[11px] font-semibold text-fg-muted shadow-sunken inline-flex items-center gap-1">
                      <DoorOpen size={12} /> {slot.room}
                    </span>
                  </td>
                  <td className="p-3.5 text-fg-muted">
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-fg-muted" />
                      {slot.supervisor}
                    </div>
                  </td>
                  <td className="p-3.5 text-right font-bold text-fg">
                    {slot.maxMarks} / {slot.passingMarks}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}