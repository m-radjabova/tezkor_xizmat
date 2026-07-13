import type { User } from './user'
import type { GoogleLoginPayload, LoginPayload, RegisterPayload } from './auth'

export * from './auth'
export * from './budget'
export * from './category'
export * from './debt'
export * from './note'
export * from './notification'
export * from './recurring-transaction'
export * from './savings-goal'
export * from './transaction'
export * from './user'

export interface AuthContextValue {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  loginWithGoogle: (payload: GoogleLoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => void
  refreshSession: () => Promise<void>
  setCurrentUser: (user: User | null) => void
}
