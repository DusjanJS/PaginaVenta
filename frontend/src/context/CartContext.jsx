import { createContext, useContext, useEffect, useState } from 'react'
import { trackEvent } from '../lib/events.js'

const CartContext = createContext(null)
export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ucam_cart')) ?? [] } catch { return [] }
  })

  useEffect(() => localStorage.setItem('ucam_cart', JSON.stringify(items)), [items])

  const addItem = (product, qty = 1) => {
    if (product.stock < 1 || !Number.isFinite(qty) || qty < 1) return
    qty = Math.floor(qty)
    setItems((prev) => {
      const existing = prev.find((i) => i.id === product.id)
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, qty: Math.min(i.qty + qty, product.stock) } : i))
      }
      return [...prev, { id: product.id, slug: product.slug, name: product.name, brand: product.brand,
        price: product.price, image: product.image, stock: product.stock, qty: Math.min(qty, product.stock) }]
    })
    trackEvent('cart.item_added', { productId: product.id, sku: product.sku, qty, price: product.price })
  }

  const setQty = (id, qty) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, qty: Math.max(1, Math.min(qty, i.stock)) } : i)))

  const removeItem = (id) => setItems((prev) => prev.filter((i) => i.id !== id))
  const clear = () => setItems([])
  const count = items.reduce((s, i) => s + i.qty, 0)

  return (
    <CartContext.Provider value={{ items, count, addItem, setQty, removeItem, clear }}>
      {children}
    </CartContext.Provider>
  )
}