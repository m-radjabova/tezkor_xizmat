import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { Budget, BudgetPayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const BUDGETS_QUERY_KEY = ['budgets']

async function getBudgetsRequest() {
  const { data } = await apiClient.get<Budget[]>('/budgets/')
  return data
}

async function createBudgetRequest(payload: BudgetPayload) {
  const { data } = await apiClient.post<Budget>('/budgets/', payload)
  return data
}

async function updateBudgetRequest(id: string, payload: Partial<BudgetPayload>) {
  const { data } = await apiClient.patch<Budget>(`/budgets/${id}`, payload)
  return data
}

async function deleteBudgetRequest(id: string) {
  await apiClient.delete(`/budgets/${id}`)
}

export function useBudgets() {
  const queryClient = useQueryClient()

  const budgetsQuery = useQuery({
    queryKey: BUDGETS_QUERY_KEY,
    queryFn: getBudgetsRequest,
  })

  const createMutation = useMutation({
    mutationFn: createBudgetRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.budget_created'))
      void queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.budget_create_failed')))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<BudgetPayload> }) => updateBudgetRequest(id, payload),
    onSuccess: () => {
      showSuccessToast(translate('toast.budget_updated'))
      void queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.budget_update_failed')))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBudgetRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.budget_deleted'))
      void queryClient.invalidateQueries({ queryKey: BUDGETS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.budget_delete_failed')))
    },
  })

  return {
    budgets: budgetsQuery.data ?? [],
    isLoading: budgetsQuery.isLoading,
    isFetching: budgetsQuery.isFetching,
    refetch: budgetsQuery.refetch,
    createBudget: createMutation.mutate,
    updateBudget: updateMutation.mutate,
    deleteBudget: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
