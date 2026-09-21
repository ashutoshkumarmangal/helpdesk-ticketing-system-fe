import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import * as authApi from '../api/auth'
import { clearToken, getToken, setToken } from '../api/client'

const AuthContext = createContext(null)

const USER_KEY = 'helpdesk_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(USER_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (!getToken() && !user) {
      localStorage.removeItem(USER_KEY)
    }
  }, [user])

  const persistSession = useCallback(({ accessToken, user: profile }) => {
    setToken(accessToken)
    localStorage.setItem(USER_KEY, JSON.stringify(profile))
    setUser(profile)
  }, [])

  const login = useCallback(
    async (credentials) => {
      const data = await authApi.login(credentials)
      persistSession(data)
      return data.user
    },
    [persistSession],
  )

  const register = useCallback(
    async (profile) => {
      const data = await authApi.register(profile)
      persistSession(data)
      return data.user
    },
    [persistSession],
  )

  const logout = useCallback(() => {
    clearToken()
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout, isAuthenticated: Boolean(user) }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export { AuthContext }