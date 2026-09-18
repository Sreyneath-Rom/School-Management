// src/features/dashboard/index.ts

// Widgets
export { default as AcademicPulseWidget } from './AcademicPulseWidget'
export { default as Announcements } from './Announcements'
export { default as DashboardHeroBanner } from './DashboardHeroBanner'
export { default as DashboardQuickActions } from './DashboardQuickActions'
export { default as LiveAttendanceBreakdown } from './LiveAttendanceBreakdown'
export { default as PendingApprovalsWidget } from './PendingApprovalsWidget'
export { default as RecentActivities } from './RecentActivities'
export { default as RecentLeaveRequests } from './RecentLeaveRequests'
export { default as UpcomingEvents } from './UpcomingEvents'

// Data hooks and card definitions
export { useDashboardData } from './useDashboardData'
export { DASHBOARD_CARDS, applyDashboardStats } from './dashboardCards'