// src/routes/routeConfig.ts
//
// Named paths for the routes defined in AdminRoutes.tsx and the sibling
// role route files. Import `routes` instead of writing path strings inline
// — a typo in one place becomes a typo in every file, and TypeScript can't
// catch it.

export const routes = {
  // ---- Admin -----------------------------------------------------------------
  dashboard: '/dashboard',

  setup: {
    school: '/setup/school',
    academicYears: '/setup/academic-years',
    gradeLevels: '/setup/grade-levels',
    terms: '/setup/terms',
    subjects: '/setup/subjects',
    rooms: '/setup/rooms',
    roles: '/setup/roles',
    users: '/setup/users',
    translations: '/setup/translations',
  },

  academic: {
    classes: '/academic/classes',
    classSubjects: '/academic/class-subjects',
    schedules: '/academic/schedules',
    lessons: '/academic/lessons',
    homework: '/academic/homework',
    quizzes: '/academic/quizzes',
    grades: '/academic/grades',
  },

  exams: {
    list: '/academic/exams',
    create: '/academic/exams/create',
    edit: (id: string) => `/academic/exams/${id}/edit`,
    schedules: '/academic/exam-schedules',
    markEntry: '/academic/mark-entry',
    marksFor: (id: string) => `/academic/exams/${id}/marks`,
    reportCards: '/academic/report-cards',
  },

  students: {
    list: '/students',
    profiles: '/students/profiles',
    attendance: '/students/attendance',
    leaveRequests: '/students/leave-requests',
  },

  teachers: {
    list: '/teachers',
    profiles: '/teachers/profiles',
    assignments: '/teachers/assignments',
    attendance: '/teachers/attendance',
  },

  calendar: {
    view: '/calendar',
    events: '/calendar/events',
    createEvent: '/calendar/events/create',
    editEvent: (id: string) => `/calendar/events/${id}/edit`,
    holidays: '/calendar/holidays',
  },

  messages: {
    inbox: '/messages',
    conversation: (id: string) => `/messages/${id}`,
  },

  communication: {
    announcements: '/communication/announcements',
    notifications: '/communication/notifications',
  },

  reports: {
    attendance: '/reports/attendance',
    grades: '/reports/grades',
    academic: '/reports/academic',
    students: '/reports/students',
    teachers: '/reports/teachers',
  },

  system: {
    activity: '/system/activity',
  },

  // ---- Teacher ---------------------------------------------------------------
  teacher: {
    dashboard: '/teacher/dashboard',
    classes: '/teacher/classes',
    lessons: '/teacher/lessons',
    homework: '/teacher/homework',
    quizzes: '/teacher/quizzes',
    grades: '/teacher/grades',
    exams: '/teacher/exams',
    marksFor: (id: string) => `/teacher/exams/${id}/marks`,
    students: '/teacher/students',
    attendance: '/teacher/attendance',
    announcements: '/teacher/announcements',
    notifications: '/teacher/notifications',
    messages: '/teacher/messages',
    calendar: '/teacher/calendar',
  },

  // ---- Student ---------------------------------------------------------------
  student: {
    dashboard: '/student/dashboard',
    classes: '/student/classes',
    lessons: '/student/lessons',
    homework: '/student/homework',
    quizzes: '/student/quizzes',
    grades: '/student/grades',
    exams: '/student/exams',
    reportCards: '/student/report-cards',
    attendance: '/student/attendance',
    leaveRequests: '/student/leave-requests',
    announcements: '/student/announcements',
    notifications: '/student/notifications',
    messages: '/student/messages',
    calendar: '/student/calendar',
  },

  // ---- Parent ----------------------------------------------------------------
  parent: {
    dashboard: '/parent/dashboard',
    children: '/parent/children',
    child: (id: string) => `/parent/children/${id}`,
    announcements: '/parent/announcements',
    notifications: '/parent/notifications',
    messages: '/parent/messages',
  },

  // ---- Auth ------------------------------------------------------------------
  auth: {
    login: '/login',
    adminLogin: '/login/admin',
    teacherLogin: '/login/teacher',
    studentLogin: '/login/student',
    parentLogin: '/login/parent',
  },
} as const