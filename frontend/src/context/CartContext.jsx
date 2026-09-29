import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { PRODUCTS } from '../data/products.js'
import { trackEvent } from '../lib/events.js'

const CART_KEY = 'ucam_cart'
const INVENTORY_KEY = 'ucam_inventory_v2'
const CartContext = createContext(null)

const inventoryKey = (productId, variantId = null) => variantId ? `${productId}:${variantId}` : productId

const DEFAULT_INVENTORY = PRODUCTS.reduce((inventory, product) => {
  inventory[inventoryKey(product.id)] = product.stock
  product.variants?.forEach((variant) => {
    inventory[inventoryKey(product.id, variant.id)] = variant.stock
  })
  return inventory
}, {})

function readJson(key, fallback) {
  try {
    return JSON.parse(sessionStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}

export const useCart = () => useContext(CartContext)

export function CartProvider({ children }) {
  const [inventory, setInventory] = useState(() => {
    const saved = readJson(INVENTORY_KEY, {})
    return Object.fromEntries(Object.entries(DEFAULT_INVENTORY).map(([key, stock]) => [
      key,
      Number.isInteger(saved[key]) && saved[key] >= 0 ? saved[key] : stock,
    ]))
  })
  const [items, setItems] = useState(() => {
    const saved = readJson(CART_KEY, [])
    if (!Array.isArray(saved)) return []
    return saved.filter((item) => item && typeof item === 'object').map((item) => ({
      ...item,
      productId: item.productId ?? item.id,
      cartKey: item.cartKey ?? item.id,
      variantId: item.variantId ?? null,
    }))
  })
  const [notice, setNotice] = useState(null)
  const [cartOpen, setCartOpen] = useState(false)
  const noticeTimer = useRef(null)

  useEffect(() => {
    sessionStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  useEffect(() => {
    sessionStorage.setItem(INVENTORY_KEY, JSON.stringify(inventory))
  }, [inventory])

  useEffect(() => () => clearTimeout(noticeTimer.current), [])

  const getAvailableStock = (productId, variantId = null) => inventory[inventoryKey(productId, variantId)] ?? 0

  const showNotice = (item) => {
    clearTimeout(noticeTimer.current)
    setNotice(item)
    noticeTimer.current = setTimeout(() => setNotice(null), 3500)
  }

  const addItem = (product, qty = 1, variant = null) => {
    const variantId = variant?.id ?? null
    const availableStock = getAvailableStock(product.id, variantId)
    if (availableStock < 1 || !Number.isFinite(qty) || qty < 1) return false

    const cartKey = inventoryKey(product.id, variantId)
    const safeQty = Math.floor(qty)
    const color = variant?.color ?? product.color ?? null
    const sku = variant?.sku ?? product.sku

    setItems((previous) => {
      const existing = previous.find((item) => item.cartKey === cartKey)
      if (existing) {
        return previous.map((item) => item.cartKey === cartKey
          ? { ...item, qty: Math.min(item.qty + safeQty, availableStock), stock: availableStock }
          : item)
      }
      return [...previous, {
        id: cartKey,
        cartKey,
        productId: product.id,
        variantId,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: variant?.image ?? product.image,
        color,
        colorHex: variant?.colorHex ?? product.colorHex ?? null,
        sku,
        stock: availableStock,
        qty: Math.min(safeQty, availableStock),
      }]
    })

    showNotice({ name: product.name, color })
    trackEvent('cart.item_added', { productId: product.id, sku, variantId, qty: safeQty, price: product.price })
    return true
  }

  const setQty = (cartKey, qty) => setItems((previous) => previous.map((item) => {
    if (item.cartKey !== cartKey) return item
    const availableStock = getAvailableStock(item.productId, item.variantId)
    return { ...item, stock: availableStock, qty: Math.max(1, Math.min(qty, availableStock)) }
  }))

  const removeItem = (cartKey) => setItems((previous) => previous.filter((item) => item.cartKey !== cartKey))
  const clear = () => setItems([])
  const completePurchase = () => {
    setInventory((previous) => {
      const next = { ...previous }
      items.forEach((item) => {
        next[item.cartKey] = Math.max(0, (next[item.cartKey] ?? item.stock) - item.qty)
      })
      return next
    })
    setItems([])
    setNotice(null)
    setCartOpen(false)
  }
  const count = items.reduce((total, item) => total + item.qty, 0)

  return (
    <CartContext.Provider value={{
      items,
      count,
      notice,
      cartOpen,
      addItem,
      setQty,
      removeItem,
      clear,
      completePurchase,
      getAvailableStock,
      openCart: () => { setCartOpen(true); setNotice(null) },
      closeCart: () => setCartOpen(false),
      toggleCart: () => { setCartOpen((open) => !open); setNotice(null) },
      dismissNotice: () => setNotice(null),
    }}>
      {children}
    </CartContext.Provider>
  )
}
