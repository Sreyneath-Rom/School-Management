import React, { useEffect, useState } from 'react'
import { X, GraduationCap, User, Phone, Mail, MapPin, Calendar, Heart, Sparkles } from 'lucide-react'
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
  isOpen,
  isSubmitting,
  studentToEdit,
  onClose,
  onSubmit,
  grades,
  classes,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'academic' | 'parent'>('basic')

  // Basic Info
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('male')
  const [dateOfBirth, setDateOfBirth] = useState('2009-05-15')
  const [address, setAddress] = useState('')
  const [nationality, setNationality] = useState('American')

  // Academic Info
  const [studentId, setStudentId] = useState('')
  const [grade, setGrade] = useState('Grade 10')
  const [classSection, setClassSection] = useState('Grade 10 - A')
  const [academicYear, setAcademicYear] = useState('2025-2026')
  const [enrollmentDate, setEnrollmentDate] = useState('2023-08-15')
  const [status, setStatus] = useState<'active' | 'inactive'>('active')
  const [role, setRole] = useState<'student' | 'mazer'>('student')

  // Parent Info
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

      const pName =
        studentToEdit.fatherName ||
        studentToEdit.motherName ||
        studentToEdit.guardianName ||
        ''
      setParentName(pName)
      setParentRelationship(studentToEdit.relationship || 'father')
      setParentPhone(studentToEdit.parentPhone || '')
      setParentEmail(studentToEdit.parentEmail || '')
    } else {
      const randomId = `STU${Math.floor(Math.random() * 900000 + 100000)}`
      setFirstName('')
      setLastName('')
      setEmail('')
      setPassword('')
      setPhone('')
      setGender('male')
      setDateOfBirth('2009-05-15')
      setAddress('')
      setNationality('American')

      setStudentId(randomId)
      setGrade(grades[0] || 'Grade 10')
      setClassSection(classes[0] || 'Grade 10 - A')
      setAcademicYear('2025-2026')
      setEnrollmentDate(new Date().toISOString().split('T')[0])
      setStatus('active')
      setRole('student')

      setParentName('')
      setParentRelationship('father')
      setParentPhone('')
      setParentEmail('')
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-md animate-in fade-in duration-200"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-white/80 bg-white/95 shadow-2xl backdrop-blur-2xl animate-in zoom-in-95 duration-200 dark:border-slate-800/80 dark:bg-slate-900/95"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Soft Ambient Light in Top-Right Corner */}
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-linear-to-br from-blue-400/20 via-cyan-400/15 to-transparent blur-3xl opacity-70" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-slate-100 bg-white/60 px-6 py-4.5 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-500/25">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {studentToEdit ? 'Edit Student Record' : 'Register New Student'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {studentToEdit
                  ? `Editing profile for ${studentToEdit.firstName} ${studentToEdit.lastName}`
                  : 'Enroll and assign academic credentials to student roster'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="relative z-10 flex gap-2 border-b border-slate-100 bg-slate-50/70 px-6 py-2.5 dark:border-slate-800/80 dark:bg-slate-800/40">
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
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200/60 dark:text-slate-400 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="relative z-10 flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {error && (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {error}
              </div>
            )}

            {/* TAB 1: BASIC INFORMATION */}
            {activeTab === 'basic' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      First Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="e.g. Alexander"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  {!studentToEdit && (
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                        Account Password <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="password"
                        required
                        minLength={8}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="At least 8 characters"
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      />
                    </div>
                  )}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Last Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="e.g. Vance"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@varinhs.edu"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 555-303-1000"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Gender
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Nationality
                    </label>
                    <input
                      type="text"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="American"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Home Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street Address, City, State"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: ACADEMIC ENROLLMENT */}
            {activeTab === 'academic' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Student ID <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. STU123456"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 font-mono text-xs sm:text-sm font-bold text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Academic Role
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as any)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="student">Student</option>
                      <option value="mazer">Mazer (Class Representative)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Grade Level
                    </label>
                    <select
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {grades.map((g) => (
                        <option key={g} value={g}>
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Class Section
                    </label>
                    <select
                      value={classSection}
                      onChange={(e) => setClassSection(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      {classes.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Academic Year
                    </label>
                    <input
                      type="text"
                      value={academicYear}
                      onChange={(e) => setAcademicYear(e.target.value)}
                      placeholder="2025-2026"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Enrollment Date
                    </label>
                    <input
                      type="date"
                      value={enrollmentDate}
                      onChange={(e) => setEnrollmentDate(e.target.value)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Enrollment Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as any)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: GUARDIAN / PARENT DETAILS */}
            {activeTab === 'parent' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Relationship
                    </label>
                    <select
                      value={parentRelationship}
                      onChange={(e) => setParentRelationship(e.target.value as any)}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3 py-2.5 text-xs font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    >
                      <option value="father">Father</option>
                      <option value="mother">Mother</option>
                      <option value="guardian">Legal Guardian</option>
                      <option value="other">Other Relative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Parent / Guardian Full Name
                    </label>
                    <input
                      type="text"
                      value={parentName}
                      onChange={(e) => setParentName(e.target.value)}
                      placeholder="e.g. Robert Vance"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Guardian Phone Number
                    </label>
                    <input
                      type="tel"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      placeholder="+1 555-303-1011"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Guardian Email Address
                    </label>
                    <input
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="parent@example.com"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs sm:text-sm font-medium text-slate-900 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/60 px-6 py-4 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/60">
            <div>
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === 'parent' ? 'academic' : 'basic')
                  }
                  className="rounded-2xl border border-slate-200/80 bg-slate-100/80 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  Previous Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl border border-slate-200/80 bg-slate-100/80 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 transition cursor-pointer dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                Cancel
              </button>

              {activeTab !== 'parent' ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === 'basic' ? 'academic' : 'parent')
                  }
                  className="rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer"
                >
                  Next Step
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-2xl bg-linear-to-r from-blue-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting
                    ? 'Saving...'
                    : studentToEdit
                    ? 'Save Changes'
                    : 'Register Student'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
