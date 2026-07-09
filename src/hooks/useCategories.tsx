import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Category, CategoryPayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const CATEGORIES_QUERY_KEY = ['categories']

async function getCategoriesRequest() {
  const { data } = await apiClient.get<Category[]>('/categories/')
  return data
}

async function createCategoryRequest(payload: CategoryPayload) {
  const { data } = await apiClient.post<Category>('/categories/', payload)
  return data
}

async function updateCategoryRequest(id: string, payload: Partial<CategoryPayload>) {
  const { data } = await apiClient.patch<Category>(`/categories/${id}`, payload)
  return data
}

async function deleteCategoryRequest(id: string) {
  await apiClient.delete(`/categories/${id}`)
}

export function useCategories() {
  const queryClient = useQueryClient()

  const categoriesQuery = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategoriesRequest,
  })

  const createMutation = useMutation({
    mutationFn: createCategoryRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.category_created'))
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.category_create_failed')))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CategoryPayload> }) => updateCategoryRequest(id, payload),
    onSuccess: () => {
      showSuccessToast(translate('toast.category_updated'))
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.category_update_failed')))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategoryRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.category_deleted'))
      void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.category_delete_failed')))
    },
  })

  return {
    categories: categoriesQuery.data ?? [],
    isLoading: categoriesQuery.isLoading,
    isFetching: categoriesQuery.isFetching,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
