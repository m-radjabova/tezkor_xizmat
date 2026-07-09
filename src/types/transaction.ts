export type TransactionType = 'income' | 'expense'

export interface TransactionItem {
  id: string
  user_id: string
  category_id: string | null
  title: string
  amount: string
  type: TransactionType
  transaction_date: string
  description: string | null
  tags: string[]
  created_at: string
  updated_at: string
}

export interface TransactionPayload {
  category_id?: string | null
  title: string
  amount: number
  type: TransactionType
  transaction_date: string
  description?: string | null
  tags?: string[]
}
