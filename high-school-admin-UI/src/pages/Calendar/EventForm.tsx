import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Save, 
  Bell, 
  RotateCw,
  Sparkles
} from "lucide-react";
import { useToast } from "@/components/common/ToastProvider";

export default function EventForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isEditing = Boolean(id);

  // Form states
  const [title, setTitle] = useState(isEditing ? "Parent-Teacher Advisory Conference (PTA)" : "");
  const [category, setCategory] = useState<"Academic" | "Exam" | "Holiday" | "Extracurricular" | "Meeting">("Meeting");
  const [targetAudience, setTargetAudience] = useState<"All" | "Students" | "Teachers" | "Parents" | "Staff">("Parents");
  const [date, setDate] = useState("2026-03-06");
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("18:00");
  const [location, setLocation] = useState("Main Auditorium & Classrooms");
  const [organizer, setOrganizer] = useState("Principal's Office");
  const [description, setDescription] = useState(
    "Term 2 midterm feedback session between parents, subject leads, and counselors. Light refreshments provided."
  );
  const [notifyAttendees, setNotifyAttendees] = useState(true);
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Event title is required", "error");
      return;
    }
    showToast(isEditing ? "Event details updated successfully" : "New calendar event scheduled", "success");
    setTimeout(() => {
      navigate("/calendar");
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto pb-12">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/calendar"
            className="p-2 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-600 dark:text-stone-300 transition"
          >
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-stone-900 dark:text-white">
              {isEditing ? "Edit School Event" : "Create New School Event"}
            </h1>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Schedule school activities, holidays, tests, or assemblies on the calendar.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/calendar")}
            className="px-4 py-2 rounded-xl border border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-300 text-xs font-semibold hover:bg-stone-100 dark:hover:bg-white/5"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-md shadow-brand-500/20 transition cursor-pointer"
          >
            <Save size={15} />
            <span>{isEditing ? "Update Event" : "Publish Event"}</span>
          </button>
        </div>
      </div>

      <div className="p-6 rounded-2xl glass-sm border border-stone-200/70 dark:border-white/10 space-y-4 bg-white/40 dark:bg-stone-900/40 text-xs">
        <div>
          <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Event Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Annual Interscholastic Track & Field Championship"
            className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            >
              <option value="Academic" className="dark:bg-stone-900">Academic Milestone</option>
              <option value="Exam" className="dark:bg-stone-900">Exam / Assessment</option>
              <option value="Holiday" className="dark:bg-stone-900">Holiday / Break</option>
              <option value="Extracurricular" className="dark:bg-stone-900">Extracurricular / Sports</option>
              <option value="Meeting" className="dark:bg-stone-900">Meeting / Conference</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Target Audience
            </label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            >
              <option value="All" className="dark:bg-stone-900">All School Community</option>
              <option value="Students" className="dark:bg-stone-900">Students Only</option>
              <option value="Teachers" className="dark:bg-stone-900">Faculty / Teachers Only</option>
              <option value="Parents" className="dark:bg-stone-900">Parents & Guardians</option>
              <option value="Staff" className="dark:bg-stone-900">Administrative Staff</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-200/50 dark:border-white/5">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Start Time
            </label>
            <input
              type="time"
              disabled={isAllDay}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              End Time
            </label>
            <input
              type="time"
              disabled={isAllDay}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none disabled:opacity-50"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="allDayCheck"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
            className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
          />
          <label htmlFor="allDayCheck" className="text-stone-700 dark:text-stone-300 font-medium">
            All Day Event (No specific timing)
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-stone-200/50 dark:border-white/5">
          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Location / Room
            </label>
            <input
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Science Wing Hall 1 or Online Zoom"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
              Organizer / Host
            </label>
            <input
              type="text"
              required
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              placeholder="e.g. Athletics Department"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
            Event Description & Details
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Detailed description, expectations, materials needed, dress code..."
            className="w-full px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-stone-900 dark:text-white focus:outline-none"
          />
        </div>

        <div className="space-y-2 pt-2 border-t border-stone-200/50 dark:border-white/5">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={notifyAttendees}
              onChange={(e) => setNotifyAttendees(e.target.checked)}
              className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1.5">
              <Bell size={13} className="text-brand-500" />
              Send automated broadcast notification to targeted audience
            </span>
          </label>

          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={isRecurring}
              onChange={(e) => setIsRecurring(e.target.checked)}
              className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
            />
            <span className="text-stone-700 dark:text-stone-300 font-medium flex items-center gap-1.5">
              <RotateCw size={13} className="text-brand-500" />
              Repeat this event on a weekly cadence throughout the academic term
            </span>
          </label>
        </div>
      </div>
    </form>
  );
}
