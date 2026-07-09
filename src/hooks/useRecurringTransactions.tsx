import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { RecurringTransaction, RecurringTransactionPayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const RECURRING_TRANSACTIONS_QUERY_KEY = ['recurring-transactions']

async function getRecurringTransactionsRequest() {
  const { data } = await apiClient.get<RecurringTransaction[]>('/recurring-transactions/')
  return data
}

async function createRecurringTransactionRequest(payload: RecurringTransactionPayload) {
  const { data } = await apiClient.post<RecurringTransaction>('/recurring-transactions/', payload)
  return data
}

async function updateRecurringTransactionRequest(id: string, payload: Partial<RecurringTransactionPayload>) {
  const { data } = await apiClient.patch<RecurringTransaction>(`/recurring-transactions/${id}`, payload)
  return data
}

async function deleteRecurringTransactionRequest(id: string) {
  await apiClient.delete(`/recurring-transactions/${id}`)
}

export function useRecurringTransactions() {
  const queryClient = useQueryClient()

  const recurringQuery = useQuery({
    queryKey: RECURRING_TRANSACTIONS_QUERY_KEY,
    queryFn: getRecurringTransactionsRequest,
  })

  const createMutation = useMutation({
    mutationFn: createRecurringTransactionRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.recurring_created'))
      void queryClient.invalidateQueries({ queryKey: RECURRING_TRANSACTIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.recurring_create_failed')))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<RecurringTransactionPayload> }) =>
      updateRecurringTransactionRequest(id, payload),
    onSuccess: () => {
      showSuccessToast(translate('toast.recurring_updated'))
      void queryClient.invalidateQueries({ queryKey: RECURRING_TRANSACTIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.recurring_update_failed')))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteRecurringTransactionRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.recurring_deleted'))
      void queryClient.invalidateQueries({ queryKey: RECURRING_TRANSACTIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.recurring_delete_failed')))
    },
  })

  return {
    recurringTransactions: recurringQuery.data ?? [],
    isLoading: recurringQuery.isLoading,
    isFetching: recurringQuery.isFetching,
    createRecurringTransaction: createMutation.mutate,
    updateRecurringTransaction: updateMutation.mutate,
    deleteRecurringTransaction: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
