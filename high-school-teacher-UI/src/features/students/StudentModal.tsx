// src/features/students/StudentModal.tsx
import React, { useEffect, useState } from 'react'
import { X, GraduationCap, User, Phone, Mail, MapPin, Calendar, Heart } from 'lucide-react'
import Button from '@/components/common/Button'
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

    const payload: CreateStudentPayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim() || `${firstName.toLowerCase()}.${lastName.toLowerCase()}@varinhs.edu`,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-3xl border border-border-card/60 bg-surface-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-card/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600 dark:text-brand-400">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-text-main">
                {studentToEdit ? 'Edit Student Record' : 'Register New Student'}
              </h3>
              <p className="text-xs text-text-main/55">
                {studentToEdit
                  ? `Editing details for ${studentToEdit.firstName} ${studentToEdit.lastName}`
                  : 'Add a new enrolled student to the school roster'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-text-main/40 transition hover:bg-surface-base hover:text-text-main"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border-card/60 px-6 pt-2 bg-surface-base/40 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`border-b-2 px-4 py-2.5 transition ${
              activeTab === 'basic'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-text-main/60 hover:text-text-main'
            }`}
          >
            1. Personal Info
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('academic')}
            className={`border-b-2 px-4 py-2.5 transition ${
              activeTab === 'academic'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-text-main/60 hover:text-text-main'
            }`}
          >
            2. Academic Enrollment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('parent')}
            className={`border-b-2 px-4 py-2.5 transition ${
              activeTab === 'parent'
                ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                : 'border-transparent text-text-main/60 hover:text-text-main'
            }`}
          >
            3. Guardian / Contact
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-y-auto p-6 space-y-4">
          {error && (
            <div className="rounded-xl bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* TAB 1: BASIC INFORMATION */}
          {activeTab === 'basic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Alexander"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-sm text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Vance"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-sm text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@varinhs.edu"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-sm text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-303-1000"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-sm text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3 py-2 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Date of Birth</label>
                  <input
                    type="date"
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3 py-1.5 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Nationality</label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="American"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-main mb-1">Home Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street Address, City, State"
                  className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-sm text-text-main focus:border-brand-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: ACADEMIC ENROLLMENT */}
          {activeTab === 'academic' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">
                    Student ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. STU123456"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 font-mono text-sm text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Academic Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3 py-2 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
                  >
                    <option value="student">Student</option>
                    <option value="mazer">Mazer (Class Representative)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Grade Level</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3 py-2 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
                  >
                    {grades.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Class Section</label>
                  <select
                    value={classSection}
                    onChange={(e) => setClassSection(e.target.value)}
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3 py-2 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
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
                  <label className="block text-xs font-medium text-text-main mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    placeholder="2025-2026"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Enrollment Date</label>
                  <input
                    type="date"
                    value={enrollmentDate}
                    onChange={(e) => setEnrollmentDate(e.target.value)}
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3 py-1.5 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Enrollment Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3 py-2 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
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
            <div className="space-y-4 animate-fadeIn">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">Relationship</label>
                  <select
                    value={parentRelationship}
                    onChange={(e) => setParentRelationship(e.target.value as any)}
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3 py-2 text-xs font-medium text-text-main focus:border-brand-500 focus:outline-none"
                  >
                    <option value="father">Father</option>
                    <option value="mother">Mother</option>
                    <option value="guardian">Legal Guardian</option>
                    <option value="other">Other Relative</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">
                    Parent / Guardian Full Name
                  </label>
                  <input
                    type="text"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    placeholder="e.g. Robert Vance"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-sm text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">
                    Guardian Phone Number
                  </label>
                  <input
                    type="tel"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    placeholder="+1 555-303-1011"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-sm text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-main mb-1">
                    Guardian Email Address
                  </label>
                  <input
                    type="email"
                    value={parentEmail}
                    onChange={(e) => setParentEmail(e.target.value)}
                    placeholder="parent@example.com"
                    className="w-full rounded-xl border border-border-card bg-surface-base px-3.5 py-2 text-sm text-text-main focus:border-brand-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="mt-6 flex items-center justify-between border-t border-border-card/60 pt-4">
            <div>
              {activeTab !== 'basic' && (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === 'parent' ? 'academic' : 'basic')
                  }
                  className="rounded-xl border border-border-card px-4 py-2 text-xs font-medium text-text-main hover:bg-surface-base"
                >
                  Previous Step
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-border-card px-4 py-2 text-xs font-medium text-text-main hover:bg-surface-base"
              >
                Cancel
              </button>

              {activeTab !== 'parent' ? (
                <button
                  type="button"
                  onClick={() =>
                    setActiveTab(activeTab === 'basic' ? 'academic' : 'parent')
                  }
                  className="rounded-xl bg-brand-600 px-4 py-2 text-xs font-medium text-white shadow-sm hover:bg-brand-700"
                >
                  Next Step
                </button>
              ) : (
                <Button type="submit" variant="solid" disabled={isSubmitting}>
                  {studentToEdit ? 'Save Changes' : 'Register Student'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
