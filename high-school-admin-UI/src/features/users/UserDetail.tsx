// src/features/users/UserDetail.tsx
import { useEffect, type ReactNode, type ComponentType } from 'react'
import { X, Mail, Phone, MapPin, Globe2, Cake, IdCard, CalendarDays, Briefcase, GraduationCap, Users as UsersIcon } from 'lucide-react'
import {
  type SystemUser,
  ROLE_LABELS,
  ROLE_COLORS,
  getFullName,
} from '@/types/user'

interface UserDetailProps {
  user: SystemUser | null
  onClose: () => void
  onEdit?: (user: SystemUser) => void
}

export default function UserDetail({ user, onClose, onEdit }: UserDetailProps) {
  useEffect(() => {
    if (!user) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [user, onClose])

  if (!user) return null

  const roleColor = ROLE_COLORS[user.role]
  const fullName = getFullName(user)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Flat dark scrim — dropped brand-tinted backdrop-blur (an
          off-theme artifact that fought the neumorphic surface). */}
      <button
        aria-label="Close profile"
        onClick={onClose}
        className="absolute inset-0 bg-slate-950/60"
      />

      {/* Drawer — `.glass-strong` supplies bg + elevated shadow.
          The old `glass-strong shadow-2xl` had `shadow-2xl` overriding
          the neumorphic shadow. */}
      <div className="relative h-full w-full max-w-lg overflow-y-auto glass-strong">
        {/* Sticky header — shadow seam replaces the invisible border */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 py-5 shadow-[0_1px_0_var(--neu-shadow-dark)] bg-surface-strong">
          <div className="flex items-center gap-4">
            {user.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt=""
                className="h-14 w-14 rounded-full object-cover shadow-emboss"
              />
            ) : (
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full text-lg font-semibold shadow-sunken ${roleColor.bg} ${roleColor.text}`}
              >
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
            )}
            <div>
              <div className="text-lg font-bold text-fg">{fullName}</div>
              <div className="mt-1 flex items-center gap-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${roleColor.bg} ${roleColor.text} ${roleColor.ring}`}
                >
                  {ROLE_LABELS[user.role]}
                </span>
                {user.status === 'active' ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-semibold text-success">
                    Active
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold text-fg-muted shadow-sunken">
                    Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-2 text-fg-muted hover:text-fg hover:shadow-sunken transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-6 px-6 py-6">
          <Section title="Account">
            <DetailRow icon={IdCard} label="User ID" value={user.id} mono />
            <DetailRow icon={IdCard} label="Username" value={user.username} />
            <DetailRow icon={CalendarDays} label="Created" value={user.createdDate} />
          </Section>

          <Section title="Contact Information">
            <DetailRow icon={Mail} label="Email" value={user.email} />
            <DetailRow icon={Phone} label="Phone" value={user.phone} />
            <DetailRow icon={MapPin} label="Address" value={user.address} />
            <DetailRow icon={Globe2} label="Nationality" value={user.nationality} />
            <DetailRow icon={Phone} label="Emergency Contact" value={user.emergencyContact} />
            <DetailRow icon={Cake} label="Date of Birth" value={user.dateOfBirth} />
          </Section>

          {user.role === 'admin' && (
            <Section title="Employment">
              <DetailRow icon={Briefcase} label="Employee ID" value={user.employeeId} mono />
              <DetailRow icon={Briefcase} label="Department" value={user.department} />
              <DetailRow icon={Briefcase} label="Position" value={user.position} />
            </Section>
          )}

          {user.role === 'teacher' && (
            <>
              <Section title="Employment">
                <DetailRow icon={Briefcase} label="Teacher ID" value={user.teacherId} mono />
                <DetailRow icon={Briefcase} label="Department" value={user.department} />
                <DetailRow icon={GraduationCap} label="Qualification" value={user.qualification} />
                <DetailRow icon={CalendarDays} label="Hire Date" value={user.hireDate} />
                <DetailRow icon={Briefcase} label="Experience" value={`${user.experienceYears} years`} />
              </Section>
              <Section title="Teaching Assignments">
                <BadgeRow label="Subjects" items={user.subjects} />
                <BadgeRow label="Assigned Classes" items={user.assignedClasses} />
              </Section>
            </>
          )}

          {(user.role === 'student' || user.role === 'mazer') && (
            <>
              <Section title="Academic">
                <DetailRow icon={GraduationCap} label="Student ID" value={user.studentId} mono />
                <DetailRow icon={GraduationCap} label="Grade" value={user.grade} />
                <DetailRow icon={GraduationCap} label="Class" value={user.class} />
                <DetailRow icon={CalendarDays} label="Academic Year" value={user.academicYear} />
                <DetailRow icon={CalendarDays} label="Enrollment Date" value={user.enrollmentDate} />
                {user.role === 'mazer' && (
                  <>
                    <DetailRow icon={GraduationCap} label="Assigned Class" value={user.assignedClass} />
                    <DetailRow icon={CalendarDays} label="Appointment Date" value={user.appointmentDate} />
                    {user.endDate && <DetailRow icon={CalendarDays} label="End Date" value={user.endDate} />}
                  </>
                )}
              </Section>

              <Section title="Parent / Guardian">
                {user.fatherName && <DetailRow icon={UsersIcon} label="Father" value={user.fatherName} />}
                {user.motherName && <DetailRow icon={UsersIcon} label="Mother" value={user.motherName} />}
                {user.guardianName && <DetailRow icon={UsersIcon} label="Guardian" value={user.guardianName} />}
                {user.relationship && (
                  <DetailRow icon={UsersIcon} label="Relationship" value={capitalize(user.relationship)} />
                )}
                <DetailRow icon={Phone} label="Parent Phone" value={user.parentPhone} />
                <DetailRow icon={Mail} label="Parent Email" value={user.parentEmail} />
              </Section>
            </>
          )}

          {user.notes && (
            <Section title="Notes">
              <p className="whitespace-pre-line text-sm leading-relaxed text-fg-muted">{user.notes}</p>
            </Section>
          )}
        </div>

        {/* Sticky footer — shadow seam replaces the invisible border */}
        <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 shadow-[0_-1px_0_var(--neu-shadow-dark)] bg-surface-strong">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-semibold text-fg-muted hover:text-fg transition cursor-pointer"
          >
            Close
          </button>
          {/* Was `glass-teal glass-interactive text-white` — glass-teal
              is a raised surface (page-colored), so white text was
              invisible. Converted to a proper brand CTA. */}
          <button
            onClick={() => onEdit?.(user)}
            className="rounded-full bg-brand-600 hover:bg-brand-700 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-brand-600/25 transition cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="glass rounded-2xl p-4">
      <div className="mb-3 text-xs font-bold uppercase tracking-wider text-brand-600 dark:text-brand-400">
        {title}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function DetailRow({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: ComponentType<{ size?: number; className?: string }>
  label: string
  value?: string | null
  mono?: boolean
}) {
  if (!value) return null
  return (
    <div className="flex items-start gap-3">
      <Icon size={16} className="mt-0.5 shrink-0 text-fg-muted/70" />
      <div className="flex min-w-0 flex-1 items-baseline justify-between gap-3">
        <span className="text-xs font-medium text-fg-muted">{label}</span>
        <span className={`truncate text-sm font-medium text-fg ${mono ? 'font-mono text-xs' : ''}`}>
          {value}
        </span>
      </div>
    </div>
  )
}

function BadgeRow({ label, items }: { label: string; items: string[] }) {
  if (!items || items.length === 0) {
    return (
      <div>
        <div className="mb-1.5 text-xs font-medium text-fg-muted">{label}</div>
        <span className="text-sm text-fg-muted/60">None assigned</span>
      </div>
    )
  }
  return (
    <div>
      <div className="mb-1.5 text-xs font-medium text-fg-muted">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full px-2.5 py-1 text-xs font-medium text-fg shadow-sunken"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}