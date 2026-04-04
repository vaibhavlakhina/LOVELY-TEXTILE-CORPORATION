// ============================================================
// src/pages/Products.jsx  (Firebase version)
// Now fetches products from Firestore in real time.
// UI is exactly the same as before — only data source changed.
// ============================================================

import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useProducts } from '../hooks/useProducts'
import { CATEGORIES } from '../data/products'       // categories stay static
import ProductCard from '../components/ProductCard'
import styles from './Products.module.css'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search,  setSearch]  = useState('')
  const [sortBy,  setSortBy]  = useState('default')

  // 🔥 Fetch products from Firestore (real-time)
  const { products, loading, error } = useProducts()

  const activeCategory = searchParams.get('cat') || 'all'

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // Filter + sort products (same logic as before)
  const filtered = useMemo(() => {
    let result = products

    if (activeCategory !== 'all') {
      result = result.filter(p => p.category === activeCategory)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      )
    }
    if (sortBy === 'rating') {
      result = [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    } else if (sortBy === 'reviews') {
      result = [...result].sort((a, b) => (b.reviews ?? 0) - (a.reviews ?? 0))
    }
    return result
  }, [products, activeCategory, search, sortBy])

  const setCategory = (cat) => {
    if (cat === 'all') searchParams.delete('cat')
    else searchParams.set('cat', cat)
    setSearchParams(searchParams)
    setSearch('')
  }

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div className={styles.headerOverlay} />
        <div className={styles.headerContent}>
          <div className="container">
            <span className="section-label" style={{ color: 'var(--gold)' }}>Our Collection</span>
            <h1 className={styles.pageTitle}>All Products</h1>
            <p className={styles.pageSubtitle}>
              Premium textiles for every need — from cozy bedsheets to luxurious comforters.
            </p>
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {/* Controls Row */}
          <div className={styles.controls}>
            {/* Search */}
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="search"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={styles.searchInput}
                id="products-search"
              />
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className={styles.sort}
              id="products-sort"
            >
              <option value="default">Default</option>
              <option value="rating">Top Rated</option>
              <option value="reviews">Most Reviewed</option>
            </select>
          </div>

          {/* Category Tabs */}
          <div className={styles.catTabs}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`${styles.catTab} ${activeCategory === cat.id ? styles.active : ''}`}
                id={`filter-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* ─── Loading State ─────────────────────────────── */}
          {loading && (
            <div className={styles.loadingWrap} id="products-loading">
              <div className={styles.spinner} />
              <p>Loading products…</p>
            </div>
          )}

          {/* ─── Error State ───────────────────────────────── */}
          {error && (
            <div className={styles.errorBox} id="products-error">
              <span>⚠️</span>
              <p>Could not load products. Please check your connection and try again.</p>
            </div>
          )}

          {/* ─── Results ──────────────────────────────────── */}
          {!loading && !error && (
            <>
              <div className={styles.resultsRow}>
                <p className={styles.resultsCount}>
                  Showing <strong>{filtered.length}</strong> products
                  {activeCategory !== 'all' && ` in `}
                  {activeCategory !== 'all' && <strong> {CATEGORIES.find(c => c.id === activeCategory)?.label}</strong>}
                </p>
              </div>

              {filtered.length > 0 ? (
                <div className={styles.grid}>
                  {filtered.map(p => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              ) : (
                <div className={styles.empty}>
                  <span className={styles.emptyIcon}>🔍</span>
                  <h3>No products found</h3>
                  <p>Try a different search term or category</p>
                  <button
                    onClick={() => { setSearch(''); setCategory('all') }}
                    className="btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
