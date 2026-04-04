// ============================================================
// src/firebase/auth.js
// Firebase Authentication helpers for the admin panel login.
// ============================================================

import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from './config'

/**
 * Sign in an admin user with email + password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export async function adminLogin(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}

/**
 * Sign out the currently logged-in admin.
 */
export async function adminLogout() {
  return signOut(auth)
}

/**
 * Listen to auth state changes.
 * @param {Function} callback - Called with the user object (or null if signed out)
 * @returns {Function} unsubscribe - Call this in useEffect cleanup
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback)
}
