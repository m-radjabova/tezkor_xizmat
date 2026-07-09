import type { UserRole } from './auth'

export type SupportedCurrency = 'USD' | 'UZS' | 'EUR' | 'RUB'

export interface User {
  id: string
  full_name: string
  email: string
  avatar_url: string | null
  role: UserRole
  currency: SupportedCurrency
  created_at: string
  updated_at: string
}

export interface UserUpdatePayload {
  full_name?: string
  email?: string
  role?: UserRole
  currency?: SupportedCurrency
}
