import { useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import { CATEGORIES, PRODUCTS } from '../data/products.js'

export default function Catalogo() {
  const { categoria } = useParams()
  const [params, setParams] = useSearchParams()
  const q = (params.get('q') ?? '').toLowerCase()
  const sort = params.get('orden') ?? 'destacados'
  const current = CATEGORIES.find((c) => c.slug === categoria)

  const products = useMemo(() => {
    let list = PRODUCTS.filter((p) => (!categoria || p.category === categoria))
    if (q) list = list.filter((p) => `${p.brand} ${p.name} ${p.category}`.toLowerCase().includes(q))
    if (sort === 'precio-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'precio-desc') list = [...list].sort((a, b) => b.price - a.price)
    if (sort === 'valoracion') list = [...list].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews)
    return list
  }, [categoria, q, sort])

  const setSort = (value) => {
    const next = new URLSearchParams(params)
    next.set('orden', value)
    setParams(next)
  }

  return (
    <section className="section section-cream page-top">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">{current ? 'Categoría' : 'Catálogo'}</p>
          <h1 className="h-xl">{current ? current.nombre : 'Todos los productos'}</h1>
          {current && <p className="lead">{current.descripcion}</p>}
        </div>

        <div className="toolbar">
          <div className="chips">
            <Link to="/catalogo" className={'chip' + (!categoria ? ' active' : '')}>Todos</Link>
            {CATEGORIES.map((c) => (
              <Link key={c.slug} to={`/catalogo/${c.slug}`} className={'chip' + (categoria === c.slug ? ' active' : '')}>
                {c.nombre}
              </Link>
            ))}
          </div>
          <label className="select-wrap">
            <span>Ordenar por</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
              <option value="valoracion">Mejor valorados</option>
            </select>
          </label>
        </div>

        {q && <p className="muted">Resultados para “{params.get('q')}” · {products.length} productos</p>}

        {products.length === 0 ? (
          <div className="empty">
            <h3>No hemos encontrado productos</h3>
            <p>Prueba con otra búsqueda o explora todo el catálogo.</p>
            <Link to="/catalogo" className="btn btn-dark">Ver catálogo completo</Link>
          </div>
        ) : (
          <div className="product-grid">
            {products.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  )
}