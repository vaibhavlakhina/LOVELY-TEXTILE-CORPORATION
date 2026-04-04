// ============================================================
// src/App.jsx  (Firebase version)
// Added: AuthProvider context, /admin route
// ============================================================

import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Wholesale from './pages/Wholesale'
import Contact from './pages/Contact'
import Admin from './pages/Admin'
import { AuthProvider } from './context/AuthContext'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  return (
    // AuthProvider makes the logged-in user available to Admin panel
    <AuthProvider>
      <ScrollToTop />

      {/* Hide Navbar and Footer on the /admin page for a cleaner admin UI */}
      <Routes>
        <Route path="/admin" element={<Admin />} />
        <Route path="/*" element={<PublicLayout />} />
      </Routes>
    </AuthProvider>
  )
}

// Public site layout with Navbar + Footer
function PublicLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/"            element={<Home />} />
          <Route path="/products"    element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/wholesale"   element={<Wholesale />} />
          <Route path="/contact"     element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </>
  )
}
