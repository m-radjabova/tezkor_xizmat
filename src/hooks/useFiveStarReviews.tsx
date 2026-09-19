import { useQuery } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Review } from '../types'

export interface ReviewWithBusiness extends Review {
  businessName: string
}

async function getFiveStarReviewsRequest() {
  const { data } = await apiClient.get<Review[]>('/reviews/featured', {
    params: { limit: 3 },
  })

  return data.map((review) => ({
    ...review,
    businessName: review.business?.name ?? 'YaqinXizmat',
  }))
}

export function useFiveStarReviews() {
  const query = useQuery({
    queryKey: ['five-star-reviews'],
    queryFn: getFiveStarReviewsRequest,
    staleTime: 60 * 1000,
  })

  return {
    reviews: query.data ?? [],
    isLoadingReviews: query.isLoading,
  }
}
