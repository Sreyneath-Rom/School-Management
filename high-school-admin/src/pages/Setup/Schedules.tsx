import { Plus, Search, CalendarDays, FileStack, ClipboardList, Users2, Eye, Pencil, Trash2, Calendar } from '../../shims/lucide-react'
import PageHeading from '../../components/common/PageHeading'

const scheduleStats = [
  {
    title: 'Classes today',
    value: '18',
    icon: CalendarDays,
    accent: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Upcoming exams',
    value: '5',
    icon: FileStack,
    accent: 'bg-violet-50 text-violet-700',
  },
  {
    title: 'Teachers on duty',
    value: '12',
    icon: Users2,
    accent: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Schedule alerts',
    value: '2',
    icon: ClipboardList,
    accent: 'bg-amber-50 text-amber-700',
  },
]

const scheduleBlocks = [
  {
    id: 'b1',
    time: '08:00 - 09:00',
    title: 'Biology Lab',
    location: 'Science Block / Lab 2',
    teacher: 'Ms. Adler',
    type: 'Class',
    color: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'b2',
    time: '09:15 - 10:15',
    title: 'Calculus',
    location: 'Room 12',
    teacher: 'Mr. Patel',
    type: 'Class',
    color: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'b3',
    time: '10:30 - 12:00',
    title: 'History Exam',
    location: 'Hall C',
    teacher: 'Dr. Ross',
    type: 'Exam',
    color: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'b4',
    time: '13:00 - 14:00',
    title: 'Art Studio',
    location: 'Art Centre',
    teacher: 'Ms. Morgan',
    type: 'Class',
    color: 'bg-emerald-100 text-emerald-700',
  },
]

const timelineItems = [
  {
    id: 't1',
    time: '09:00',
    title: 'Schedule review',
    label: 'Maintenance window',
  },
  {
    id: 't2',
    time: '11:30',
    title: 'Exam seating finalized',
    label: 'Exam planning',
  },
  {
    id: 't3',
    time: '15:00',
    title: 'After-school clubs',
    label: 'Supervision schedule',
  },
]

export default function Schedules() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <PageHeading
            title="Schedules"
            subtitle="Plan classes, exams, and daily rhythms with a clear operational schedule view."
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
          <Plus size={18} />
          Add Schedule
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {scheduleStats.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${item.accent}`}>
                <Icon size={20} />
              </div>
              <div className="mt-5 text-sm font-medium text-slate-500">{item.title}</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{item.value}</div>
            </div>
          )
        })}
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative flex-1">
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by room, teacher, or event"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
              <option>All schedules</option>
              <option>Today</option>
              <option>This week</option>
              <option>Exams</option>
            </select>
            <button className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              <Calendar size={18} />
              Week view
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Today’s timetable</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Monday, July 7</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-700">
              <CalendarDays size={18} />
              18 Events
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {scheduleBlocks.map((block) => (
              <div key={block.id} className="rounded-[28px] border border-slate-200 p-5 shadow-sm transition hover:border-slate-300">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{block.title}</div>
                    <div className="mt-1 text-sm text-slate-500">{block.location}</div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${block.color}`}>
                    {block.type}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-4 text-sm text-slate-600">
                  <div>{block.time}</div>
                  <div>Teacher: {block.teacher}</div>
                </div>
                <div className="mt-5 flex items-center gap-2">
                  <button className="inline-flex h-11 items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 transition hover:bg-slate-100">
                    <Eye size={16} />
                    View
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 transition hover:bg-slate-100">
                    <Pencil size={16} />
                    Edit
                  </button>
                  <button className="inline-flex h-11 items-center gap-2 rounded-3xl border border-rose-100 bg-rose-50 px-4 text-sm font-semibold text-rose-600 transition hover:bg-rose-100">
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Schedule summary</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Key planning items</div>
            </div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
              <Calendar size={22} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Exam seating updates</div>
              <div className="mt-2 text-sm text-slate-600">All seating charts are ready for the history exam in Hall C.</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Teacher coverage</div>
              <div className="mt-2 text-sm text-slate-600">Two additional substitute teachers have been added for the afternoon session.</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Schedule alerts</div>
              <div className="mt-2 text-sm text-slate-600">Fire drill practice scheduled for 3:30 PM in the main hall.</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3 text-slate-700">
              <FileStack size={18} />
              <span className="text-sm font-semibold">Weekly planning</span>
            </div>
            <div className="mt-4 space-y-4">
              {timelineItems.map((item) => (
                <div key={item.id} className="grid gap-2 rounded-3xl bg-white p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                    <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">{item.time}</div>
                  </div>
                  <div className="text-sm text-slate-600">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
