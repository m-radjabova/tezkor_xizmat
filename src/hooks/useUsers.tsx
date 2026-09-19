import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { User, UserListResponse, UserUpdatePayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const USERS_QUERY_KEY = ['users']

type UserStatusFilter = 'all' | 'active' | 'blocked'

interface UseUsersParams {
  enabled?: boolean
  role?: User['role']
  filter?: UserStatusFilter
  search?: string
  page?: number
  limit?: number
}

async function getUsersRequest({ role, filter = 'all', search = '', page = 1, limit = 10 }: UseUsersParams) {
  const params: Record<string, string | number> = {
    status_filter: filter,
    limit,
    offset: (page - 1) * limit,
  }

  if (role) params.role = role
  if (search.trim().length >= 2) params.search = search.trim()

  const { data } = await apiClient.get<UserListResponse>('/users/', { params })
  return data
}

async function updateUserRequest(id: string, payload: UserUpdatePayload) {
  const { data } = await apiClient.patch<User>(`/users/${id}`, payload)
  return data
}

async function deleteUserRequest(id: string) {
  await apiClient.delete(`/users/${id}`)
}

export function useUsers(paramsOrEnabled: UseUsersParams | boolean = {}) {
  const params = typeof paramsOrEnabled === 'boolean' ? { enabled: paramsOrEnabled } : paramsOrEnabled
  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: [...USERS_QUERY_KEY, params],
    queryFn: () => getUsersRequest(params),
    enabled: params.enabled ?? true,
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
    users: usersQuery.data?.items ?? [],
    totalUsers: usersQuery.data?.total ?? 0,
    activeUsersCount: usersQuery.data?.active_count ?? 0,
    blockedUsersCount: usersQuery.data?.blocked_count ?? 0,
    userLimit: usersQuery.data?.limit ?? params.limit ?? 10,
    userOffset: usersQuery.data?.offset ?? 0,
    isLoading: usersQuery.isLoading,
    isFetching: usersQuery.isFetching,
    refetch: usersQuery.refetch,
    updateUser: updateMutation.mutateAsync,
    deleteUser: deleteMutation.mutateAsync,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
