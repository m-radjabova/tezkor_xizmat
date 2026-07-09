export type CategoryType = 'income' | 'expense'

export interface Category {
  id: string
  user_id: string
  name: string
  icon: string | null
  color: string | null
  type: CategoryType
  created_at: string
}

export interface CategoryPayload {
  name: string
  icon?: string | null
  color?: string | null
  type: CategoryType
}
