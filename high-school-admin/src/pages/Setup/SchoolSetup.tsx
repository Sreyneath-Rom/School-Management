import { useState } from 'react'
import { Info, Globe, Camera, CheckCircle2, Phone, CalendarDays } from 'lucide-react'
import PageHeading from '@/components/common/PageHeading'

export default function SchoolSetup() {
  const [progress] = useState(85)

  return (
    <div className="space-y-8">
      <PageHeading
        title="School Setup"
        subtitle="Configure the core identity and administrative parameters of your institution."
      />

      <div className="grid gap-6 xl:grid-cols-[1.7fr_1fr]">
        <div className="rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl p-6 ">
          <div className="flex items-center gap-2 text-lg font-bold text-stone-900">
            <Info size={20} className="text-brand-600" />
            School Information
          </div>

          <div className="mt-5 flex flex-col gap-5 rounded-3xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl p-5 sm:flex-row sm:items-center">
            <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border border-dashed bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl text-stone-400">
              <Camera size={22} />
              <button className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl text-white ">
                <Camera size={13} />
              </button>
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-stone-900">Upload School Logo</div>
              <div className="mt-1 text-sm text-stone-500">
                Recommended size: 512×512px. PNG or SVG preferred for high resolution.
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button className="rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-800">
                  Replace Photo
                </button>
                <button className="rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl px-4 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-300">
                  Remove
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                School Name
              </label>
              <input
                defaultValue="St. Andrews International High"
                className="w-full rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                School Code
              </label>
              <input
                defaultValue="SAIH-2024-X"
                className="w-full rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Motto
            </label>
            <input
              defaultValue="Scientia, Virtus, et Excellence"
              className="w-full rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
              Description
            </label>
            <textarea
              rows={3}
              defaultValue="A leading institution dedicated to holistic education and global citizenship. Founded in 1985, St. Andrews provides a rigorous academic environment coupled with diverse extracurricular programs."
              className="w-full resize-none rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl p-6 ">
            <div className="flex items-center gap-2 text-lg font-bold text-stone-900">
              <Globe size={20} className="text-brand-600" />
              Regional Settings
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  Language
                </label>
                <select className="w-full rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  <option>English (United States)</option>
                  <option>Spanish</option>
                  <option>French</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  Time Zone
                </label>
                <select className="w-full rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  <option>(GMT-05:00) Eastern Time</option>
                  <option>(GMT-08:00) Pacific Time</option>
                  <option>(GMT+00:00) London</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">
                  Date Format
                </label>
                <select className="w-full rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl px-4 py-3 text-sm text-stone-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100">
                  <option>DD/MM/YYYY</option>
                  <option>MM/DD/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl p-6 ">
            <div className="text-lg font-bold text-cyan-700">Setup Progress</div>
            <p className="mt-2 text-sm text-cyan-700">
              You have completed {progress}% of your institutional profile.
            </p>
            <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10 shadow-xl backdrop-blur-2xl">
              <div className="h-full rounded-full bg-cyan-700" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-cyan-700">
              <CheckCircle2 size={16} />
              Profile visibility: Public
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl p-6 ">
          <div className="flex items-center gap-2 text-lg font-bold text-stone-900">
            <Phone size={20} className="text-brand-600" />
            Contact Information
          </div>
          <div className="mt-5 space-y-4 text-sm text-stone-600">
            <div className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Address</span>
              <span className="font-medium text-stone-800">1200 Elm Avenue, Lakeside District, Central City</span>
            </div>
            <div className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Phone</span>
              <span className="font-medium text-stone-800">+1 (555) 342-1100</span>
            </div>
            <div className="grid gap-1">
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Website</span>
              <span className="font-medium text-stone-800">standrewsinternational.edu</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl p-6 ">
          <div className="flex items-center gap-2 text-lg font-bold text-stone-900">
            <CalendarDays size={20} className="text-brand-600" />
            Academic Information
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Academic Year</div>
              <div className="mt-2 text-lg font-semibold text-stone-900">2026 – 2027</div>
            </div>
            <div className="rounded-2xl bg-white/10 text-brand-700 shadow-xl backdrop-blur-2xl p-4">
              <div className="text-xs font-semibold uppercase tracking-[0.14em] text-stone-500">Term Start</div>
              <div className="mt-2 text-lg font-semibold text-stone-900">August 12, 2026</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}