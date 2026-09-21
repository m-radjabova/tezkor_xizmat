import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Review } from '../types'

interface ReviewCreatePayload {
  rating: number
  comment?: string | null
}

async function getBusinessReviewsRequest(id: string) {
  const { data } = await apiClient.get<Review[]>(`/businesses/${id}/reviews`)
  return data
}

async function createBusinessReviewRequest({
  id,
  payload,
}: {
  id: string
  payload: ReviewCreatePayload
}) {
  const { data } = await apiClient.post<Review>(`/businesses/${id}/reviews`, payload)
  return data
}

export function useBusinessReviews(id: string | undefined) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: ['business-reviews', id],
    queryFn: () => getBusinessReviewsRequest(id as string),
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  })

  const createReviewMutation = useMutation({
    mutationFn: (payload: ReviewCreatePayload) =>
      createBusinessReviewRequest({ id: id as string, payload }),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['business-reviews', id] }),
        queryClient.invalidateQueries({ queryKey: ['business', id] }),
        queryClient.invalidateQueries({ queryKey: ['businesses'] }),
      ])
    },
  })

  return {
    reviews: query.data ?? [],
    isLoadingReviews: query.isLoading,
    createReview: createReviewMutation.mutateAsync,
    isCreatingReview: createReviewMutation.isPending,
  }
}
