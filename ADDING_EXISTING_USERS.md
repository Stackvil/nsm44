# Adding Existing Users to Firebase

This guide explains how to add existing NSM OSA members to Firebase Firestore so they can register and log in.

## Quick Steps

### Method 1: Using Firebase Console (Recommended for small number of users)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Select project: **nsmalumini**
   - Navigate to **Firestore Database** > **Data** tab

2. **Create/Open the `users` Collection**
   - If it doesn't exist, click **"Start collection"**
   - Collection ID: `users`
   - Click **"Next"**

3. **Add User Documents**
   - For each existing member, add a document with these fields:
     - `email` (string): User's email address (use lowercase)
     - `fullName` (string): User's full name
     - `batchYear` (string): Graduation year (e.g., "2020")
     - `phoneNumber` (string, optional): Phone number
     - `isExistingMember` (boolean): Set to `true`
     - `createdAt` (timestamp): Current date/time
   
   **Note:** Don't add `uid` yet - it will be automatically added when the user registers.

4. **Save the Document**
   - Use the email address as the document ID (without special characters) OR let Firebase auto-generate an ID
   - Click **"Save"**

5. **Repeat** for all existing members

### Method 2: Using a CSV File (For bulk imports)

If you have a CSV file with existing users:

1. Format your CSV like this:
   ```csv
   email,fullName,batchYear,phoneNumber
   john.doe@example.com,John Doe,2020,+91 9876543210
   jane.smith@example.com,Jane Smith,2019,+91 9876543211
   ```

2. Use a Firebase extension or script to import:
   - Install Firebase Extensions: "Import data from CSV"
   - OR use a script (see `FIREBASE_SETUP_GUIDE.md` for example)

### Method 3: Contact Support Email

If you're a user trying to register but don't see your email:

1. Send an email to: **alumininsm@gmail.com**
2. Include:
   - Your full name
   - Email address
   - Batch year
   - Phone number (optional)
3. Wait for admin to add you to the system
4. Then try registering again

## What Happens After Adding Users?

1. **User receives email** (if you send them a notification)
2. **User goes to registration page**: `/register`
3. **User enters their email**: System checks if email exists in Firestore
4. **If email exists**: User can proceed with registration
5. **User creates password**: Account is created in Firebase Authentication
6. **User is logged in**: Redirected to dashboard

## Example User Document Structure

```json
{
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "batchYear": "2020",
  "phoneNumber": "+91 9876543210",
  "isExistingMember": true,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

After the user registers, the document will also have:
```json
{
  "uid": "firebase-auth-user-id",
  "registeredAt": "2024-01-16T14:20:00Z"
}
```

## Important Notes

- ⚠️ **Email must be lowercase** when adding to Firestore (system converts it automatically)
- ✅ **User can register once** their email is in Firestore
- ✅ **User can log in** after successful registration
- 📧 **Contact support** if you need help: alumininsm@gmail.com

## Testing

After adding a test user:

1. Go to `/register`
2. Enter the email you just added
3. Fill in the registration form
4. Submit - should work!
5. Try logging in at `/login`

---

**Support:** alumininsm@gmail.com
