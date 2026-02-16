import { useMemo, useEffect } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { DataTable } from '@core/components/ui/DataTable'
import type { Column } from '@core/components/ui/DataTable'
import { Button } from '@core/components/ui/Button'
import { Badge } from '@core/components/ui/Badge'
import { Avatar, AvatarFallback } from '@core/components/ui/Avatar'
import { RoleGuard } from '@core/auth/RoleGuard'
import { usePagination } from '@core/hooks/usePagination'
import { useUsers } from '../hooks/useUsers.ts'
import { RoleBadge } from './RoleBadge.tsx'
import type { User } from '../types/User.ts'

interface UserTableProps {
  readonly onEdit: (user: User) => void
  readonly onDelete: (user: User) => void
}

function UserAvatar({ name }: { readonly name: string }) {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <Avatar className="h-8 w-8">
      <AvatarFallback className="text-xs">{initials}</AvatarFallback>
    </Avatar>
  )
}

export function UserTable({ onEdit, onDelete }: UserTableProps) {
  const pagination = usePagination(20)

  const { data, isLoading } = useUsers(pagination.page, pagination.size)

  useEffect(() => {
    if (data) {
      pagination.setTotal(data.totalPages, data.totalElements)
    }
  }, [data, pagination])

  const columns: readonly Column<User>[] = useMemo(
    () => [
      {
        key: 'name' as const,
        header: 'User',
        render: (_value, row) => (
          <div className="flex items-center gap-3">
            <UserAvatar name={row.name} />
            <span className="font-medium text-primary">{row.name}</span>
          </div>
        ),
      },
      {
        key: 'email' as const,
        header: 'Email',
        render: (value) => <span className="text-sm text-muted">{value as string}</span>,
      },
      {
        key: 'role' as const,
        header: 'Role',
        render: (_value, row) => <RoleBadge role={row.role} />,
      },
      {
        key: 'isActive' as const,
        header: 'Status',
        render: (_value, row) => (
          <Badge variant={row.isActive ? 'success' : 'default'}>
            {row.isActive ? 'Active' : 'Inactive'}
          </Badge>
        ),
      },
      {
        key: 'lastLoginAt' as const,
        header: 'Last Login',
        render: (value) => (
          <span className="text-sm text-muted">
            {value ? format(new Date(value as string), 'dd/MM/yyyy HH:mm') : 'Never'}
          </span>
        ),
      },
      {
        key: 'id' as const,
        header: 'Actions',
        render: (_value, row) => (
          <RoleGuard allowedRoles={['ADMIN']}>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit(row)
                }}
                aria-label={`Edit ${row.name}`}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(row)
                }}
                aria-label={`Delete ${row.name}`}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          </RoleGuard>
        ),
      },
    ],
    [onEdit, onDelete],
  )

  return (
    <DataTable<User>
      columns={columns}
      data={data?.content ?? []}
      isLoading={isLoading}
      emptyMessage="No users found"
      keyExtractor={(row) => row.id}
      pagination={{
        page: pagination.page + 1,
        totalPages: pagination.totalPages,
        onPageChange: (p) => pagination.setPage(p - 1),
      }}
    />
  )
}
