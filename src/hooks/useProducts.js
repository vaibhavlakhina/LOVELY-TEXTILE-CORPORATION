// ============================================================
// src/hooks/useProducts.js
// Custom React hook that subscribes to Firestore in real time.
// Any time you add/edit/delete a product in Firebase, every
// page using this hook will automatically update — no refresh!
// ============================================================

import { useState, useEffect } from 'react'
import { subscribeToProducts } from '../firebase/firestore'

/**
 * Returns { products, loading, error } from Firestore.
 * Automatically re-renders when Firestore data changes.
 */
export function useProducts() {
  const [products, setProducts] = useState([])   // array of product objects
  const [loading,  setLoading]  = useState(true)  // true while first load
  const [error,    setError]    = useState(null)  // error message string or null

  useEffect(() => {
    setLoading(true)

    // subscribeToProducts returns an unsubscribe function
    const unsubscribe = subscribeToProducts(
      (data) => {
        setProducts(data)
        setLoading(false)
        setError(null)
      }
    )

    // If Firestore throws (bad config, no internet, etc.)
    // onSnapshot errors are caught in the second arg
    return unsubscribe // cleanup: stop listening when component unmounts
  }, [])

  return { products, loading, error }
}
