import { useEffect, useState, type ReactNode } from 'react'
import apiClient from '../apiClient/apiClient'
import { AuthContext } from './auth-context'
import type { AuthTokens, LoginPayload, RegisterPayload, User } from '../types'
import { showInfoToast, showSuccessToast } from '../utils/toast'
import { translate } from '../utils/i18n'
import { clearAuthStorage, getAccessToken, getRefreshToken, getStoredUser, saveTokens, saveUser } from '../utils/storage'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(getStoredUser())
  const [isLoading, setIsLoading] = useState(true)

  const setCurrentUser = (nextUser: User | null) => {
    setUser(nextUser)

    if (nextUser) {
      saveUser(nextUser)
    }
  }

  const fetchMe = async () => {
    const { data } = await apiClient.get<User>('/auth/me')
    setUser(data)
    saveUser(data)
    return data
  }

  const login = async (payload: LoginPayload) => {
    const { data } = await apiClient.post<AuthTokens>('/auth/login', payload)
    saveTokens(data)
    await fetchMe()
    showSuccessToast(translate('toast.login_success'))
  }

  const register = async (payload: RegisterPayload) => {
    await apiClient.post<User>('/users/register', payload)
    await login({ email: payload.email, password: payload.password })
    showSuccessToast(translate('toast.account_created'))
  }

  const refreshSession = async () => {
    const storedRefreshToken = getRefreshToken()
    if (!storedRefreshToken) {
      clearAuthStorage()
      setUser(null)
      return
    }

    const { data } = await apiClient.post<AuthTokens>('/auth/refresh', {
      refresh_token: storedRefreshToken,
    })

    saveTokens(data)
    await fetchMe()
  }

  const logout = () => {
    clearAuthStorage()
    setUser(null)
    showInfoToast(translate('toast.logged_out'))
  }

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        const accessToken = getAccessToken()
        const refreshToken = getRefreshToken()

        if (accessToken) {
          const { data } = await apiClient.get<User>('/auth/me')
          if (!isMounted) return
          setUser(data)
          saveUser(data)
        } else if (refreshToken) {
          const { data } = await apiClient.post<AuthTokens>('/auth/refresh', {
            refresh_token: refreshToken,
          })

          saveTokens(data)

          const meResponse = await apiClient.get<User>('/auth/me')
          if (!isMounted) return
          setUser(meResponse.data)
          saveUser(meResponse.data)
        } else if (isMounted) {
          setUser(null)
        }
      } catch {
        clearAuthStorage()
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void initializeAuth()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        login,
        register,
        logout,
        refreshSession,
        setCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
