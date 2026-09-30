import { useState } from 'react'
import { Link } from 'react-router-dom'
import ImageSlot from './ImageSlot.jsx'
import Stars from './Stars.jsx'
import { useCart } from '../context/CartContext.jsx'
import { eur } from '../lib/format.js'
import { CATEGORIES } from '../data/products.js'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const cat = CATEGORIES.find((c) => c.slug === product.category)
  const [added, setAdded] = useState(false)

  const handleAddToCart = () => {
    addItem(product, 1)

    setAdded(true)

    setTimeout(() => {
      setAdded(false)
    }, 1200)
  }

  return (
    <article className="card">
      <Link to={`/producto/${product.slug}`} className="card-media">
        <ImageSlot
          src={product.image}
          alt={`${product.brand} ${product.name}`}
        />

        {product.badge && (
          <span
            className={`badge ${
              product.badge.startsWith('Últimas')
                ? 'badge-dark badge-right'
                : ''
            }`}
          >
            {product.badge}
          </span>
        )}
      </Link>

      <div className="card-body">
        <div className="card-top">
          <span className="card-cat">{cat?.nombre}</span>
          <Stars
            rating={product.rating}
            reviews={product.reviews}
          />
        </div>

        <span className="card-brand">{product.brand}</span>

        <Link
          to={`/producto/${product.slug}`}
          className="card-name"
        >
          {product.name}
        </Link>

        <p className="card-stock">{product.stock > 0 ? `${product.stock} unidades disponibles` : "Agotado"}</p><div className="card-bottom">
          <span className="price">{eur(product.price)}</span>

          <button
            className={`btn btn-sm ${added ? 'added' : 'btn-dark'}`}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {added ? '✓ Añadido' : '+ Carrito'}
          </button>
        </div>
      </div>
    </article>
  )
}