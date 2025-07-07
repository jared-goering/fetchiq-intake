import { initializeApp, getApps, getApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

// Firebase configuration is read from environment variables so that secrets are not checked into the repo.
// Make sure you create an `.env.local` file in the project root with your Firebase values, e.g.
// NEXT_PUBLIC_FIREBASE_API_KEY=xxx
// NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxx
// NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxx
// NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxx
// NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxx
// NEXT_PUBLIC_FIREBASE_APP_ID=xxx

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Avoid re-initialising when hot-reloading in development.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app) 