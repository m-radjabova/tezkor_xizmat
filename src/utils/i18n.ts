import type { AppLanguage } from '../context/preferences-context'
import enTranslations from '../locales/en.json'
import ruTranslations from '../locales/ru.json'
import { getStoredLanguage } from './storage'

const translations: Record<AppLanguage, Record<string, string>> = {
  en: enTranslations,
  ru: ruTranslations,
}

type TranslationParams = Record<string, string | number>

function interpolate(template: string, params?: TranslationParams) {
  if (!params) return template

  return Object.entries(params).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    template,
  )
}

export function getTranslations(language: AppLanguage) {
  return translations[language]
}

export function translate(
  key: string,
  params?: TranslationParams,
  options?: { fallback?: string; language?: AppLanguage },
) {
  const language = options?.language ?? getStoredLanguage() ?? 'en'
  const dict = translations[language]
  const template = dict[key] ?? options?.fallback ?? key

  return interpolate(template, params)
}
