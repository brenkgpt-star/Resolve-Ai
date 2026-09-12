import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/authService.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState('login') // 'login' | 'signup' | 'forgot'

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe()
      }
    }
  }, [])

  function openLoginModal() {
    setAuthModalMode('login')
    setIsAuthModalOpen(true)
  }

  function openSignupModal() {
    setAuthModalMode('signup')
    setIsAuthModalOpen(true)
  }

  async function login(email, password) {
    return await authService.signIn(email, password)
  }

  async function signup(name, email, password) {
    return await authService.signUp(name, email, password)
  }

  async function logout() {
    return await authService.signOutUser()
  }

  async function resetPassword(email) {
    return await authService.resetPassword(email)
  }

  const value = {
    user,
    loading,
    isFirebaseActive: authService.isFirebaseActive(),
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openLoginModal,
    openSignupModal,
    login,
    signup,
    logout,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
