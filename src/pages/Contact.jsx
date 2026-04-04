import { useState } from 'react'
import { buildWhatsAppUrl, CONTACT_INFO } from '../data/products'
import styles from './Contact.module.css'

const CONTACT_CARDS = [
  { icon: '📞', title: 'Phone', value: CONTACT_INFO.phone, sub: 'Call us during business hours', id: 'contact-phone' },
  { icon: '✉️', title: 'Email', value: CONTACT_INFO.email, sub: 'We reply within 24 hours', id: 'contact-email' },
  { icon: '📍', title: 'Address', value: CONTACT_INFO.address, sub: 'Visit our showroom', id: 'contact-address' },
  { icon: '🕐', title: 'Hours', value: CONTACT_INFO.workingHours, sub: 'Sunday: Closed', id: 'contact-hours' },
]

const FAQS = [
  { q: 'What is the minimum order for wholesale?', a: 'For wholesale pricing, minimum order is 50 pieces per product. Higher quantities unlock better slab pricing.' },
  { q: 'Do you deliver pan India?', a: 'Yes! We ship to all major cities and towns across India. Typical delivery time is 3–7 business days.' },
  { q: 'Can I visit your showroom?', a: "Absolutely! Visit us at Textile Market, Surat. We're open Monday to Saturday, 9 AM to 7 PM." },
  { q: 'How can I place a bulk order?', a: 'You can fill our wholesale enquiry form, WhatsApp us directly, or call us. Our team will guide you through the entire process.' },
  { q: 'Do you offer custom branding?', a: 'Yes, we offer custom label printing on bulk orders of 100+ pieces. Contact us for pricing and turnaround time.' },
]

function FAQ({ question, answer, index }) {
  const [open, setOpen] = useState(false)

  return (
    <div className={styles.faq} id={`faq-${index}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className={styles.faqQ}
        aria-expanded={open}
      >
        <span>{question}</span>
        <span className={`${styles.faqIcon} ${open ? styles.faqOpen : ''}`}>+</span>
      </button>
      {open && <p className={styles.faqA}>{answer}</p>}
    </div>
  )
}

export default function Contact() {
  const waMain = buildWhatsAppUrl('Hi LTC Textiles! I have a query and would like to get in touch.')

  return (
    <div className="page-enter">
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className="container">
          <div className={styles.headerContent}>
            <span className="section-label" style={{ color: 'var(--gold)' }}>Get In Touch</span>
            <h1 className={styles.headerTitle}>Contact Us</h1>
            <p className={styles.headerSub}>
              Have a question, need a quote, or want to visit us? We'd love to hear from you.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Cards */}
      <section className="section">
        <div className="container">
          <div className={styles.contactGrid}>
            {CONTACT_CARDS.map(c => (
              <div key={c.id} className={styles.contactCard} id={c.id}>
                <span className={styles.cardIcon}>{c.icon}</span>
                <h3 className={styles.cardTitle}>{c.title}</h3>
                <p className={styles.cardValue}>{c.value}</p>
                <p className={styles.cardSub}>{c.sub}</p>
              </div>
            ))}
          </div>

          {/* WhatsApp CTA Banner */}
          <div className={styles.waBanner}>
            <div className={styles.waLeft}>
              <h2 className={styles.waTitle}>Need a Quick Answer?</h2>
              <p className={styles.waDesc}>
                The fastest way to reach us is WhatsApp. Our team responds within minutes during business hours.
              </p>
            </div>
            <div className={styles.waRight}>
              <a
                href={waMain}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp"
                id="contact-main-wa-btn"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Message Us on WhatsApp
              </a>
              <p className={styles.waNum}>{CONTACT_INFO.phone}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Map & FAQs */}
      <section className="section" style={{ background: 'var(--cream-dark)', paddingTop: '60px' }}>
        <div className="container">
          <div className={styles.bottomGrid}>
            {/* Map Mock */}
            <div className={styles.mapCol}>
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <span className="section-label">Location</span>
                <h2 className="section-title" style={{ color: 'var(--navy)' }}>Visit Our Showroom</h2>
              </div>
              <div className={styles.mapBox}>
                <iframe
                  title="LTC Textiles Location"
                  src="https://www.google.com/maps?q=29.38580038645153,76.96879064991892&z=16&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, borderRadius: '12px', minHeight: '320px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className={styles.mapOverlay}>
                  <a
                    href="https://www.google.com/maps?q=29.38580038645153,76.96879064991892"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    id="contact-map-btn"
                    style={{ marginTop: '0' }}
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            </div>

            {/* FAQs */}
            <div className={styles.faqCol}>
              <div style={{ textAlign: 'left', marginBottom: '24px' }}>
                <span className="section-label">Common Questions</span>
                <h2 className="section-title" style={{ color: 'var(--navy)' }}>FAQs</h2>
              </div>
              <div className={styles.faqs}>
                {FAQS.map((faq, i) => (
                  <FAQ key={i} question={faq.q} answer={faq.a} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
