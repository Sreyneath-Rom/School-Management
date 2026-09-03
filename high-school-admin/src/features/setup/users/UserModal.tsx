// src/features/setup/users/UserModal.tsx
import React, { useEffect, useState } from 'react'
import { X, UserPlus, User, Shield, GraduationCap, School } from 'lucide-react'
import Button from '@/components/common/Button'
import type { SystemUser, UserRole } from '@/types/user'
import type { CreateUserPayload } from '@/services/userService'

interface UserModalProps {
  isOpen: boolean
  isSubmitting: boolean
  userToEdit: SystemUser | null
  onClose: () => void
  onSubmit: (data: CreateUserPayload) => void
  roleIds: Partial<Record<UserRole, string>>
}

const ROLES: { id: UserRole; label: string; icon: any }[] = [
  { id: 'admin', label: 'Admin / Staff', icon: Shield },
  { id: 'teacher', label: 'Teacher', icon: School },
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'parent', label: 'Parent', icon: User },
]

export const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  isSubmitting,
  userToEdit,
  onClose,
  onSubmit,
  roleIds,
}) => {
  const [role, setRole] = useState<UserRole>('student')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('female')
  const [dateOfBirth, setDateOfBirth] = useState('2008-05-12')
  const [address, setAddress] = useState('')

  // Admin
  const [department, setDepartment] = useState('Administration')
  const [position, setPosition] = useState('Staff')

  // Teacher
  const [qualification, setQualification] = useState("Bachelor's Degree")

  // Student / Mazer
  const [grade, setGrade] = useState('Grade 10')
  const [className, setClassName] = useState('10-A')
  const [academicYear, setAcademicYear] = useState('2025-2026')

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (userToEdit) {
      setRole(userToEdit.role)
      setFirstName(userToEdit.firstName)
      setLastName(userToEdit.lastName)
      setEmail(userToEdit.email)
      setPassword('')
      setPhone(userToEdit.phone || '')
      setStatus(userToEdit.status)
      setGender(userToEdit.gender || 'other')
      setDateOfBirth(userToEdit.dateOfBirth || '2008-01-01')
      setAddress(userToEdit.address || '')

      if (userToEdit.role === 'admin') {
        setDepartment(userToEdit.department || 'Administration')
        setPosition(userToEdit.position || 'Staff')
      } else if (userToEdit.role === 'teacher') {
        setDepartment(userToEdit.department || 'Science')
        setQualification(userToEdit.qualification || "Bachelor's Degree")
      } else {
        setGrade((userToEdit as any).grade || 'Grade 10')
        setClassName((userToEdit as any).class || '10-A')
        setAcademicYear((userToEdit as any).academicYear || '2025-2026')
      }
    } else {
      setRole('student')
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setPhone('')
      setStatus('active')
      setGender('female')
      setDateOfBirth('2008-05-12')
      setAddress('')
      setDepartment('Administration')
      setPosition('Staff')
      setQualification("Bachelor's Degree")
      setGrade('Grade 10')
      setClassName('10-A')
      setAcademicYear('2025-2026')
    }
    setError(null)
  }, [userToEdit, isOpen])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim() || !email.trim() || (!userToEdit && password.length < 8)) {
      setError(userToEdit ? 'First name, last name, and email are required' : 'Enter a password with at least 8 characters')
      return
    }

    if (!userToEdit && !roleIds[role]) {
      setError('The selected role is not available from the server')
      return
    }

    onSubmit({
      role,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password: password || 'unused-on-update',
      roleId: roleIds[role] || '',
      phone: phone.trim(),
      status,
      gender,
      dateOfBirth,
      address: address.trim(),
      department: role === 'admin' || role === 'teacher' ? department : undefined,
      position: role === 'admin' ? position : undefined,
      qualification: role === 'teacher' ? qualification : undefined,
      grade: role === 'student' || role === 'mazer' ? grade : undefined,
      class: role === 'student' || role === 'mazer' ? className : undefined,
      academicYear: role === 'student' || role === 'mazer' ? academicYear : undefined,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[30px] glass-strong p-6 sm:p-7 shadow-2xl border border-text-main/15">
        <div className="flex items-center justify-between pb-4 border-b border-text-main/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-md shadow-brand-600/20">
              <UserPlus size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-text-main">
                {userToEdit ? 'Edit User Profile' : 'Register New User'}
              </h2>
              <p className="text-xs text-text-main/55">Create or modify school system user credentials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-text-main/50 hover:bg-text-main/10 hover:text-text-main transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {error && (
            <div className="rounded-2xl bg-error/10 border border-error/20 p-3 text-xs text-error">
              {error}
            </div>
          )}

          {/* Role selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-2">
              System Role
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {ROLES.map((r) => {
                const Icon = r.icon
                const isSelected = role === r.id
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id)}
                    className={`flex flex-col items-center justify-center rounded-2xl p-3 text-xs font-bold transition cursor-pointer border ${
                      isSelected
                        ? 'bg-brand-500/20 border-brand-500 text-brand-400 ring-2 ring-brand-500/20'
                        : 'bg-text-main/5 border-text-main/10 text-text-main/70 hover:border-text-main/20'
                    }`}
                  >
                    <Icon size={18} className="mb-1" />
                    <span>{r.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                First Name *
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Chen"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sarah.chen@varinhs.edu"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-201-3344"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>
          </div>

          {!userToEdit && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Initial Password *
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              />
            </div>
          )}

          {/* Role specific fields */}
          {role === 'admin' && (
            <div className="grid gap-4 sm:grid-cols-2 rounded-2xl bg-text-main/5 p-3.5 border border-text-main/10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                  Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Administration"
                  className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2 text-sm text-text-main outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                  Position Title
                </label>
                <input
                  type="text"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="e.g. Principal / Registrar"
                  className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2 text-sm text-text-main outline-none transition focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {role === 'teacher' && (
            <div className="grid gap-4 sm:grid-cols-2 rounded-2xl bg-text-main/5 p-3.5 border border-text-main/10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                  Teaching Department
                </label>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="e.g. Mathematics"
                  className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2 text-sm text-text-main outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                  Qualification
                </label>
                <input
                  type="text"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  placeholder="e.g. Master of Science"
                  className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2 text-sm text-text-main outline-none transition focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {(role === 'student' || role === 'mazer') && (
            <div className="grid gap-4 sm:grid-cols-3 rounded-2xl bg-text-main/5 p-3.5 border border-text-main/10">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                  Grade Level
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-3 py-2 text-sm text-text-main outline-none transition focus:border-brand-500"
                >
                  <option value="Grade 9" className="bg-slate-800 text-white">Grade 9</option>
                  <option value="Grade 10" className="bg-slate-800 text-white">Grade 10</option>
                  <option value="Grade 11" className="bg-slate-800 text-white">Grade 11</option>
                  <option value="Grade 12" className="bg-slate-800 text-white">Grade 12</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                  Class Cohort
                </label>
                <input
                  type="text"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="e.g. 10-A"
                  className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-3 py-2 text-sm text-text-main outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                  Academic Year
                </label>
                <input
                  type="text"
                  value={academicYear}
                  onChange={(e) => setAcademicYear(e.target.value)}
                  placeholder="2025-2026"
                  className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-3 py-2 text-sm text-text-main outline-none transition focus:border-brand-500"
                />
              </div>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Account Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              >
                <option value="active" className="bg-slate-800 text-white">Active</option>
                <option value="inactive" className="bg-slate-800 text-white">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-text-main/60 mb-1.5">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full rounded-2xl border border-text-main/15 bg-text-main/5 px-4 py-2.5 text-sm text-text-main outline-none transition focus:border-brand-500"
              >
                <option value="female" className="bg-slate-800 text-white">Female</option>
                <option value="male" className="bg-slate-800 text-white">Male</option>
                <option value="other" className="bg-slate-800 text-white">Other</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-text-main/10 flex items-center justify-end gap-3">
            <Button variant="glass" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              variant="solid"
              type="submit"
              disabled={isSubmitting || !firstName.trim() || !lastName.trim() || !email.trim()}
            >
              {isSubmitting ? 'Saving...' : userToEdit ? 'Update User' : 'Register User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
