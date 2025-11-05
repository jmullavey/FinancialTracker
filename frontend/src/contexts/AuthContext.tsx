import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '../services/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  emailVerified?: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<{ requiresVerification?: boolean; emailSent?: boolean; user?: User }>
  resendVerificationEmail: (email: string) => Promise<any>
  verifyEmail: (token: string) => Promise<any>
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      loadUser()
    } else {
      setLoading(false)
    }
  }, [])

  const loadUser = async () => {
    try {
      const response = await api.get('/auth/me')
      setUser(response.data.user)
    } catch (error) {
      console.error('Failed to load user:', error)
      localStorage.removeItem('token')
      delete api.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user: userData, emailVerified, canResend } = response.data
      
      // Check if email verification is required
      if (response.status === 403 && !emailVerified && canResend) {
        throw new Error('EMAIL_VERIFICATION_REQUIRED')
      }
      
      if (token) {
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
      }
    } catch (error: any) {
      if (error.message === 'EMAIL_VERIFICATION_REQUIRED') {
        throw error
      }
      throw new Error(error.response?.data?.error || 'Login failed')
    }
  }

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    try {
      const response = await api.post('/auth/register', { 
        email, 
        password, 
        firstName, 
        lastName 
      })
      const { token, user: userData, requiresVerification, emailSent } = response.data
      
      // If email verification is required and no token is provided, don't auto-login
      if (requiresVerification && !token) {
        return { requiresVerification: true, emailSent, user: userData }
      }
      
      if (token) {
        localStorage.setItem('token', token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setUser(userData)
      }
      
      return { requiresVerification: false, user: userData }
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed')
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      const response = await api.post('/auth/resend-verification', { email })
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Failed to resend verification email')
    }
  }

  const verifyEmail = async (token: string) => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`)
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Email verification failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    delete api.defaults.headers.common['Authorization']
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, resendVerificationEmail, verifyEmail, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
