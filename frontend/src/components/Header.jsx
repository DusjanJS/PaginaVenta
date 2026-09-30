import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Disc3, Search, User, ShoppingBag, X, Menu } from 'lucide-react'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo', end: true },
  { to: '/catalogo/vinilos', label: 'Vinilos' },
  { to: '/catalogo/tocadiscos', label: 'Tocadiscos' },
  { to: '/catalogo/altavoces', label: 'Altavoces' },
  { to: '/catalogo/auriculares', label: 'Auriculares' },
]

export default function Header() {
  const { count } = useCart()
  const { user, openAccount } = useAuth()
  const [menu, setMenu] = useState(false)
  const navigate = useNavigate()
  const [searching, setSearching] = useState(false)
  const [q, setQ] = useState('')

  const submit = (e) => {
    e.preventDefault()
    navigate(`/catalogo?q=${encodeURIComponent(q.trim())}`)
    setSearching(false)
  }

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="logo" aria-label="UCAM Stereo, inicio">
          <span className="logo-mark"><Disc3 size={20} /></span>
          <span className="logo-text">UCAM <em>Stereo</em></span>
        </Link>

        <nav className={"nav" + (menu ? " is-open" : "")} aria-label="Principal">
          {LINKS.map((l) => (
            <NavLink onClick={() => setMenu(false)} key={l.to} to={l.to} end={l.end} className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-icons"><button className="icon-btn menu-toggle" aria-label="Abrir menú" aria-expanded={menu} onClick={() => setMenu(!menu)}><Menu size={20}/></button>
          {searching ? (
            <form className="search-form" onSubmit={submit}>
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar producto o marca" aria-label="Buscar" />
              <button type="button" className="icon-btn" onClick={() => setSearching(false)} aria-label="Cerrar búsqueda"><X size={18} /></button>
            </form>
          ) : (
            <button className="icon-btn" onClick={() => setSearching(true)} aria-label="Buscar"><Search size={20} /></button>
          )}
          <button onClick={() => openAccount()} className="icon-btn" aria-label={user ? `Cuenta de ${user.name}` : 'Iniciar sesión'}><User size={20} />{user && <span className="session-dot" />}</button>
          <Link to="/carrito" className="icon-btn" aria-label={`Carrito, ${count} artículos`}>
            <ShoppingBag size={20} />
            {count > 0 && <span className="cart-badge">{count}</span>}
          </Link>
        </div>
      </div>
    </header>
  )
}