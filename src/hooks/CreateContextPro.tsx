import { useEffect, useReducer, type Dispatch, type ReactNode } from 'react'
import apiClient from '../apiClient/apiClient'
import { MyContext } from '../context/MyContext'
import type { AuthTokens, GoogleLoginPayload, LoginPayload, RegisterPayload, User } from '../types'
import { clearAuthStorage, clearStoredUser, getAccessToken, getRefreshToken, saveTokens } from '../utils/storage'
import { showInfoToast, showSuccessToast } from '../utils/toast'

export interface TypeState {
  user: User | null
  isLoading: boolean
}

type SetUserAction = { type: 'SET_USER'; payload: User | null }
type SetLoadingAction = { type: 'SET_LOADING'; payload: boolean }
type UpdateUserAction = { type: 'UPDATE_USER'; payload: Partial<User> }
type LogoutAction = { type: 'LOGOUT' }

type Action = SetUserAction | SetLoadingAction | UpdateUserAction | LogoutAction

export interface ContextType {
  state: TypeState
  dispatch: Dispatch<Action>
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<User>
  loginWithGoogle: (payload: GoogleLoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
  refreshSession: () => Promise<void>
  setCurrentUser: (user: User | null) => void
}

const initialState: TypeState = {
  user: null,
  isLoading: true,
}

function reducer(state: TypeState, action: Action): TypeState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'UPDATE_USER':
      return state.user ? { ...state, user: { ...state.user, ...action.payload } } : state

    case 'LOGOUT':
      return { ...state, user: null, isLoading: false }

    default:
      return state
  }
}

function CreateContextPro({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const setCurrentUser = (user: User | null) => {
    dispatch({ type: 'SET_USER', payload: user })
  }

  const fetchMe = async () => {
    const { data } = await apiClient.get<User>('/auth/me')
    dispatch({ type: 'SET_USER', payload: data })
    return data
  }

  const refreshSession = async () => {
    const refreshToken = getRefreshToken()

    if (!refreshToken) {
      clearAuthStorage()
      dispatch({ type: 'LOGOUT' })
      return
    }

    const { data } = await apiClient.post<AuthTokens>('/auth/refresh', {
      refresh_token: refreshToken,
    })

    saveTokens(data)
    await fetchMe()
  }

  const login = async (payload: LoginPayload) => {
    const { data } = await apiClient.post<AuthTokens>('/auth/provider/login', payload)
    saveTokens(data)

    const currentUser = await fetchMe()
    showSuccessToast("Muvaffaqiyatli tizimga kirdingiz!")
    return currentUser
  }

  const loginWithGoogle = async (payload: GoogleLoginPayload) => {
    const { data } = await apiClient.post<AuthTokens>('/auth/customer/google', payload)
    saveTokens(data)

    await fetchMe()
    showSuccessToast("Google orqali tizimga kirdingiz!")
  }

  const register = async (payload: RegisterPayload) => {
    const { data } = await apiClient.post<AuthTokens>('/auth/provider/register', payload)
    saveTokens(data)

    await fetchMe()
    showSuccessToast("Muvaffaqiyatli ro'yhatdan o'tdingiz!")
  }

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout')
    } catch {
      // Internet yoki serverda muammo bo'lsa ham local logout ishlashi kerak.
    }

    clearAuthStorage()
    dispatch({ type: 'LOGOUT' })
    showInfoToast("Tizimdan chiqdingiz!")
  }

  useEffect(() => {
    let isMounted = true

    async function startAuth() {
      try {
        clearStoredUser()

        if (getAccessToken()) {
          const { data } = await apiClient.get<User>('/auth/me')
          if (!isMounted) return
          dispatch({ type: 'SET_USER', payload: data })
          return
        }

        if (getRefreshToken()) {
          const { data } = await apiClient.post<AuthTokens>('/auth/refresh', {
            refresh_token: getRefreshToken(),
          })

          saveTokens(data)

          const meResponse = await apiClient.get<User>('/auth/me')
          if (!isMounted) return
          dispatch({ type: 'SET_USER', payload: meResponse.data })
          return
        }

        if (isMounted) {
          dispatch({ type: 'SET_USER', payload: null })
        }
      } catch {
        clearAuthStorage()
        if (isMounted) {
          dispatch({ type: 'SET_USER', payload: null })
        }
      } finally {
        if (isMounted) {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      }
    }

    void startAuth()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <MyContext.Provider
      value={{
        state,
        dispatch,
        user: state.user,
        isLoading: state.isLoading,
        isAuthenticated: Boolean(state.user),
        login,
        loginWithGoogle,
        register,
        logout,
        refreshSession,
        setCurrentUser,
      }}
    >
      {children}
    </MyContext.Provider>
  )
}

export default CreateContextPro
