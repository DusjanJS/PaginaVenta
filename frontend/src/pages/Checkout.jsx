import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import OrderSummary from '../components/OrderSummary.jsx'
import Modal from '../components/Modal.jsx'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { computeTotals } from '../lib/pricing.js'
import { trackEvent } from '../lib/events.js'
import { createOrder, registerPayment } from '../lib/orders.js'
import { eur } from '../lib/format.js'
const EMPTY = { nombre:'', apellidos:'', telefono:'', direccion:'', piso:'', ciudad:'', provincia:'', cp:'', pais:'España', notas:'' }
function validate(f) {
 const e = {}
 for (const name of ['nombre','apellidos','ciudad','provincia']) if (f[name].trim().length < 2) e[name] = 'Completa este campo.'
 if (!/^(?:\+34)?[6-9]\d{8}$/.test(f.telefono.replace(/\s/g,''))) e.telefono='Introduce un teléfono español válido.'
 if (f.direccion.trim().length < 5) e.direccion='Indica calle y número.'
 if (!/^\d{5}$/.test(f.cp)) e.cp='Introduce 5 dígitos.'
 return e
}
export default function Checkout() {
 const { items, clear } = useCart(), { user, openAccount } = useAuth(), navigate = useNavigate()
 const [form,setForm]=useState(EMPTY), [errors,setErrors]=useState({}), [step,setStep]=useState('delivery'), [paypal,setPaypal]=useState(false), [paying,setPaying]=useState(false), [payError,setPayError]=useState('')
 const started=useRef(false), lock=useRef(false), orderRef=useRef(null)
 useEffect(()=>{ if(items.length && !started.current){started.current=true; trackEvent('checkout.started',{items:items.length})} },[items])
 const totals=computeTotals(items,{user})
 if (!items.length) return <section className="section"><div className="container empty"><h1 className="h-lg">Tu carrito está vacío</h1><Link to="/catalogo" className="btn btn-dark">Explorar catálogo</Link></div></section>
 if (!user) return <section className="section"><div className="container narrow panel"><h1 className="h-lg">Identifícate para continuar</h1><p>Guarda tu pedido en tu cuenta y consulta su estado cuando quieras.</p><button className="btn btn-accent" onClick={()=>openAccount()}>Iniciar sesión</button><button className="btn btn-outline" onClick={()=>openAccount('register')}>Registrarse</button><Link to="/carrito">Volver al carrito</Link></div></section>
 const review=e=>{ e.preventDefault();const next=validate(form);setErrors(next); if(Object.keys(next).length){document.getElementById(Object.keys(next)[0])?.focus(); return} setStep('review'); setPayError('') }
 const pay=async result=>{
   if(lock.current) return
   lock.current=true;setPaying(true);setPayError('')
   try {
     await new Promise(resolve=>setTimeout(resolve,650))
     const signature=JSON.stringify({items,totals,form,email:user.email})
     if(!orderRef.current || orderRef.current.signature!==signature) {
       const order=createOrder({customer:{...form,nombre:`${form.nombre} ${form.apellidos}`,email:user.email,direccion:`${form.direccion}${form.piso?', '+form.piso:''}, ${form.cp} ${form.ciudad}, ${form.provincia}, ${form.pais}`},items,totals})
       orderRef.current={id:order.id,signature}
     }
     registerPayment(orderRef.current.id,{method:'paypal_simulado',result})
     if(result==='approved'){clear();navigate(`/pedido/${orderRef.current.id}`)}
     else {setPaypal(false);setPayError('PayPal ha rechazado el pago de prueba. No se ha cobrado nada. Puedes reintentarlo; el pedido conserva su referencia.')}
   } catch {setPaypal(false);setPayError('No se pudo guardar el pedido. Comprueba el almacenamiento del navegador y vuelve a intentarlo.')}
   finally{lock.current=false;setPaying(false)}
 }
 return <section className="section page-top"><div className="container">
  <nav className="breadcrumb" aria-label="Ruta"><Link to="/carrito">Carrito</Link> / Finalizar pedido</nav><div className="section-head"><h1 className="h-xl">Finalizar pedido</h1><p className="session-state">Sesión iniciada como {user.email}</p></div>
  <ol className="checkout-steps"><li className={step==='delivery'?'current':''}>1. Datos de entrega</li><li className={step==='review'?'current':''}>2. Revisar y pagar</li><li>3. Confirmación</li></ol>
  <div className="cart-layout"><div>
  {step==='delivery' ? <form className="checkout-form" onSubmit={review} noValidate><fieldset><legend>Datos de entrega</legend><div className="form-grid">
    {[['nombre','Nombre','given-name'],['apellidos','Apellidos','family-name'],['telefono','Teléfono','tel'],['pais','País','country-name'],['direccion','Calle y número','address-line1'],['piso','Piso, puerta (opcional)','address-line2'],['cp','Código postal','postal-code'],['ciudad','Ciudad','address-level2'],['provincia','Provincia','address-level1']].map(([name,label,autocomplete])=><div className={'field '+(name==='direccion'?'span-2':'')} key={name}><label htmlFor={name}>{label}</label><input id={name} name={name} autoComplete={autocomplete} value={form[name]} readOnly={name==='pais'} required={name!=='piso'} inputMode={name==='cp'?'numeric':name==='telefono'?'tel':undefined} onChange={e=>setForm({...form,[name]:e.target.value})} aria-invalid={!!errors[name]} aria-describedby={errors[name]?`${name}-error`:undefined}/>{errors[name]&&<span className="field-error" id={`${name}-error`}>{errors[name]}</span>}</div>)}
    <div className="field span-2"><label htmlFor="notas">Indicaciones de entrega (opcional)</label><textarea id="notas" rows={2} maxLength={500} value={form.notas} onChange={e=>setForm({...form,notas:e.target.value})}/></div></div><p className="hint">Envío de prueba dentro de España. Usa datos ficticios.</p></fieldset><button className="btn btn-accent">Revisar pedido</button></form> : <div className="checkout-form"><section className="panel"><h2 className="h-md">Revisa tu pedido</h2><div className="review-address"><h3>Entrega</h3><p>{form.nombre} {form.apellidos}</p><p>{form.direccion} {form.piso}</p><p>{form.cp} {form.ciudad}, {form.provincia}, {form.pais}</p><p>{form.telefono}</p><p>{user.email}</p>{form.notas && <p>{form.notas}</p>}<button className="text-button" onClick={()=>setStep('delivery')}>Editar datos de entrega</button></div><ul className="review-lines">{items.map(i=><li key={i.id}><span>{i.qty} × {i.brand} {i.name}</span><strong>{eur(i.qty*i.price)}</strong></li>)}</ul></section><section className="panel"><h2 className="h-md">Método de pago</h2><div className="paypal-choice"><strong className="paypal-word">Pay<span>Pal</span></strong><span>Pago simulado</span></div><p className="muted">Demostración sin conexión a PayPal ni cobros reales. No se solicitan datos bancarios.</p>{payError&&<p role="alert" className="alert">{payError}</p>}<button className="btn btn-paypal" onClick={()=>setPaypal(true)}>Continuar con PayPal</button></section></div>}
  </div><aside><OrderSummary/><p className="hint">Podrás consultar el pedido desde Mi cuenta.</p></aside></div>
  {paypal && <Modal title="Pago de prueba con PayPal" onClose={()=>{if(!paying){setPaypal(false);setPayError('Pago cancelado. Tu carrito sigue disponible.')}}}><div className="account-body"><p className="paypal-word">Pay<span>Pal</span></p><p>Total a confirmar: <strong>{eur(totals.total)}</strong></p><p className="muted">Esta ventana simula el resultado del pago. No inicia sesión en PayPal ni realiza ningún cargo.</p><button className="btn btn-paypal" disabled={paying} onClick={()=>pay('approved')}>{paying?'Procesando…':'Confirmar pago de prueba'}</button><button className="text-button" disabled={paying} onClick={()=>pay('declined')}>Simular pago rechazado</button><button className="btn btn-outline" disabled={paying} onClick={()=>{setPaypal(false);setPayError('Pago cancelado. Tu carrito sigue disponible.')}}>Cancelar pago</button></div></Modal>}
 </div></section>
}
