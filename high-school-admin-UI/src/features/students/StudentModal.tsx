// src/features/students/StudentModal.tsx
import React, { useEffect, useState } from 'react'
import { X, GraduationCap } from 'lucide-react'
import type { StudentUser } from '@/types/user'
import type { CreateStudentPayload } from '@/services/studentService'

interface StudentModalProps {
  isOpen: boolean
  isSubmitting: boolean
  studentToEdit: StudentUser | null
  onClose: () => void
  onSubmit: (data: CreateStudentPayload) => void
  grades: string[]
  classes: string[]
}

export const StudentModal: React.FC<StudentModalProps> = ({
  isOpen, isSubmitting, studentToEdit, onClose, onSubmit, grades, classes,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'academic' | 'parent'>('basic')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male')
  const [dateOfBirth, setDateOfBirth] = useState('2009-05-15')
  const [address, setAddress] = useState('')
  const [nationality, setNationality] = useState('American')

  const [studentId, setStudentId] = useState('')
  const [grade, setGrade] = useState('Grade 10')
  const [classSection, setClassSection] = useState('Grade 10 - A')
  const [academicYear, setAcademicYear] = useState('2025-2026')
  const [enrollmentDate, setEnrollmentDate] = useState('2023-08-15')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [role, setRole] = useState<'student' | 'mazer'>('student')

  const [parentName, setParentName] = useState('')
  const [parentRelationship, setParentRelationship] = useState<'father' | 'mother' | 'guardian' | 'other'>('father')
  const [parentPhone, setParentPhone] = useState('')
  const [parentEmail, setParentEmail] = useState('')

  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (studentToEdit) {
      setFirstName(studentToEdit.firstName || '')
      setLastName(studentToEdit.lastName || '')
      setEmail(studentToEdit.email || '')
      setPassword('')
      setPhone(studentToEdit.phone || '')
      setGender(studentToEdit.gender || 'male')
      setDateOfBirth(studentToEdit.dateOfBirth || '2009-05-15')
      setAddress(studentToEdit.address || '')
      setNationality(studentToEdit.nationality || 'American')

      setStudentId(studentToEdit.studentId || studentToEdit.id)
      setGrade(studentToEdit.grade || 'Grade 10')
      setClassSection(studentToEdit.class || 'Grade 10 - A')
      setAcademicYear(studentToEdit.academicYear || '2025-2026')
      setEnrollmentDate(studentToEdit.enrollmentDate || '2023-08-15')
      setStatus(studentToEdit.status || 'active')
      setRole((studentToEdit.role as any) || 'student')

      const pName = studentToEdit.fatherName || studentToEdit.motherName || studentToEdit.guardianName || ''
      setParentName(pName)
      setParentRelationship(studentToEdit.relationship || 'father')
      setParentPhone(studentToEdit.parentPhone || '')
      setParentEmail(studentToEdit.parentEmail || '')
    } else {
      const randomId = `STU${Math.floor(Math.random() * 900000 + 100000)}`
      setFirstName(''); setLastName(''); setEmail(''); setPassword(''); setPhone('')
      setGender('male'); setDateOfBirth('2009-05-15'); setAddress(''); setNationality('American')

      setStudentId(randomId)
      setGrade(grades[0] || 'Grade 10')
      setClassSection(classes[0] || 'Grade 10 - A')
      setAcademicYear('2025-2026')
      setEnrollmentDate(new Date().toISOString().split('T')[0])
      setStatus('active'); setRole('student')

      setParentName(''); setParentRelationship('father'); setParentPhone(''); setParentEmail('')
    }
    setActiveTab('basic')
    setError(null)
  }, [studentToEdit, isOpen, grades, classes])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!firstName.trim() || !lastName.trim()) {
      setError('First name and last name are required.')
      setActiveTab('basic')
      return
    }
    if (!studentId.trim()) {
      setError('Student ID is required.')
      setActiveTab('academic')
      return
    }
    if (!studentToEdit && password.length < 8) {
      setError('A password of at least 8 characters is required for the student account.')
      setActiveTab('basic')
      return
    }

    const payload: CreateStudentPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${studentId.toLowerCase()}@varinhs.edu`,
      password: password || undefined,
      phone: phone.trim(),
      gender,
      dateOfBirth,
      address: address.trim(),
      nationality: nationality.trim(),
      studentId: studentId.trim(),
      grade,
      class: classSection,
      academicYear,
      enrollmentDate,
      status,
      role,
      fatherName: parentRelationship === 'father' ? parentName.trim() : undefined,
      motherName: parentRelationship === 'mother' ? parentName.trim() : undefined,
      guardianName: parentRelationship === 'guardian' ? parentName.trim() : undefined,
      parentPhone: parentPhone.trim(),
      parentEmail: parentEmail.trim(),
      relationship: parentRelationship,
    }

    onSubmit(payload)
  }

  // Common input classes — inputs inherit the sunken-well look from globals.css
  const inputBase = 'w-full rounded-2xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-fg focus:outline-none focus:ring-2 focus:ring-brand-500'
  const labelBase = 'block text-xs font-bold text-fg-muted mb-1.5'

  return (
    <div
      // Flat scrim, no backdrop-blur.
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* `.glass-strong` supplies bg + radius + elevated shadow. The
          previous glassmorphism stack (bg-white/95 backdrop-blur-2xl
          border-white/80 shadow-2xl) fought the flat surface treatment. */}
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] glass-strong animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-linear-to-br from-brand-400/20 via-info/15 to-transparent blur-3xl opacity-50" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4.5 shadow-[0_1px_0_var(--neu-shadow-dark)]">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-info text-white shadow-md shadow-brand-500/25">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-fg">
                {studentToEdit ? 'Edit Student Record' : 'Register New Student'}
              </h3>
              <p className="text-xs text-fg-muted mt-0.5">
                {studentToEdit
                  ? `Editing profile for ${studentToEdit.firstName} ${studentToEdit.lastName}`
                  : 'Enroll and assign academic credentials to student roster'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-fg-muted transition hover:text-fg hover:shadow-sunken cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab bar — sunken tray, active segment brand-filled */}
        <div className="relative z-10 flex gap-2 px-6 py-2.5 shadow-[0_1px_0_var(--neu-shadow-dark)]">
          {[
            { id: 'basic', label: '1. Personal Details' },
            { id: 'academic', label: '2. Academic Enrollment' },
            { id: 'parent', label: '3. Guardian & Contact' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/25'
                  : 'text-fg-muted hover:text-fg shadow-sunken'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Semantic error — tinted bg + border is the signal, kept */}
            {error && (
              <div className="rounded-2xl border border-error/25 bg-error/10 p-3 text-xs font-semibold text-error">
                {error}
              </div>
            )}

            {activeTab === 'basic' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelBase}>
                      First Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text" required value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Alexander"
                      className={inputBase}
                    />
                  </div>
                  {!studentToEdit && (
                    <div>
                      <label className={labelBase}>
                        Account Password <span className="text-error">*</span>
                      </label>
                      <input
                        type="password" required minLength={8} value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className={inputBase}
                      />
                    </div>
                  )}
                  <div>
                    <label className={labelBase}>
                      Last Name <span className="text-error">*</span>
                    </label>
                    <input
                      type="text" required value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Vance"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelBase}>Email Address</label>
                    <input
                      type="email" value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@varinhs.edu"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Phone Number</label>
                    <input
                      type="tel" value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555-303-1000"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelBase}>Gender</label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className={inputBase}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelBase}>Date of Birth</label>
                    <input
                      type="date" value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Nationality</label>
                    <input
                      type="text" value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="American"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelBase}>Home Address</label>
                  <input
                    type="text" value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address, City, State"
                    className={inputBase}
                  />
                </div>
              </div>
            )}

            {activeTab === 'academic' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelBase}>
                      Student ID <span className="text-error">*</span>
                    </label>
                    <input
                      type="text" required value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. STU123456"
                      className={`${inputBase} font-mono font-bold`}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Academic Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className={inputBase}
                    >
                      <option value="student">Student</option>
                      <option value="mazer">Mazer (Class Representative)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelBase}>Grade Level</label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className={inputBase}
                    >
                      {grades.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelBase}>Class Section</label>
                    <select
                      value={classSection}
                      onChange={(e) => setClassSection(e.target.value)}
                      className={inputBase}
                    >
                      {classes.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className={labelBase}>Academic Year</label>
                    <input
                      type="text" value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="2025-2026"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Enrollment Date</label>
                    <input
                      type="date" value={enrollmentDate}
                      onChange={(e) => setEnrollmentDate(e.target.value)}
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Enrollment Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className={inputBase}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'parent' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelBase}>Relationship</label>
                    <select
                      value={parentRelationship}
                      onChange={(e) => setParentRelationship(e.target.value as any)}
                      className={inputBase}
                    >
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="guardian">Legal Guardian</option>
                      <option value="other">Other Relative</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelBase}>Parent / Guardian Full Name</label>
                    <input
                      type="text" value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Robert Vance"
                      className={inputBase}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelBase}>Guardian Phone Number</label>
                    <input
                      type="tel" value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+1 555-303-1011"
                      className={inputBase}
                    />
                  </div>
                  <div>
                    <label className={labelBase}>Guardian Email Address</label>
                    <input
                      type="email" value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className={inputBase}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer — shadow seam */}
          <div className="flex items-center justify-between px-6 py-4 shadow-[0_-1px_0_var(--neu-shadow-dark)]">
            <div>
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'parent' ? 'academic' : 'basic')}
                  className="glass-sm glass-interactive rounded-2xl px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer"
                >
                  Previous Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="glass-sm glass-interactive rounded-2xl px-4 py-2 text-xs font-bold text-fg-muted hover:text-fg cursor-pointer"
              >
                Cancel
              </button>

              {activeTab !== 'parent' ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab === 'basic' ? 'academic' : 'parent')}
                  className="rounded-2xl bg-linear-to-r from-brand-600 to-info px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600 transition cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-linear-to-r from-brand-600 to-info px-5 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/25 hover:from-brand-700 hover:to-brand-600 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : studentToEdit ? 'Save Changes' : 'Register Student'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}