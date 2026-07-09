export interface SavingsGoal {
  id: string
  user_id: string
  title: string
  target_amount: string
  current_amount: string
  deadline: string | null
  icon: string | null
  color: string | null
  created_at: string
  updated_at: string
}

export interface SavingsGoalPayload {
  title: string
  target_amount: number
  current_amount?: number
  deadline?: string | null
  icon?: string | null
  color?: string | null
}
