import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { NotificationItem, NotificationPayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showInfoToast, showSuccessToast } from '../utils/toast'

const NOTIFICATIONS_QUERY_KEY = ['notifications']

async function getNotificationsRequest() {
  const { data } = await apiClient.get<NotificationItem[]>('/notifications/')
  return data
}

async function createNotificationRequest(payload: NotificationPayload) {
  const { data } = await apiClient.post<NotificationItem>('/notifications/', payload)
  return data
}

async function updateNotificationRequest(id: string, payload: Partial<NotificationPayload>) {
  const { data } = await apiClient.patch<NotificationItem>(`/notifications/${id}`, payload)
  return data
}

async function deleteNotificationRequest(id: string) {
  await apiClient.delete(`/notifications/${id}`)
}

async function markAllNotificationsAsReadRequest() {
  const { data } = await apiClient.post<{ updated_count: number }>('/notifications/mark-all-read')
  return data
}

export function useNotifications() {
  const queryClient = useQueryClient()

  const notificationsQuery = useQuery({
    queryKey: NOTIFICATIONS_QUERY_KEY,
    queryFn: getNotificationsRequest,
  })

  const createMutation = useMutation({
    mutationFn: createNotificationRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.notification_created'))
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.notification_create_failed')))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<NotificationPayload> }) => updateNotificationRequest(id, payload),
    onSuccess: () => {
      showSuccessToast(translate('toast.notification_updated'))
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.notification_update_failed')))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteNotificationRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.notification_deleted'))
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.notification_delete_failed')))
    },
  })

  const markAllReadMutation = useMutation({
    mutationFn: markAllNotificationsAsReadRequest,
    onSuccess: (data) => {
      if (data.updated_count > 0) {
        showInfoToast(translate('toast.notifications_marked_read', { count: data.updated_count }))
      } else {
        showInfoToast(translate('toast.notifications_already_read'))
      }
      void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.notifications_mark_read_failed')))
    },
  })

  return {
    notifications: notificationsQuery.data ?? [],
    isLoading: notificationsQuery.isLoading,
    isFetching: notificationsQuery.isFetching,
    createNotification: createMutation.mutate,
    updateNotification: updateMutation.mutate,
    deleteNotification: deleteMutation.mutate,
    markAllAsRead: markAllReadMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isMarkingAllRead: markAllReadMutation.isPending,
  }
}
