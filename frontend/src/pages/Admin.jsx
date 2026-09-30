import { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { getOrders, getTickets, updateOrderStatus, ORDER_STATUS, clearAll } from '../lib/orders.js'
import { getEvents, clearEvents, downloadEvents, EVENT_TYPES } from '../lib/events.js'
import { eur, fechaHora } from '../lib/format.js'

export default function Admin() {
  const { user } = useAuth()
  const [tab, setTab] = useState('pedidos')
  const [, refresh] = useState(0)
  const [filter, setFilter] = useState('todos')
  const [open, setOpen] = useState(null)

  if (user?.role !== 'admin') {
    return (
      <section className="section section-cream page-top">
        <div className="container narrow">
          <div className="panel">
            <h1 className="h-lg">Acceso restringido</h1>
            <p className="muted">El back-office es solo para la cuenta de prueba <code>admin@ucam.test</code>.</p>
            <Link to="/login" className="btn btn-dark">Iniciar sesión</Link>
          </div>
        </div>
      </section>
    )
  }

  const orders = getOrders()
  const events = getEvents().slice().reverse()
  const tickets = getTickets()
  const shown = filter === 'todos' ? events : events.filter((e) => e.type === filter)

  const reset = () => {
    if (window.confirm('¿Borrar pedidos, eventos e incidencias de este navegador?')) {
      clearAll(); clearEvents(); refresh((n) => n + 1)
    }
  }

  return (
    <section className="section section-cream page-top">
      <div className="container">
        <div className="section-head row">
          <div>
            <p className="eyebrow">Back-office</p>
            <h1 className="h-xl">Panel de administración</h1>
          </div>
          <button className="btn btn-outline btn-sm" onClick={reset}>Reiniciar datos de prueba</button>
        </div>

        <div className="stats">
          <div><strong>{orders.length}</strong><span>Pedidos</span></div>
          <div><strong>{eur(orders.filter((o) => o.status !== 'cancelado').reduce((s, o) => s + o.totals.total, 0))}</strong><span>Facturación simulada</span></div>
          <div><strong>{events.length}</strong><span>Eventos</span></div>
          <div><strong>{tickets.length}</strong><span>Incidencias</span></div>
        </div>

        <div className="chips tabs" role="tablist">
          {[['pedidos', 'Pedidos'], ['eventos', 'Eventos'], ['incidencias', 'Incidencias']].map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} className={'chip' + (tab === k ? ' active' : '')} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        {tab === 'pedidos' && (
          orders.length === 0 ? <div className="empty"><h3>Aún no hay pedidos</h3><p>Completa una compra para verla aquí.</p></div> : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Pedido</th><th>Fecha</th><th>Cliente</th><th>Líneas</th><th>Pago</th><th className="r">Total</th><th>Estado</th></tr></thead>
                <tbody>
                  {orders.map((o) => (
                    <Fragment key={o.id}>
                      <tr className="clickable" onClick={() => setOpen(open === o.id ? null : o.id)}>
                        <td><strong>{o.id}</strong></td>
                        <td>{fechaHora(o.createdAt)}</td>
                        <td>{o.customer.nombre}<br /><span className="muted">{o.customer.email}</span></td>
                        <td>{o.lines.length}</td>
                        <td>{o.payment ? `${o.payment.result === 'approved' ? 'Aprobado' : 'Rechazado'} (${o.payment.method === 'paypal_simulado' ? 'PayPal' : 'Tarjeta de prueba'})` : '-'}</td>
                        <td className="r">{eur(o.totals.total)}</td>
                        <td onClick={(e) => e.stopPropagation()}>
                          <select className={`status status-${o.status}`} value={o.status}
                            onChange={(e) => { updateOrderStatus(o.id, e.target.value); refresh((n) => n + 1) }} aria-label={`Estado de ${o.id}`}>
                            {Object.entries(ORDER_STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                          </select>
                        </td>
                      </tr>
                      {open === o.id && (
                        <tr className="detail">
                          <td colSpan="7">
                            <ul>
                              {o.lines.map((l) => <li key={l.cartKey ?? l.productId}>{l.qty} × {l.brand} {l.name}{l.variantValue ?? l.finish ? ` (${l.variantValue ?? l.finish})` : ''} - {eur(l.unitPrice * l.qty)}</li>)}
                            </ul>
                            <p className="muted">Entrega: {o.customer.direccion}</p>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {tab === 'eventos' && (
          <>
            <div className="toolbar">
              <label className="select-wrap">
                <span>Tipo</span>
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="todos">Todos</option>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </label>
              <div className="chips">
                <button className="btn btn-dark btn-sm" onClick={() => downloadEvents(shown, 'json')}>Exportar JSON</button>
                <button className="btn btn-outline btn-sm" onClick={() => downloadEvents(shown, 'csv')}>Exportar CSV</button>
              </div>
            </div>
            {shown.length === 0 ? <div className="empty"><h3>Sin eventos</h3><p>Navega por la tienda para generarlos.</p></div> : (
              <div className="table-wrap">
                <table className="table">
                  <thead><tr><th>Fecha</th><th>Evento</th><th>Sesión</th><th>Usuario</th><th>Payload</th></tr></thead>
                  <tbody>
                    {shown.map((e) => (
                      <tr key={e.id}>
                        <td>{fechaHora(e.timestamp)}</td>
                        <td><code>{e.type}</code></td>
                        <td>{e.sessionId}</td>
                        <td>{e.user ?? 'anónimo'}</td>
                        <td><code className="payload">{JSON.stringify(e.payload)}</code></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {tab === 'incidencias' && (
          tickets.length === 0 ? <div className="empty"><h3>Sin incidencias</h3><p>Las solicitudes de soporte aparecerán aquí.</p></div> : (
            <div className="table-wrap">
              <table className="table">
                <thead><tr><th>Código</th><th>Fecha</th><th>Contacto</th><th>Pedido</th><th>Asunto</th><th>Mensaje</th></tr></thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id}>
                      <td><strong>{t.id}</strong></td><td>{fechaHora(t.createdAt)}</td>
                      <td>{t.name}<br /><span className="muted">{t.email}</span></td>
                      <td>{t.orderId ?? '-'}</td><td>{t.subject}</td><td>{t.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </section>
  )
}
