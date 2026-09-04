import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageHeading from "@/components/common/PageHeading";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Filter, 
  X, 
  Edit3, 
  Trash2,
  CalendarDays,
  Bell
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

interface SchoolEvent {
  id: string;
  title: string;
  category: "Academic" | "Exam" | "Holiday" | "Extracurricular" | "Meeting";
  date: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  location: string;
  targetAudience: "All" | "Students" | "Teachers" | "Parents" | "Staff";
  description: string;
  organizer: string;
  isAllDay?: boolean;
}

const INITIAL_EVENTS: SchoolEvent[] = [
  {
    id: "evt-1",
    title: "Midterm Examination Period Begins",
    category: "Exam",
    date: "2026-03-02",
    startTime: "08:30",
    endTime: "15:30",
    location: "Examination Halls A & B",
    targetAudience: "Students",
    description: "Compulsory examination for Grade 9 through 12 students. Morning and afternoon shifts.",
    organizer: "Academic Office",
    isAllDay: true,
  },
  {
    id: "evt-2",
    title: "Parent-Teacher Advisory Conference (PTA)",
    category: "Meeting",
    date: "2026-03-06",
    startTime: "14:00",
    endTime: "18:00",
    location: "Main Auditorium & Classrooms",
    targetAudience: "Parents",
    description: "Term 2 midterm feedback session between parents, subject leads, and counselors.",
    organizer: "Principal's Office",
  },
  {
    id: "evt-3",
    title: "National Robotics Olympiad Exhibition",
    category: "Extracurricular",
    date: "2026-03-09",
    startTime: "10:00",
    endTime: "16:00",
    location: "STEM Innovation Center",
    targetAudience: "All",
    description: "Showcasing student-engineered autonomous robotics and AI drone projects.",
    organizer: "STEM Department",
  },
  {
    id: "evt-4",
    title: "Faculty Professional Development Seminar",
    category: "Academic",
    date: "2026-03-13",
    startTime: "09:00",
    endTime: "13:00",
    location: "Conference Room 101",
    targetAudience: "Teachers",
    description: "Interactive workshop on AI-assisted pedagogical grading tools and personalized learning.",
    organizer: "Dean of Faculty",
  },
  {
    id: "evt-5",
    title: "Spring Vernal Recess / School Holiday",
    category: "Holiday",
    date: "2026-03-20",
    startTime: "00:00",
    endTime: "23:59",
    location: "School Closed",
    targetAudience: "All",
    description: "School closed for spring break. Administrative offices operate on skeleton staff.",
    organizer: "School Administration",
    isAllDay: true,
  },
  {
    id: "evt-6",
    title: "Interscholastic Track & Field Championship",
    category: "Extracurricular",
    date: "2026-03-24",
    startTime: "08:00",
    endTime: "17:00",
    location: "Athletic Stadium",
    targetAudience: "All",
    description: "Annual regional high school track, sprint, and relay invitationals.",
    organizer: "Athletics Dept",
  },
  {
    id: "evt-7",
    title: "Term 2 Final Report Cards Published",
    category: "Academic",
    date: "2026-03-27",
    startTime: "16:00",
    endTime: "17:00",
    location: "Student & Parent Portals",
    targetAudience: "All",
    description: "Digital release of certified report cards and term GPA transcripts online.",
    organizer: "Registrar Office",
  },
];

