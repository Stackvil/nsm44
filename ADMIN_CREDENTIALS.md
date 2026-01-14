# NSM Alumni Admin Dashboard - Login Credentials

## 🔐 Admin Access Information

### Login URL
**Direct Access:** `admin-login.html`

You can access the admin login page by navigating to:
- `http://localhost:5173/admin-login.html` (during development with `npm run dev`)
- `https://yourdomain.com/admin-login.html` (in production)

---

## 👥 Admin Roles & Credentials

The system has **three types of admin roles** with different permissions:

### 1. **Super Admin** (Full Access)
- **Username:** `superadmin`
- **Password:** `SuperAdmin@2024!`
- **Role:** `super_admin`
- **Permissions:**
  - ✅ Full access to all features
  - ✅ Can manage all content directly (no approval needed)
  - ✅ Can add/remove Representative Admins
  - ✅ Can approve/reject Representative Admin submissions
  - ✅ Can view all user activity, registrations, and donations

### 2. **Admin** (Full Access)
- **Username:** `admin`
- **Password:** `Admin@2024!`
- **Role:** `admin`
- **Permissions:**
  - ✅ Full access to all features
  - ✅ Can manage all content directly (no approval needed)
  - ✅ Can add/remove Representative Admins
  - ✅ Can approve/reject Representative Admin submissions
  - ✅ Can view all user activity, registrations, and donations

### 3. **Representative Admin** (Limited Access - Requires Approval)
- **Username:** `repadmin1`
- **Password:** `RepAdmin@2024!`
- **Role:** `representative_admin`
- **Permissions:**
  - ✅ Can create/edit content (updates, photos, content forms)
  - ⚠️ **All submissions require approval** from Super Admin or Admin
  - ✅ Can view their own pending submissions
  - ❌ Cannot manage other admins
  - ❌ Cannot view sensitive data (full donation details, user activity logs)
  - ❌ Cannot approve/reject content

> **Note:** Super Admin and Admin can add more Representative Admins through the "User Management" section in the dashboard.

---

## 🚀 How to Login

### Step-by-Step Instructions:

1. **Open the Login Page**
   - Navigate to `admin-login.html` in your browser
   - Or run `npm run dev` and go to `http://localhost:5173/admin-login.html`

2. **Enter Credentials**
   - Enter your **Username** (e.g., `superadmin`)
   - Enter your **Password** (e.g., `SuperAdmin@2024!`)

3. **Click "Sign In"**
   - The system will authenticate your credentials
   - If valid, you'll be redirected to the admin dashboard
   - If invalid, an error message will appear

4. **Access Dashboard**
   - Once logged in, you'll see the dashboard based on your role
   - The UI will automatically show/hide features based on your permissions

---

## 📋 Dashboard Features by Role

### Super Admin & Admin Dashboard Includes:
- ✅ **Content Management** - Direct publish (no approval needed)
- ✅ **Homepage Photos** - Direct upload
- ✅ **Pending Approvals** - Review and approve/reject Representative Admin submissions
- ✅ **User Management** - Add/remove Representative Admins
- ✅ **User Activity** - View all user activities
- ✅ **Registrations** - View all member registrations
- ✅ **Donations** - View all donation records

### Representative Admin Dashboard Includes:
- ✅ **Content Management** - Submit for approval
- ✅ **Homepage Photos** - Submit for approval
- ✅ **My Pending Posts** - View status of submitted content
- ❌ **Pending Approvals** - Hidden (no access)
- ❌ **User Management** - Hidden (no access)
- ❌ **User Activity** - Limited access
- ❌ **Registrations** - Limited access
- ❌ **Donations** - Limited access

---

## 🔒 Security Features

1. **Session Management:**
   - Sessions last **8 hours**
   - Automatic logout after session expires
   - Session stored securely in localStorage

2. **Role-Based Access Control:**
   - UI dynamically shows/hides features based on role
   - Server-side validation (when backend is implemented)
   - Permission checks on all actions

3. **Approval Workflow:**
   - Representative Admins cannot publish directly
   - All submissions go through approval process
   - Notifications sent to Super Admin/Admin for review

---

## 📝 Important Notes

### For Development:
- All data is stored in **browser localStorage**
- Photos are stored as **base64 data URLs**
- Credentials are stored in plain text (for demo purposes only)

### For Production (Recommended):
- ⚠️ **CHANGE ALL PASSWORDS** before going live
- Implement backend API for authentication
- Use server-side session management
- Store data in a database (not localStorage)
- Implement password hashing (bcrypt, etc.)
- Use HTTPS encryption
- Add rate limiting for login attempts
- Implement proper file upload to server/cloud storage
- Consider using cloud storage (AWS S3, Cloudinary, etc.)

---

## 🛠️ Development Setup

To test the admin dashboard locally:

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev

# Then navigate to:
# http://localhost:5173/admin-login.html
```

---

## 🔄 Adding New Representative Admins

**Super Admin** or **Admin** can add new Representative Admins:

1. Login as Super Admin or Admin
2. Navigate to **"User Management"** tab
3. Fill in the form:
   - Full Name
   - Username
   - Email
   - Password
4. Click **"Add Representative Admin"**
5. The new admin can now login with their credentials

---

## 📞 Support

For issues or questions about the admin dashboard, contact the development team.

---

**⚠️ SECURITY WARNING:** 
- These credentials are for **development/testing purposes only**
- **CHANGE ALL PASSWORDS** before deploying to production
- Implement proper security measures (password hashing, HTTPS, etc.)
- Never commit real credentials to version control

---

## 🎯 Quick Reference

| Role | Username | Password | Full Access | Can Approve | Can Manage Admins |
|------|----------|----------|------------|-------------|-------------------|
| Super Admin | `superadmin` | `SuperAdmin@2024!` | ✅ | ✅ | ✅ |
| Admin | `admin` | `Admin@2024!` | ✅ | ✅ | ✅ |
| Representative Admin | `repadmin1` | `RepAdmin@2024!` | ❌ | ❌ | ❌ |

---

**Last Updated:** 2024
**Version:** 2.0 (Role-Based System)
