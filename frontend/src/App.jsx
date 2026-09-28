import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import PrototypeBanner from './components/PrototypeBanner.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import HelpButton from './components/HelpButton.jsx'
import Home from './pages/Home.jsx'
import Catalogo from './pages/Catalogo.jsx'
import Producto from './pages/Producto.jsx'
import Carrito from './pages/Carrito.jsx'
import Checkout from './pages/Checkout.jsx'
import Confirmacion from './pages/Confirmacion.jsx'
import Login from './pages/Login.jsx'
import Soporte from './pages/Soporte.jsx'
import Admin from './pages/Admin.jsx'
import Info from './pages/info.jsx'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PrototypeBanner />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/catalogo/:categoria" element={<Catalogo />} />
          <Route path="/producto/:slug" element={<Producto />} />
          <Route path="/carrito" element={<Carrito />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/pedido/:id" element={<Confirmacion />} />
          <Route path="/login" element={<Login />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Home />} />
          <Route path="/info/:slug" element={<Info />} />
        </Routes>
      </main>
      <Footer />
      <HelpButton />
    </>
  )
}

