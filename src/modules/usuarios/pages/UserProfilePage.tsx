import { format } from 'date-fns'
import { User as UserIcon, Mail, Shield, Clock } from 'lucide-react'
import { Card } from '@core/components/ui/Card'
import { Skeleton } from '@core/components/ui/Skeleton'
import { useCurrentUser } from '../hooks/useCurrentUser.ts'
import { RoleBadge } from '../components/RoleBadge.tsx'

function ProfileAvatar({ name, picture }: { readonly name: string; readonly picture?: string }) {
  if (picture) {
    return <img src={picture} alt={name} className="h-20 w-20 rounded-full object-cover" />
  }

  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
      {initials}
    </div>
  )
}

export function UserProfilePage() {
  const { data: user, isLoading } = useCurrentUser()

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6">
        <Skeleton className="mb-6 h-8 w-48" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Skeleton className="h-64" variant="rectangle" />
          <Skeleton className="h-64" variant="rectangle" />
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="p-4 sm:p-6">
        <p className="text-muted">Could not load profile information.</p>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">My Profile</h1>
        <p className="mt-1 text-sm text-muted">View your account information</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            <ProfileAvatar name={user.name} picture={user.picture} />
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-primary">{user.name}</h2>
              <div className="mt-1 flex items-center justify-center gap-2 sm:justify-start">
                <RoleBadge role={user.role} />
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-lg font-semibold text-primary">Account Details</h2>
          <dl className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted/10 p-2">
                <Mail className="h-4 w-4 text-muted" />
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-muted">Email</dt>
                <dd className="text-sm text-primary">{user.email}</dd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted/10 p-2">
                <Shield className="h-4 w-4 text-muted" />
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-muted">Role</dt>
                <dd className="mt-0.5">
                  <RoleBadge role={user.role} />
                </dd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted/10 p-2">
                <Clock className="h-4 w-4 text-muted" />
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-muted">Last Login</dt>
                <dd className="text-sm text-primary">
                  {user.lastLoginAt
                    ? format(new Date(user.lastLoginAt), 'dd/MM/yyyy HH:mm')
                    : 'Never'}
                </dd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-muted/10 p-2">
                <UserIcon className="h-4 w-4 text-muted" />
              </div>
              <div>
                <dt className="text-xs font-medium uppercase text-muted">Account Created</dt>
                <dd className="text-sm text-primary">
                  {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                </dd>
              </div>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  )
}
