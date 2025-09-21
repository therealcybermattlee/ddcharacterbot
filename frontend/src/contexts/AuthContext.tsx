import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { api } from '../services/api'

// Types
interface User {
  id: string
  email: string
  username: string
  role: 'player' | 'dm'
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, username: string, password: string, role?: 'player' | 'dm') => Promise<boolean>
  logout: () => void
  clearError: () => void
  checkAuthStatus: () => Promise<boolean>
}

// Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_AUTH'; payload: { user: User; token: string } }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_AUTH' }
  | { type: 'CLEAR_ERROR' }

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }

    case 'SET_AUTH':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }

    case 'CLEAR_AUTH':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }

    case 'CLEAR_ERROR':
      return { ...state, error: null }

    default:
      return state
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async (): Promise<boolean> => {
    const token = localStorage.getItem('authToken')
    if (!token) {
      dispatch({ type: 'SET_LOADING', payload: false })
      return false
    }

    try {
      const response = await api.get('/auth/profile')
      if (response.data.success) {
        dispatch({
          type: 'SET_AUTH',
          payload: {
            user: response.data.data.user,
            token,
          },
        })
        return true
      } else {
        // Invalid token, clear it
        localStorage.removeItem('authToken')
        dispatch({ type: 'CLEAR_AUTH' })
        return false
      }
    } catch (error) {
      // Token expired or invalid
      localStorage.removeItem('authToken')
      dispatch({ type: 'CLEAR_AUTH' })
      return false
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const response = await api.post('/auth/login', { email, password })

      if (response.data.success) {
        const { user, token } = response.data.data
        localStorage.setItem('authToken', token)
        dispatch({ type: 'SET_AUTH', payload: { user, token } })
        return true
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.error.message })
        return false
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Login failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return false
    }
  }

  const register = async (
    email: string,
    username: string,
    password: string,
    role: 'player' | 'dm' = 'player'
  ): Promise<boolean> => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'CLEAR_ERROR' })

    try {
      const response = await api.post('/auth/register', {
        email,
        username,
        password,
        role,
      })

      if (response.data.success) {
        const { user, token } = response.data.data
        localStorage.setItem('authToken', token)
        dispatch({ type: 'SET_AUTH', payload: { user, token } })
        return true
      } else {
        dispatch({ type: 'SET_ERROR', payload: response.data.error.message })
        return false
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error?.message || 'Registration failed'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    dispatch({ type: 'CLEAR_AUTH' })

    // Optional: Call logout endpoint to invalidate session on server
    api.post('/auth/logout').catch(() => {
      // Ignore errors - user is logged out locally anyway
    })
  }

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' })
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
    checkAuthStatus,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}