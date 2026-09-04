import { apiClient } from '@/lib/apiClient'

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'

export interface AttendanceRecord {
  id: string
  studentId: string
  studentName?: string
  studentCode?: string
  studentAvatar?: string
  grade?: string
  class?: string
  date: string // YYYY-MM-DD
  status: AttendanceStatus
  checkIn?: string | null
  checkOut?: string | null
  note?: string | null
  createdAt?: string
  updatedAt?: string
  student?: {
    id: string
    studentId?: string
    firstName?: string
    lastName?: string
    user?: {
      id: string
      firstName: string
      lastName: string
      email: string
    }
    class?: {
      id: string
      name: string
      gradeLevel: number
    }
  }
}

export interface AttendanceStats {
  date?: string
  total: number
  present: number
  absent: number
  late: number
  excused: number
  attendanceRate: number
  presentToday: number
  absentToday: number
  lateToday: number
  pendingExcuses: number
  perfectAttendanceCount: number
}

export interface BulkMarkPayload {
  date: string
  records: Array<{
    studentId: string
    status: AttendanceStatus
    checkIn?: string | null
    checkOut?: string | null
    note?: string | null
  }>
}

export interface AttendanceFilterParams {
  date?: string
  studentId?: string
  class?: string
  grade?: string
  from?: string
  to?: string
}

export type AttendanceStatusBreakdown = Array<{ status: string; _count: number }>

export const attendanceService = {
  async list(params?: AttendanceFilterParams): Promise<AttendanceRecord[]> {
    const query = new URLSearchParams()
    if (params?.date) query.append('date', params.date)
    if (params?.studentId) query.append('studentId', params.studentId)
    if (params?.class && params.class !== 'all') query.append('class', params.class)
    if (params?.grade && params.grade !== 'all') query.append('grade', params.grade)
    if (params?.from) query.append('from', params.from)
    if (params?.to) query.append('to', params.to)

    const qs = query.toString() ? `?${query.toString()}` : ''
    return apiClient.get<AttendanceRecord[]>(`/attendance${qs}`)
  },

  async getStats(date?: string): Promise<AttendanceStats> {
    const query = date ? `?date=${encodeURIComponent(date)}` : ''
    return apiClient.get<AttendanceStats>(`/attendance/stats${query}`)
  },

  async checkIn(payload: {
    studentId: string
    date: string
    status: AttendanceStatus
    checkIn?: string | null
    checkOut?: string | null
    note?: string | null
  }): Promise<AttendanceRecord> {
    return apiClient.post<AttendanceRecord>('/attendance/check-in', payload)
  },

  async bulkMark(payload: BulkMarkPayload): Promise<{ count: number; records: AttendanceRecord[] }> {
    return apiClient.post<{ count: number; records: AttendanceRecord[] }>('/attendance/bulk', payload)
  },

  async checkOut(studentId: string, date: string, checkOut?: string): Promise<AttendanceRecord> {
    return apiClient.post<AttendanceRecord>('/attendance/check-out', { studentId, date, checkOut })
  },

  async delete(id: string): Promise<void> {
    return apiClient.delete<void>(`/attendance/${id}`)
  },

  async getStatusBreakdown(date?: string): Promise<AttendanceStatusBreakdown> {
    try {
      const stats = await this.getStats(date)
      return [
        { status: 'Present', _count: stats.present ?? stats.presentToday ?? 0 },
        { status: 'Late', _count: stats.late ?? stats.lateToday ?? 0 },
        { status: 'Absent', _count: stats.absent ?? stats.absentToday ?? 0 },
        { status: 'Excused', _count: stats.excused ?? 0 },
      ]
    } catch {
      return [
        { status: 'Present', _count: 0 },
        { status: 'Late', _count: 0 },
        { status: 'Absent', _count: 0 },
      ]
    }
  },
}
