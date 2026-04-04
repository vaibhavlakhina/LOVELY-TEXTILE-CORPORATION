// ============================================================
// scripts/seedFirestore.js
// One-time script: imports all products from products.js
// into your Firestore "products" collection.
//
// HOW TO RUN (after you've filled in your Firebase config):
//   node scripts/seedFirestore.js
//
// ⚠️  Only run this ONCE. Running it again will create duplicates.
// ============================================================

import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'

// 🔴 PASTE YOUR FIREBASE CONFIG HERE (same as in src/firebase/config.js)
const firebaseConfig = {
  apiKey:            "REPLACE_WITH_YOUR_API_KEY",
  authDomain:        "REPLACE_WITH_YOUR_PROJECT_ID.firebaseapp.com",
  projectId:         "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket:     "REPLACE_WITH_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "REPLACE_WITH_YOUR_MESSAGING_SENDER_ID",
  appId:             "REPLACE_WITH_YOUR_APP_ID",
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

// ─── Your existing products ───────────────────────────────
const PRODUCTS = [
  {
    name: 'Royal Cotton Bedsheet',
    category: 'bedsheets',
    price: '₹1,299',
    wholesalePrice: '₹899',
    image: '/product_bedsheet_1774271113786.png',
    badge: 'New',
    rating: 4.8,
    reviews: 124,
    sizes: ['Single', 'Double', 'King', 'Queen'],
    colors: ['#0B1F3A', '#C5A880', '#FFFFFF', '#8B4513'],
    description: 'Experience unparalleled comfort with our 300 TC premium Egyptian cotton bedsheets.',
    features: ['300 Thread Count Egyptian Cotton', 'Fade & Shrink Resistant', 'Hypoallergenic', 'Machine Washable', 'Deep pocket design'],
    material: '100% Egyptian Cotton',
    dimensions: 'Available in all standard sizes',
    care: 'Machine wash cold, tumble dry low',
  },
  {
    name: 'Luxury Bedsheet Set',
    category: 'sets',
    price: '₹2,499',
    wholesalePrice: '₹1,699',
    image: '/product_bedsheet_set_1774271215760.png',
    badge: 'Bestseller',
    rating: 4.9,
    reviews: 248,
    sizes: ['Double', 'King', 'Queen'],
    colors: ['#F5F3EF', '#C5A880', '#6B8CAE', '#4A6741'],
    description: 'Complete your bedroom with our signature 6-piece bedsheet set.',
    features: ['6-Piece Complete Set', '400 TC Microfiber', 'Wrinkle-Free Technology', 'Color coordinated pieces', 'Gift-ready packaging'],
    material: '100% Microfiber',
    dimensions: 'All sizes available',
    care: 'Machine wash warm, do not bleach',
  },
  {
    name: 'Premium AC Comforter',
    category: 'comforters',
    price: '₹3,499',
    wholesalePrice: '₹2,299',
    image: '/product_comforter_1774271132221.png',
    badge: 'New',
    rating: 4.7,
    reviews: 89,
    sizes: ['Single', 'Double', 'King'],
    colors: ['#F5F3EF', '#C5A880', '#0B1F3A'],
    description: 'Stay perfectly comfortable all night with our premium AC comforter.',
    features: ['Hollow Fiber Fill Technology', 'AC-optimized warmth', 'Anti-dust mite', 'Lightweight & breathable', '3-year quality guarantee'],
    material: 'Polyester Shell, Hollow Fiber Fill',
    dimensions: 'Single: 60"x90", Double: 90"x100", King: 108"x100"',
    care: 'Dry clean recommended',
  },
  {
    name: 'Embroidered Pillow Covers',
    category: 'pillows',
    price: '₹549',
    wholesalePrice: '₹349',
    image: '/product_pillow_1774271153046.png',
    badge: 'Sale',
    rating: 4.6,
    reviews: 167,
    sizes: ['Standard', 'King'],
    colors: ['#FFFFFF', '#C5A880', '#0B1F3A', '#F5DEB3'],
    description: 'Add a touch of elegance to your bedroom with our hand-embroidered pillow covers.',
    features: ['Hand-embroidered gold thread', 'Pure cotton shell', 'Zipper closure', 'Set of 2 included', 'Machine washable'],
    material: '100% Cotton with Embroidery',
    dimensions: 'Standard: 18"x28", King: 20"x36"',
    care: 'Hand wash cold, line dry',
  },
  {
    name: 'Premium Fabric Rolls',
    category: 'fabrics',
    price: '₹180/m',
    wholesalePrice: '₹120/m',
    image: '/product_fabric_1774271174747.png',
    badge: 'Wholesale',
    rating: 4.8,
    reviews: 312,
    sizes: ['Per Meter', '5m Roll', '10m Roll', '20m Roll'],
    colors: ['#0B1F3A', '#C5A880', '#F5F3EF', '#8B4513', '#4A6741'],
    description: 'High-quality fabric rolls for retailers and manufacturers.',
    features: ['Multiple variants available', 'Bulk discounts available', 'Custom dyeing on order', 'Consistent quality batches', 'Fast bulk shipment'],
    material: 'Cotton / Polyester / Blend variants',
    dimensions: 'Width: 44 inches standard',
    care: 'As per fabric type',
  },
  {
    name: 'Satin Finish Bedsheet',
    category: 'bedsheets',
    price: '₹1,699',
    wholesalePrice: '₹1,150',
    image: '/product_bedsheet_1774271113786.png',
    badge: null,
    rating: 4.7,
    reviews: 93,
    sizes: ['Double', 'King', 'Queen'],
    colors: ['#C5A880', '#0B1F3A', '#8B0000', '#2F4F4F'],
    description: 'Experience hotel-like luxury with our satin finish bedsheets.',
    features: ['Satin weave 600 TC', 'Hotel-grade quality', 'Anti-wrinkle finish', 'Lustrous sheen', 'Durable stitching'],
    material: '100% Polyester Satin',
    dimensions: 'All standard sizes',
    care: 'Machine wash cold, gentle cycle',
  },
  {
    name: 'Kids Cartoon Bedsheet Set',
    category: 'sets',
    price: '₹1,199',
    wholesalePrice: '₹799',
    image: '/product_bedsheet_set_1774271215760.png',
    badge: 'New',
    rating: 4.9,
    reviews: 211,
    sizes: ['Single'],
    colors: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'],
    description: 'Make bedtime fun for your little ones with our vibrant cartoon bedsheet sets.',
    features: ['Colorfast printing', 'Hypoallergenic material', 'Skin-safe dyes', 'Complete set included', 'Easy care fabric'],
    material: 'Soft Microfiber',
    dimensions: 'Single: 60"x90"',
    care: 'Machine wash warm',
  },
  {
    name: 'Winter Quilt Comforter',
    category: 'comforters',
    price: '₹2,999',
    wholesalePrice: '₹1,999',
    image: '/product_comforter_1774271132221.png',
    badge: null,
    rating: 4.6,
    reviews: 78,
    sizes: ['Single', 'Double', 'King'],
    colors: ['#F5F3EF', '#C5A880'],
    description: 'Stay cozy on cold winter nights with our premium quilted comforter.',
    features: ['High-loft hollow fiber', 'Double-layered warmth', 'Box-stitch quilting', 'Prevents fill shift', 'Washable at home'],
    material: 'Cotton outer, Hollow fiber fill',
    dimensions: 'Multiple sizes',
    care: 'Machine wash cold, tumble dry low',
  },
]

// ─── Seed Firestore ───────────────────────────────────────
async function seed() {
  console.log('🌱 Seeding Firestore with', PRODUCTS.length, 'products…')
  const col = collection(db, 'products')

  for (const product of PRODUCTS) {
    const doc = await addDoc(col, {
      ...product,
      createdAt: serverTimestamp(),
    })
    console.log('  ✅ Added:', product.name, '→', doc.id)
  }

  console.log('\n🎉 Done! All products seeded to Firestore.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err)
  process.exit(1)
})
