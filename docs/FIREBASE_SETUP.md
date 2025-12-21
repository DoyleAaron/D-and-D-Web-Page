# Firebase Setup Guide for Dayner

This guide will help you set up Firebase for player authentication and journals.

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `dayner-dnd` (or your choice)
4. Disable Google Analytics (optional, not needed)
5. Click **"Create project"**

## Step 2: Enable Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Go to **Sign-in method** tab
4. Click **Email/Password**
5. Toggle **"Enable"** for Email/Password
6. Click **Save**

## Step 3: Create Firestore Database

1. Go to **Build → Firestore Database**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll secure it next)
4. Choose your region (closest to you)
5. Click **"Enable"**

## Step 4: Set Up Firestore Security Rules

1. In Firestore, go to **Rules** tab
2. Replace the rules with:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own journals
    match /journals/{journalId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    // Users can read their own profile
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

## Step 5: Get Firebase Config

1. Go to **Project Settings** (gear icon)
2. Scroll down to **"Your apps"**
3. Click **"Web"** icon (</> symbol)
4. Register app with nickname: `dayner-web`
5. Copy the `firebaseConfig` object

## Step 6: Update Your Config

1. Open `static/js/firebase-config.js`
2. Replace the placeholder values with your config:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // Your API key
  authDomain: "dayner-dnd.firebaseapp.com",
  projectId: "dayner-dnd",
  storageBucket: "dayner-dnd.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

## Step 7: Create Player Accounts

Since you're manually adding accounts:

1. Go to **Build → Authentication → Users**
2. Click **"Add user"**
3. Enter player's email and a password
4. Click **"Add user"**

To store player names:

1. Go to **Build → Firestore Database**
2. Click **"Start collection"**
3. Collection ID: `users`
4. Document ID: (copy the user's UID from Authentication)
5. Add fields:
   - `firstName` (string): Player's first name
   - `lastName` (string): Player's last name

## Step 8: Vercel Deployment

Firebase works with Vercel out of the box - no special configuration needed! Just deploy your updated code.

---

## Player Instructions

Share these instructions with your players:

1. Go to the website
2. Click the **user icon** in the header
3. Enter your email and password
4. Once logged in, click the **book icon** to open your journal
5. Click **"New Entry"** to create a journal entry
6. Your journal is private - only you can see it!

---

## Troubleshooting

**"Permission denied" error:**
- Make sure Firestore rules are published correctly
- Check that the user is logged in

**"Firebase not initialized" in console:**
- Verify your firebaseConfig values are correct
- Check that all Firebase SDK scripts are loading

**Login not working:**
- Verify Email/Password auth is enabled
- Check the email/password are correct
- Look at browser console for error details
