// ============================================================
// src/firebase/firestore.js
// All Firestore CRUD operations for the products collection.
// ============================================================

import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore'
import { db } from './config'

// The name of the Firestore collection that stores products
const PRODUCTS_COLLECTION = 'products'

// ─── Reference helper ─────────────────────────────────────
const productsRef = () => collection(db, PRODUCTS_COLLECTION)
const productDocRef = (id) => doc(db, PRODUCTS_COLLECTION, id)

// ─── READ: Get all products (one-time fetch) ──────────────
export async function getAllProducts() {
  const q = query(productsRef(), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
}

// ─── READ: Get a single product by Firestore doc ID ───────
export async function getProductById(id) {
  const snap = await getDoc(productDocRef(id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

// ─── REAL-TIME: Subscribe to products collection ──────────
// Calls `callback(products)` every time Firestore data changes.
// Returns an unsubscribe function — call it in useEffect cleanup.
export function subscribeToProducts(callback) {
  const q = query(productsRef(), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))
    callback(products)
  })
}

// ─── CREATE: Add a new product ────────────────────────────
export async function addProduct(productData) {
  const docRef = await addDoc(productsRef(), {
    ...productData,
    rating:    productData.rating    ?? 0,
    reviews:   productData.reviews   ?? 0,
    sizes:     productData.sizes     ?? [],
    colors:    productData.colors    ?? [],
    features:  productData.features  ?? [],
    createdAt: serverTimestamp(),
  })
  return docRef.id
}

// ─── UPDATE: Edit an existing product ─────────────────────
export async function updateProduct(id, updates) {
  await updateDoc(productDocRef(id), {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// ─── DELETE: Remove a product ─────────────────────────────
export async function deleteProduct(id) {
  await deleteDoc(productDocRef(id))
}
