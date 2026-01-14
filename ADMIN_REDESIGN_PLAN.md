# Admin Dashboard Redesign Plan

## Overview
Complete redesign of the admin dashboard with three-tier permission system:
- **Super Admin** - Full access to all features
- **Admin** - Full access to all features (same as Super Admin)
- **Representative Admin** - Limited access, requires approval for posts

## Key Features

### 1. User Role System
- Three roles: `super_admin`, `admin`, `representative_admin`
- Role stored in localStorage: `admin_role`
- Permission checks based on role

### 2. Authentication & Login
- Updated login page to support multiple admin types
- Default credentials:
  - Super Admin: `superadmin` / `SuperAdmin@2024!`
  - Admin: `admin` / `Admin@2024!`
  - Representative Admin: Created by Super Admin/Admin

### 3. Permission System
- Super Admin & Admin: Can do everything
- Representative Admin: Can create posts but needs approval

### 4. Representative Admin Management
- Super Admin/Admin can:
  - Add new Representative Admins (name, email, username, password)
  - View list of Representative Admins
  - Remove Representative Admins
  - View Representative Admin activity

### 5. Approval Workflow
- When Representative Admin submits content:
  1. Content saved as "pending approval"
  2. Notification created for Super Admin/Admin
  3. Email notification simulated (stored in localStorage)
  4. Super Admin/Admin sees pending items
  5. Can approve or reject
  6. Approved content goes live

### 6. Notification System
- Email notifications simulated using localStorage
- Stored key: `nsm_admin_notifications`
- Contains: pending approvals, new Representative Admin requests, etc.
- Dashboard shows notification badge

### 7. Dashboard UI Changes
- Role badge in header showing current role
- Different menu items based on role
- "Pending Approvals" section for Super Admin/Admin
- "My Pending Posts" section for Representative Admin
- "User Management" section for Super Admin/Admin only

## Implementation Structure

### Files to Create/Modify:
1. `admin-login.html` - Updated with role support
2. `admin-dashboard.html` - Complete redesign with permission-based UI
3. `src/admin.ts` - Updated with role system, permissions, approval workflow
4. New sections in dashboard:
   - User Management (Super Admin/Admin only)
   - Pending Approvals (Super Admin/Admin only)
   - My Pending Posts (Representative Admin only)

### Data Storage Structure:
```javascript
// Admin Users
nsm_admin_users = [
  {
    id: string,
    username: string,
    email: string,
    role: 'super_admin' | 'admin' | 'representative_admin',
    createdAt: number,
    createdBy: string
  }
]

// Pending Approvals
nsm_pending_approvals = [
  {
    id: string,
    type: 'update' | 'event_photo' | 'gallery_photo' | 'content',
    data: object,
    submittedBy: string,
    submittedAt: number,
    status: 'pending' | 'approved' | 'rejected'
  }
]

// Notifications
nsm_admin_notifications = [
  {
    id: string,
    type: 'approval_request' | 'user_added',
    message: string,
    link: string,
    createdAt: number,
    read: boolean
  }
]
```

## Next Steps
1. Update login system with role support
2. Create permission checking functions
3. Redesign dashboard UI with role-based sections
4. Implement approval workflow
5. Add user management interface
6. Create notification system
7. Update all forms to check permissions and require approval when needed
