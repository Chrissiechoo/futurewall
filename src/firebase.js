import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBpXU3wtojmMkuwn6NgXV5HBgrwCN5tkUQ",
  authDomain: "the-future-is-on-the-wall.firebaseapp.com",
  projectId: "the-future-is-on-the-wall",
  storageBucket: "the-future-is-on-the-wall.firebasestorage.app",
  messagingSenderId: "73665116092",
  appId: "1:73665116092:web:6edfdb6f70605e4cf39db9",
  measurementId: "G-KQSZ2BJ4ZL"
}

const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)
