import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, TEST_USERS } from '../context/AuthContext.jsx'

export default function Login() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!email || !password) return setError('Introduce correo y contraseña.')
    if (!login(email, password)) return setError('Credenciales incorrectas. Usa una de las cuentas de prueba.')
    navigate('/')
  }

  if (user) {
    return (
      <section className="section section-cream page-top">
        <div className="container narrow">
          <div className="panel">
            <h1 className="h-lg">Hola, {user.name}</h1>
            <p className="muted">Sesión iniciada como {user.email} ({user.role}).</p>
            <div className="confirm-actions">
              {user.role === 'admin' && <button className="btn btn-accent" onClick={() => navigate('/admin')}>Abrir back-office</button>}
              <button className="btn btn-dark" onClick={logout}>Cerrar sesión</button>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section section-cream page-top">
      <div className="container narrow">
        <form className="panel" onSubmit={submit} noValidate>
          <h1 className="h-lg">Iniciar sesión</h1>
          <div className="field">
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" />
          </div>
          <div className="field">
            <label htmlFor="password">Contraseña</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
          </div>
          {error && <p className="alert" role="alert">{error}</p>}
          <button className="btn btn-accent btn-block">Entrar</button>

          <div className="test-note">
            <strong>Cuentas de prueba</strong> (ficticias):
            <ul>
              {TEST_USERS.map((u) => (
                <li key={u.email}>{u.role}: <code>{u.email}</code> / <code>{u.password}</code></li>
              ))}
            </ul>
          </div>
        </form>
      </div>
    </section>
  )
}