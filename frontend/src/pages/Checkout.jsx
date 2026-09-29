import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, LockKeyhole, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import CheckoutOrderCard from '../components/CheckoutOrderCard.jsx'
import CheckoutStepper, { CheckoutLogo } from '../components/CheckoutStepper.jsx'
import ImageSlot from '../components/ImageSlot.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { trackEvent } from '../lib/events.js'
import { eur } from '../lib/format.js'
import { createOrder, registerPayment } from '../lib/orders.js'
import { computeTotals } from '../lib/pricing.js'

const EMPTY_FORM = {
  nombre: '', apellidos: '', email: '', telefono: '', direccion: '', ciudad: '', provincia: '', cp: '', pais: 'España', newsletter: false,
}

function validate(form) {
  const errors = {}
  for (const name of ['nombre', 'apellidos', 'ciudad', 'provincia']) {
    if (form[name].trim().length < 2) errors[name] = 'Completa este campo.'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Introduce un correo válido.'
  if (!/^(?:\+34)?[6-9]\d{8}$/.test(form.telefono.replace(/\s/g, ''))) errors.telefono = 'Introduce un teléfono español válido.'
  if (form.direccion.trim().length < 5) errors.direccion = 'Indica calle y número.'
  if (!/^\d{5}$/.test(form.cp)) errors.cp = 'Introduce 5 dígitos.'
  return errors
}

export default function Checkout() {
  const { items, completePurchase } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, email: user?.email ?? '' }))
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)
  const [paying, setPaying] = useState(false)
  const [payError, setPayError] = useState('')
  const started = useRef(false)
  const paymentLock = useRef(false)
  const totals = computeTotals(items, { user })

  useEffect(() => {
    if (items.length && !started.current) {
      started.current = true
      trackEvent('checkout.started', { items: items.length })
    }
  }, [items])

  const change = (event) => {
    const { name, value, checked, type } = event.target
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }))
  }

  const moveTo = (nextStep) => {
    setStep(nextStep)
    setPayError('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const submitDelivery = (event) => {
    event.preventDefault()
    const nextErrors = validate(form)
    setErrors(nextErrors)
    const firstError = Object.keys(nextErrors)[0]
    if (firstError) {
      document.getElementById(firstError)?.focus()
      return
    }
    moveTo(2)
  }

  const pay = async () => {
    if (paymentLock.current) return
    paymentLock.current = true
    setPaying(true)
    setPayError('')
    try {
      await new Promise((resolve) => setTimeout(resolve, 850))
      const order = createOrder({
        customer: {
          ...form,
          nombre: `${form.nombre} ${form.apellidos}`.trim(),
          guest: !user,
          direccionCompleta: `${form.direccion}, ${form.cp} ${form.ciudad}, ${form.provincia}, ${form.pais}`,
        },
        items,
        totals,
      })
      registerPayment(order.id, { method: 'paypal_simulado', result: 'approved' })
      completePurchase()
      navigate(`/pedido/${order.id}`)
    } catch {
      setPayError('No se pudo completar la simulación. Tu carrito sigue disponible para intentarlo de nuevo.')
    } finally {
      paymentLock.current = false
      setPaying(false)
    }
  }

  if (!items.length) {
    return (
      <section className="commerce-page checkout-empty-page">
        <CheckoutLogo />
        <div className="commerce-empty"><h1>Tu carrito está vacío</h1><Link to="/catalogo" className="commerce-primary-button">Explorar catálogo</Link></div>
      </section>
    )
  }

  return (
    <section className="commerce-page checkout-screen">
      <div className="checkout-container">
        <CheckoutLogo />
        <CheckoutStepper active={step} />

        <div key={step} className="checkout-stage">
          {step === 1 && (
            <div className="checkout-two-columns">
              <form className="checkout-delivery" onSubmit={submitDelivery} noValidate>
                <h1>Datos de envío</h1>
                <div className="checkout-form-grid">
                  {[
                    ['nombre', 'Nombre', 'given-name'], ['apellidos', 'Apellidos', 'family-name'],
                    ['email', 'Email', 'email'], ['telefono', 'Teléfono', 'tel'],
                    ['direccion', 'Dirección', 'address-line1'], ['ciudad', 'Ciudad', 'address-level2'],
                    ['provincia', 'Provincia', 'address-level1'], ['cp', 'Código postal', 'postal-code'],
                    ['pais', 'País', 'country-name'],
                  ].map(([name, label, autoComplete]) => (
                    <div className={`checkout-field ${name === 'direccion' || name === 'pais' ? 'wide' : ''}`} key={name}>
                      <label htmlFor={name}>{label}</label>
                      <input id={name} name={name} type={name === 'email' ? 'email' : 'text'} value={form[name]} onChange={change} autoComplete={autoComplete} readOnly={name === 'pais' || (name === 'email' && Boolean(user))} inputMode={name === 'cp' ? 'numeric' : name === 'telefono' ? 'tel' : undefined} aria-invalid={Boolean(errors[name])} />
                      {errors[name] && <span className="checkout-error">{errors[name]}</span>}
                    </div>
                  ))}
                </div>
                <label className="checkout-newsletter"><input type="checkbox" name="newsletter" checked={form.newsletter} onChange={change} />Quiero recibir novedades de UCAM Stereo.</label>
                <button className="commerce-primary-button" type="submit">Continuar</button>
                <Link className="checkout-bottom-back" to="/carrito"><ChevronLeft size={16} />Volver al carrito</Link>
              </form>
              <CheckoutOrderCard items={items} totals={totals} compact />
            </div>
          )}

          {step === 2 && (
            <div className="checkout-two-columns review-columns">
              <div className="checkout-review">
                <h1>Resumen del pedido</h1>
                <section className="checkout-review-panel address-panel">
                  <div><h2>Datos de envío</h2><button type="button" onClick={() => moveTo(1)}>Editar</button></div>
                  <p>{form.nombre} {form.apellidos}</p>
                  <p>{form.direccion}</p>
                  <p>{form.cp} {form.ciudad}, {form.provincia}</p>
                  <p>{form.pais}</p>
                  <p>{form.email} · {form.telefono}</p>
                </section>
                <section className="checkout-review-panel product-panel">
                  <h2>Productos</h2>
                  <ul>
                    {items.map((item) => (
                      <li key={item.cartKey}>
                        <ImageSlot src={item.image} alt={item.name} className="checkout-review-image" fit="contain" />
                        <div><strong>{item.name}</strong><span>{item.brand}{item.color ? ` · ${item.color}` : ''} · Cant: {item.qty}</span></div>
                        <strong>{eur(item.price * item.qty)}</strong>
                      </li>
                    ))}
                  </ul>
                  <dl className="checkout-review-totals">
                    <div><dt>Subtotal</dt><dd>{eur(totals.subtotal)}</dd></div>
                    {totals.discount > 0 && <div><dt>Descuento</dt><dd>-{eur(totals.discount)}</dd></div>}
                    <div><dt>Envío</dt><dd>{totals.shipping ? eur(totals.shipping) : 'Gratis'}</dd></div>
                    <div className="total"><dt>Total</dt><dd>{eur(totals.total)}</dd></div>
                  </dl>
                </section>
                <div className="checkout-review-actions">
                  <button className="commerce-secondary-button" type="button" onClick={() => moveTo(1)}>Atrás</button>
                  <button className="commerce-primary-button" type="button" onClick={() => moveTo(3)}>Continuar al pago</button>
                </div>
              </div>
              <CheckoutOrderCard items={items} totals={totals} compact />
            </div>
          )}

          {step === 3 && (
            <div className="checkout-two-columns payment-columns">
              <div className="checkout-payment">
                <h1>Pago seguro</h1>
                <section className="paypal-panel">
                  <div className="paypal-panel-title"><span className="paypal-icon">P</span><div><strong>Pago seguro con PayPal</strong><small>Protegido por PayPal Buyer Protection</small></div></div>
                  <div className="paypal-total"><div><strong>Total a pagar</strong><span>IVA incluido · Cargo único</span></div><strong>{eur(totals.total)}</strong></div>
                  {payError && <p className="checkout-payment-error" role="alert">{payError}</p>}
                  <button className="paypal-button" type="button" onClick={pay} disabled={paying}><strong>P</strong>{paying ? 'Procesando pago…' : 'Continuar con PayPal'}</button>
                  <p className="paypal-protection"><LockKeyhole size={15} />Tus datos están protegidos. Nunca almacenamos información de pago.</p>
                </section>
                <button className="checkout-bottom-back" type="button" onClick={() => moveTo(2)}><ChevronLeft size={16} />Volver al resumen</button>
                <p className="checkout-simulation-note"><ShieldCheck size={15} />Pago académico simulado. No se realiza ningún cargo real.</p>
              </div>
              <CheckoutOrderCard items={items} totals={totals} compact />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
