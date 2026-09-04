import type {
  StatCard,
  AttendanceDay,
  EnrollmentSlice,
  EventItem,
  ActivityItem,
  LeaveRequestItem,
  AnnouncementItem,
  NavSection,
} from '../types'

export const statCards: StatCard[] = [
  {
    id: 'students',
    label: 'Total Students',
    value: '1,284',
    delta: '2.4%',
    deltaDirection: 'up',
    deltaLabel: 'vs last month',
    icon: 'GraduationCap',
    tint: 'blue',
  },
  {
    id: 'teachers',
    label: 'Total Teachers',
    value: '86',
    delta: '1.8%',
    deltaDirection: 'up',
    deltaLabel: 'vs last month',
    icon: 'UserRound',
    tint: 'green',
  },
  {
    id: 'classes',
    label: 'Total Classes',
    value: '48',
    delta: '0.6%',
    deltaDirection: 'up',
    deltaLabel: 'vs last month',
    icon: 'Users',
    tint: 'amber',
  },
  {
    id: 'subjects',
    label: 'Total Subjects',
    value: '32',
    delta: '—',
    deltaDirection: 'neutral',
    deltaLabel: 'vs last month',
    icon: 'BookOpen',
    tint: 'violet',
  },
  {
    id: 'attendance',
    label: "Today's Attendance",
    value: '94.2%',
    delta: '3.1%',
    deltaDirection: 'up',
    deltaLabel: 'vs yesterday',
    icon: 'UserCheck',
    tint: 'sky',
  },
  {
    id: 'leaves',
    label: 'Pending Leaves',
    value: '12',
    delta: '4',
    deltaDirection: 'down',
    deltaLabel: 'vs yesterday',
    icon: 'ClipboardList',
    tint: 'red',
  },
]

export const attendanceData: AttendanceDay[] = [
  { day: 'Mon', value: 92 },
  { day: 'Tue', value: 94 },
  { day: 'Wed', value: 90 },
  { day: 'Thu', value: 96 },
  { day: 'Fri', value: 95 },
  { day: 'Sat', value: 89 },
  { day: 'Sun', value: 91 },
]

export const enrollmentData: EnrollmentSlice[] = [
  { grade: 'Grade 7', count: 210, color: '#F472B6' },
  { grade: 'Grade 8', count: 245, color: '#34D399' },
  { grade: 'Grade 9', count: 260, color: '#FBBF24' },
  { grade: 'Grade 10', count: 290, color: '#A78BFA' },
  { grade: 'Grade 11', count: 160, color: '#60A5FA' },
  { grade: 'Grade 12', count: 119, color: '#FB7185' },
]

export const upcomingEvents: EventItem[] = [
  { id: 'e1', day: '28', month: 'MAY', title: 'Midterm Exams Begin', time: 'All Day' },
  { id: 'e2', day: '05', month: 'JUN', title: 'Parent-Teacher Meeting', time: '09:00 AM - 12:00 PM' },
  { id: 'e3', day: '15', month: 'JUN', title: 'Science Fair', time: '10:00 AM - 03:00 PM' },
  { id: 'e4', day: '30', month: 'JUN', title: 'End of Semester', time: 'All Day' },
]

export const recentActivities: ActivityItem[] = [
  {
    id: 'a1',
    icon: 'enrolled',
    title: 'New student enrolled: Benjamin Thompson',
    subtitle: 'Grade 10-B • Admissions Office',
    time: '5m ago',
  },
  {
    id: 'a2',
    icon: 'grade',
    title: 'Grade report generated for Science Dept',
    subtitle: 'Term 2 • 2025-2026',
    time: '45m ago',
  },
  {
    id: 'a3',
    icon: 'homework',
    title: 'Homework published: Math Homework #4',
    subtitle: 'Grade 9-A • John Smith',
    time: '1h ago',
  },
  {
    id: 'a4',
    icon: 'leave',
    title: 'Leave request approved for Emily Johnson',
    subtitle: 'May 24 - May 26 • Sick Leave',
    time: '2h ago',
  },
  {
    id: 'a5',
    icon: 'announcement',
    title: 'New announcement: School Sports Day',
    subtitle: 'By Admin Sarah',
    time: '3h ago',
  },
]

