import { Download, Plus, Search, SlidersHorizontal, BookOpen, Sparkles, Layers, Building2, Pencil, Eye, Trash2 } from 'lucide-react'
import Button from '@/components/common/Button'
import PageHeading from '@/components/common/PageHeading'

const summaryCards = [
  { title: 'Total Subjects', value: '42', subtitle: '+4 this year', icon: BookOpen, accent: 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300' },
  { title: 'Core Subjects', value: '32', subtitle: '82% of units', icon: Sparkles, accent: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300' },
  { title: 'Elective Subjects', value: '10', subtitle: '18% of units', icon: Layers, accent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
  { title: 'Department Count', value: '8', subtitle: 'All Active', icon: Building2, accent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' },
]

const subjects = [
  {
    id: 's1',
    name: 'Advanced Biology',
    subtitle: 'Molecular Focus',
    code: 'SCI-301',
    department: 'Science',
    deptColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    category: 'Core',
    iconColor: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300',
    icon: BookOpen,
    teachers: [
      { label: 'JD', color: 'bg-emerald-500' },
      { label: 'AL', color: 'bg-violet-500' },
    ],
    indicator: '+1',
  },
  {
    id: 's2',
    name: 'Calculus BC',
    subtitle: 'College Level',
    code: 'MTH-402',
    department: 'Mathematics',
    deptColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    category: 'Core',
    iconColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    icon: Layers,
    teachers: [
      { label: 'MK', color: 'bg-violet-500' },
      { label: 'RR', color: 'bg-teal-500' },
    ],
    indicator: null,
  },
  {
    id: 's3',
    name: 'Digital Illustration',
    subtitle: 'Visual Design',
    code: 'ART-105',
    department: 'Fine Arts',
    deptColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    category: 'Elective',
    iconColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    icon: Sparkles,
    teachers: [{ label: 'LW', color: 'bg-amber-500' }],
    indicator: null,
  },
  {
    id: 's4',
    name: 'Modern World History',
    subtitle: '19th-21st Century',
    code: 'HUM-201',
    department: 'Humanities',
    deptColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    category: 'Core',
    iconColor: 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300',
    icon: Building2,
    teachers: [
      { label: 'SP', color: 'bg-amber-500' },
      { label: 'DM', color: 'bg-violet-500' },
      { label: 'JT', color: 'bg-emerald-500' },
    ],
    indicator: null,
  },
]

export default function Subjects() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PageHeading title="Subject Management" subtitle="Manage curriculum, departments, and teaching assignments." />
        <Button variant="solid" className="inline-flex items-center gap-2" onClick={() => {}}>
          <Plus size={18} />
          Create New Subject
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="rounded-[28px] glass-sm p-6">
              <div className="flex items-center justify-between">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${card.accent}`}>
                  <Icon size={20} />
                </div>
                <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">{card.subtitle}</span>
              </div>
              <div className="mt-5 text-sm font-medium text-stone-500 dark:text-stone-400">{card.title}</div>
              <div className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-stone-100">{card.value}</div>
            </div>
          )
        })}
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] glass-sm p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1">
          <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 dark:text-stone-500" />
          <input
            type="text"
            placeholder="Filter by name or code..."
            className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm text-stone-700 outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:ring-brand-900"
          />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <select className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none transition focus:border-brand-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
            <option>All Departments</option>
            <option>Science</option>
            <option>Mathematics</option>
            <option>Fine Arts</option>
            <option>Humanities</option>
          </select>
          <select className="rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 outline-none transition focus:border-brand-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100">
            <option>Category</option>
            <option>Core</option>
            <option>Elective</option>
          </select>
          <Button variant="none" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-stone-50 text-stone-600 transition hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-300 dark:hover:bg-stone-800" onClick={() => {}}>
            <SlidersHorizontal size={17} />
          </Button>
          <Button variant="glass" className="inline-flex items-center gap-2 text-sm font-semibold text-stone-700 dark:text-stone-100" onClick={() => {}}>
            <Download size={16} />
            Export
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[28px] glass-sm">
        <table className="min-w-180 w-full divide-y divide-stone-100 dark:divide-stone-800">
          <thead className="bg-stone-50 dark:bg-stone-900">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">Subject Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">Code</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">Department</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">Teachers</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">Category</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-stone-500 dark:text-stone-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
            {subjects.map((subject) => {
              const Icon = subject.icon
              return (
                <tr key={subject.id} className="transition hover:bg-stone-50 dark:hover:bg-stone-900">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${subject.iconColor}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-stone-100">{subject.name}</div>
                        <div className="text-sm text-stone-500 dark:text-stone-400">{subject.subtitle}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-stone-700 dark:text-stone-200">{subject.code}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${subject.deptColor}`}>
                      {subject.department}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center -space-x-2">
                      {subject.teachers.map((teacher) => (
                        <span
                          key={teacher.label}
                          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-stone-900 text-xs font-semibold text-white ${teacher.color}`}
                        >
                          {teacher.label}
                        </span>
                      ))}
                      {subject.indicator && (
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-white dark:border-stone-900 bg-stone-200 text-xs font-semibold text-stone-600 dark:bg-stone-700 dark:text-stone-300">
                          {subject.indicator}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                        subject.category === 'Core'
                          ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/30 dark:text-brand-300'
                          : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                      }`}
                    >
                      {subject.category}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex items-center gap-3 text-stone-400 dark:text-stone-400">
                      <Button variant="none" onClick={() => {}} className="rounded-full p-1.5 transition hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-brand-600">
                        <Pencil size={16} />
                      </Button>
                      <Button variant="none" onClick={() => {}} className="rounded-full p-1.5 transition hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-700">
                        <Eye size={16} />
                      </Button>
                      <Button variant="none" onClick={() => {}} className="rounded-full p-1.5 transition hover:bg-rose-50 dark:hover:bg-rose-950 hover:text-rose-600">
                        <Trash2 size={16} />
                      </Button>
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