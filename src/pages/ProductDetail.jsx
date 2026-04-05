// ============================================================
// src/pages/ProductDetail.jsx  (Firebase version)
// Fetches a single product from Firestore by its doc ID.
// Falls back gracefully if the product is not found.
// ============================================================

import { useState, useEffect } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import { getProductById, subscribeToProducts } from '../firebase/firestore'
import { buildWhatsAppUrl } from '../data/products'
import ProductCard from '../components/ProductCard'
import styles from './ProductDetail.module.css'

export default function ProductDetail() {
  const { id } = useParams()

  const [product,  setProduct]  = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [related,  setRelated]  = useState([])

  const [selectedSize,  setSelectedSize]  = useState(null)
  const [selectedColor, setSelectedColor] = useState(null)  // full variant object
  const [selectedImage, setSelectedImage] = useState(null)
  const [tab,           setTab]           = useState('description')

  // Fetch the product by Firestore doc ID
  useEffect(() => {
    setLoading(true)
    setNotFound(false)

    getProductById(id).then((data) => {
      if (!data) {
        setNotFound(true)
      } else {
        setProduct(data)
        setSelectedImage(data.images?.[0] || data.image || '/placeholder.png')
      }
      setLoading(false)
    }).catch(() => {
      setNotFound(true)
      setLoading(false)
    })
  }, [id])

  // Fetch related products from the same category
  useEffect(() => {
    if (!product) return
    const unsub = subscribeToProducts((all) => {
      setRelated(
        all.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
      )
    })
    return unsub
  }, [product])

  // ─── States ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-enter" style={{ textAlign: 'center', padding: '160px 24px' }}>
        <div className={styles.spinner} />
        <p style={{ color: 'var(--text-mid)' }}>Loading product…</p>
      </div>
    )
  }

  if (notFound) return <Navigate to="/products" replace />

  const waOrder = buildWhatsAppUrl(
    `Hi LTC Textiles! I want to order:\n\n🛍️ Product: ${product.name}\n💰 Price: ${product.price}\n📐 Size: ${selectedSize || 'Not selected'}\n\nPlease confirm availability and payment details.`
  )
  const waWholesale = buildWhatsAppUrl(
    `Hi LTC Textiles! I am interested in wholesale pricing for:\n\n📦 Product: ${product.name}\n💰 Wholesale Price: ${product.wholesalePrice}\n\nPlease share bulk pricing and MOQ details.`
  )

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <div className="container">
          <nav>
            <Link to="/">Home</Link>
            <span>/</span>
            <Link to="/products">Products</Link>
            <span>/</span>
            <span>{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Detail */}
      <section className="section-sm">
        <div className="container">
          <div className={styles.detail}>
            {/* Image */}
            <div className={styles.imageCol}>
              <div className={styles.mainImg}>
                {product.badge && (
                  <span className={`badge badge-${product.badge === 'New' ? 'new' : product.badge === 'Sale' ? 'sale' : 'wholesale'} ${styles.badge}`}>
                    {product.badge}
                  </span>
                )}
                <img src={selectedImage} alt={product.name} className={styles.img} />
              </div>
              {/* Gallery: show images of selected color, or fallback */}
              {(() => {
                const galleryImgs = selectedColor?.images?.length > 0
                  ? selectedColor.images
                  : (product.images?.length > 0 ? product.images : [product.image].filter(Boolean))
                return (
                  <div className={styles.thumbGrid}>
                    {galleryImgs.map((img, i) => (
                      <div
                        key={i}
                        className={`${styles.thumb} ${selectedImage === img ? styles.activeThumb : ''}`}
                        onClick={() => setSelectedImage(img)}
                        style={{ cursor: 'pointer' }}
                      >
                        <img src={img} alt={`${product.name} view ${i + 1}`} />
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>

            {/* Info */}
            <div className={styles.infoCol}>
              <div className={styles.metaTop}>
                <span className={styles.category}>{product.category}</span>
                <div className={styles.rating}>
                  <span className={styles.stars}>{'★'.repeat(Math.floor(product.rating ?? 0))}</span>
                  <span>{product.rating} ({product.reviews} reviews)</span>
                </div>
              </div>

              <h1 className={styles.name}>{product.name}</h1>

              <div className={styles.prices}>
                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>Retail Price</span>
                  <span className={styles.price}>{product.price}</span>
                </div>
                <div className={styles.divider} />
                <div className={styles.priceBlock}>
                  <span className={styles.priceLabel}>Wholesale Price</span>
                  <span className={styles.wholesalePrice}>{product.wholesalePrice}</span>
                </div>
              </div>

              {/* Sizes */}
              {product.sizes?.length > 0 && (
                <div className={styles.optionGroup}>
                  <label className={styles.optionLabel}>
                    Size: {selectedSize && <strong>{selectedSize}</strong>}
                  </label>
                  <div className={styles.sizes}>
                    {product.sizes.map(s => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`${styles.sizeBtn} ${selectedSize === s ? styles.selectedSize : ''}`}
                        id={`size-${s}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colorVariants?.length > 0 ? (
                <div className={styles.optionGroup}>
                  <label className={styles.optionLabel}>
                    Color: {selectedColor && <strong>{selectedColor.name}</strong>}
                  </label>
                  <div className={styles.colors}>
                    {product.colorVariants.map((variant, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSelectedColor(variant)
                          setSelectedImage(variant.images?.[0] ?? null)
                        }}
                        className={`${styles.colorBtn} ${selectedColor === variant ? styles.selectedColor : ''}`}
                        style={{ background: variant.hex }}
                        title={variant.name}
                      />
                    ))}
                  </div>
                </div>
              ) : product.colors?.length > 0 && (
                <div className={styles.optionGroup}>
                  <label className={styles.optionLabel}>Color Variants</label>
                  <div className={styles.colors}>
                    {product.colors.map((color, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(color)}
                        className={`${styles.colorBtn} ${selectedColor === color ? styles.selectedColor : ''}`}
                        style={{ background: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Buttons */}
              <div className={styles.ctaBtns}>
                <a
                  href={waOrder}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                  id="detail-whatsapp-order-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Order via WhatsApp
                </a>
                <a
                  href={waWholesale}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                  id="detail-wholesale-btn"
                >
                  💼 Get Wholesale Price
                </a>
              </div>

              {/* Assurances */}
              <div className={styles.assurances}>
                {[
                  { icon: '🚚', text: 'Free Shipping on orders above ₹2000' },
                  { icon: '↩️', text: '7-day easy returns' },
                  { icon: '✅', text: '100% genuine quality guarantee' },
                ].map(a => (
                  <div key={a.text} className={styles.assurance}>
                    <span>{a.icon}</span>
                    <span>{a.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            <div className={styles.tabNav}>
              {['description', 'features', 'care'].map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`${styles.tabBtn} ${tab === t ? styles.activeTab : ''}`}
                  id={`tab-${t}`}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
            <div className={styles.tabContent}>
              {tab === 'description' && (
                <div>
                  <p className={styles.desc}>{product.description}</p>
                  <div className={styles.specs}>
                    <div className={styles.spec}><span>Material</span><span>{product.material}</span></div>
                    <div className={styles.spec}><span>Dimensions</span><span>{product.dimensions}</span></div>
                  </div>
                </div>
              )}
              {tab === 'features' && (
                <ul className={styles.featureList}>
                  {(product.features ?? []).map((f, i) => (
                    <li key={i} className={styles.featureItem}>
                      <span className={styles.featureCheck}>✓</span> {f}
                    </li>
                  ))}
                </ul>
              )}
              {tab === 'care' && (
                <div className={styles.care}>
                  <p>🧺 {product.care}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section" style={{ background: 'var(--cream-dark)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">You May Also Like</span>
              <h2 className="section-title">Related Products</h2>
              <div className="gold-divider" />
            </div>
            <div className={styles.relatedGrid}>
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
