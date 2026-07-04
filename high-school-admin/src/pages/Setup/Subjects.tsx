import { Download, Plus, Search, SlidersHorizontal, BookOpen, Users, Layers, Sparkles, Pencil, Eye, Trash2 } from '../../shims/lucide-react'
import PageHeading from '../../components/common/PageHeading'

const subjects = [
  {
    id: 's1',
    name: 'Advanced Biology',
    subtitle: 'Molecular Focus',
    code: 'SCI-301',
    department: 'Science',
    category: 'Core',
    teachers: ['JD', 'AL'],
    indicator: '+1',
    icon: 'BookOpen',
  },
  {
    id: 's2',
    name: 'Calculus BC',
    subtitle: 'College Level',
    code: 'MTH-402',
    department: 'Mathematics',
    category: 'Core',
    teachers: ['MK', 'RR'],
    indicator: null,
    icon: 'Layers',
  },
  {
    id: 's3',
    name: 'Digital Illustration',
    subtitle: 'Visual Design',
    code: 'ART-105',
    department: 'Fine Arts',
    category: 'Elective',
    teachers: ['LW'],
    indicator: null,
    icon: 'Sparkles',
  },
  {
    id: 's4',
    name: 'Modern World History',
    subtitle: '19th-21st Century',
    code: 'HUM-201',
    department: 'Humanities',
    category: 'Core',
    teachers: ['SP', 'DM', 'JT'],
    indicator: null,
    icon: 'Users',
  },
]

const summaryCards = [
  {
    title: 'Total Subjects',
    value: '42',
    subtitle: '+4 this year',
    icon: BookOpen,
    accent: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Core Subjects',
    value: '32',
    subtitle: '82% of units',
    icon: Layers,
    accent: 'bg-violet-50 text-violet-700',
  },
  {
    title: 'Elective Subjects',
    value: '10',
    subtitle: '18% of units',
    icon: Sparkles,
    accent: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Department Count',
    value: '8',
    subtitle: 'All Active',
    icon: Users,
    accent: 'bg-amber-50 text-amber-700',
  },
]

export default function Subjects() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <PageHeading
            title="Subject Management"
            subtitle="Manage curriculum, departments, and teaching assignments."
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
          <Plus size={18} />
          Create New Subject
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${card.accent}`}>
                <Icon size={20} />
              </div>
              <div className="mt-5 text-sm font-medium text-slate-500">{card.title}</div>
              <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{card.value}</div>
              <div className="mt-4 text-sm text-slate-500">{card.subtitle}</div>
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
              placeholder="Filter by name or code..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
              <option>All Departments</option>
              <option>Science</option>
              <option>Mathematics</option>
              <option>Fine Arts</option>
              <option>Humanities</option>
            </select>
            <select className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
              <option>Category</option>
              <option>Core</option>
              <option>Elective</option>
            </select>
            <button className="inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 text-slate-700 transition hover:bg-slate-100">
              <SlidersHorizontal size={18} />
            </button>
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Subject Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Code</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Department</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Teachers</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Category</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {subjects.map((subject) => {
              const Icon = subject.icon === 'BookOpen' ? BookOpen : subject.icon === 'Layers' ? Layers : subject.icon === 'Sparkles' ? Sparkles : Users
              return (
                <tr key={subject.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{subject.name}</div>
                        <div className="text-sm text-slate-500">{subject.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-700">{subject.code}</td>
                  <td className="px-6 py-5">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600">
                      {subject.department}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1">
                      {subject.teachers.map((teacher) => (
                        <span key={teacher} className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
                          {teacher}
                        </span>
                      ))}
                      {subject.indicator ? (
                        <span className="inline-flex h-9 min-w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
                          {subject.indicator}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] ${subject.category === 'Core' ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {subject.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex items-center gap-3 text-slate-500">
                      <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                        <Pencil size={16} />
                      </button>
                      <button className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900">
                        <Eye size={16} />
                      </button>
                      <button className="rounded-full p-2 text-rose-600 transition hover:bg-rose-50">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