export const leaveRequests: LeaveRequestItem[] = [
  { id: 'l1', name: 'Emily Johnson', grade: 'Grade 10-A', dateRange: 'May 24 - May 26', status: 'Pending', avatar: 'EJ' },
  { id: 'l2', name: 'Michael Brown', grade: 'Grade 11-B', dateRange: 'May 23 - May 24', status: 'Approved', avatar: 'MB' },
  { id: 'l3', name: 'Sophia Williams', grade: 'Grade 9-C', dateRange: 'May 20 - May 21', status: 'Rejected', avatar: 'SW' },
  { id: 'l4', name: 'James Anderson', grade: 'Grade 12-A', dateRange: 'May 25 - May 27', status: 'Pending', avatar: 'JA' },
]

export const announcements: AnnouncementItem[] = [
  {
    id: 'an1',
    title: 'School Sports Day',
    body: 'The annual sports day will be held on June 15.',
    time: '1h ago',
  },
  {
    id: 'an2',
    title: 'Library Hours Update',
    body: 'Library will now close at 6:00 PM on weekdays.',
    time: '3h ago',
  },
  {
    id: 'an3',
    title: 'Midterm Exam Schedule',
    body: 'Midterm exams will start from May 28.',
    time: '1d ago',
  },
  {
    id: 'an4',
    title: 'Uniform Reminder',
    body: 'Please wear the new uniform starting June 1.',
    time: '2d ago',
  },
]

export const navSections: NavSection[] = [
  {
    heading: 'Setup',
    links: [
      { label: 'School Setup', icon: 'Settings', path: '/setup/school' },
      { label: 'Roles', icon: 'ShieldCheck', path: '/setup/roles' },
      { label: 'Subjects', icon: 'BookMarked', path: '/setup/subjects' },
      { label: 'Schedules', icon: 'CalendarDays', path: '/setup/schedules' },
      { label: 'Users', icon: 'User', path: '/setup/users' },
    ],
  },
  {
    heading: 'Academic',
    links: [
      { label: 'Classes', icon: 'BookOpenCheck', path: '/academic/classes' },
      { label: 'Lessons', icon: 'NotebookText', path: '/academic/lessons' },
      { label: 'Homework', icon: 'PenLine', path: '/academic/homework' },
      { label: 'Quiz & Tests', icon: 'FileQuestion', path: '/academic/quizzes' },
      { label: 'Grades', icon: 'Award', path: '/academic/grades' },
    ],
  },
  {
    heading: 'Students',
    links: [
      { label: 'Student List', icon: 'Users2', path: '/students' },
      { label: 'Attendance', icon: 'ClipboardCheck', path: '/students/attendance' },
      { label: 'Leave Requests', icon: 'FileClock', path: '/students/leave-requests' },
    ],
  },
  {
    heading: 'Teachers',
    links: [
      { label: 'Teacher List', icon: 'Users2', path: '/teachers' },
      { label: 'Teacher Assignments', icon: 'UserCog', path: '/teachers/assignments' },
    ],
  },
  {
    heading: 'Communication',
    links: [
      { label: 'Announcements', icon: 'Megaphone', path: '/communication/announcements' },
      { label: 'Notifications', icon: 'Bell', path: '/communication/notifications' },
    ],
  },
  {
    heading: 'Reports',
    links: [
      { label: 'Attendance Report', icon: 'BarChart3', path: '/reports/attendance' },
      { label: 'Grade Report', icon: 'FileBarChart', path: '/reports/grades' },
      { label: 'Student Report', icon: 'UserSquare2', path: '/reports/students' },
      { label: 'Teacher Report', icon: 'FileStack', path: '/reports/teachers' },
    ],
  },
]
