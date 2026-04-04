// ============================================================
// src/firebase/config.js
// ⚠️  STEP 1: Replace the values below with YOUR Firebase project's config.
//
// How to get your config:
//   1. Go to https://console.firebase.google.com
//   2. Select your project → ⚙️ Project Settings → General
//   3. Under "Your apps", click </>  (Web app) → Register
//   4. Copy the firebaseConfig object and paste it below.
// ============================================================

import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// 🔴 REPLACE THESE VALUES WITH YOUR OWN FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyB1U1ixAWci1qYam5xPCgD0U2p2_GN8Epc",
  authDomain: "lovely-textile-corporation.firebaseapp.com",
  projectId: "lovely-textile-corporation",
  storageBucket: "lovely-textile-corporation.firebasestorage.app",
  messagingSenderId: "713736987818",
  appId: "1:713736987818:web:d67ea518178c77a7b81cd3",
  measurementId: "G-GLYZXRPEMB"
};

// Initialize Firebase services
const app       = initializeApp(firebaseConfig)
export const db      = getFirestore(app)   // Firestore database
export const auth    = getAuth(app)        // Firebase Authentication
export const storage = getStorage(app)     // Firebase Storage (images)

export default app
