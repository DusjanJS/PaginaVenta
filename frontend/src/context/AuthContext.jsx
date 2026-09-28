import { createContext, useContext, useState } from 'react'

// Usuarios de PRUEBA (ficticios). No hay credenciales reales.
export const TEST_USERS = [
  { email: 'cliente@ucam.test', password: 'demo1234', name: 'Cliente Demo', role: 'cliente' },
  { email: 'admin@ucam.test', password: 'admin1234', name: 'Admin Demo', role: 'admin' },
]

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ucam_user')) } catch { return null }
  })

  const login = (email, password) => {
    const found = TEST_USERS.find((u) => u.email === email.trim().toLowerCase() && u.password === password)
    if (!found) return false
    const session = { email: found.email, name: found.name, role: found.role }
    localStorage.setItem('ucam_user', JSON.stringify(session))
    setUser(session)
    return true
  }

  const logout = () => {
    localStorage.removeItem('ucam_user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}