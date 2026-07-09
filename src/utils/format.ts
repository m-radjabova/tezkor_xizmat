import { getStoredLanguage, getStoredUser } from './storage'
import { translate } from './i18n'

const currencyMap = {
  USD: { locale: 'en-US', currency: 'USD', rate: 1 },
  UZS: { locale: 'uz-UZ', currency: 'UZS', rate: 12600 },
  EUR: { locale: 'de-DE', currency: 'EUR', rate: 0.92 },
  RUB: { locale: 'ru-RU', currency: 'RUB', rate: 89 },
} as const

const localeMap = {
  en: 'en-US',
  ru: 'ru-RU',
  uz: 'uz-UZ',
} as const

type CurrencyCode = keyof typeof currencyMap
type LanguageCode = keyof typeof localeMap

function getSafeCurrency(currency?: string | null): CurrencyCode {
  if (currency && currency in currencyMap) {
    return currency as CurrencyCode
  }

  return 'USD'
}

function getSafeLanguage(language?: string | null): LanguageCode {
  if (language && language in localeMap) {
    return language as LanguageCode
  }

  return 'en'
}

export function formatCurrency(value: number | string | null | undefined) {
  const user = getStoredUser()
  const currencyCode = getSafeCurrency(user?.currency)
  const selectedCurrency = currencyMap[currencyCode]

  const amount = Number(value) || 0
  const convertedAmount = amount * selectedCurrency.rate

  if (currencyCode === 'UZS') {
    const formattedAmount = new Intl.NumberFormat(selectedCurrency.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(convertedAmount)

    return `${formattedAmount} so'm`
  }

  return new Intl.NumberFormat(selectedCurrency.locale, {
    style: 'currency',
    currency: selectedCurrency.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(convertedAmount)
}

export function formatShortDate(value?: string | null) {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  const language = getSafeLanguage(getStoredLanguage())

  return new Intl.DateTimeFormat(localeMap[language], {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function formatMonthYear(month: number, year: number) {
  if (!month || !year) return '-'

  const date = new Date(year, month - 1, 1)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  const language = getSafeLanguage(getStoredLanguage())

  return new Intl.DateTimeFormat(localeMap[language], {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatUserRole(role?: string | null) {
  switch (role) {
    case 'admin':
      return translate('role_admin')
    case 'user':
      return translate('role_user')
    default:
      return translate('role_user')
  }
}

export function toDateInputValue(value?: string | null) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}
