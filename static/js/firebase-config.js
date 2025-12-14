/**
 * Firebase Configuration
 * Dayner D&D Lore Website
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create a new project (or use existing)
 * 3. Enable Authentication > Email/Password sign-in method
 * 4. Enable Firestore Database (start in test mode, then add rules below)
 * 5. Go to Project Settings > Your apps > Add web app
 * 6. Copy the firebaseConfig values and paste below
 * 
 * FIRESTORE RULES (paste in Firestore > Rules):
 * rules_version = '2';
 * service cloud.firestore {
 *   match /databases/{database}/documents {
 *     // Users can only read/write their own journals
 *     match /journals/{journalId} {
 *       allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
 *       allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
 *     }
 *     // Users can read their own profile
 *     match /users/{userId} {
 *       allow read: if request.auth != null && request.auth.uid == userId;
 *     }
 *   }
 * }
 */

// TODO: Replace with your Firebase project config
const firebaseConfig = {
  apiKey: "AIzaSyC_RiYRfz1C9eUOPKmfxZo5SjwIxs91R7k",
  authDomain: "dayner-dnd-lore.firebaseapp.com",
  projectId: "dayner-dnd-lore",
  storageBucket: "dayner-dnd-lore.firebasestorage.app",
  messagingSenderId: "178495593992",
  appId: "1:178495593992:web:1483a7ba1e574bd3193bbd"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Export for use in other modules
window.firebaseAuth = auth;
window.firebaseDb = db;
