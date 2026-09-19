import axios from 'axios'

export function getErrorMessage(error: unknown, fallback = 'Xatolik yuz berdi') {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail
    if (typeof detail === 'string') return detail
    if (Array.isArray(detail) && detail[0]?.msg) return detail[0].msg
  }

  if (error instanceof Error) return error.message

  return fallback
}
