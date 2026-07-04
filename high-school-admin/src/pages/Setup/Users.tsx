import { Plus, Search, Users2, ShieldCheck, ClipboardCheck, User, Bell, CalendarDays, Pencil, Trash2, Eye } from '../../shims/lucide-react'
import PageHeading from '../../components/common/PageHeading'

const userStats = [
  {
    title: 'Total users',
    value: '248',
    icon: Users2,
    accent: 'bg-sky-50 text-sky-700',
  },
  {
    title: 'Active staff',
    value: '112',
    icon: ShieldCheck,
    accent: 'bg-violet-50 text-violet-700',
  },
  {
    title: 'Pending invites',
    value: '9',
    icon: ClipboardCheck,
    accent: 'bg-emerald-50 text-emerald-700',
  },
  {
    title: 'Recently active',
    value: '68',
    icon: Bell,
    accent: 'bg-amber-50 text-amber-700',
  },
]

const users = [
  {
    id: 'u1',
    name: 'Arianna Wells',
    email: 'arianna.wells@riverwood.edu',
    role: 'Administrator',
    department: 'Leadership',
    status: 'Active',
    lastSeen: '5m ago',
  },
  {
    id: 'u2',
    name: 'Noah Grant',
    email: 'noah.grant@riverwood.edu',
    role: 'Teacher',
    department: 'Science',
    status: 'Active',
    lastSeen: '23m ago',
  },
  {
    id: 'u3',
    name: 'Sophia Blake',
    email: 'sophia.blake@riverwood.edu',
    role: 'Counselor',
    department: 'Student Services',
    status: 'Invited',
    lastSeen: '—',
  },
  {
    id: 'u4',
    name: 'Julian Price',
    email: 'julian.price@riverwood.edu',
    role: 'Academic Head',
    department: 'Mathematics',
    status: 'Active',
    lastSeen: '1h ago',
  },
]

export default function Users() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <PageHeading
            title="Users"
            subtitle="Manage account access, roles, and activity for staff and administrators."
          />
        </div>

        <button className="inline-flex items-center gap-2 rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800">
          <Plus size={18} />
          Invite User
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {userStats.map((item) => {
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
              placeholder="Search users by name, email, or role"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
              <option>All roles</option>
              <option>Administrator</option>
              <option>Teacher</option>
              <option>Counselor</option>
              <option>Academic Head</option>
            </select>
            <select className="rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100">
              <option>All status</option>
              <option>Active</option>
              <option>Invited</option>
              <option>Disabled</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.8fr_1fr]">
        <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.16em] text-slate-500">Name</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.16em] text-slate-500">Role</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.16em] text-slate-500">Department</th>
                <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.16em] text-slate-500">Status</th>
                <th className="px-6 py-4 text-right font-semibold uppercase tracking-[0.16em] text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
                        <User size={18} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{user.name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-700">{user.role}</td>
                  <td className="px-6 py-5 text-slate-700">{user.department}</td>
                  <td className="px-6 py-5">
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-600 transition hover:bg-slate-100">
                        <Eye size={16} />
                      </button>
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
              <div className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">User details</div>
              <div className="mt-2 text-lg font-semibold text-slate-900">Quick insights</div>
            </div>
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700">
              <CalendarDays size={22} />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Most recent login</div>
              <div className="mt-2 text-sm text-slate-600">Arianna Wells signed in 5 minutes ago.</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Teams with highest activity</div>
              <div className="mt-2 text-sm text-slate-600">Leadership and Science have the most active users today.</div>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">Pending approvals</div>
              <div className="mt-2 text-sm text-slate-600">9 invites are pending acceptance by invited staff members.</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-3 text-slate-700">
              <Users2 size={18} />
              <span className="text-sm font-semibold">Role distribution</span>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Administrator</span>
                <span className="font-semibold text-slate-900">7</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Teacher</span>
                <span className="font-semibold text-slate-900">112</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Counselor</span>
                <span className="font-semibold text-slate-900">3</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
