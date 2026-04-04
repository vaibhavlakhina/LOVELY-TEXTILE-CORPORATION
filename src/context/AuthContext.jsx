// ============================================================
// src/context/AuthContext.jsx
// Provides the logged-in admin user to the whole app via Context.
// Wrap your app with <AuthProvider> in main.jsx or App.jsx.
// ============================================================

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange } from '../firebase/auth'

const AuthContext = createContext(null)

/** Wrap your app with this to make auth available everywhere */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)   // Firebase user object or null
  const [loading, setLoading] = useState(true)   // true until first auth check completes

  useEffect(() => {
    // Listen for login/logout events
    const unsubscribe = onAuthChange((firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe // clean up listener on unmount
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

/** Custom hook — use this anywhere you need the current admin user */
export function useAuth() {
  return useContext(AuthContext)
}
