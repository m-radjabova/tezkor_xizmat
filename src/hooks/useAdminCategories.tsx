import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Category } from '../types'
import { CATEGORIES_QUERY_KEY } from './useCategories'

export const ADMIN_CATEGORIES_QUERY_KEY = ['admin-categories'] as const

type CategoryPayload = {
  name: string
  icon?: string | null
}

async function getAdminCategoriesRequest() {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

async function createCategoryRequest(payload: CategoryPayload) {
  const { data } = await apiClient.post<Category>('/categories', payload)
  return data
}

async function updateCategoryRequest({ id, payload }: { id: string; payload: CategoryPayload }) {
  const { data } = await apiClient.patch<Category>(`/categories/${id}`, payload)
  return data
}

async function deleteCategoryRequest(id: string) {
  await apiClient.delete(`/categories/${id}`)
}

async function uploadCategoryLogoRequest(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<{ url: string }>('/categories/logo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data.url
}

export function useAdminCategories() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ADMIN_CATEGORIES_QUERY_KEY,
    queryFn: getAdminCategoriesRequest,
    staleTime: 60 * 1000,
  })

  const invalidateCategories = () => {
    void queryClient.invalidateQueries({ queryKey: ADMIN_CATEGORIES_QUERY_KEY })
    void queryClient.invalidateQueries({ queryKey: CATEGORIES_QUERY_KEY })
  }

  const createCategory = useMutation({
    mutationFn: createCategoryRequest,
    onSuccess: invalidateCategories,
  })
  const updateCategory = useMutation({
    mutationFn: updateCategoryRequest,
    onSuccess: invalidateCategories,
  })
  const deleteCategory = useMutation({
    mutationFn: deleteCategoryRequest,
    onSuccess: invalidateCategories,
  })
  const uploadCategoryLogo = useMutation({ mutationFn: uploadCategoryLogoRequest })

  return {
    categories: query.data ?? [],
    isLoadingCategories: query.isLoading,
    isFetchingCategories: query.isFetching,
    refetchCategories: query.refetch,
    createCategory,
    updateCategory,
    deleteCategory,
    uploadCategoryLogo,
  }
}