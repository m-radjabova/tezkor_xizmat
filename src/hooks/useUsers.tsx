import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { User, UserUpdatePayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const USERS_QUERY_KEY = ['users']

async function getUsersRequest() {
  const { data } = await apiClient.get<User[]>('/users/')
  return data
}

async function updateUserRequest(id: string, payload: UserUpdatePayload) {
  const { data } = await apiClient.patch<User>(`/users/${id}`, payload)
  return data
}

async function deleteUserRequest(id: string) {
  await apiClient.delete(`/users/${id}`)
}

export function useUsers(enabled = true) {
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: USERS_QUERY_KEY,
    queryFn: getUsersRequest,
    enabled,
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UserUpdatePayload }) => updateUserRequest(id, payload),
    onSuccess: () => {
      showSuccessToast(translate('toast.user_updated'))
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.user_update_failed')))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteUserRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.user_deleted'))
      void queryClient.invalidateQueries({ queryKey: USERS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.user_delete_failed')))
    },
  })

  return {
    users: usersQuery.data ?? [],
    isLoading: usersQuery.isLoading,
    isFetching: usersQuery.isFetching,
    refetch: usersQuery.refetch,
    updateUser: updateMutation.mutate,
    deleteUser: deleteMutation.mutate,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
