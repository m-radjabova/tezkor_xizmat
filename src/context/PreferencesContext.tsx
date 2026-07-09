import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { PreferencesContext, type AppCurrency, type AppLanguage, type DateFilter, type ThemeMode } from './preferences-context'
import { useAuth } from '../hooks/useAuth'
import { useProfile } from '../hooks/useProfile'
import { getTranslations } from '../utils/i18n'
import { getStoredLanguage, getStoredThemeMode, saveLanguage, saveThemeMode } from '../utils/storage'

interface PreferencesProviderProps {
  children: ReactNode
}

const themeModePalettes: Record<ThemeMode, Record<string, string>> = {
  light: {
    '--color-bg': '#f8fafc',
    '--color-surface': '#ffffff',
    '--color-surface-soft': '#f1f5f9',
    '--color-surface-strong': 'rgba(255,255,255,0.92)',
    '--color-surface-muted': 'rgba(248,250,252,0.88)',

    '--color-border': '#e2e8f0',
    '--color-border-strong': '#cbd5e1',

    '--color-text': '#0f172a',
    '--color-text-muted': '#64748b',

    '--color-primary': '#4f46e5',
    '--color-primary-soft': '#818cf8',
    '--color-primary-pale': '#eef2ff',

    '--color-success': '#10b981',
    '--color-success-soft': '#d1fae5',

    '--color-danger': '#ef4444',
    '--color-danger-soft': '#fee2e2',

    '--color-warning': '#f59e0b',
    '--color-warning-soft': '#fef3c7',

    '--color-purple': '#8b5cf6',
    '--color-purple-soft': '#ede9fe',

    '--color-overlay': 'rgba(15,23,42,0.08)',

    '--shadow-card': '0 10px 30px rgba(15,23,42,0.08)',
    '--shadow-soft': '0 4px 16px rgba(15,23,42,0.05)',
  },

  dark: {
    '--color-bg': '#0f172a',
    '--color-surface': '#111827',
    '--color-surface-soft': '#1e293b',
    '--color-surface-strong': 'rgba(17,24,39,0.94)',
    '--color-surface-muted': 'rgba(30,41,59,0.88)',

    '--color-border': '#334155',
    '--color-border-strong': '#475569',

    '--color-text': '#f8fafc',
    '--color-text-muted': '#94a3b8',

    '--color-primary': '#6366f1',
    '--color-primary-soft': '#818cf8',
    '--color-primary-pale': '#1e1b4b',

    '--color-success': '#34d399',
    '--color-success-soft': '#052e2b',

    '--color-danger': '#f87171',
    '--color-danger-soft': '#3b1212',

    '--color-warning': '#fbbf24',
    '--color-warning-soft': '#422006',

    '--color-purple': '#a78bfa',
    '--color-purple-soft': '#2e1065',

    '--color-overlay': 'rgba(0,0,0,0.55)',

    '--shadow-card': '0 18px 45px rgba(0,0,0,0.35)',
    '--shadow-soft': '0 10px 25px rgba(0,0,0,0.22)',
  },
};

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const { user, setCurrentUser } = useAuth()
  const { updateMe } = useProfile()
  const [dateFilter, setDateFilter] = useState<DateFilter>('month')
  const [transactionSearch, setTransactionSearch] = useState('')
  const [languageOverride, setLanguageOverride] = useState<AppLanguage | null>(() => getStoredLanguage())
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => getStoredThemeMode() ?? 'light')
  const language = languageOverride ?? 'en'
  const currency = (user?.currency as AppCurrency | undefined) ?? 'USD'

  useEffect(() => {
    Object.entries(themeModePalettes[themeMode]).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
    document.documentElement.dataset.theme = themeMode
  }, [themeMode])

  useEffect(() => {
    saveLanguage(language)
  }, [language])

  useEffect(() => {
    saveThemeMode(themeMode)
  }, [themeMode])

  const updateCurrencyPreference = async (value: AppCurrency) => {
    if (!user) return
    const updatedUser = await updateMe({ currency: value }, { silent: true })
    setCurrentUser(updatedUser)
  }

  const setLanguage = (value: AppLanguage) => {
    setLanguageOverride(value)
    saveLanguage(value)
  }

  const setCurrency = (value: AppCurrency) => {
    void updateCurrencyPreference(value)
  }

  const setThemeMode = (value: ThemeMode) => {
    setThemeModeState(value)
    saveThemeMode(value)
  }

  const t = useMemo(() => {
    const dict = getTranslations(language)
    return (key: string, params?: Record<string, string | number>) => {
      const template = dict[key] ?? key

      if (!params) return template

      return Object.entries(params).reduce(
        (result, [paramKey, value]) => result.replaceAll(`{{${paramKey}}}`, String(value)),
        template,
      )
    }
  }, [language])

  return (
    <PreferencesContext.Provider
      value={{
        language,
        currency,
        themeMode,
        dateFilter,
        transactionSearch,
        setLanguage,
        setCurrency,
        setThemeMode,
        setDateFilter,
        setTransactionSearch,
        t,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  )
}
