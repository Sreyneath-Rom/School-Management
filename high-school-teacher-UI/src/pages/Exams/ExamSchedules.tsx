import { useState } from "react";
import PageHeading from "@/components/common/PageHeading";
import { 
  Calendar, 
  Plus, 
  Search, 
  Clock, 
  DoorOpen, 
  User, 
  BookOpen, 
  Filter,
  CheckCircle2,
  FileDown
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface ExamScheduleSlot {
  id: string;
  examName: string;
  subject: string;
  subjectCode: string;
  classGroup: string;
  date: string;
  startTime: string;
  endTime: string;
  room: string;
  invigilator: string;
  maxScore: number;
}

export default function ExamSchedules() {
  const { showToast } = useToast();
  const [selectedExam, setSelectedExam] = useState("Midterm Examination Term 2");
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [schedules, setSchedules] = useState<ExamScheduleSlot[]>([
    {
      id: "es-1",
      examName: "Midterm Examination Term 2",
      subject: "Calculus BC",
      subjectCode: "MTH-402",
      classGroup: "Grade 10-A, 10-B",
      date: "2026-03-02",
      startTime: "09:00",
      endTime: "11:30",
      room: "Grand Auditorium",
      invigilator: "Prof. Marcus Kane",
      maxScore: 100,
    },
    {
      id: "es-2",
      examName: "Midterm Examination Term 2",
      subject: "Advanced Biology",
      subjectCode: "SCI-301",
      classGroup: "Grade 10-A",
      date: "2026-03-03",
      startTime: "09:00",
      endTime: "11:00",
      room: "Lab 302",
      invigilator: "Dr. Alice Liu",
      maxScore: 100,
    },
    {
      id: "es-3",
      examName: "Midterm Examination Term 2",
      subject: "Modern World History",
      subjectCode: "HUM-201",
      classGroup: "Grade 10-A, 10-B",
      date: "2026-03-04",
      startTime: "09:00",
      endTime: "11:00",
      room: "Room 101",
      invigilator: "Sarah Parker",
      maxScore: 100,
    },
    {
      id: "es-4",
      examName: "Midterm Examination Term 2",
      subject: "Literature & Composition II",
      subjectCode: "ENG-202",
      classGroup: "Grade 10-A",
      date: "2026-03-05",
      startTime: "09:00",
      endTime: "11:30",
      room: "Room 204",
      invigilator: "Claire Bennett",
      maxScore: 100,
    },
    {
      id: "es-5",
      examName: "Midterm Examination Term 2",
      subject: "AP Computer Science A",
      subjectCode: "CS-501",
      classGroup: "Grade 11-A",
      date: "2026-03-06",
      startTime: "13:00",
      endTime: "15:30",
      room: "Computer Lab Alpha",
      invigilator: "Elena Vance",
      maxScore: 100,
    },
  ]);

  const [formData, setFormData] = useState({
    subject: "Chemistry Honors",
    subjectCode: "SCI-302",
    classGroup: "Grade 10-A",
    date: "2026-03-07",
    startTime: "09:00",
    endTime: "11:00",
    room: "Lab 301",
    invigilator: "Dr. John Whitfield",
    maxScore: 100,
  });

  const filtered = schedules.filter((s) => {
    const matchesExam = selectedExam === "All" || s.examName === selectedExam;
    const matchesSearch =
      s.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.invigilator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.room.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesExam && matchesSearch;
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const newSlot: ExamScheduleSlot = {
      id: `es-${Date.now()}`,
      examName: selectedExam === "All" ? "Midterm Examination Term 2" : selectedExam,
      ...formData,
      maxScore: Number(formData.maxScore) || 100,
    };
    setSchedules((prev) => [...prev, newSlot]);
    setModalOpen(false);
    showToast("Exam schedule timetable slot added", "success");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="Exam Timetables & Schedules"
          subtitle="Organize date slots, room assignments, proctor/invigilator allocations, and examination sessions."
        />
        <div className="flex items-center gap-3 shrink-0">
          <select
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-white/10 border border-stone-200 dark:border-white/10 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="Midterm Examination Term 2">Midterm Examination Term 2</option>
            <option value="Final Comprehensive Exam Term 1">Final Comprehensive Exam Term 1</option>
            <option value="All">All Examinations</option>
          </select>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Slot</span>
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="p-4 border-b border-stone-200/50 dark:border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1">
            <Search size={16} className="text-stone-400" />
            <input
              type="text"
              placeholder="Search paper subject, invigilator, or room..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs bg-transparent text-stone-800 dark:text-stone-200 placeholder:text-stone-400 focus:outline-none"
            />
          </div>
          <button
            onClick={() => showToast("Exporting timetable as PDF", "info")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg border border-stone-200 dark:border-white/10 hover:bg-stone-50 dark:hover:bg-white/5 transition"
          >
            <FileDown size={14} />
            <span>Export Timetable</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50/80 dark:bg-white/5 text-stone-500 font-semibold border-b border-stone-200/50 dark:border-white/10">
              <tr>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Subject</th>
                <th className="p-3.5">Class / Candidates</th>
                <th className="p-3.5">Assigned Room</th>
                <th className="p-3.5">Proctor / Invigilator</th>
                <th className="p-3.5">Max Score</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/40 dark:divide-white/5">
              {filtered.map((slot) => (
                <tr
                  key={slot.id}
                  className="hover:bg-stone-50/50 dark:hover:bg-white/5 transition"
                >
                  <td className="p-3.5">
                    <div className="font-semibold text-stone-900 dark:text-white flex items-center gap-1.5">
                      <Calendar size={13} className="text-brand-500" />
                      <span>{slot.date}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5 font-medium">
                      <Clock size={12} />
                      <span>{slot.startTime} – {slot.endTime}</span>
                    </div>
                  </td>
                  <td className="p-3.5">
                    <div className="font-bold text-stone-900 dark:text-white">{slot.subject}</div>
                    <div className="text-[11px] font-mono text-stone-400">{slot.subjectCode}</div>
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300 font-medium">
                    {slot.classGroup}
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-1 rounded-md text-[11px] font-semibold bg-stone-100 dark:bg-white/10 text-stone-700 dark:text-stone-300 inline-flex items-center gap-1">
                      <DoorOpen size={12} /> {slot.room}
                    </span>
                  </td>
                  <td className="p-3.5 text-stone-700 dark:text-stone-300">
                    <div className="flex items-center gap-1.5">
                      <User size={13} className="text-stone-400" />
                      <span>{slot.invigilator}</span>
                    </div>
                  </td>
                  <td className="p-3.5 font-bold text-stone-900 dark:text-white">
                    {slot.maxScore} pts
                  </td>
                  <td className="p-3.5 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setSchedules((prev) => prev.filter((s) => s.id !== slot.id));
                        showToast("Exam schedule slot removed", "info");
                      }}
                      className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                    >
                      Remove
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
              Schedule Exam Paper
            </h3>
            <form onSubmit={handleAddSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Exam Date *
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Class Group *
                  </label>
                  <input
                    type="text"
                    value={formData.classGroup}
                    onChange={(e) => setFormData({ ...formData, classGroup: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Room / Hall
                  </label>
                  <input
                    type="text"
                    value={formData.room}
                    onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Invigilator
                  </label>
                  <input
                    type="text"
                    value={formData.invigilator}
                    onChange={(e) => setFormData({ ...formData, invigilator: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-stone-100/70 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                    required
                  />
                </div>
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
                  Save Schedule Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
