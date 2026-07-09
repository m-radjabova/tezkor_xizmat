import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { clearAuthStorage, getAccessToken, getRefreshToken, saveTokens } from '../utils/storage'
import type { AuthTokens } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000'

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean }

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined

    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error)
    }

    if (originalRequest.url?.includes('/auth/login') || originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error)
    }

    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearAuthStorage()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const { data } = await axios.post<AuthTokens>(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      })

      saveTokens(data)
      originalRequest.headers.Authorization = `Bearer ${data.access_token}`

      return apiClient(originalRequest)
    } catch (refreshError) {
      clearAuthStorage()
      return Promise.reject(refreshError)
    }
  },
)

export default apiClient
