import { useMutation } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { User, UserUpdatePayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

interface UpdateMeOptions {
  silent?: boolean
}

async function updateMeRequest(payload: UserUpdatePayload) {
  const { data } = await apiClient.patch<User>('/users/me', payload)
  return data
}

async function uploadAvatarRequest(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.patch<User>('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data
}

async function deleteAvatarRequest() {
  const { data } = await apiClient.delete<User>('/users/me/avatar')
  return data
}

export function useProfile() {
  const updateMeMutation = useMutation({
    mutationFn: updateMeRequest,
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.profile_update_failed')))
    },
  })

  const uploadAvatarMutation = useMutation({
    mutationFn: uploadAvatarRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.avatar_uploaded'))
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.avatar_upload_failed')))
    },
  })

  const deleteAvatarMutation = useMutation({
    mutationFn: deleteAvatarRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.avatar_deleted'))
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.avatar_delete_failed')))
    },
  })

  return {
    updateMe: async (payload: UserUpdatePayload, options?: UpdateMeOptions) => {
      const updatedUser = await updateMeMutation.mutateAsync(payload)

      if (!options?.silent) {
        showSuccessToast(translate('toast.profile_updated'))
      }

      return updatedUser
    },
    uploadAvatar: uploadAvatarMutation.mutateAsync,
    deleteAvatar: deleteAvatarMutation.mutateAsync,
    isUpdating: updateMeMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
    isDeletingAvatar: deleteAvatarMutation.isPending,
  }
}
