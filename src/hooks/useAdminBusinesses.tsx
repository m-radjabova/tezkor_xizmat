import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Business, BusinessListResponse } from '../types'

const ADMIN_BUSINESSES_QUERY_KEY = ['admin-businesses'] as const
const PUBLIC_BUSINESSES_QUERY_KEY = ['businesses'] as const

export type AdminBusinessFilter = 'pending' | 'verified' | 'all'

interface UseAdminBusinessesParams {
  page?: number
  limit?: number
  filter?: AdminBusinessFilter
  search?: string
}

async function getAdminBusinessesRequest({ page = 1, limit = 10, filter = 'all', search = '' }: UseAdminBusinessesParams) {
  const params: Record<string, string | number> = {
    limit,
    offset: (page - 1) * limit,
    status_filter: filter,
  }

  if (search.trim().length >= 2) {
    params.search = search.trim()
  }

  const { data } = await apiClient.get<BusinessListResponse>('/businesses/admin/all', { params })
  return data
}

async function verifyBusinessRequest({ id, is_verified }: { id: string; is_verified: boolean }) {
  const { data } = await apiClient.patch<Business>(`/businesses/${id}/verify`, { is_verified })
  return data
}

async function deleteBusinessRequest(id: string) {
  await apiClient.delete(`/businesses/${id}`)
  return id
}

export function useAdminBusinesses(params: UseAdminBusinessesParams = {}) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: [...ADMIN_BUSINESSES_QUERY_KEY, params],
    queryFn: () => getAdminBusinessesRequest(params),
    staleTime: 60 * 1000,
  })

  const verifyMutation = useMutation({
    mutationFn: verifyBusinessRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_BUSINESSES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PUBLIC_BUSINESSES_QUERY_KEY }),
      ])
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBusinessRequest,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ADMIN_BUSINESSES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PUBLIC_BUSINESSES_QUERY_KEY }),
      ])
    },
  })

  return {
    businesses: query.data?.items ?? [],
    totalBusinesses: query.data?.total ?? 0,
    pendingBusinessesCount: query.data?.pending_count ?? 0,
    verifiedBusinessesCount: query.data?.verified_count ?? 0,
    businessLimit: query.data?.limit ?? params.limit ?? 10,
    businessOffset: query.data?.offset ?? 0,
    isLoadingBusinesses: query.isLoading,
    isFetchingBusinesses: query.isFetching,
    verifyBusiness: verifyMutation.mutateAsync,
    deleteBusiness: deleteMutation.mutateAsync,
    isVerifyingBusiness: verifyMutation.isPending,
    isDeletingBusiness: deleteMutation.isPending,
  }
}
