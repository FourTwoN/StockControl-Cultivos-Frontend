import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormField } from '@core/components/forms/FormField'
import { Button } from '@core/components/ui/Button'
import { RoleGuard } from '@core/auth/RoleGuard'
import { userSchema } from '../types/schemas.ts'
import type { UserFormData } from '../types/schemas.ts'
import type { User } from '../types/User.ts'

interface UserFormProps {
  readonly initialData?: User
  readonly onSubmit: (data: UserFormData) => void
  readonly isSubmitting?: boolean
}

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Admin' },
  { value: 'SUPERVISOR', label: 'Supervisor' },
  { value: 'WORKER', label: 'Worker' },
  { value: 'VIEWER', label: 'Viewer' },
] as const

const ACTIVE_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
] as const

export function UserForm({ initialData, onSubmit, isSubmitting = false }: UserFormProps) {
  const defaultValues: UserFormData = useMemo(
    () => ({
      name: initialData?.name ?? '',
      email: initialData?.email ?? '',
      role: initialData?.role ?? 'VIEWER',
      isActive: initialData?.isActive ?? true,
    }),
    [initialData],
  )

  const { control, handleSubmit, setValue, watch } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  const isActive = watch('isActive')

  const handleActiveToggle = useMemo(
    () => (value: string) => {
      setValue('isActive', value === 'true')
    },
    [setValue],
  )

  return (
    <RoleGuard
      allowedRoles={['ADMIN']}
      fallback={<p className="text-sm text-muted">You do not have permission to manage users.</p>}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField<UserFormData>
            name="name"
            control={control}
            label="Name"
            placeholder="Full name"
          />
          <FormField<UserFormData>
            name="email"
            control={control}
            label="Email"
            placeholder="user@example.com"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField<UserFormData>
            name="role"
            control={control}
            label="Role"
            type="select"
            options={[...ROLE_OPTIONS]}
            placeholder="Select a role"
          />
          <div>
            <label className="mb-1 block text-sm font-medium text-primary">Status</label>
            <div className="flex gap-2">
              {ACTIVE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                    String(isActive) === option.value
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted hover:bg-muted/10'
                  }`}
                  onClick={() => handleActiveToggle(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="submit" isLoading={isSubmitting}>
            {initialData ? 'Update User' : 'Create User'}
          </Button>
        </div>
      </form>
    </RoleGuard>
  )
}
