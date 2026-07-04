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

      <StatsGrid />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <AttendanceChart />
        <EnrollmentDonut />
        <UpcomingEvents />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr_0.9fr]">
        <RecentActivities />
        <RecentLeaveRequests />
        <Announcements />
      </div>
    </>
  )
}
