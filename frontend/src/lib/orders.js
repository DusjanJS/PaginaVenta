// PERSISTENCIA de pedidos, pagos e incidencias (localStorage).
// Está aislado en este archivo para poder cambiarlo por llamadas a una API real.
import { trackEvent } from './events.js'

const ORDERS = 'ucam_orders'
const TICKETS = 'ucam_tickets'
const COUNTER = 'ucam_order_counter'

export const ORDER_STATUS = {
  creado: 'Creado',
  pagado_simulado: 'Pagado (simulado)',
  pendiente_preparacion: 'Pendiente de preparación',
  enviado: 'Enviado',
  cancelado: 'Cancelado',
  con_incidencia: 'Con incidencia',
}

const read = (k) => { try { return JSON.parse(localStorage.getItem(k)) ?? [] } catch { return [] } }
const write = (k, v) => localStorage.setItem(k, JSON.stringify(v))

function nextOrderId() {
  const n = (Number(localStorage.getItem(COUNTER)) || 1000) + 1
  localStorage.setItem(COUNTER, String(n))
  return `UC-${new Date().getFullYear()}-${String(n).padStart(5, '0')}`
}

export const getOrders = () => read(ORDERS).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
export const getOrder = (id) => read(ORDERS).find((o) => o.id === id)

export function createOrder({ customer, items, totals }) {
  const order = {
    id: nextOrderId(),
    createdAt: new Date().toISOString(),
    status: 'creado',
    customer,
    lines: items.map((i) => ({ productId: i.id, name: i.name, brand: i.brand, unitPrice: i.price, qty: i.qty })),
    totals,
    payment: null,
  }
  write(ORDERS, [...read(ORDERS), order])
  trackEvent('order.created', { orderId: order.id, total: totals.total, lines: order.lines.length })
  return order
}

function patch(id, changes) {
  const all = read(ORDERS).map((o) => (o.id === id ? { ...o, ...changes } : o))
  write(ORDERS, all)
  return all.find((o) => o.id === id)
}

export function registerPayment(orderId, { method, last4, result }) {
  const payment = {
    id: 'PAY-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    method, last4, result, at: new Date().toISOString(),
  }
  const order = patch(orderId, { payment, status: result === 'approved' ? 'pagado_simulado' : 'con_incidencia' })
  trackEvent('payment.simulated', { orderId, paymentId: payment.id, result })
  return order
}

export function updateOrderStatus(id, status) {
  const prev = getOrder(id)?.status
  patch(id, { status })
  trackEvent('order.status_changed', { orderId: id, from: prev, to: status })
}

export const getTickets = () => read(TICKETS).sort((a, b) => b.createdAt.localeCompare(a.createdAt))

export function createTicket({ name, email, orderId, subject, message }) {
  const ticket = {
    id: 'INC-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
    createdAt: new Date().toISOString(),
    name, email, orderId: orderId || null, subject, message, status: 'abierta',
  }
  write(TICKETS, [...read(TICKETS), ticket])
  trackEvent('support.requested', { ticketId: ticket.id, orderId: ticket.orderId, subject })
  return ticket
}

export function clearAll() {
  ;[ORDERS, TICKETS, COUNTER].forEach((k) => localStorage.removeItem(k))
}