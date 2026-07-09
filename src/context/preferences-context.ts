import { createContext } from 'react'

export type AppLanguage = 'en' | 'ru'
export type AppCurrency = 'USD' | 'UZS' | 'EUR' | 'RUB'
export type ThemeMode = 'light' | 'dark'
export type DateFilter = 'today' | 'week' | 'month' | 'year'

export interface PreferencesContextValue {
  language: AppLanguage
  currency: AppCurrency
  themeMode: ThemeMode
  dateFilter: DateFilter
  transactionSearch: string
  setLanguage: (value: AppLanguage) => void
  setCurrency: (value: AppCurrency) => void
  setThemeMode: (value: ThemeMode) => void
  setDateFilter: (value: DateFilter) => void
  setTransactionSearch: (value: string) => void
  t: (key: string, params?: Record<string, string | number>) => string
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null)
