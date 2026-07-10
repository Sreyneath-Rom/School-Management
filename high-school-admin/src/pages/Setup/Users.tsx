import { useState } from 'react'
import { UserPlus, Search, SlidersHorizontal, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeading from '../../components/common/PageHeading'

const tabs = ['All Users', 'Teachers', 'Students', 'Mazers', 'Admins']

const roleStyles: Record<string, string> = {
  Teacher: 'bg-brand-100 text-brand-700',
  Student: 'bg-emerald-100 text-emerald-700',
  Mazer: 'bg-amber-100 text-amber-700',
  Admin: 'bg-stone-200 text-stone-700',
}

const users = [
  {
    id: 'u1',
    name: 'Dr. Julian Vane',
    email: 'julian.vane@edumanage.com',
    role: 'Teacher',
    regId: 'TCH-8821',
    classroom: '12B',
    status: 'Active',
    lastLogin: '2 mins ago',
  },
  {
    id: 'u2',
    name: 'Sarah Jenkins',
    email: 's.jenkins@stu.edumanage.com',
    role: 'Student',
    regId: 'STU-4509',
    classroom: '12B',
    status: 'Active',
    lastLogin: 'Today, 08:45 AM',
  },
  {
    id: 'u3',
    name: 'Markus Thoren',
    email: 'markus.t@mazer.edu',
    role: 'Mazer',
    regId: 'MAZ-1102',
    classroom: '12B',
    status: 'Inactive',
    lastLogin: '3 days ago',
  },
  {
    id: 'u4',
    name: 'Alex Rivers',
    email: 'admin.rivers@edumanage.com',
    role: 'Admin',
    regId: 'ADM-0001',
    classroom: '—',
    status: 'Active',
    lastLogin: 'Just now',
  },
]

export default function Users() {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PageHeading title="User Management" subtitle="View, filter, and manage all academic system participants." />
        <button className="inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-700/20 transition hover:bg-brand-800">
          <UserPlus size={17} />
          Create New User
        </button>
      </div>

      <div className="flex flex-col gap-4 rounded-[28px] glass-sm p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-1 rounded-2xl bg-stone-50 p-1">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                activeTab === tab ? 'bg-white text-brand-700 shadow-sm' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-1 items-center gap-3 lg:justify-end">
          <div className="relative w-full max-w-xs">
            <Search size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by name, email, or registration ID..."
              className="w-full rounded-full border border-stone-200 bg-stone-50 py-2.5 pl-11 pr-4 text-sm text-stone-700 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <button className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100">
            <SlidersHorizontal size={16} />
            Advanced Filters
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-[28px] glass-sm">
        <table className="min-w-[780px] w-full divide-y divide-stone-100 text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">User</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Role</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Classroom</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Status</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Last Login</th>
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {users.map((user) => (
              <tr key={user.id} className="transition hover:bg-stone-50">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-sm font-semibold text-stone-500">
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900">{user.name}</div>
                      <div className="text-sm text-stone-500">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleStyles[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-5 text-stone-600">{user.regId}</td>
                <td className="px-6 py-5 text-stone-600">{user.classroom}</td>
                <td className="px-6 py-5">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-stone-700">
                    <span
                      className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-stone-400'}`}
                    />
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-stone-500">{user.lastLogin}</td>
                <td className="px-6 py-5 text-right">
                  <button className="rounded-full p-1.5 text-stone-400 transition hover:bg-stone-100 hover:text-stone-700">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-stone-100 px-6 py-4">
          <div className="text-sm text-stone-500">Showing 1 to 10 of 156 users</div>
          <div className="flex items-center gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                  p === 1 ? 'bg-brand-700 text-white' : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {p}
              </button>
            ))}
            <span className="px-1 text-stone-400">...</span>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-stone-600 transition hover:bg-stone-100">
              16
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition hover:bg-stone-100">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}