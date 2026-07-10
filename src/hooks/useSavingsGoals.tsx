import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import apiClient from '../apiClient/apiClient'
import type { SavingsGoal, SavingsGoalPayload } from '../types'
import { getErrorMessage } from '../utils/error'
import { translate } from '../utils/i18n'
import { showErrorToast, showSuccessToast } from '../utils/toast'

const SAVINGS_GOALS_QUERY_KEY = ['savings-goals']

async function getSavingsGoalsRequest() {
  const { data } = await apiClient.get<SavingsGoal[]>('/savings-goals/')
  return data
}

async function createSavingsGoalRequest(payload: SavingsGoalPayload) {
  const { data } = await apiClient.post<SavingsGoal>('/savings-goals/', payload)
  return data
}

async function updateSavingsGoalRequest(id: string, payload: Partial<SavingsGoalPayload>) {
  const { data } = await apiClient.patch<SavingsGoal>(`/savings-goals/${id}`, payload)
  return data
}

async function deleteSavingsGoalRequest(id: string) {
  await apiClient.delete(`/savings-goals/${id}`)
}

async function addSavingsDepositRequest({ id, amount }: { id: string; amount: number }) {
  const { data } = await apiClient.post<SavingsGoal>(`/savings-goals/${id}/deposits`, { amount })
  return data
}

export function useSavingsGoals() {
  const queryClient = useQueryClient()

  const goalsQuery = useQuery({
    queryKey: SAVINGS_GOALS_QUERY_KEY,
    queryFn: getSavingsGoalsRequest,
  })

  const createMutation = useMutation({
    mutationFn: createSavingsGoalRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.savings_goal_created'))
      void queryClient.invalidateQueries({ queryKey: SAVINGS_GOALS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.savings_goal_create_failed')))
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<SavingsGoalPayload> }) => updateSavingsGoalRequest(id, payload),
    onSuccess: () => {
      showSuccessToast(translate('toast.savings_goal_updated'))
      void queryClient.invalidateQueries({ queryKey: SAVINGS_GOALS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.savings_goal_update_failed')))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteSavingsGoalRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.savings_goal_deleted'))
      void queryClient.invalidateQueries({ queryKey: SAVINGS_GOALS_QUERY_KEY })
    },
    onError: (error) => {
      showErrorToast(getErrorMessage(error, translate('toast.savings_goal_delete_failed')))
    },
  })

  const depositMutation = useMutation({
    mutationFn: addSavingsDepositRequest,
    onSuccess: () => {
      showSuccessToast(translate('toast.savings_deposit_added'))
      void queryClient.invalidateQueries({ queryKey: SAVINGS_GOALS_QUERY_KEY })
    },
    onError: (error) => showErrorToast(getErrorMessage(error, translate('toast.savings_deposit_failed'))),
  })

  return {
    savingsGoals: goalsQuery.data ?? [],
    isLoading: goalsQuery.isLoading,
    isFetching: goalsQuery.isFetching,
    createSavingsGoal: createMutation.mutate,
    updateSavingsGoal: updateMutation.mutate,
    deleteSavingsGoal: deleteMutation.mutate,
    addDeposit: depositMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAddingDeposit: depositMutation.isPending,
  }
}
