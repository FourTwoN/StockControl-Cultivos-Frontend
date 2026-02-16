import { useState, useCallback } from 'react'
import { Plus } from 'lucide-react'
import { AnimatedPage } from '@core/components/motion/AnimatedPage'
import { Modal } from '@core/components/ui/Modal'
import { ConfirmDialog } from '@core/components/ui/ConfirmDialog'
import { Button } from '@core/components/ui/Button'
import { useToast } from '@core/components/ui/Toast'
import { RoleGuard } from '@core/auth/RoleGuard'
import { UserTable } from '../components/UserTable.tsx'
import { UserForm } from '../components/UserForm.tsx'
import { useCreateUser } from '../hooks/useCreateUser.ts'
import { useUpdateUser } from '../hooks/useUpdateUser.ts'
import { useDeleteUser } from '../hooks/useDeleteUser.ts'
import type { User } from '../types/User.ts'
import type { UserFormData } from '../types/schemas.ts'

interface ModalState {
  readonly isOpen: boolean
  readonly user?: User
}

interface DeleteState {
  readonly isOpen: boolean
  readonly user?: User
}

export function UsersPage() {
  const toast = useToast()
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const deleteUser = useDeleteUser()

  const [modal, setModal] = useState<ModalState>({ isOpen: false })
  const [deleteDialog, setDeleteDialog] = useState<DeleteState>({
    isOpen: false,
  })

  const handleCreate = useCallback(() => {
    setModal({ isOpen: true })
  }, [])

  const handleEdit = useCallback((user: User) => {
    setModal({ isOpen: true, user })
  }, [])

  const handleCloseModal = useCallback(() => {
    setModal({ isOpen: false })
  }, [])

  const handleDeleteRequest = useCallback((user: User) => {
    setDeleteDialog({ isOpen: true, user })
  }, [])

  const handleCloseDelete = useCallback(() => {
    setDeleteDialog({ isOpen: false })
  }, [])

  const handleSubmit = useCallback(
    (data: UserFormData) => {
      if (modal.user) {
        updateUser.mutate(
          { id: modal.user.id, data },
          {
            onSuccess: () => {
              toast.success('User updated successfully')
              setModal({ isOpen: false })
            },
            onError: () => {
              toast.error('Failed to update user')
            },
          },
        )
      } else {
        createUser.mutate(data, {
          onSuccess: () => {
            toast.success('User created successfully')
            setModal({ isOpen: false })
          },
          onError: () => {
            toast.error('Failed to create user')
          },
        })
      }
    },
    [modal.user, createUser, updateUser, toast],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deleteDialog.user) return

    deleteUser.mutate(deleteDialog.user.id, {
      onSuccess: () => {
        toast.success('User deleted successfully')
        setDeleteDialog({ isOpen: false })
      },
      onError: () => {
        toast.error('Failed to delete user')
      },
    })
  }, [deleteDialog.user, deleteUser, toast])

  return (
    <AnimatedPage className="p-4 sm:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Users</h1>
          <p className="mt-1 text-sm text-muted">Manage user accounts and roles</p>
        </div>
        <RoleGuard allowedRoles={['ADMIN']}>
          <Button onClick={handleCreate}>
            <Plus className="h-4 w-4" />
            New User
          </Button>
        </RoleGuard>
      </div>

      <UserTable onEdit={handleEdit} onDelete={handleDeleteRequest} />

      <Modal
        open={modal.isOpen}
        onClose={handleCloseModal}
        title={modal.user ? 'Edit User' : 'New User'}
        size="lg"
      >
        <UserForm
          initialData={modal.user}
          onSubmit={handleSubmit}
          isSubmitting={createUser.isPending || updateUser.isPending}
        />
      </Modal>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={handleCloseDelete}
        onConfirm={handleConfirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${deleteDialog.user?.name ?? ''}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="danger"
      />
    </AnimatedPage>
  )
}
