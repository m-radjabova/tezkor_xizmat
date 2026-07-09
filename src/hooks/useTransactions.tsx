import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { TransactionItem, TransactionPayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const TRANSACTIONS_QUERY_KEY = ['transactions']

async function getTransactionsRequest() {
  const { data } = await apiClient.get<TransactionItem[]>('/transactions/')
  return data
}

async function createTransactionRequest(payload: TransactionPayload) {
  const { data } = await apiClient.post<TransactionItem>('/transactions/', payload)
  return data
}

async function updateTransactionRequest(id: string, payload: Partial<TransactionPayload>) {
  const { data } = await apiClient.patch<TransactionItem>(`/transactions/${id}`, payload)
  return data
}

async function deleteTransactionRequest(id: string) {
  await apiClient.delete(`/transactions/${id}`)
}

export function useTransactions() {
  const queryClient = useQueryClient()

  const transactionsQuery = useQuery({
    queryKey: TRANSACTIONS_QUERY_KEY,
    queryFn: getTransactionsRequest,
  })

  const createMutation = useMutation({
    mutationFn: createTransactionRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.transaction_created'))
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.transaction_create_failed')))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<TransactionPayload> }) => updateTransactionRequest(id, payload),
    onSuccess: () => {
      showSuccessToast(translate('toast.transaction_updated'))
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.transaction_update_failed')))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTransactionRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.transaction_deleted'))
      void queryClient.invalidateQueries({ queryKey: TRANSACTIONS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.transaction_delete_failed')))
    },
  })

  return {
    transactions: transactionsQuery.data ?? [],
    isLoading: transactionsQuery.isLoading,
    isFetching: transactionsQuery.isFetching,
    createTransaction: createMutation.mutate,
    updateTransaction: updateMutation.mutate,
    deleteTransaction: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
