import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Category } from '../types'

export const CATEGORIES_QUERY_KEY = ['categories'] as const

async function getCategoriesRequest() {
  const { data } = await apiClient.get<Category[]>('/categories')
  return data
}

export function useCategories() {
  const query = useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: getCategoriesRequest,
    staleTime: 5 * 60 * 1000,
  })

  return {
    categories: query.data ?? [],
    isLoadingCategories: query.isLoading,
    isFetchingCategories: query.isFetching,
    refetchCategories: query.refetch,
  }
}
