import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Debt, DebtPayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const DEBTS_QUERY_KEY = ['debts']

async function getDebtsRequest() {
  const { data } = await apiClient.get<Debt[]>('/debts/')
  return data
}

async function createDebtRequest(payload: DebtPayload) {
  const { data } = await apiClient.post<Debt>('/debts/', payload)
  return data
}

async function updateDebtRequest(id: string, payload: Partial<DebtPayload>) {
  const { data } = await apiClient.patch<Debt>(`/debts/${id}`, payload)
  return data
}

async function deleteDebtRequest(id: string) {
  await apiClient.delete(`/debts/${id}`)
}

export function useDebts() {
  const queryClient = useQueryClient()

  const debtsQuery = useQuery({
    queryKey: DEBTS_QUERY_KEY,
    queryFn: getDebtsRequest,
  })

  const createMutation = useMutation({
    mutationFn: createDebtRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.debt_created'))
      void queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.debt_create_failed')))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<DebtPayload> }) => updateDebtRequest(id, payload),
    onSuccess: () => {
      showSuccessToast(translate('toast.debt_updated'))
      void queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.debt_update_failed')))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDebtRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.debt_deleted'))
      void queryClient.invalidateQueries({ queryKey: DEBTS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.debt_delete_failed')))
    },
  })

  return {
    debts: debtsQuery.data ?? [],
    isLoading: debtsQuery.isLoading,
    isFetching: debtsQuery.isFetching,
    createDebt: createMutation.mutate,
    updateDebt: updateMutation.mutate,
    deleteDebt: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
