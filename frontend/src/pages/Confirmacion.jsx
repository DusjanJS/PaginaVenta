import { Link, useParams } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { getOrder, ORDER_STATUS } from '../lib/orders.js'
import { useAuth } from '../context/AuthContext.jsx'
import { eur, fechaHora } from '../lib/format.js'

export default function Confirmacion() {
  const { id } = useParams()
  const { user, openAccount } = useAuth()
  const order = getOrder(id)

  if (!order || !user || (order.customer.email !== user.email && user.role !== "admin")) {
    return (
      <section className="section section-cream page-top">
        <div className="container empty">
          <h2>Pedido no encontrado</h2>
          <Link to="/catalogo" className="btn btn-dark">Volver al catálogo</Link>
        </div>
      </section>
    )
  }

  return (
    <section className="section section-cream page-top">
      <div className="container narrow">
        <div className="confirm">
          <CheckCircle2 size={44} className="ok" strokeWidth={1.5} />
          <h1 className="h-xl">Pedido creado</h1>
          <p className="lead">Gracias, {order.customer.nombre}. Esto es una simulación: no se ha cobrado nada ni se enviará ningún producto.</p>

          <dl className="order-meta">
            <div><dt>Nº de pedido</dt><dd>{order.id}</dd></div>
            <div><dt>Fecha</dt><dd>{fechaHora(order.createdAt)}</dd></div>
            <div><dt>Estado</dt><dd><span className={`status status-${order.status}`}>{ORDER_STATUS[order.status]}</span></dd></div>
            <div><dt>Pago</dt><dd>{order.payment?.method === 'paypal_simulado' ? 'PayPal (simulado)' : 'Tarjeta de prueba'} · {order.payment?.result === 'approved' ? 'Aprobado' : 'Pendiente o rechazado'}</dd></div>
            <div><dt>Entrega</dt><dd>{order.customer.direccion}</dd></div>
          </dl>

          <table className="table">
            <thead><tr><th>Producto</th><th>Ud.</th><th className="r">Importe</th></tr></thead>
            <tbody>
              {order.lines.map((l) => (
                <tr key={l.productId}><td>{l.brand} {l.name}</td><td>{l.qty}</td><td className="r">{eur(l.unitPrice * l.qty)}</td></tr>
              ))}
            </tbody>
            <tfoot>
              {order.totals.discount > 0 && <tr><td colSpan="2">Descuento</td><td className="r">−{eur(order.totals.discount)}</td></tr>}
              <tr><td colSpan="2">Envío</td><td className="r">{order.totals.shipping ? eur(order.totals.shipping) : 'Gratis'}</td></tr>
              <tr className="total"><td colSpan="2">Total (IVA incl.)</td><td className="r">{eur(order.totals.total)}</td></tr>
            </tfoot>
          </table>

          <p className="session-state">Sesión iniciada como {user.email}</p>
          {['pagado_simulado','pendiente_preparacion','enviado'].includes(order.status) && <ol className="order-progress"><li className="done">Pedido recibido</li><li className="done">Pago confirmado</li><li className={['pendiente_preparacion','enviado'].includes(order.status)?'done':''}>Preparación</li><li className={order.status==='enviado'?'done':''}>Enviado</li></ol>}
          <div className="confirm-actions"><button className="btn btn-outline" onClick={() => openAccount()}>Ver mis pedidos</button>
            <Link to="/catalogo" className="btn btn-dark">Seguir comprando</Link>
            <Link to="/soporte" className="btn btn-outline">Necesito ayuda con este pedido</Link>
          </div>
        </div>
      </div>
    </section>
  )
}