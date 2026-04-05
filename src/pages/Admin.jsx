// ============================================================
// src/pages/Admin.jsx
// Admin panel: login + full product management (add/edit/delete)
// with Firebase Auth, Firestore, and Storage image uploads.
// Each color variant has its own name, hex and image gallery.
// Access this page at: http://localhost:5173/admin
// ============================================================

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { adminLogin, adminLogout } from '../firebase/auth'
import { useProducts } from '../hooks/useProducts'
import { addProduct, updateProduct, deleteProduct } from '../firebase/firestore'
import { uploadProductImage } from '../firebase/storage'
import { CATEGORIES } from '../data/products'
import styles from './Admin.module.css'

// ─── Default empty form ───────────────────────────────────
const EMPTY_FORM = {
  name: '', category: 'bedsheets', price: '', wholesalePrice: '',
  badge: '', description: '', material: '', dimensions: '', care: '',
  rating: '0', reviews: '0',
  sizes: '',    // comma-separated string → stored as array
  features: '', // newline-separated → stored as array
}

// ─── Default empty color variant ─────────────────────────
const EMPTY_VARIANT = { name: '', hex: '#000000', imagesText: '', files: [], previews: [] }

export default function Admin() {
  const { user, loading: authLoading } = useAuth()

  // ─── Login State ────────────────────────────────────────
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loginErr, setLoginErr] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)

  // ─── Product list ────────────────────────────────────────
  const { products, loading: productsLoading } = useProducts()

  // ─── Form state ──────────────────────────────────────────
  const [form,       setForm]      = useState(EMPTY_FORM)
  const [editId,     setEditId]    = useState(null)
  const [saving,     setSaving]    = useState(false)
  const [saveMsg,    setSaveMsg]   = useState('')
  const [deleting,   setDeleting]  = useState(null)
  const [uploadPct,  setUploadPct] = useState(0)

  // ─── Color variants state ──────────────────────────────
  // Each variant: { name, hex, imagesText, files[], previews[] }
  const [colorVariants, setColorVariants] = useState([{ ...EMPTY_VARIANT }])

  const fileRefs = useRef([])
  const formRef  = useRef(null)

  // ─── Auth: Handle login ───────────────────────────────────
  async function handleLogin(e) {
    e.preventDefault()
    setLoginErr('')
    setLoggingIn(true)
    try {
      await adminLogin(email, password)
    } catch (err) {
      setLoginErr('Invalid credentials. Please try again.')
    } finally {
      setLoggingIn(false)
    }
  }

  // ─── Form input change ─────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  // ─── Color variant helpers ────────────────────────────────
  function updateVariant(idx, field, value) {
    setColorVariants(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], [field]: value }
      return next
    })
  }

  function addVariant() {
    setColorVariants(prev => [...prev, { ...EMPTY_VARIANT }])
  }

  function removeVariant(idx) {
    setColorVariants(prev => prev.filter((_, i) => i !== idx))
  }

  function handleVariantFiles(e, idx) {
    const files = Array.from(e.target.files)
    if (!files.length) return
    const previews = files.map(f => URL.createObjectURL(f))
    setColorVariants(prev => {
      const next = [...prev]
      next[idx] = { ...next[idx], files, previews }
      return next
    })
  }

  // ─── Load product into form for editing ───────────────────
  function startEdit(product) {
    setEditId(product.id)
    setForm({
      name:           product.name           ?? '',
      category:       product.category       ?? 'bedsheets',
      price:          product.price          ?? '',
      wholesalePrice: product.wholesalePrice ?? '',
      badge:          product.badge          ?? '',
      description:    product.description    ?? '',
      material:       product.material       ?? '',
      dimensions:     product.dimensions     ?? '',
      care:           product.care           ?? '',
      rating:         String(product.rating  ?? 0),
      reviews:        String(product.reviews ?? 0),
      sizes:          (product.sizes    ?? []).join(', '),
      features:       (product.features ?? []).join('\n'),
    })

    // Load existing color variants (or create one from legacy data)
    if (product.colorVariants?.length > 0) {
      setColorVariants(product.colorVariants.map(v => ({
        name:       v.name  ?? '',
        hex:        v.hex   ?? '#000000',
        imagesText: (v.images ?? []).join(', '),
        files:      [],
        previews:   v.images ?? [],
      })))
    } else {
      // Legacy: single image, old colors array
      const legacyImages = product.images ?? (product.image ? [product.image] : [])
      const legacyColors = product.colors ?? []
      if (legacyColors.length > 0) {
        setColorVariants(legacyColors.map((hex, i) => ({
          name:       hex,
          hex,
          imagesText: i === 0 ? legacyImages.join(', ') : '',
          files:      [],
          previews:   i === 0 ? legacyImages : [],
        })))
      } else {
        setColorVariants([{
          name:       'Default',
          hex:        '#0B1F3A',
          imagesText: legacyImages.join(', '),
          files:      [],
          previews:   legacyImages,
        }])
      }
    }

    formRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditId(null)
    setForm(EMPTY_FORM)
    setColorVariants([{ ...EMPTY_VARIANT }])
    setSaveMsg('')
  }

  // ─── Save (add or update) ────────────────────────────────
  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setSaveMsg('')

    try {
      // Upload images for each color variant
      const builtVariants = []
      let totalFiles = colorVariants.reduce((acc, v) => acc + v.files.length, 0)
      let uploadedCount = 0

      for (const variant of colorVariants) {
        let uploadedUrls = []

        // Upload files
        for (const file of variant.files) {
          const url = await uploadProductImage(file, () => {})
          uploadedUrls.push(url)
          uploadedCount++
          setUploadPct(Math.round((uploadedCount / Math.max(totalFiles, 1)) * 100))
        }

        // Merge with manual URLs
        const manualUrls = variant.imagesText.split(',').map(s => s.trim()).filter(Boolean)
        const finalImages = [...manualUrls, ...uploadedUrls]

        builtVariants.push({
          name:   variant.name.trim() || variant.hex,
          hex:    variant.hex,
          images: finalImages,
        })
      }

      // Derive top-level arrays for backwards compatibility
      const primaryImage  = builtVariants[0]?.images?.[0] ?? ''
      const allImages     = builtVariants.flatMap(v => v.images)
      const colorsHex     = builtVariants.map(v => v.hex)

      const data = {
        name:           form.name.trim(),
        category:       form.category,
        price:          form.price.trim(),
        wholesalePrice: form.wholesalePrice.trim(),
        badge:          form.badge.trim() || null,
        description:    form.description.trim(),
        material:       form.material.trim(),
        dimensions:     form.dimensions.trim(),
        care:           form.care.trim(),
        rating:         parseFloat(form.rating)  || 0,
        reviews:        parseInt(form.reviews)   || 0,
        sizes:          form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        features:       form.features.split('\n').map(s => s.trim()).filter(Boolean),
        // New structured data
        colorVariants:  builtVariants,
        // Legacy compat
        colors:         colorsHex,
        image:          primaryImage,
        images:         allImages,
      }

      if (editId) {
        await updateProduct(editId, data)
        setSaveMsg('✅ Product updated successfully!')
      } else {
        await addProduct(data)
        setSaveMsg('✅ Product added successfully!')
      }

      cancelEdit()
    } catch (err) {
      console.error(err)
      setSaveMsg('❌ Error saving product. Please try again.')
    } finally {
      setSaving(false)
      setUploadPct(0)
    }
  }

  // ─── Delete a product ─────────────────────────────────────
  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(id)
    try {
      await deleteProduct(id)
    } catch (err) {
      alert('Failed to delete. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  // ─── RENDER: Loading auth ──────────────────────────────────
  if (authLoading) {
    return (
      <div className={styles.center}>
        <div className={styles.spinner} />
      </div>
    )
  }

  // ─── RENDER: Login Form (not authenticated) ───────────────
  if (!user) {
    return (
      <div className={styles.loginPage}>
        <div className={styles.loginCard}>
          <div className={styles.loginLogo}>🔒</div>
          <h1 className={styles.loginTitle}>Admin Panel</h1>
          <p className={styles.loginSub}>LTC Textiles — Sign in to manage products</p>

          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.field}>
              <label htmlFor="admin-email">Email</label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@ltctextiles.com"
                required
                autoFocus
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="admin-password">Password</label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>
            {loginErr && <p className={styles.loginError}>{loginErr}</p>}
            <button
              type="submit"
              className={styles.loginBtn}
              id="admin-login-btn"
              disabled={loggingIn}
            >
              {loggingIn ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // ─── RENDER: Admin Dashboard (authenticated) ──────────────
  return (
    <div className={styles.adminPage}>
      {/* Header */}
      <div className={styles.adminHeader}>
        <div className={styles.adminHeaderInner}>
          <div>
            <h1 className={styles.adminTitle}>🛠 Product Manager</h1>
            <p className={styles.adminSub}>Logged in as <strong>{user.email}</strong></p>
          </div>
          <button
            onClick={adminLogout}
            className={styles.logoutBtn}
            id="admin-logout-btn"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className={styles.adminBody}>

        {/* ─── Add / Edit Form ────────────────────────────── */}
        <section className={styles.formSection} ref={formRef}>
          <h2 className={styles.sectionTitle}>
            {editId ? '✏️ Edit Product' : '➕ Add New Product'}
          </h2>

          {saveMsg && (
            <div className={`${styles.saveMsg} ${saveMsg.startsWith('❌') ? styles.saveMsgErr : styles.saveMsgOk}`}>
              {saveMsg}
            </div>
          )}

          <form onSubmit={handleSave} className={styles.productForm}>
            {/* Row 1 */}
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Product Name *</label>
                <input name="name" value={form.name} onChange={handleChange} required placeholder="Royal Cotton Bedsheet" />
              </div>
              <div className={styles.field}>
                <label>Category *</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 */}
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Retail Price *</label>
                <input name="price" value={form.price} onChange={handleChange} required placeholder="₹1,299" />
              </div>
              <div className={styles.field}>
                <label>Wholesale Price</label>
                <input name="wholesalePrice" value={form.wholesalePrice} onChange={handleChange} placeholder="₹899" />
              </div>
              <div className={styles.field}>
                <label>Badge</label>
                <select name="badge" value={form.badge} onChange={handleChange}>
                  <option value="">None</option>
                  <option value="New">New</option>
                  <option value="Sale">Sale</option>
                  <option value="Bestseller">Bestseller</option>
                  <option value="Wholesale">Wholesale</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className={styles.field}>
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Product description…" />
            </div>

            {/* Row 3 */}
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Material</label>
                <input name="material" value={form.material} onChange={handleChange} placeholder="100% Egyptian Cotton" />
              </div>
              <div className={styles.field}>
                <label>Dimensions</label>
                <input name="dimensions" value={form.dimensions} onChange={handleChange} placeholder="Available in all standard sizes" />
              </div>
              <div className={styles.field}>
                <label>Care Instructions</label>
                <input name="care" value={form.care} onChange={handleChange} placeholder="Machine wash cold" />
              </div>
            </div>

            {/* Row 4 */}
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label>Rating (0–5)</label>
                <input name="rating" type="number" min="0" max="5" step="0.1" value={form.rating} onChange={handleChange} />
              </div>
              <div className={styles.field}>
                <label>Reviews count</label>
                <input name="reviews" type="number" min="0" value={form.reviews} onChange={handleChange} />
              </div>
            </div>

            {/* Sizes */}
            <div className={styles.field}>
              <label>Sizes <span className={styles.hint}>(comma-separated)</span></label>
              <input name="sizes" value={form.sizes} onChange={handleChange} placeholder="Single, Double, King, Queen" />
            </div>

            {/* Features */}
            <div className={styles.field}>
              <label>Features <span className={styles.hint}>(one per line)</span></label>
              <textarea name="features" value={form.features} onChange={handleChange} rows={4} placeholder={"300 Thread Count\nFade Resistant\nHypoallergenic"} />
            </div>

            {/* ─── Color Variants ──────────────────────────── */}
            <div className={styles.field}>
              <label style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px', display: 'block' }}>
                🎨 Color Variants
                <span className={styles.hint} style={{ marginLeft: '8px' }}>Each color has its own images</span>
              </label>

              {colorVariants.map((variant, idx) => (
                <div key={idx} className={styles.variantCard}>
                  <div className={styles.variantHeader}>
                    <span className={styles.variantNum}>Color {idx + 1}</span>
                    {colorVariants.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeVariantBtn}
                        onClick={() => removeVariant(idx)}
                      >
                        ✕ Remove
                      </button>
                    )}
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.field}>
                      <label>Color Name</label>
                      <input
                        value={variant.name}
                        onChange={e => updateVariant(idx, 'name', e.target.value)}
                        placeholder="e.g. Navy Blue"
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Hex Color</label>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={variant.hex}
                          onChange={e => updateVariant(idx, 'hex', e.target.value)}
                          style={{ width: '48px', height: '38px', padding: '2px', border: '1px solid var(--border)', borderRadius: '6px', cursor: 'pointer' }}
                        />
                        <input
                          value={variant.hex}
                          onChange={e => updateVariant(idx, 'hex', e.target.value)}
                          placeholder="#0B1F3A"
                          style={{ flex: 1 }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Variant Images */}
                  <div className={styles.field}>
                    <label>Images for this color</label>
                    {variant.previews.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
                        {variant.previews.map((src, i) => (
                          <img key={i} src={src} alt={`variant-${idx}-img-${i}`}
                            style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--border)' }}
                          />
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        className={styles.browseBtn}
                        onClick={() => {
                          if (!fileRefs.current[idx]) fileRefs.current[idx] = document.createElement('input')
                          const inp = fileRefs.current[idx]
                          inp.type = 'file'
                          inp.accept = 'image/*'
                          inp.multiple = true
                          inp.onchange = (e) => handleVariantFiles(e, idx)
                          inp.click()
                        }}
                        id={`browse-variant-${idx}`}
                      >
                        📁 Upload Images
                      </button>
                      {variant.files.length > 0 && (
                        <span className={styles.fileName}>{variant.files.length} file(s) selected</span>
                      )}
                    </div>
                    <p className={styles.orUrl} style={{ marginTop: '8px' }}>or enter comma-separated URLs:</p>
                    <input
                      value={variant.imagesText}
                      onChange={e => updateVariant(idx, 'imagesText', e.target.value)}
                      placeholder="https://img1.jpg, https://img2.jpg"
                      className={styles.imageUrlInput}
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                className={styles.addVariantBtn}
                onClick={addVariant}
                id="admin-add-variant-btn"
              >
                + Add Another Color
              </button>
            </div>

            {uploadPct > 0 && uploadPct < 100 && (
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${uploadPct}%` }} />
              </div>
            )}

            {/* Form Actions */}
            <div className={styles.formActions}>
              <button type="submit" className={styles.saveBtn} id="admin-save-btn" disabled={saving}>
                {saving ? 'Saving…' : editId ? 'Update Product' : 'Add Product'}
              </button>
              {editId && (
                <button type="button" onClick={cancelEdit} className={styles.cancelBtn} id="admin-cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ─── Product List ──────────────────────────────── */}
        <section className={styles.listSection}>
          <h2 className={styles.sectionTitle}>
            📦 All Products
            <span className={styles.productCount}>{products.length} total</span>
          </h2>

          {productsLoading ? (
            <div className={styles.center}><div className={styles.spinner} /></div>
          ) : products.length === 0 ? (
            <p className={styles.emptyMsg}>No products yet. Add your first product above!</p>
          ) : (
            <div className={styles.productTable}>
              <div className={styles.tableHeader}>
                <span>Product</span>
                <span>Category</span>
                <span>Price</span>
                <span>Actions</span>
              </div>
              {products.map(p => (
                <div key={p.id} className={styles.tableRow} id={`admin-row-${p.id}`}>
                  <div className={styles.productInfo}>
                    <img
                      src={p.colorVariants?.[0]?.images?.[0] || p.images?.[0] || p.image || '/placeholder.png'}
                      alt={p.name}
                      className={styles.tableImg}
                      onError={e => { e.target.src = '' }}
                    />
                    <div>
                      <span className={styles.productName}>{p.name}</span>
                      {p.colorVariants?.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {p.colorVariants.map((v, i) => (
                            <span key={i} title={v.name} style={{
                              display: 'inline-block', width: '14px', height: '14px',
                              borderRadius: '50%', background: v.hex,
                              border: '1px solid rgba(0,0,0,0.2)'
                            }} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={styles.productCat}>{p.category}</span>
                  <span className={styles.productPrice}>{p.price}</span>
                  <div className={styles.rowActions}>
                    <button
                      onClick={() => startEdit(p)}
                      className={styles.editBtn}
                      id={`edit-btn-${p.id}`}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className={styles.deleteBtn}
                      id={`delete-btn-${p.id}`}
                      disabled={deleting === p.id}
                    >
                      {deleting === p.id ? '…' : '🗑 Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
