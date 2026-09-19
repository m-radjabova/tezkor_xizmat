import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Review } from '../types'

async function getBusinessReviewsRequest(id: string) {
  const { data } = await apiClient.get<Review[]>(`/businesses/${id}/reviews`)
  return data
}

export function useBusinessReviews(id: string | undefined) {
  const query = useQuery({
    queryKey: ['business-reviews', id],
    queryFn: () => getBusinessReviewsRequest(id as string),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  })

  return {
    reviews: query.data ?? [],
    isLoadingReviews: query.isLoading,
  }
}
