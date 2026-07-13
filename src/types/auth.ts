export type UserRole = 'user' | 'admin'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  full_name: string
  email: string
  password: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  role: UserRole
}

export interface GoogleLoginPayload {
  id_token: string
}
