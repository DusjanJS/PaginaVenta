import { createContext, useContext, useState, useCallback } from 'react'
export const TEST_USERS = [
  { email: 'cliente@ucam.test', password: 'demo1234', name: 'Cliente Demo', role: 'cliente' },
  { email: 'admin@ucam.test', password: 'admin1234', name: 'Admin Demo', role: 'admin' },
]
const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback } catch { return fallback } }
const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)
// Solo demostración local. Sustituir por autenticación del servidor al integrar el backend.
async function digest(password, salt) {
  const bytes = new TextEncoder().encode(salt + password)
  return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join('')
}
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => read('ucam_user', null))
  const [authView, setAuthView] = useState(null)
  const openAccount = useCallback((view = 'login') => setAuthView(view), [])
  const save = session => { localStorage.setItem('ucam_user', JSON.stringify(session)); setUser(session); return true }
  const login = async (email, password) => {
    if (user) return 'Cierra la sesión actual antes de entrar en otra cuenta.'
    email = email.trim().toLowerCase()
    const demo = TEST_USERS.find(u => u.email === email && u.password === password)
    if (demo) {
      const dates = read('ucam_demo_dates', {})
      dates[email] ??= new Date().toISOString()
      localStorage.setItem('ucam_demo_dates', JSON.stringify(dates))
      return save({ email, name: demo.name, role: demo.role, joinedAt: dates[email] })
    }
    const found = read('ucam_accounts', []).find(u => u.email === email)
    if (!found || await digest(password, found.salt) !== found.hash) return false
    return save({ email, name: found.name, role: 'cliente', joinedAt: found.joinedAt })
  }
  const register = async ({ name, email, password, confirm }) => {
    if (user) return 'Ya tienes una sesión iniciada.'
    email = email.trim().toLowerCase(); name = name.trim()
    if (name.length < 3 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8) return 'Revisa tus datos. La contraseña debe tener al menos 8 caracteres.'
    if (password !== confirm) return 'Las contraseñas no coinciden.'
    const accounts = read('ucam_accounts', [])
    if ([...accounts, ...TEST_USERS].some(u => u.email === email)) return 'Ya existe una cuenta con este correo. Inicia sesión.'
    const salt = crypto.randomUUID(), joinedAt = new Date().toISOString()
    const hash = await digest(password, salt)
    localStorage.setItem('ucam_accounts', JSON.stringify([...accounts, { name, email, salt, hash, joinedAt }]))
    return save({ name, email, role: 'cliente', joinedAt })
  }
  const logout = () => { localStorage.removeItem('ucam_user'); setUser(null); setAuthView('login') }
  return <AuthContext.Provider value={{ user, login, register, logout, authView, openAccount, closeAccount: () => setAuthView(null) }}>{children}</AuthContext.Provider>
}
