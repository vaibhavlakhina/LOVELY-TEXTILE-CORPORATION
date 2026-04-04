import { Link } from 'react-router-dom'
import { TESTIMONIALS, STATS, buildWhatsAppUrl } from '../data/products'
import { useProducts } from '../hooks/useProducts'
import ProductCard from '../components/ProductCard'
import styles from './Home.module.css'

const INSTAGRAM_POSTS = [
  { id: 1, img: '/product_bedsheet_1774271113786.png', likes: '2.4K', caption: 'New Royal Cotton Collection ✨' },
  { id: 2, img: '/product_comforter_1774271132221.png', likes: '1.8K', caption: 'Stay cozy all night 🌙' },
  { id: 3, img: '/product_pillow_1774271153046.png', likes: '3.1K', caption: 'Embroidered elegance 💛' },
  { id: 4, img: '/product_fabric_1774271174747.png', likes: '1.2K', caption: 'Fabric collection drop 🎨' },
  { id: 5, img: '/product_bedsheet_set_1774271215760.png', likes: '2.7K', caption: 'Bedroom goals 🏠' },
  { id: 6, img: '/product_bedsheet_1774271113786.png', likes: '1.9K', caption: 'Wholesale ready stock 📦' },
]

export default function Home() {
  const { products, loading } = useProducts()
  
  const featured = products.slice(0, 4)
  const newArrivals = products.filter(p => p?.badge === 'New').slice(0, 4)

  const waWholesale = buildWhatsAppUrl('Hi LTC Textiles! I am interested in getting wholesale prices. Please share details.')
  const waShop = buildWhatsAppUrl('Hi LTC Textiles! I want to shop your products. Please help me.')

  return (
    <div className="page-enter">
      {/* ============= HERO ============= */}
      <section className={styles.hero}>
        <div className={styles.heroOverlay} />
        <img
          src="/hero_banner_1774271197371.png"
          alt="Luxury home textiles"
          className={styles.heroBg}
        />
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Premium Home Textiles</span>
          <h1 className={styles.heroTitle}>
            Wrap Your World<br />
            <em>in Pure Luxury</em>
          </h1>
          <p className={styles.heroDesc}>
            Bedsheets, comforters, pillow covers &amp; fabrics crafted for those who value comfort and style.
          </p>
          <div className={styles.heroBtns}>
            <Link to="/products" className="btn-gold" id="hero-shop-btn">
              Shop Now
            </Link>
            <a href={waWholesale} target="_blank" rel="noopener noreferrer" className="btn-outline-white" id="hero-wholesale-btn">
              Get Wholesale Price
            </a>
          </div>
          {/* Stats */}
          <div className={styles.heroStats}>
            {STATS.map(s => (
              <div key={s.label} className={styles.heroStat}>
                <span className={styles.statVal}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Cue */}
        <div className={styles.scrollCue}>
          <span className={styles.scrollLine} />
          <span className={styles.scrollText}>Scroll</span>
        </div>
      </section>

      {/* ============= CATEGORIES STRIP ============= */}
      <section className={styles.catStrip}>
        <div className="container">
          <div className={styles.catGrid}>
            {[
              { emoji: '🛏️', label: 'Bedsheets', cat: 'bedsheets' },
              { emoji: '📦', label: 'Bedsheet Sets', cat: 'sets' },
              { emoji: '❄️', label: 'AC Comforters', cat: 'comforters' },
              { emoji: '🌿', label: 'Pillow Covers', cat: 'pillows' },
              { emoji: '🎨', label: 'Fabrics', cat: 'fabrics' },
            ].map(c => (
              <Link key={c.cat} to={`/products?cat=${c.cat}`} className={styles.catCard} id={`cat-${c.cat}`}>
                <span className={styles.catEmoji}>{c.emoji}</span>
                <span className={styles.catLabel}>{c.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============= FEATURED PRODUCTS ============= */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Our Collection</span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Discover our most-loved premium textiles, crafted for comfort and elegance.</p>
            <div className="gold-divider" />
          </div>
          <div className={styles.productsGrid}>
            {loading ? (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-mid)' }}>Loading products...</p>
            ) : featured.length === 0 ? (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-mid)' }}>No products available yet.</p>
            ) : (
              featured.map(p => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
          <div className={styles.viewAllWrap}>
            <Link to="/products" className="btn-primary" id="home-view-all-btn">
              View All Products →
            </Link>
          </div>
        </div>
      </section>

      {/* ============= WHOLESALE CTA ============= */}
      <section className={styles.wholesaleCta}>
        <div className="container">
          <div className={styles.ctaCard}>
            <div className={styles.ctaLeft}>
              <span className="section-label" style={{ color: 'var(--gold)' }}>For Businesses</span>
              <h2 className={styles.ctaTitle}>Are You a Retailer or Distributor?</h2>
              <p className={styles.ctaDesc}>
                Join 500+ wholesale partners who trust LTC Textiles for consistent quality, bulk pricing, and timely delivery. Get exclusive wholesale rates starting from today.
              </p>
              <ul className={styles.ctaList}>
                {['Wholesale Price List Available', 'Minimum Order from 50 pieces', 'Pan India Delivery', 'Dedicated Account Manager', 'Custom Branding on Bulk Orders'].map(item => (
                  <li key={item} className={styles.ctaItem}>
                    <span className={styles.ctaCheck}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <div className={styles.ctaBtns}>
                <Link to="/wholesale" className="btn-gold" id="home-wholesale-cta-btn">
                  Get Wholesale Price
                </Link>
                <a href={waWholesale} target="_blank" rel="noopener noreferrer" className="btn-whatsapp" id="home-wa-wholesale-btn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>
            <div className={styles.ctaRight}>
              <img src="/product_fabric_1774271174747.png" alt="Wholesale fabrics" className={styles.ctaImg} />
              <div className={styles.ctaBadge}>
                <span className={styles.ctaBadgeVal}>40%</span>
                <span className={styles.ctaBadgeLabel}>Off on Bulk</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============= NEW ARRIVALS ============= */}
      <section className="section" style={{ background: 'var(--cream-dark)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Just In</span>
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">Fresh designs and exclusive collections, just arrived in our store.</p>
            <div className="gold-divider" />
          </div>
          <div className={styles.productsGrid}>
            {loading ? (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-mid)' }}>Loading products...</p>
            ) : newArrivals.length === 0 ? (
              <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: 'var(--text-mid)' }}>No new arrivals right now.</p>
            ) : (
              newArrivals.map(p => (
                <ProductCard key={p.id} product={p} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* ============= TESTIMONIALS ============= */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Trusted by Thousands</span>
            <h2 className="section-title">What Our Customers Say</h2>
            <div className="gold-divider" />
          </div>
          <div className={styles.testimonialGrid}>
            {TESTIMONIALS.map(t => (
              <div key={t.id} className={styles.testimonial}>
                <div className={styles.stars}>{'★'.repeat(t.rating)}</div>
                <p className={styles.testimonialText}>"{t.text}"</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.avatar}>{t.name[0]}</div>
                  <div>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorRole}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============= INSTAGRAM ============= */}
      <section className={styles.igSection}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Follow Us</span>
            <h2 className="section-title">@ltctextiles on Instagram</h2>
            <p className="section-subtitle">Join our community for daily inspiration, new launches and exclusive offers.</p>
            <div className="gold-divider" />
          </div>
          <div className={styles.igGrid}>
            {INSTAGRAM_POSTS.map(post => (
              <a key={post.id} href="#" className={styles.igPost} id={`ig-post-${post.id}`} aria-label={post.caption}>
                <img src={post.img} alt={post.caption} className={styles.igImg} loading="lazy" />
                <div className={styles.igOverlay}>
                  <span className={styles.igLikes}>❤️ {post.likes}</span>
                  <span className={styles.igCaption}>{post.caption}</span>
                </div>
              </a>
            ))}
          </div>
          <div className={styles.viewAllWrap}>
            <a href="#" className="btn-secondary" id="home-ig-follow-btn">
              Follow @ltctextiles on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