const categoryColors: Record<SchoolEvent["category"], { bg: string; text: string; dot: string }> = {
  Academic: { bg: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200/50 dark:border-blue-800/40", text: "text-blue-600", dot: "bg-blue-500" },
  Exam: { bg: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200/50 dark:border-purple-800/40", text: "text-purple-600", dot: "bg-purple-500" },
  Holiday: { bg: "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/40", text: "text-emerald-600", dot: "bg-emerald-500" },
  Extracurricular: { bg: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 border-amber-200/50 dark:border-amber-800/40", text: "text-amber-600", dot: "bg-amber-500" },
  Meeting: { bg: "bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300 border-rose-200/50 dark:border-rose-800/40", text: "text-rose-600", dot: "bg-rose-500" },
};

export default function CalendarView() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [events, setEvents] = useState<SchoolEvent[]>(INITIAL_EVENTS);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"month" | "list">("month");
  
  // Date Navigation (Target: March 2026)
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(2); // 0-indexed: 2 = March

  // Selected event modal
  const [activeEvent, setActiveEvent] = useState<SchoolEvent | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleToday = () => {
    setCurrentMonth(2); // March
    setCurrentYear(2026);
  };

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === "All") return true;
    return e.category === selectedCategory;
  });

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    setActiveEvent(null);
    showToast("Event removed from calendar", "info");
  };

  // Build days for the month
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push({ day: null, dateStr: "" });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const monthStr = String(currentMonth + 1).padStart(2, "0");
    const dayStr = String(d).padStart(2, "0");
    calendarDays.push({
      day: d,
      dateStr: `${currentYear}-${monthStr}-${dayStr}`,
    });
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeading
          title="School Calendar"
          subtitle="View institutional milestones, examinations, athletic fixtures, and parent meetings."
        />
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center rounded-xl bg-stone-100 dark:bg-white/5 p-1 border border-stone-200/50 dark:border-white/5 text-xs font-semibold">
            <button
              onClick={() => setViewMode("month")}
              className={`px-3 py-1.5 rounded-lg transition ${viewMode === 'month' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500'}`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1.5 rounded-lg transition ${viewMode === 'list' ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-white shadow-sm' : 'text-stone-500'}`}
            >
              List
            </button>
          </div>

          <Link
            to="/calendar/events/create"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Plus size={16} />
            <span>Add Event</span>
          </Link>
        </div>
      </div>

      {/* Navigation & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-3 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>
            <h2 className="text-base font-bold text-stone-900 dark:text-white px-2 min-w-[140px] text-center">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <button
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl hover:bg-stone-100 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-700 dark:text-stone-200 transition"
          >
            Today
          </button>
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {["All", "Academic", "Exam", "Holiday", "Extracurricular", "Meeting"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-sm"
                  : "text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-white/5"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* View Mode: Month Grid */}
      {viewMode === "month" ? (
        <div className="rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 overflow-hidden shadow-sm">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-stone-200/70 dark:border-white/10 bg-stone-50/50 dark:bg-white/[0.02] text-center text-[11px] font-semibold tracking-wider text-stone-500 dark:text-stone-400 uppercase py-2.5">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Calendar Grid Cells */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-stone-200/50 dark:divide-white/5 bg-white/30 dark:bg-stone-950/20">
            {calendarDays.map((cell, idx) => {
              if (!cell.day) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[105px] p-2 bg-stone-50/20 dark:bg-white/[0.01]"
                  />
                );
              }

              const dayEvents = filteredEvents.filter(e => e.date === cell.dateStr);
              const isToday = cell.dateStr === "2026-03-04"; // Current mock time

              return (
                <div
                  key={cell.dateStr}
                  className={`min-h-[105px] p-2 transition flex flex-col justify-between hover:bg-stone-500/5 ${
                    isToday ? "bg-brand-500/[0.04]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold inline-flex items-center justify-center w-6 h-6 rounded-full ${
                        isToday
                          ? "bg-brand-600 text-white font-bold"
                          : "text-stone-700 dark:text-stone-300"
                      }`}
                    >
                      {cell.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] text-stone-400 font-mono">
                        {dayEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Event Chips */}
                  <div className="space-y-1 mt-1 overflow-y-auto max-h-[80px]">
                    {dayEvents.map(evt => {
                      const col = categoryColors[evt.category];
                      return (
                        <button
                          key={evt.id}
                          onClick={() => setActiveEvent(evt)}
                          className={`w-full text-left px-2 py-1 rounded-lg border text-[11px] font-medium truncate flex items-center gap-1.5 transition hover:scale-[1.02] cursor-pointer ${col.bg}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.dot}`} />
                          <span className="truncate">{evt.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* View Mode: List View */
        <div className="space-y-3">
          {filteredEvents.length === 0 ? (
            <div className="p-12 text-center text-stone-400 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10">
              No events found for the chosen category.
            </div>
          ) : (
            filteredEvents.map((evt) => {
              const col = categoryColors[evt.category];
              return (
                <div
                  key={evt.id}
                  onClick={() => setActiveEvent(evt)}
                  className="p-4 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-brand-500/30 transition cursor-pointer"
                >
                  <div className="flex items-start gap-3.5">
                    <div className={`p-2.5 rounded-xl border ${col.bg} shrink-0`}>
                      <CalendarDays size={20} className={col.text} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold text-stone-900 dark:text-white">
                          {evt.title}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${col.bg}`}>
                          {evt.category}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 line-clamp-1">
                        {evt.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-stone-500 dark:text-stone-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <CalendarIcon size={12} /> {evt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} /> {evt.startTime} - {evt.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} /> {evt.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} /> {evt.targetAudience}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/calendar/events/${evt.id}/edit`);
                      }}
                      className="p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-white/10 text-stone-500"
                    >
                      <Edit3 size={15} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteEvent(evt.id);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-stone-400 hover:text-red-500"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Event Details Preview Modal */}
      {activeEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl glass border border-stone-200/80 dark:border-white/10 p-6 shadow-2xl bg-white dark:bg-stone-900 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 dark:border-white/10 pb-3">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${categoryColors[activeEvent.category].bg}`}>
                {activeEvent.category}
              </span>
              <button
                onClick={() => setActiveEvent(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white">
                {activeEvent.title}
              </h3>
              <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                {activeEvent.description}
              </p>

              <div className="p-3.5 rounded-xl bg-stone-50 dark:bg-white/5 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-200">
                  <CalendarIcon size={14} className="text-stone-400" />
                  <span className="font-semibold">{activeEvent.date}</span>
                  <span className="text-stone-400">•</span>
                  <span>{activeEvent.startTime} - {activeEvent.endTime}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-200">
                  <MapPin size={14} className="text-stone-400" />
                  <span>{activeEvent.location}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-200">
                  <Users size={14} className="text-stone-400" />
                  <span>Audience: <strong>{activeEvent.targetAudience}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-stone-700 dark:text-stone-200">
                  <Bell size={14} className="text-stone-400" />
                  <span>Organizer: <strong>{activeEvent.organizer}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-stone-200 dark:border-white/10">
              <button
                onClick={() => handleDeleteEvent(activeEvent.id)}
                className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
              >
                Delete Event
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/calendar/events/${activeEvent.id}/edit`)}
                  className="px-3.5 py-1.5 rounded-xl border border-stone-200 dark:border-white/10 text-stone-700 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-white/5"
                >
                  Edit
                </button>
                <button
                  onClick={() => setActiveEvent(null)}
                  className="px-4 py-1.5 rounded-xl bg-stone-900 dark:bg-white text-white dark:text-stone-900 text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
