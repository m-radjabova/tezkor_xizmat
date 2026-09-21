import { useInfiniteQuery } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Business } from '../types'

const DEFAULT_LIMIT = 8

interface UseBusinessesParams {
  categoryId?: string
  search?: string
  limit?: number
  latitude?: number
  longitude?: number
  sortBy?: 'newest' | 'distance' | 'rating'
  minRating?: number
}

interface BusinessesPage {
  items: Business[]
  nextOffset: number
  hasMore: boolean
}

async function getBusinessesRequest({
  categoryId,
  search,
  limit,
  latitude,
  longitude,
  sortBy,
  minRating,
  offset,
}: Required<Pick<UseBusinessesParams, 'limit'>> &
  Pick<UseBusinessesParams, 'categoryId' | 'search' | 'latitude' | 'longitude' | 'sortBy' | 'minRating'> & { offset: number }) {
  const params: Record<string, string | number> = {
    limit,
    offset,
  }

  if (categoryId) params.category_id = categoryId
  if (search && search.trim().length >= 2) params.search = search.trim()
  if (latitude !== undefined && longitude !== undefined) {
    params.latitude = latitude
    params.longitude = longitude
    params.sort_by = sortBy ?? 'distance'
  } else if (sortBy) {
    params.sort_by = sortBy
  }
  if (minRating) params.min_rating = minRating

  const { data } = await apiClient.get<Business[]>('/businesses', { params })

  return {
    items: data,
    nextOffset: offset + data.length,
    hasMore: data.length === limit,
  } satisfies BusinessesPage
}

export function useBusinesses({
  categoryId = '',
  search = '',
  limit = DEFAULT_LIMIT,
  latitude,
  longitude,
  sortBy,
  minRating,
}: UseBusinessesParams = {}) {
  const normalizedSearch = search.trim()

  const query = useInfiniteQuery({
    queryKey: ['businesses', { categoryId, search: normalizedSearch, limit, latitude, longitude, sortBy, minRating }],
    initialPageParam: 0,
    queryFn: ({ pageParam }) =>
      getBusinessesRequest({
        categoryId,
        search: normalizedSearch,
        limit,
        latitude,
        longitude,
        sortBy,
        minRating,
        offset: pageParam,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.nextOffset : undefined),
    staleTime: 60 * 1000,
  })

  return {
    businesses: query.data?.pages.flatMap((page) => page.items) ?? [],
    isLoadingBusinesses: query.isLoading,
    isFetchingBusinesses: query.isFetching,
    isLoadingMoreBusinesses: query.isFetchingNextPage,
    hasMoreBusinesses: Boolean(query.hasNextPage),
    loadMoreBusinesses: query.fetchNextPage,
    refetchBusinesses: query.refetch,
  }
}
