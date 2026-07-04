import { Plus, Search, ShieldCheck, UserCog, Users2, ClipboardCheck, FileClock, Pencil, Trash2 } from '../../shims/lucide-react'
import PageHeading from '../../components/common/PageHeading'

const roles = [
  {
    id: 'r1',
    name: 'Administrator',
    description: 'Full access to school settings, users, and reports.',
    users: 7,
    permissions: ['Manage users', 'Edit settings', 'View reports'],
    badge: 'Primary',
  },
  {
    id: 'r2',
    name: 'Academic Head',
    description: 'Oversees curriculum, classes, and teacher assignments.',
    users: 4,
    permissions: ['Manage classes', 'Approve lessons', 'Grade review'],
    badge: 'Core',
  },
  {
    id: 'r3',
    name: 'Teacher',
    description: 'Access to lesson plans, grades, and student engagement tools.',
    users: 32,
    permissions: ['Manage lessons', 'Submit grades', 'View attendance'],
    badge: 'Standard',
  },
  {
    id: 'r4',
    name: 'Counselor',
    description: 'Supports student wellbeing and academic advising.',
    users: 3,
    permissions: ['View student profiles', 'Manage referrals'],
    badge: 'Support',
  },
]

const summaryCards = [
  {
    title: 'Total roles',
    value: '4',
    icon: ShieldCheck,
    accent: 'bg-slate-100 text-slate-700',
  },
  {
    title: 'Active users',
    value: '46',
    icon: Users2,
    accent: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Core roles',
    value: '2',
    icon: UserCog,
    accent: 'bg-violet-50 text-violet-700',
  },
  {
    title: 'Permission sets',
    value: '18',
    icon: ClipboardCheck,
    accent: 'bg-emerald-50 text-emerald-700',
  },
]

export default function Roles() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <PageHeading
            title="Roles & Permissions"
            subtitle="Define user roles, assign access levels, and manage who can do what across the school system."
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
          <Plus size={18} />
          Add New Role
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => {
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
              placeholder="Search roles or permissions..."
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <select className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
              <option>All roles</option>
              <option>Primary</option>
              <option>Core</option>
              <option>Standard</option>
              <option>Support</option>
            </select>
            <button className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              <FileClock size={16} />
              Audit Log
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.16em] text-slate-500">Role</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.16em] text-slate-500">Users</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.16em] text-slate-500">Permissions</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.16em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {roles.map((role) => (
                <tr key={role.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="font-semibold text-slate-900">{role.name}</div>
                    <div className="mt-1 text-sm text-slate-500">{role.description}</div>
                  </td>
                  <td className="px-6 py-5 text-slate-700">{role.users}</td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <span key={permission} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition hover:bg-slate-100">
                        <Pencil size={16} />
                      </button>
                      <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Role insights</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Permission health</div>
            </div>
            <ShieldCheck size={22} className="text-slate-500" />
          </div>

          <div className="mt-6 space-y-5">
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm text-slate-600">Most common role</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">Teacher</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm text-slate-600">Pending review</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">2 roles</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm text-slate-600">Role changes this month</div>
              <div className="mt-2 text-xl font-semibold text-slate-900">5 updates</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3 text-slate-700">
              <UserCog size={18} />
              <span className="text-sm font-semibold">Role ownership</span>
            </div>
            <div className="mt-4 text-sm text-slate-600">
              Assign a trusted administrator to keep role permissions aligned with school policy and simplify future audits.
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
