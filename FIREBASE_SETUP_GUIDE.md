# Firebase Setup Guide for NSM Alumni Association

## 🔥 Firebase Configuration

### Step 1: Get Your Firebase Web App Config

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **nsmalumini**
3. Click the gear icon ⚙️ next to "Project Overview"
4. Select **"Project settings"**
5. Scroll down to **"Your apps"** section
6. If you haven't created a web app yet, click **"</>" (Add app)** and choose **Web**
7. Register your app with a nickname (e.g., "NSM Alumni Web App")
8. Copy the `firebaseConfig` object

### Step 2: Update Firebase Configuration

Open `src/config/firebase.ts` and replace the placeholder values with your actual Firebase config:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_ACTUAL_API_KEY",
  authDomain: "nsmalumini.firebaseapp.com",
  projectId: "nsmalumini",
  storageBucket: "nsmalumini.firebasestorage.app",
  messagingSenderId: "66377924171",
  appId: "YOUR_ACTUAL_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
};
```

### Step 3: Enable Authentication

1. In Firebase Console, go to **"Authentication"** in the left sidebar
2. Click **"Get started"** (if you haven't enabled it yet)
3. Go to the **"Sign-in method"** tab
4. Enable **"Email/Password"** authentication:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

### Step 4: Set Up Firestore Database

1. In Firebase Console, go to **"Firestore Database"** in the left sidebar
2. Click **"Create database"** (if you haven't created it yet)
3. Choose **"Start in test mode"** (for now - you can secure it later)
4. Select a location closest to your users
5. Click **"Enable"**

### Step 5: Set Up Firestore Security Rules (Important!)

1. Go to **"Firestore Database"** > **"Rules"** tab
2. Update the rules to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      // Users can update their own data
      allow update: if request.auth != null && request.auth.uid == userId;
      // Only authenticated users can create their own document
      allow create: if request.auth != null && request.auth.uid == userId;
      // Only admins can delete
      allow delete: if false; // Prevent deletions for now
    }
    
    // Admin-only collections
    match /{document=**} {
      allow read, write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'ADMIN';
    }
  }
}
```

## 📋 Adding Existing Users to Firestore

Since only existing members can register, you need to add their email addresses to Firestore first. Here's how:

### Option 1: Using Firebase Console (Manual)

1. Go to **Firestore Database** > **"Data"** tab
2. Click **"Start collection"**
3. Collection ID: `users`
4. Add documents with the following fields:

```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "batchYear": "2020",
  "phoneNumber": "+91 9876543210",
  "isExistingMember": true,
  "createdAt": "2024-01-01T00:00:00Z"
}
```

**Note:** The `uid` field will be automatically added when the user registers.

### Option 2: Using Firebase Admin SDK (Bulk Import)

If you have many users, you can create a script to bulk import. Create a file `scripts/add-users.ts`:

```typescript
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as serviceAccount from './serviceAccountKey.json';

// Initialize Firebase Admin
initializeApp({
  credential: cert(serviceAccount as any)
});

const db = getFirestore();

// Your existing users data
const existingUsers = [
  {
    email: 'user1@example.com',
    fullName: 'User One',
    batchYear: '2020',
    phoneNumber: '+91 9876543210'
  },
  {
    email: 'user2@example.com',
    fullName: 'User Two',
    batchYear: '2019',
    phoneNumber: '+91 9876543211'
  }
  // Add more users...
];

async function addUsers() {
  for (const user of existingUsers) {
    await db.collection('users').add({
      email: user.email.toLowerCase(),
      fullName: user.fullName,
      batchYear: user.batchYear,
      phoneNumber: user.phoneNumber,
      isExistingMember: true,
      createdAt: new Date()
    });
    console.log(`Added user: ${user.email}`);
  }
  console.log('All users added successfully!');
}

addUsers().catch(console.error);
```

### Option 3: Import from CSV/Excel

1. Export your existing users list to CSV/Excel
2. Use a Firebase extension like "Import data from CSV" or write a custom script

## 🔐 User Registration Flow

1. **User exists in Firestore**: When someone tries to register, the system checks if their email exists in the `users` collection in Firestore.

2. **If email exists**: User can proceed with registration. They'll create a password, and their Firebase Auth account will be linked to the Firestore document.

3. **If email doesn't exist**: User will see an error message asking them to contact support (alumininsm@gmail.com) to be added to the system first.

4. **Login**: Users can log in with their email and password once registered.

## 📧 Support Email

Make sure to check `alumininsm@gmail.com` for requests from users who want to be added to the system.

## 🚀 Testing

1. Add a test user to Firestore manually
2. Try registering with that email
3. Try logging in with the credentials

## 🔒 Security Checklist

- [ ] Update Firebase config with actual API keys
- [ ] Enable Email/Password authentication
- [ ] Set up Firestore security rules
- [ ] Add existing users to Firestore
- [ ] Test registration and login flows
- [ ] Consider implementing rate limiting for authentication
- [ ] Set up email verification (optional but recommended)
- [ ] Consider password reset functionality

## 📝 Firestore Collection Structure

### Collection: `users`

Each document should have:
- `email` (string): User's email address (lowercase)
- `fullName` (string): User's full name
- `batchYear` (string): Graduation year
- `phoneNumber` (string, optional): Phone number
- `isExistingMember` (boolean): Always `true`
- `createdAt` (timestamp): When the record was created
- `uid` (string, added after registration): Firebase Auth user ID
- `registeredAt` (timestamp, added after registration): When user completed registration

## 🆘 Troubleshooting

**Error: "Firebase: Error (auth/api-key-not-valid)"**
- Make sure you've updated the Firebase config with the correct API key

**Error: "This email is not registered as an existing member"**
- The user's email needs to be added to Firestore `users` collection first

**Error: "Permission denied"**
- Check your Firestore security rules
- Make sure authentication is properly set up

---

**Project Details:**
- Project ID: nsmalumini
- Project Number: 66377924171
- Support Email: alumininsm@gmail.com
