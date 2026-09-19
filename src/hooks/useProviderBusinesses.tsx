import { useMutation, useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Business, BusinessCreatePayload, BusinessUpdatePayload } from '../types'

export const PROVIDER_BUSINESSES_QUERY_KEY = ['provider-businesses'] as const
const PUBLIC_BUSINESSES_QUERY_KEY = ['businesses'] as const

interface BusinessesPage {
  items: Business[]
  nextOffset: number
  hasMore: boolean
}

async function getProviderBusinessesRequest() {
  const { data } = await apiClient.get<Business[]>('/businesses/my')
  return data
}

async function createProviderBusinessRequest(payload: BusinessCreatePayload) {
  const { data } = await apiClient.post<Business>('/businesses', payload)
  return data
}

async function updateProviderBusinessRequest({
  id,
  payload,
}: {
  id: string
  payload: BusinessUpdatePayload
}) {
  const { data } = await apiClient.patch<Business>(`/businesses/${id}`, payload)
  return data
}

async function deleteProviderBusinessRequest(id: string) {
  await apiClient.delete(`/businesses/${id}`)
  return id
}

export async function uploadBusinessImages(files: File[]) {
  if (!files.length) return []

  const formData = new FormData()
  files.forEach((file) => formData.append('files', file))

  const { data } = await apiClient.post<{ urls: string[] }>('/uploads/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data.urls
}

export async function uploadBusinessLogo(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await apiClient.post<{ url: string }>('/uploads/business-logo', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return data.url
}

export function useProviderBusinesses() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: PROVIDER_BUSINESSES_QUERY_KEY,
    queryFn: getProviderBusinessesRequest,
    staleTime: 60 * 1000,
  })

  const createBusinessMutation = useMutation({
    mutationFn: createProviderBusinessRequest,
    onSuccess: async (createdBusiness) => {
      queryClient.setQueryData<Business[]>(PROVIDER_BUSINESSES_QUERY_KEY, (current = []) => [
        createdBusiness,
        ...current.filter((business) => business.id !== createdBusiness.id),
      ])

      queryClient.setQueriesData<InfiniteData<BusinessesPage>>(
        { queryKey: PUBLIC_BUSINESSES_QUERY_KEY },
        (current) => {
          if (!current?.pages?.length) return current

          return {
            ...current,
            pages: current.pages.map((page, index) => {
              const filteredItems = page.items.filter((business) => business.id !== createdBusiness.id)
              if (index !== 0) {
                return { ...page, items: filteredItems }
              }

              return {
                ...page,
                items: [createdBusiness, ...filteredItems].slice(0, page.items.length || 8),
              }
            }),
          }
        },
      )

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: PROVIDER_BUSINESSES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PUBLIC_BUSINESSES_QUERY_KEY }),
        queryClient.refetchQueries({ queryKey: PUBLIC_BUSINESSES_QUERY_KEY, type: 'all' }),
      ])
    },
  })

  const updateBusinessMutation = useMutation({
    mutationFn: updateProviderBusinessRequest,
    onSuccess: async (updatedBusiness) => {
      queryClient.setQueryData<Business[]>(PROVIDER_BUSINESSES_QUERY_KEY, (current = []) =>
        current.map((business) =>
          business.id === updatedBusiness.id
            ? { ...business, ...updatedBusiness }
            : business,
        ),
      )

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: PROVIDER_BUSINESSES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PUBLIC_BUSINESSES_QUERY_KEY }),
      ])
    },
  })

  const deleteBusinessMutation = useMutation({
    mutationFn: deleteProviderBusinessRequest,
    onSuccess: async (deletedId) => {
      queryClient.setQueryData<Business[]>(PROVIDER_BUSINESSES_QUERY_KEY, (current = []) =>
        current.filter((business) => business.id !== deletedId),
      )

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: PROVIDER_BUSINESSES_QUERY_KEY }),
        queryClient.invalidateQueries({ queryKey: PUBLIC_BUSINESSES_QUERY_KEY }),
      ])
    },
  })

  return {
    businesses: query.data ?? [],
    isLoadingBusinesses: query.isLoading,
    isFetchingBusinesses: query.isFetching,
    isErrorBusinesses: query.isError,
    refetchBusinesses: query.refetch,
    createBusiness: createBusinessMutation.mutateAsync,
    updateBusiness: updateBusinessMutation.mutateAsync,
    deleteBusiness: deleteBusinessMutation.mutateAsync,
    isCreatingBusiness: createBusinessMutation.isPending,
    isUpdatingBusiness: updateBusinessMutation.isPending,
    isDeletingBusiness: deleteBusinessMutation.isPending,
  }
}
