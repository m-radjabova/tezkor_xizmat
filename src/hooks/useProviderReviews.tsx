import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Review } from '../types'

const PROVIDER_REVIEWS_QUERY_KEY = ['provider-reviews'] as const

export type ProviderReviewStatusFilter = 'all' | 'approved' | 'pending'

interface UseProviderReviewsParams {
  statusFilter?: ProviderReviewStatusFilter
}

async function getProviderReviewsRequest({ statusFilter = 'all' }: UseProviderReviewsParams) {
  const { data } = await apiClient.get<Review[]>('/reviews/provider/my', {
    params: { status_filter: statusFilter },
  })
  return data
}

async function approveReviewRequest(id: string) {
  const { data } = await apiClient.patch<Review>(`/reviews/${id}/approve`)
  return data
}

async function rejectReviewRequest(id: string) {
  await apiClient.delete(`/reviews/${id}/reject`)
  return id
}

export function useProviderReviews({ statusFilter = 'all' }: UseProviderReviewsParams = {}) {
  const queryClient = useQueryClient()
  const queryKey = [...PROVIDER_REVIEWS_QUERY_KEY, statusFilter] as const
  const query = useQuery({
    queryKey,
    queryFn: () => getProviderReviewsRequest({ statusFilter }),
    staleTime: 60 * 1000,
  })

  const approveReviewMutation = useMutation({
    mutationFn: approveReviewRequest,
    onSuccess: async (updatedReview) => {
      queryClient.setQueryData<Review[]>(queryKey, (current = []) =>
        current.map((review) => (review.id === updatedReview.id ? updatedReview : review)),
      )
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: PROVIDER_REVIEWS_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: ['business-reviews', updatedReview.business_id] }),
        queryClient.invalidateQueries({ queryKey: ['provider-businesses'] }),
      ])
    },
  })

  const rejectReviewMutation = useMutation({
    mutationFn: rejectReviewRequest,
    onSuccess: async (deletedId) => {
      queryClient.setQueryData<Review[]>(queryKey, (current = []) =>
        current.filter((review) => review.id !== deletedId),
      )
      await queryClient.invalidateQueries({ queryKey: PROVIDER_REVIEWS_QUERY_KEY })
    },
  })

  return {
    reviews: query.data ?? [],
    isLoadingReviews: query.isLoading,
    approveReview: approveReviewMutation.mutateAsync,
    rejectReview: rejectReviewMutation.mutateAsync,
    isApprovingReview: approveReviewMutation.isPending,
    isRejectingReview: rejectReviewMutation.isPending,
  }
}
