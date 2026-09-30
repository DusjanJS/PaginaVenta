import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getOrders, ORDER_STATUS } from '../lib/orders.js'
import { eur, fechaHora } from '../lib/format.js'
import { isWelcomeEligible } from '../lib/pricing.js'
import Modal from './Modal.jsx'
export default function AccountModal() {
  const { user, login, register, logout, authView, openAccount, closeAccount } = useAuth()
  const [error, setError] = useState(''), [busy, setBusy] = useState(false)
  const registering = authView === 'register'
  const submit = async e => {
    e.preventDefault(); setBusy(true); setError('')
    const f = Object.fromEntries(new FormData(e.currentTarget))
    try {
      const result = registering ? await register(f) : await login(f.email, f.password)
      if (result !== true) setError(result || 'Correo o contraseña incorrectos.')
    } catch { setError('No se pudo guardar la sesión. Vuelve a intentarlo.') }
    finally { setBusy(false) }
  }
  const orders = user ? getOrders().filter(o => o.customer.email === user.email) : []
  return <Modal title={user ? 'Mi cuenta' : 'UCAM Stereo'} onClose={closeAccount}>
    {user ? <div className="account-body">
      <p className="session-state">Sesión iniciada</p><h3>Hola, {user.name}</h3><p className="muted">{user.email}</p>
      {isWelcomeEligible(user) && <p className="welcome-note">Tu 10 % de bienvenida está activo durante el primer mes.</p>}
      <h3>Mis pedidos <span className="muted">({orders.length})</span></h3>
      {orders.length ? <ul className="account-orders">{orders.map(o => <li key={o.id}><Link to={`/pedido/${o.id}`} onClick={closeAccount}><strong>{o.id}</strong><span>{eur(o.totals.total)}</span><small>{fechaHora(o.createdAt)}</small><span className={`status status-${o.status}`}>{ORDER_STATUS[o.status]}</span></Link></li>)}</ul> : <p className="muted">Todavía no has realizado ningún pedido.</p>}
      {user.role === 'admin' && <Link to="/admin" onClick={closeAccount} className="btn btn-outline">Administración de prueba</Link>}
      <p className="hint">Para utilizar otra cuenta, primero debes cerrar esta sesión.</p>
      <button className="btn btn-outline" onClick={() => { logout(); setError('') }}>Cerrar sesión</button>
    </div> : <form className="account-body" onSubmit={submit}>
      <p className="muted">{registering ? 'Crea tu cuenta y descubre tu próxima escucha.' : 'Bienvenido de nuevo. Entra en tu cuenta.'}</p>
      <p className="welcome-note"><strong>10 % de descuento el primer mes</strong><br />Aplicado automáticamente a tus pedidos como cliente.</p>
      {registering && <div className="field"><label htmlFor="account-name">Nombre completo</label><input id="account-name" name="name" required minLength={3} autoComplete="name" /></div>}
      <div className="field"><label htmlFor="account-email">Correo electrónico</label><input id="account-email" name="email" type="email" required autoComplete="username" /></div>
      <div className="field"><label htmlFor="account-password">Contraseña</label><input id="account-password" name="password" type="password" minLength={8} required autoComplete={registering ? 'new-password' : 'current-password'} /></div>
      {registering && <div className="field"><label htmlFor="account-confirm">Repetir contraseña</label><input id="account-confirm" name="confirm" type="password" minLength={8} required autoComplete="new-password" /></div>}
      {error && <p className="alert" role="alert">{error}</p>}
      <button className="btn btn-accent" disabled={busy}>{busy ? 'Un momento…' : registering ? 'Crear cuenta' : 'Iniciar sesión'}</button>
      <button type="button" className="text-button" onClick={() => {setError(''); openAccount(registering ? 'login' : 'register')}}>{registering ? 'Ya tengo cuenta. Iniciar sesión' : '¿No tienes cuenta? Regístrate'}</button>
      <details className="demo-note"><summary>Entorno de demostración</summary><p>Usa datos ficticios. Cuenta cliente: cliente@ucam.test / demo1234. Los registros y pedidos se guardan solo en este navegador.</p></details>
    </form>}
  </Modal>
}
