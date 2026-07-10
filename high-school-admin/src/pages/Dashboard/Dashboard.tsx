import PageHeading from '../../components/common/PageHeading'
import StatsGrid from '../../components/cards/StatsGrid'
import AttendanceChart from '../../components/charts/AttendanceChart'
import EnrollmentDonut from '../../components/charts/EnrollmentDonut'
import UpcomingEvents from '../../features/dashboard/UpcomingEvents'
import RecentActivities from '../../features/dashboard/RecentActivities'
import RecentLeaveRequests from '../../features/dashboard/RecentLeaveRequests'
import Announcements from '../../features/dashboard/Announcements'

export default function Dashboard() {
  return (
    <>
      <PageHeading
        title="Dashboard Overview"
        subtitle="Welcome back, Principal Sarah. Here's what's happening today."
      />

      <div className="mt-6 space-y-6">
        <StatsGrid />

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <AttendanceChart />
          <EnrollmentDonut />
          <UpcomingEvents />
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          <RecentActivities />
          <RecentLeaveRequests />
          <Announcements />
        </div>
      </div>
    </>
  )
}