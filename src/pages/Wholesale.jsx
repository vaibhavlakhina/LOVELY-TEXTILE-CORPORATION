import { useState } from 'react'
import { Link } from 'react-router-dom'
import { buildWhatsAppUrl } from '../data/products'
import styles from './Wholesale.module.css'

const PRODUCT_OPTIONS = [
  'Bedsheets', 'Bedsheet Sets', 'AC Comforters', 'Pillow Covers', 'Fabrics', 'Multiple Products',
]

const BENEFITS = [
  { icon: '💰', title: 'Best Wholesale Rates', desc: 'Up to 40% off retail prices for bulk orders above 50 pieces.' },
  { icon: '🚚', title: 'Pan India Delivery', desc: 'Fast and reliable shipping to any city in India. Bulk dispatches within 3–5 days.' },
  { icon: '📞', title: 'Dedicated Support', desc: 'Your personal account manager for hassle-free ordering and quick resolution.' },
  { icon: '🏷️', title: 'Custom Branding', desc: 'Add your brand label on bulk orders of 100+ pieces. MOQ applies.' },
  { icon: '📦', title: 'Flexible MOQ', desc: 'Start from just 50 pieces. Higher volume = better pricing!' },
  { icon: '✅', title: 'Quality Guaranteed', desc: 'Every batch goes through strict quality control before dispatch.' },
]

export default function Wholesale() {
  const [form, setForm] = useState({
    name: '', phone: '', business: '', city: '', product: '', message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    const msg = `🏢 *Wholesale Enquiry from LTC Website*\n\n👤 Name: ${form.name}\n📞 Phone: ${form.phone}\n🏪 Business: ${form.business}\n🏙️ City: ${form.city}\n📦 Product: ${form.product}\n💬 Message: ${form.message}`
    window.open(buildWhatsAppUrl(msg), '_blank')
    setSubmitted(true)
  }

  const reset = () => { setForm({ name: '', phone: '', business: '', city: '', product: '', message: '' }); setSubmitted(false) }

  return (
    <div className="page-enter">
      {/* Page Header */}
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className="container">
          <div className={styles.headerContent}>
            <span className="section-label" style={{ color: 'var(--gold)' }}>For Businesses</span>
            <h1 className={styles.headerTitle}>Wholesale Partnership</h1>
            <p className={styles.headerSub}>
              Join 500+ retailers and distributors who trust LTC Textiles for premium quality at wholesale prices.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-label">Why Partner With Us</span>
            <h2 className="section-title">Wholesale Benefits</h2>
            <div className="gold-divider" />
          </div>
          <div className={styles.benefitsGrid}>
            {BENEFITS.map(b => (
              <div key={b.title} className={styles.benefit}>
                <span className={styles.benefitIcon}>{b.icon}</span>
                <h3 className={styles.benefitTitle}>{b.title}</h3>
                <p className={styles.benefitDesc}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section" style={{ background: 'var(--cream-dark)', paddingTop: 0 }}>
        <div className="container">
          <div className={styles.formSection}>
            {/* Left – Info */}
            <div className={styles.formInfo}>
              <span className="section-label">Get Started</span>
              <h2 className={styles.formTitle}>Request Wholesale Pricing</h2>
              <p className={styles.formDesc}>
                Fill in your details and we'll get back to you within 24 hours with the best pricing tailored for your business.
              </p>
              <div className={styles.infoPoints}>
                {[
                  { icon: '⚡', text: 'Response within 24 hours' },
                  { icon: '🤝', text: 'No commitment, free enquiry' },
                  { icon: '📋', text: 'Full product catalog shared' },
                  { icon: '💬', text: 'WhatsApp support available' },
                ].map(p => (
                  <div key={p.text} className={styles.infoPoint}>
                    <span>{p.icon}</span>
                    <span>{p.text}</span>
                  </div>
                ))}
              </div>
              <div className={styles.directContact}>
                <p className={styles.directLabel}>Or contact us directly:</p>
                <a
                  href={buildWhatsAppUrl('Hi! I am interested in wholesale partnership with LTC Textiles.')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp"
                  id="wholesale-direct-wa-btn"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Right – Form */}
            <div className={styles.formCard}>
              {submitted ? (
                <div className={styles.successState}>
                  <div className={styles.successIcon}>✅</div>
                  <h3>Enquiry Sent!</h3>
                  <p>Your enquiry has been sent via WhatsApp. Our team will respond within 24 hours.</p>
                  <button onClick={reset} className="btn-primary" id="wholesale-new-enquiry-btn">
                    Send Another Enquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} id="wholesale-form">
                  <h3 className={styles.formCardTitle}>Wholesale Enquiry Form</h3>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="ws-name" className={styles.label}>Full Name *</label>
                      <input id="ws-name" name="name" type="text" placeholder="Your full name" required value={form.name} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="ws-phone" className={styles.label}>Phone Number *</label>
                      <input id="ws-phone" name="phone" type="tel" placeholder="+91 98765 43210" required value={form.phone} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="ws-business" className={styles.label}>Business Name *</label>
                      <input id="ws-business" name="business" type="text" placeholder="Your shop / company name" required value={form.business} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="ws-city" className={styles.label}>City *</label>
                      <input id="ws-city" name="city" type="text" placeholder="Your city" required value={form.city} onChange={handleChange} className={styles.input} />
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="ws-product" className={styles.label}>Product Interest *</label>
                      <select id="ws-product" name="product" required value={form.product} onChange={handleChange} className={styles.input}>
                        <option value="">Select a product category</option>
                        {PRODUCT_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label htmlFor="ws-message" className={styles.label}>Message</label>
                      <textarea
                        id="ws-message"
                        name="message"
                        rows={4}
                        placeholder="Tell us about your requirements, expected quantity, etc."
                        value={form.message}
                        onChange={handleChange}
                        className={`${styles.input} ${styles.textarea}`}
                      />
                    </div>
                  </div>
                  <button type="submit" className={`btn-gold ${styles.submitBtn}`} id="wholesale-submit-btn">
                    📤 Send Enquiry via WhatsApp
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
