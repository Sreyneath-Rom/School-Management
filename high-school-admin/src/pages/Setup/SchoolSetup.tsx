import {
  ShieldCheck,
  BookOpenCheck,
  Users2,
  ClipboardCheck,
  CalendarDays,
  FileClock,
  Settings,
  Pencil,
} from '../../shims/lucide-react'
import PageHeading from '../../components/common/PageHeading'

const settingsStats = [
  {
    title: 'Campus Sites',
    value: '3',
    icon: ShieldCheck,
    accent: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Academic Tracks',
    value: '12',
    icon: BookOpenCheck,
    accent: 'bg-violet-50 text-violet-700',
  },
  {
    title: 'Total Users',
    value: '1,240',
    icon: Users2,
    accent: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Verified Accreditation',
    value: 'Yes',
    icon: ClipboardCheck,
    accent: 'bg-amber-50 text-amber-700',
  },
]

export default function SchoolSetup() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <PageHeading
            title="School Setup"
            subtitle="Configure school details, branding, and operational settings for the entire institution."
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
          <Pencil size={18} />
          Edit Setup
        </button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.5fr_1fr]">
        <div className="grid gap-4 sm:grid-cols-2">
          {settingsStats.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.title} className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-3xl ${item.accent}`}>
                  <Icon size={18} />
                </div>
                <div className="mt-5 text-sm font-medium text-slate-500">{item.title}</div>
                <div className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{item.value}</div>
              </div>
            )
          })}
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Institution profile</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Riverwood High School</div>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
              <Settings size={16} />
              Settings
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">School Code</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">RWHS-001</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Academic Year</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">2026 – 2027</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="text-sm font-medium text-slate-700">Campus type</div>
            <div className="mt-3 inline-flex rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
              Day & Boarding
            </div>
          </div>

          <div className="mt-6 grid gap-3 text-sm text-slate-600">
            <div className="grid gap-1">
              <span className="font-semibold text-slate-900">Address</span>
              <span>1200 Elm Avenue, Lakeside District, Central City</span>
            </div>
            <div className="grid gap-1">
              <span className="font-semibold text-slate-900">Phone</span>
              <span>+1 (555) 342-1100</span>
            </div>
            <div className="grid gap-1">
              <span className="font-semibold text-slate-900">Website</span>
              <span>riverwoodhigh.edu</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Operational details</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Campus hours & term planning</div>
            </div>
            <CalendarDays size={20} className="text-slate-500" />
          </div>

          <div className="mt-6 space-y-4 text-sm text-slate-600">
            <div className="grid gap-2 rounded-3xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Term start</div>
              <div className="font-semibold text-slate-900">August 12, 2026</div>
            </div>
            <div className="grid gap-2 rounded-3xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Daily hours</div>
              <div className="font-semibold text-slate-900">08:00 AM – 04:00 PM</div>
            </div>
            <div className="grid gap-2 rounded-3xl bg-slate-50 p-4">
              <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Exam window</div>
              <div className="font-semibold text-slate-900">May 5 – May 20, 2027</div>
            </div>
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Branding</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Logo, colors, and identity</div>
            </div>
            <FileClock size={20} className="text-slate-500" />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="flex h-32 flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50 text-slate-500">
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-200 text-slate-600">
                RW
              </div>
              <div className="text-sm font-medium">Riverwood mark</div>
            </div>
            <div className="space-y-3">
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Primary color</div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-2 text-sm font-semibold text-white">#0F172A</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Accent color</div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-sky-600 px-3 py-2 text-sm font-semibold text-white">#0EA5E9</div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Support color</div>
                <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-2 text-sm font-semibold text-white">#10B981</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Team & users</div>
            <div className="mt-2 text-lg font-semibold text-slate-900">Access and ownership</div>
          </div>
          <Users2 size={20} className="text-slate-500" />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Head of School</div>
            <div className="mt-3 text-lg font-semibold text-slate-900">Dr. Maya Chen</div>
            <div className="mt-1 text-sm text-slate-600">Oversees academic strategy and leadership.</div>
          </div>
          <div className="rounded-3xl bg-slate-50 p-5">
            <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Administrative lead</div>
            <div className="mt-3 text-lg font-semibold text-slate-900">Aaron Wallace</div>
            <div className="mt-1 text-sm text-slate-600">Responsible for operations, staffing, and campus services.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
