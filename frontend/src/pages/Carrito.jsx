import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import ImageSlot from '../components/ImageSlot.jsx'
import OrderSummary from '../components/OrderSummary.jsx'
import { useCart } from '../context/CartContext.jsx'
import { eur } from '../lib/format.js'

export default function Carrito() {
  const { items, setQty, removeItem } = useCart()

  return (
    <section className="section section-cream page-top">
      <div className="container">
        <div className="section-head"><h1 className="h-xl">Tu carrito</h1></div>

        {items.length === 0 ? (
          <div className="empty">
            <h3>Tu carrito está vacío</h3>
            <p>Añade un tocadiscos, unos altavoces o tu próximo vinilo.</p>
            <Link to="/catalogo" className="btn btn-dark">Ir al catálogo</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <ul className="cart-list">
              {items.map((i) => (
                <li key={i.id} className="cart-line">
                  <ImageSlot className="cart-img" src={i.image} alt={i.name} fit="contain" />
                  <div className="cart-info">
                    <span className="card-brand">{i.brand}</span>
                    <Link to={`/producto/${i.slug}`} className="card-name">{i.name}</Link>
                    <span className="muted">{eur(i.price)} / ud.</span>
                  </div>
                  <div className="qty" role="group" aria-label={`Cantidad de ${i.name}`}>
                    <button onClick={() => setQty(i.id, i.qty - 1)} aria-label="Restar">−</button>
                    <span>{i.qty}</span>
                    <button onClick={() => setQty(i.id, i.qty + 1)} aria-label="Sumar" disabled={i.qty >= i.stock}>+</button>
                  </div>
                  <span className="price cart-price">{eur(i.price * i.qty)}</span>
                  <button className="icon-btn dark" onClick={() => removeItem(i.id)} aria-label={`Quitar ${i.name}`}>
                    <Trash2 size={18} />
                  </button>
                </li>
              ))}
            </ul>

            <aside>
              <OrderSummary />
              <Link to="/checkout" className="btn btn-accent btn-lg btn-block">Ir al checkout</Link>
              <Link to="/catalogo" className="link-center">Seguir comprando</Link>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}