export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly'

export interface RecurringTransaction {
  id: string
  user_id: string
  category_id: string | null
  title: string
  amount: string
  type: 'income' | 'expense'
  frequency: RecurringFrequency
  start_date: string
  end_date: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface RecurringTransactionPayload {
  category_id?: string | null
  title: string
  amount: number
  type: 'income' | 'expense'
  frequency: RecurringFrequency
  start_date: string
  end_date?: string | null
  is_active?: boolean
}
