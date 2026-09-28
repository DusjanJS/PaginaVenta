import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OrderSummary from '../components/OrderSummary.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { computeTotals } from '../lib/pricing.js'
import { trackEvent } from '../lib/events.js'
import { createOrder, registerPayment } from '../lib/orders.js'

const EMPTY = { nombre: '', email: '', telefono: '', direccion: '', ciudad: '', cp: '', tarjeta: '', caducidad: '', cvc: '' }

// Validación básica de entradas
function validate(f) {
  const e = {}
  if (f.nombre.trim().length < 3) e.nombre = 'Escribe tu nombre completo.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = 'Introduce un correo válido.'
  if (!/^[6-9]\d{8}$/.test(f.telefono.replace(/\s/g, ''))) e.telefono = 'Teléfono de 9 dígitos.'
  if (f.direccion.trim().length < 5) e.direccion = 'Indica la dirección de entrega.'
  if (f.ciudad.trim().length < 2) e.ciudad = 'Indica la ciudad.'
  if (!/^\d{5}$/.test(f.cp)) e.cp = 'Código postal de 5 dígitos.'
  if (!/^\d{16}$/.test(f.tarjeta.replace(/\s/g, ''))) e.tarjeta = 'Tarjeta de prueba de 16 dígitos.'
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(f.caducidad)) e.caducidad = 'Formato MM/AA.'
  if (!/^\d{3}$/.test(f.cvc)) e.cvc = '3 dígitos.'
  return e
}

// Campo definido FUERA del componente principal para que el input no pierda el foco al escribir
function Field({ name, label, placeholder, className = '', inputMode, form, errors, change }) {
  return (
    <div className={'field ' + className}>
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} value={form[name]} onChange={change} placeholder={placeholder} inputMode={inputMode}
        aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `${name}-err` : undefined} />
      {errors[name] && <span id={`${name}-err`} className="field-error">{errors[name]}</span>}
    </div>
  )
}

export default function Checkout() {
  const { items, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ ...EMPTY, email: user?.email ?? '', nombre: user?.name ?? '' })
  const [errors, setErrors] = useState({})
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const started = useRef(false)

  useEffect(() => {
    if (items.length > 0 && !started.current) {
      started.current = true
      trackEvent('checkout.started', { items: items.length, units: items.reduce((s, i) => s + i.qty, 0) })
    }
  }, [items])

  if (items.length === 0) {
    return (
      <section className="section section-cream page-top">
        <div className="container empty">
          <h2>No hay nada que pagar</h2>
          <p>Tu carrito está vacío.</p>
          <Link to="/catalogo" className="btn btn-dark">Ir al catálogo</Link>
        </div>
      </section>
    )
  }

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const errs = validate(form)
    setErrors(errs)
    setPayError('')
    if (Object.keys(errs).length) return

    setPaying(true)
    const totals = computeTotals(items, { loggedIn: !!user })
    const order = createOrder({
      customer: { nombre: form.nombre, email: form.email, telefono: form.telefono, direccion: `${form.direccion}, ${form.cp} ${form.ciudad}` },
      items, totals,
    })

    // Pago SIMULADO: la tarjeta 4000 0000 0000 0002 se rechaza; cualquier otra se aprueba.
    const digits = form.tarjeta.replace(/\s/g, '')
    setTimeout(() => {
      const approved = digits !== '4000000000000002'
      registerPayment(order.id, { method: 'tarjeta_prueba', last4: digits.slice(-4), result: approved ? 'approved' : 'declined' })
      setPaying(false)
      if (approved) {
        clear()
        navigate(`/pedido/${order.id}`)
      } else {
        setPayError(`Pago rechazado (simulación). El pedido ${order.id} queda con incidencia. Prueba con otra tarjeta.`)
      }
    }, 1200)
  }

  const f = { form, errors, change }

  return (
    <section className="section section-cream page-top">
      <div className="container">
        <div className="section-head"><h1 className="h-xl">Finalizar pedido</h1></div>

        <div className="cart-layout">
          <form className="checkout-form" onSubmit={submit} noValidate>
            <fieldset>
              <legend>Datos de entrega</legend>
              <div className="form-grid">
                <Field {...f} name="nombre" label="Nombre completo" placeholder="Ana Ficticia" className="span-2" />
                <Field {...f} name="email" label="Correo electrónico" placeholder="cliente@ucam.test" />
                <Field {...f} name="telefono" label="Teléfono" placeholder="600123123" inputMode="numeric" />
                <Field {...f} name="direccion" label="Dirección" placeholder="Calle Ejemplo 1" className="span-2" />
                <Field {...f} name="ciudad" label="Ciudad" placeholder="Murcia" />
                <Field {...f} name="cp" label="Código postal" placeholder="30107" inputMode="numeric" />
              </div>
            </fieldset>

            <fieldset>
              <legend>Pago en entorno de pruebas</legend>
              <p className="test-note">
                No se realiza ningún cobro. Usa la tarjeta <strong>4242 4242 4242 4242</strong> (caducidad 12/30, CVC 123).
                La tarjeta <strong>4000 0000 0000 0002</strong> simula un pago rechazado.
              </p>
              <div className="form-grid">
                <Field {...f} name="tarjeta" label="Número de tarjeta" placeholder="4242 4242 4242 4242" className="span-2" inputMode="numeric" />
                <Field {...f} name="caducidad" label="Caducidad" placeholder="12/30" />
                <Field {...f} name="cvc" label="CVC" placeholder="123" inputMode="numeric" />
              </div>
            </fieldset>

            {payError && <p className="alert" role="alert">{payError}</p>}

            <button className="btn btn-accent btn-lg" disabled={paying}>
              {paying ? 'Procesando pago simulado…' : 'Confirmar pedido (simulado)'}
            </button>
          </form>

          <aside><OrderSummary /></aside>
        </div>
      </div>
    </section>
  )
}