// REGLAS DE NEGOCIO (simuladas)
// - Los precios del catálogo incluyen IVA (21 %).
// - 10 % de descuento en el primer pedido para usuarios con sesión iniciada.
// - Envío gratis a partir de 300 €; si no, 6,90 €.

export const IVA = 0.21
export const DISCOUNT_RATE = 0.1
export const FREE_SHIPPING_FROM = 300
export const SHIPPING_COST = 6.9

const round = (n) => Math.round(n * 100) / 100

export function computeTotals(items, { loggedIn = false } = {}) {
  const subtotal = round(items.reduce((s, i) => s + i.price * i.qty, 0))
  const discount = loggedIn ? round(subtotal * DISCOUNT_RATE) : 0
  const base = round(subtotal - discount)
  const shipping = items.length === 0 || base >= FREE_SHIPPING_FROM ? 0 : SHIPPING_COST
  const total = round(base + shipping)
  const ivaIncluded = round(total - total / (1 + IVA))
  return { subtotal, discount, shipping, total, ivaIncluded }
}