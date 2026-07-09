import type { AuthTokens, User } from '../types'
import type { AppLanguage, ThemeMode } from '../context/preferences-context'

const ACCESS_TOKEN_KEY = 'budget_planner_access_token'
const REFRESH_TOKEN_KEY = 'budget_planner_refresh_token'
const USER_KEY = 'budget_planner_user'
const LANGUAGE_KEY = 'budget_planner_language'
const THEME_MODE_KEY = 'budget_planner_theme_mode'

export function saveTokens(tokens: AuthTokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access_token)
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh_token)
}

export function saveUser(user: User) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function getStoredUser(): User | null {
  const rawUser = localStorage.getItem(USER_KEY)
  return rawUser ? (JSON.parse(rawUser) as User) : null
}

export function clearAuthStorage() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function saveLanguage(value: AppLanguage) {
  localStorage.setItem(LANGUAGE_KEY, value)
}

export function getStoredLanguage(): AppLanguage | null {
  const value = localStorage.getItem(LANGUAGE_KEY)
  return value === 'en' || value === 'ru' ? value : null
}

export function saveThemeMode(value: ThemeMode) {
  localStorage.setItem(THEME_MODE_KEY, value)
}

export function getStoredThemeMode(): ThemeMode | null {
  const value = localStorage.getItem(THEME_MODE_KEY)
  return value === 'light' || value === 'dark' ? value : null
}
