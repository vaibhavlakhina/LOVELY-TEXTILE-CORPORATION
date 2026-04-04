// ============================================================
// src/firebase/storage.js
// Firebase Storage helpers for product image uploads.
// ============================================================

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from './config'

/**
 * Upload a product image to Firebase Storage.
 * @param {File}     file        - The image File object from <input type="file">
 * @param {Function} onProgress  - Called with progress % (0-100) during upload
 * @returns {Promise<string>}    - Resolves to the public download URL
 */
export function uploadProductImage(file, onProgress = () => {}) {
  return new Promise((resolve, reject) => {
    // Store all product images under products/ folder
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Calculate and report upload progress
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
        onProgress(progress)
      },
      (error) => {
        console.error('Upload failed:', error)
        reject(error)
      },
      async () => {
        // Upload complete — get the download URL
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(url)
      }
    )
  })
}

/**
 * Delete a product image from Firebase Storage by its URL.
 * @param {string} imageUrl - The full Firebase Storage download URL
 */
export async function deleteProductImage(imageUrl) {
  try {
    const imageRef = ref(storage, imageUrl)
    await deleteObject(imageRef)
  } catch (err) {
    // Silently ignore if file doesn't exist
    console.warn('Could not delete image:', err.message)
  }
}
