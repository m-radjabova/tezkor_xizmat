export type DebtStatus = 'active' | 'paid'

export interface Debt {
  id: string
  user_id: string
  title: string
  total_amount: string
  paid_amount: string
  minimum_payment: string | null
  due_date: string | null
  status: DebtStatus
  created_at: string
  updated_at: string
}

export interface DebtPayload {
  title: string
  total_amount: number
  paid_amount?: number
  minimum_payment?: number | null
  due_date?: string | null
  status?: DebtStatus
}
