import { createContext, useContext, useState } from 'react'
import { extractToken, extractUser } from '../utils/authHelpers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (responseData) => {
    const token = extractToken(responseData)
    const userData = extractUser(responseData)
    if (!userData) {
      console.error('No se pudo extraer el usuario:', responseData)
      return
    }
    const toStore = { ...userData, token }
    localStorage.setItem('user', JSON.stringify(toStore))
    setUser(toStore)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  // Actualiza parcialmente el usuario en memoria y localStorage
  const updateUser = (partialData) => {
    setUser(prev => {
      const updated = { ...prev, ...partialData }
      localStorage.setItem('user', JSON.stringify(updated))
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}