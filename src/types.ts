export type UserRole = 'customer' | 'provider' | 'admin'

export interface User {
  id: string
  full_name: string
  email: string | null
  phone: string | null
  avatar_url: string | null
  is_blocked: boolean
  role: UserRole
  organization_name?: string | null
  responsible_person?: string | null
  provider_category_ids?: string[]
  created_at: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  role: UserRole
}

export interface LoginPayload {
  identifier?: string
  email?: string
  phone?: string
  password: string
}

export interface GoogleLoginPayload {
  id_token: string
}

export interface RegisterPayload {
  full_name: string
  email: string
  phone: string
  password: string
  organization_name: string
  responsible_person: string
  category_ids: string[]
}

export interface UserUpdatePayload {
  full_name?: string
  email?: string | null
  phone?: string | null
  role?: UserRole
  is_blocked?: boolean
  organization_name?: string | null
  responsible_person?: string | null
  provider_category_ids?: string[]
}

export interface UserListResponse {
  items: User[]
  total: number
  limit: number
  offset: number
  active_count: number
  blocked_count: number
}

export interface Category {
  id: string
  name: string
  icon: string | null
  created_at: string
}

export interface Business {
  id: string
  owner_id: string
  category_id: string
  name: string
  description: string | null
  phone: string | null
  logo_url: string | null
  address: string
  latitude: number
  longitude: number
  working_days: string | null
  open_time: string | null
  close_time: string | null
  images: string[]
  is_verified: boolean
  created_at: string
  category?: Category | null
  rating_average: number | null
  rating_count: number
  reviewStats?: {
    ratingAverage: number | null
    ratingCount: number
  }
}

export interface BusinessListResponse {
  items: Business[]
  total: number
  limit: number
  offset: number
  pending_count: number
  verified_count: number
}

export interface BusinessCreatePayload {
  category_id: string
  name: string
  description?: string | null
  phone?: string | null
  logo_url?: string | null
  address: string
  latitude: number
  longitude: number
  working_days?: string | null
  open_time?: string | null
  close_time?: string | null
  images: string[]
}

export type BusinessUpdatePayload = Partial<BusinessCreatePayload>

export interface Review {
  id: string
  business_id: string
  user_id: string
  rating: number
  comment: string | null
  is_approved: boolean
  created_at: string
  user?: User | null
  business?: Business | null
}
