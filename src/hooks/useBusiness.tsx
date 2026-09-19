import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Business } from '../types'

async function getBusinessRequest(id: string) {
  const { data } = await apiClient.get<Business>(`/businesses/${id}`)
  return data
}

export function useBusiness(id: string | undefined) {
  const query = useQuery({
    queryKey: ['business', id],
    queryFn: () => getBusinessRequest(id as string),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  })

  return {
    business: query.data,
    isLoadingBusiness: query.isLoading,
    isErrorBusiness: query.isError,
  }
}
