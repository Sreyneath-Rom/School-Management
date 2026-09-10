export interface ExtendedStudentProfile {
  id: string
  name: string
  firstName: string
  lastName: string
  avatarUrl?: string
  rollNo: string
  studentId: string
  gradeLevel: string
  grade: string
  class: string
  dateOfBirth: string
  gender: string
  email: string
  phone: string
  address: string
  nationality: string
  parentName: string
  parentPhone: string
  parentEmail: string
  emergencyContact: string
  relationship: string
  enrollmentDate: string
  bloodGroup: string
  gpa: number
  attendanceRate: number
  feesStatus: 'Paid' | 'Pending' | 'Partial'
  status: 'active' | 'inactive'
  busRoute?: string
  courses?: Array<{
    code: string
    name: string
    teacher: string
    grade: string
    score: number
    credits: number
  }>
}
