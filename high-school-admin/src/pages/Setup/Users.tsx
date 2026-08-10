import UserList from '@/components/users/UserList'
import PageHeading from '@/components/common/PageHeading'

export default function Users() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <PageHeading
          title="User Setup"
          subtitle="Manage portal accounts, roles, and bulk actions for your institution."
        />
      </div>
      <UserList showHeading={false} />
    </div>
  )
}