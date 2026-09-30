import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Truck, ShieldCheck } from 'lucide-react'
import ImageSlot from '../components/ImageSlot.jsx'
import Stars from '../components/Stars.jsx'
import ProductCard from '../components/ProductCard.jsx'
import { CATEGORIES, PRODUCTS, getProductBySlug } from '../data/products.js'
import { useCart } from '../context/CartContext.jsx'
import { trackEvent } from '../lib/events.js'
import { eur } from '../lib/format.js'

function Producto() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const { addItem } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    if (product) trackEvent('product.viewed', { productId: product.id, sku: product.sku, category: product.category })
  }, [product])

  if (!product) {
    return (
      <section className="section section-cream page-top">
        <div className="container empty">
          <h2>Producto no encontrado</h2>
          <Link to="/catalogo" className="btn btn-dark">Volver al catálogo</Link>
        </div>
      </section>
    )
  }

  const cat = CATEGORIES.find((c) => c.slug === product.category)
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)

  const add = () => {
    addItem(product, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <section className="section section-cream page-top">
      <div className="container">
        <nav className="breadcrumb" aria-label="Ruta">
          <Link to="/">Inicio</Link> / <Link to={`/catalogo/${product.category}`}>{cat?.nombre}</Link> / <span>{product.name}</span>
        </nav>

        <div className="pdp">
          <div className="pdp-media">
            {/* 👉 Imagen principal: ruta definida en data/products.js */}
            <ImageSlot className="pdp-img" src={product.image} alt={`${product.brand} ${product.name}`} fit="contain" />
            {product.badge && <span className="badge">{product.badge}</span>}
          </div>

          <div className="pdp-info">
            <p className="card-cat">{cat?.nombre} · {product.brand}</p>
            <h1 className="h-lg">{product.name}</h1>
            <Stars rating={product.rating} reviews={product.reviews} />
            <p className="pdp-price">{eur(product.price)} <small>IVA incluido</small></p>
            <p className="pdp-desc">{product.description}</p>

            <p className={'stock ' + (product.stock <= 5 ? 'low' : '')}>
              {product.stock === 0 ? 'Sin stock' : product.stock <= 5 ? `Últimas ${product.stock} unidades` : `${product.stock} unidades disponibles · envío en 24-48 h`}
            </p>

            <div className="pdp-buy">
              <div className="qty" role="group" aria-label="Cantidad">
                <button disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Restar">−</button>
                <span>{qty}</span>
                <button disabled={qty >= product.stock} onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Sumar">+</button>
              </div>
              <button className="btn btn-accent btn-lg" onClick={add} disabled={product.stock === 0}>
                {added ? <><Check size={18} /> Añadido</> : 'Añadir al carrito'}
              </button>
            </div>
            {added && <p className="added-note"><Link to="/carrito">Ver carrito</Link></p>}

            <ul className="perks">
              <li><Truck size={18} /> Envío gratis en pedidos de más de 300 €</li>
              <li><ShieldCheck size={18} /> Compatibilidad: {product.compatibility}</li>
            </ul>
          </div>
        </div>

        <div className="specs"><details open><summary>Características y especificaciones</summary>
          <table>
            <tbody>
              {Object.entries(product.specs).map(([k, v]) => (
                <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>
              ))}
              <tr><th scope="row">Referencia</th><td>{product.sku}</td></tr>
            </tbody>
          </table></details>
          <details><summary>Compatibilidad y conexiones</summary><p>{product.compatibility}</p><p>Comprueba las conexiones de tu equipo antes de elegir. <Link to="/soporte">Consultar compatibilidad</Link></p></details>
          <details><summary>Lo más destacado</summary><ul className="feature-list">{(product.features ?? Object.entries(product.specs).map(([k,v]) => `${k}: ${v}`)).map(f => <li key={f}><Check size={16}/>{f}</li>)}</ul></details>
          <details><summary>Entrega y cuidados</summary><p>Envío estándar en 24-48 horas laborables. Envío gratuito a partir de 300 € después de descuentos.</p><p>{product.category === 'vinilos' ? 'Guarda tus discos en posición vertical y utiliza un cepillo adecuado antes de cada escucha.' : 'Coloca el equipo sobre una superficie estable y sigue las indicaciones de su manual.'}</p></details>
        </div>

        {related.length > 0 && (
          <div className="related">
            <h2 className="h-md">También en {cat?.nombre.toLowerCase()}</h2>
            <div className="product-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
export default function ProductoRoute() {
  const { slug } = useParams()
  return <Producto key={slug} />
}
