export interface Budget {
  id: string
  user_id: string
  category_id: string | null
  month: number
  year: number
  limit_amount: string
  created_at: string
  updated_at: string
}

export interface BudgetPayload {
  category_id?: string | null
  month: number
  year: number
  limit_amount: number
}
