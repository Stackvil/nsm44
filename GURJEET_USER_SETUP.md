# Gurjeet Singh Sahni - User Setup Instructions

## User Information

- **Name:** Gurjeet Singh Sahni
- **Batch:** 1998
- **Phone:** 9848529755
- **Email:** vjwgurjeet@gmail.com
- **Password:** 12345678
- **Access:** Regular User Login + Admin Dashboard

## ✅ Admin Dashboard Access (Already Configured)

The admin credentials have been automatically initialized in `src/api.ts`. The user can login to the admin dashboard using:

- **Username:** `gurjeet` OR `vjwgurjeet@gmail.com`
- **Password:** `12345678`
- **Admin Role:** ADMIN (Full Access)
- **Login URL:** `/admin/login` or `/admin-login.html`

This will work immediately after deployment as the credentials are hardcoded in the initialization.

## 🔥 Firebase/Regular User Login Setup

To enable regular user login (Firebase Authentication), you need to add this user to Firestore Database.

### Step 1: Add User to Firestore (For Regular Login)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select project: **nsmalumini**
3. Navigate to **Firestore Database** → **Data** tab
4. If the `users` collection doesn't exist, click **"Start collection"**
5. Collection ID: `users`
6. Add a document with the following data:

**Document ID:** (Auto-generate or use email without special chars)

**Fields:**
```json
{
  "email": "vjwgurjeet@gmail.com",
  "fullName": "Gurjeet Singh Sahni",
  "batchYear": "1998",
  "phoneNumber": "+91 9848529755",
  "isExistingMember": true,
  "createdAt": "2024-01-15T00:00:00Z"
}
```

**Note:** Don't add `uid` field yet - it will be automatically added when the user registers.

### Step 2: User Registration (One-Time)

1. User goes to `/register` page
2. User enters:
   - Email: `vjwgurjeet@gmail.com`
   - Full Name: `Gurjeet Singh Sahni`
   - Batch Year: `1998`
   - Phone: `9848529755` (optional)
   - Password: `12345678`
   - Confirm Password: `12345678`
3. User clicks "Register"
4. System will:
   - Check if email exists in Firestore ✅ (you added it in Step 1)
   - Create Firebase Authentication account
   - Link the Firebase Auth account to the Firestore document
   - User is logged in automatically

### Step 3: User Login (After Registration)

After registration, the user can login at `/login`:

- **Email:** `vjwgurjeet@gmail.com`
- **Password:** `12345678`

## 🔐 Login Options Summary

### Admin Dashboard Login
- **URL:** `/admin/login` or `/admin-login.html`
- **Username:** `gurjeet` OR `vjwgurjeet@gmail.com`
- **Password:** `12345678`
- **Works:** ✅ Immediately after deployment

### Regular User Login (Firebase)
- **URL:** `/login`
- **Email:** `vjwgurjeet@gmail.com`
- **Password:** `12345678`
- **Works:** ✅ After adding user to Firestore and user registers once

## 📝 Quick Setup Script

If you want to automate adding the user to Firestore, you can use this script in Firebase Console → Firestore → Data:

1. Click "Add document" in `users` collection
2. Click "Start document" (auto-generate ID)
3. Add these fields:
   - `email` (string): `vjwgurjeet@gmail.com`
   - `fullName` (string): `Gurjeet Singh Sahni`
   - `batchYear` (string): `1998`
   - `phoneNumber` (string): `+91 9848529755`
   - `isExistingMember` (boolean): `true`
   - `createdAt` (timestamp): Click calendar icon, select current date/time

## 🚀 After Deployment

Both login systems will work after deployment:

1. **Admin Login** - Works immediately (credentials in code)
2. **Regular Login** - Works after:
   - User is added to Firestore (one-time setup)
   - User registers once (one-time registration)
   - Then user can login anytime

## 🔄 Alternative: Create User Directly in Firebase Auth (Advanced)

If you want to skip the registration step, you can create the Firebase Auth user directly:

1. Go to Firebase Console → **Authentication** → **Users**
2. Click **"Add user"**
3. Email: `vjwgurjeet@gmail.com`
4. Password: `12345678`
5. Click **"Add user"**

Then you still need to:
- Add user document to Firestore with `uid` field from Firebase Auth
- Or the user can register (system will link the accounts)

## 📞 Support

If you need help setting up the user, contact: alumininsm@gmail.com

---

**Status:**
- ✅ Admin credentials: Configured in code (works after deployment)
- ⚠️ Firestore user: Needs to be added manually (see Step 1 above)
