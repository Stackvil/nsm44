// Admin Dashboard Functionality

// User Role Types
type AdminRole = 'super_admin' | 'admin' | 'representative_admin';

interface AdminUser {
  id: string;
  username: string;
  email: string;
  password: string;
  role: AdminRole;
  name: string;
  createdAt: number;
  createdBy: string;
}

interface PendingApproval {
  id: string;
  type: 'update' | 'event_photo' | 'gallery_photo' | 'chapter_photo' | 'reunion_photo' | 'content';
  data: any;
  submittedBy: string;
  submittedByName: string;
  submittedAt: number;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewedAt?: number;
  reviewNotes?: string;
}

interface AdminNotification {
  id: string;
  type: 'approval_request' | 'user_added' | 'content_approved' | 'content_rejected';
  message: string;
  link?: string;
  createdAt: number;
  read: boolean;
  targetRoles?: AdminRole[];
}

interface Update {
  id: string;
  title: string;
  content: string;
  date: string;
  createdAt: number;
}

interface PhotoItem {
  id: string;
  url: string;
  name: string;
  uploadedAt: number;
}

interface EventPhoto {
  id: string;
  eventName: string;
  eventDate: string;
  photos: PhotoItem[];
  createdAt: number;
}

interface GalleryPhoto {
  id: string;
  year: number;
  photos: PhotoItem[];
  createdAt: number;
}

interface ChapterPhoto {
  id: string;
  chapterType: string;
  year: number;
  photos: PhotoItem[];
  createdAt: number;
}

interface ReunionPhoto {
  id: string;
  year: number;
  photos: PhotoItem[];
  createdAt: number;
}

// ==================== PERMISSION SYSTEM ====================

// Get current user role
function getCurrentUserRole(): AdminRole | null {
  return (localStorage.getItem('admin_role') as AdminRole) || null;
}

// Get current user ID
function getCurrentUserId(): string | null {
  return localStorage.getItem('admin_user_id') || null;
}

// Get current user info
function getCurrentUser(): AdminUser | null {
  const userId = getCurrentUserId();
  if (!userId) return null;
  
  const users = JSON.parse(localStorage.getItem('nsm_admin_users') || '[]');
  return users.find((u: AdminUser) => u.id === userId) || null;
}

// Check if user has full permissions (Super Admin or Admin)
function hasFullPermissions(): boolean {
  const role = getCurrentUserRole();
  return role === 'super_admin' || role === 'admin';
}

// Check if user can manage other admins
function canManageAdmins(): boolean {
  return hasFullPermissions();
}

// Check if user needs approval for posts
function needsApproval(): boolean {
  const role = getCurrentUserRole();
  return role === 'representative_admin';
}

// Check authentication
function checkAuth(): boolean {
  const session = localStorage.getItem('admin_session');
  const loginTime = parseInt(localStorage.getItem('admin_login_time') || '0');
  const sessionDuration = 8 * 60 * 60 * 1000; // 8 hours

  if (!session || Date.now() - loginTime > sessionDuration) {
    window.location.href = 'admin-login.html';
    return false;
  }
  return true;
}

// ==================== APPROVAL WORKFLOW ====================

// Submit content for approval (for Representative Admins)
function submitForApproval(type: PendingApproval['type'], data: any): void {
  const currentUser = getCurrentUser();
  if (!currentUser) return;

  const approval: PendingApproval = {
    id: Date.now().toString(),
    type,
    data,
    submittedBy: currentUser.id,
    submittedByName: currentUser.name || currentUser.username,
    submittedAt: Date.now(),
    status: 'pending',
  };

  const pendingApprovals = JSON.parse(localStorage.getItem('nsm_pending_approvals') || '[]');
  pendingApprovals.push(approval);
  localStorage.setItem('nsm_pending_approvals', JSON.stringify(pendingApprovals));

  // Create notifications for Super Admin and Admin
  createNotification('approval_request', `New ${type} submission from ${currentUser.name || currentUser.username} requires approval`, `#page-approvals`, ['super_admin', 'admin']);

  showSuccess('Your submission has been sent for approval. You will be notified once it is reviewed.');
}

// Approve content
function approveContent(approvalId: string): void {
  const pendingApprovals = JSON.parse(localStorage.getItem('nsm_pending_approvals') || '[]');
  const approval = pendingApprovals.find((a: PendingApproval) => a.id === approvalId);
  if (!approval) return;

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  approval.status = 'approved';
  approval.reviewedBy = currentUser.id;
  approval.reviewedAt = Date.now();

  // Save the approved content
  saveApprovedContent(approval);

  // Remove from pending
  const filtered = pendingApprovals.filter((a: PendingApproval) => a.id !== approvalId);
  localStorage.setItem('nsm_pending_approvals', JSON.stringify(filtered));

  // Notify submitter
  createNotification('content_approved', `Your ${approval.type} submission has been approved`, undefined, undefined, approval.submittedBy);

  showSuccess('Content approved and published successfully!');
  loadPendingApprovals();
  updateNotificationBadge();
}

// Reject content
function rejectContent(approvalId: string, notes?: string): void {
  const pendingApprovals = JSON.parse(localStorage.getItem('nsm_pending_approvals') || '[]');
  const approval = pendingApprovals.find((a: PendingApproval) => a.id === approvalId);
  if (!approval) return;

  const currentUser = getCurrentUser();
  if (!currentUser) return;

  approval.status = 'rejected';
  approval.reviewedBy = currentUser.id;
  approval.reviewedAt = Date.now();
  approval.reviewNotes = notes || '';

  // Remove from pending
  const filtered = pendingApprovals.filter((a: PendingApproval) => a.id !== approvalId);
  localStorage.setItem('nsm_pending_approvals', JSON.stringify(filtered));

  // Notify submitter
  createNotification('content_rejected', `Your ${approval.type} submission has been rejected${notes ? ': ' + notes : ''}`, undefined, undefined, approval.submittedBy);

  showSuccess('Content rejected.');
  loadPendingApprovals();
  updateNotificationBadge();
}

// Save approved content to appropriate storage
function saveApprovedContent(approval: PendingApproval): void {
  switch (approval.type) {
    case 'update':
      const updates = JSON.parse(localStorage.getItem('nsm_updates') || '[]');
      updates.push(approval.data);
      localStorage.setItem('nsm_updates', JSON.stringify(updates));
      break;
    case 'event_photo':
      const eventPhotos = JSON.parse(localStorage.getItem('nsm_event_photos') || '[]');
      eventPhotos.push(approval.data);
      localStorage.setItem('nsm_event_photos', JSON.stringify(eventPhotos));
      break;
    case 'gallery_photo':
      const galleryPhotos = JSON.parse(localStorage.getItem('nsm_gallery_photos') || '[]');
      galleryPhotos.push(approval.data);
      localStorage.setItem('nsm_gallery_photos', JSON.stringify(galleryPhotos));
      break;
    case 'chapter_photo':
      const chapterPhotos = JSON.parse(localStorage.getItem('nsm_chapter_photos') || '[]');
      chapterPhotos.push(approval.data);
      localStorage.setItem('nsm_chapter_photos', JSON.stringify(chapterPhotos));
      break;
    case 'reunion_photo':
      const reunionPhotos = JSON.parse(localStorage.getItem('nsm_reunion_photos') || '[]');
      reunionPhotos.push(approval.data);
      localStorage.setItem('nsm_reunion_photos', JSON.stringify(reunionPhotos));
      break;
    case 'content':
      // Handle content updates
      if (approval.data.key && approval.data.value) {
        if (approval.data.key === 'nsm_hero_content') {
          // Parse JSON for hero content
          try {
            const heroData = JSON.parse(approval.data.value);
            if (heroData.title) localStorage.setItem('nsm_hero_title', heroData.title);
            if (heroData.quote) localStorage.setItem('nsm_hero_quote', heroData.quote);
          } catch (e) {
            localStorage.setItem(approval.data.key, approval.data.value);
          }
        } else {
          localStorage.setItem(approval.data.key, approval.data.value);
        }
      }
      break;
  }
  updateStatistics();
}

// ==================== NOTIFICATION SYSTEM ====================

// Create notification
function createNotification(type: AdminNotification['type'], message: string, link?: string, targetRoles?: AdminRole[], targetUserId?: string): void {
  const notification: AdminNotification = {
    id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
    type,
    message,
    link,
    createdAt: Date.now(),
    read: false,
    targetRoles,
  };

  const notifications = JSON.parse(localStorage.getItem('nsm_admin_notifications') || '[]');
  
  // If targetUserId is specified, only send to that user
  if (targetUserId) {
    notification.targetRoles = undefined;
    (notification as any).targetUserId = targetUserId;
  }
  
  notifications.push(notification);
  localStorage.setItem('nsm_admin_notifications', JSON.stringify(notifications));
  updateNotificationBadge();
}

// Get unread notifications count
function getUnreadNotificationsCount(): number {
  const notifications = JSON.parse(localStorage.getItem('nsm_admin_notifications') || '[]');
  const currentUser = getCurrentUser();
  if (!currentUser) return 0;

  return notifications.filter((n: AdminNotification) => {
    if (n.read) return false;
    if ((n as any).targetUserId) {
      return (n as any).targetUserId === currentUser.id;
    }
    if (n.targetRoles) {
      return n.targetRoles.includes(currentUser.role);
    }
    return true;
  }).length;
}

// Update notification badge
function updateNotificationBadge(): void {
  const badge = document.getElementById('notification-badge');
  const count = getUnreadNotificationsCount();
  if (badge) {
    badge.textContent = count.toString();
    badge.style.display = count > 0 ? 'flex' : 'none';
  }
}

// ==================== USER MANAGEMENT ====================

// Add Representative Admin
function addRepresentativeAdmin(username: string, email: string, password: string, name: string): void {
  if (!canManageAdmins()) {
    showSuccess('You do not have permission to manage admins.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('nsm_admin_users') || '[]');
  
  // Check if username already exists
  if (users.some((u: AdminUser) => u.username === username)) {
    showSuccess('Username already exists. Please choose a different username.');
    return;
  }

  const currentUser = getCurrentUser();
  const newUser: AdminUser = {
    id: Date.now().toString(),
    username,
    email,
    password, // In production, this should be hashed
    role: 'representative_admin',
    name,
    createdAt: Date.now(),
    createdBy: currentUser?.id || 'system',
  };

  users.push(newUser);
  localStorage.setItem('nsm_admin_users', JSON.stringify(users));

  // Notify new user (if they had a way to receive notifications)
  createNotification('user_added', `You have been added as a Representative Admin`, undefined, ['representative_admin']);

  showSuccess('Representative Admin added successfully!');
  loadRepresentativeAdmins();
}

// Remove Representative Admin
function removeRepresentativeAdmin(userId: string): void {
  if (!canManageAdmins()) return;

  const users = JSON.parse(localStorage.getItem('nsm_admin_users') || '[]');
  const filtered = users.filter((u: AdminUser) => u.id !== userId && (u.role === 'super_admin' || u.role === 'admin'));
  filtered.push(...users.filter((u: AdminUser) => u.id !== userId && u.role === 'representative_admin' && u.id !== userId));
  localStorage.setItem('nsm_admin_users', JSON.stringify(users.filter((u: AdminUser) => u.id !== userId)));

  showSuccess('Representative Admin removed successfully!');
  loadRepresentativeAdmins();
}

// Get all Representative Admins
function getRepresentativeAdmins(): AdminUser[] {
  const users = JSON.parse(localStorage.getItem('nsm_admin_users') || '[]');
  return users.filter((u: AdminUser) => u.role === 'representative_admin');
}

// ==================== DASHBOARD INITIALIZATION ====================

// Initialize admin dashboard
function initAdminDashboard(): void {
  if (!checkAuth()) return;

  const currentUser = getCurrentUser();
  if (!currentUser) {
    window.location.href = 'admin-login.html';
    return;
  }

  // Set username and role
  const usernameEl = document.getElementById('admin-username');
  const roleEl = document.getElementById('admin-role');
  
  if (usernameEl) {
    usernameEl.textContent = currentUser.name || currentUser.username;
  }
  
  if (roleEl) {
    const roleLabels: Record<AdminRole, string> = {
      super_admin: 'Super Admin',
      admin: 'Admin',
      representative_admin: 'Representative Admin',
    };
    roleEl.textContent = roleLabels[currentUser.role];
  }

  // Update notification badge
  updateNotificationBadge();

  // Show/hide sections based on role
  updateUIForRole();

  // Logout functionality
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('admin_session');
      localStorage.removeItem('admin_username');
      localStorage.removeItem('admin_user_id');
      localStorage.removeItem('admin_role');
      localStorage.removeItem('admin_login_time');
      window.location.href = 'admin-login.html';
    });
  }

  // Initialize navigation
  initNavigation();

  // Initialize tabs
  initTabs();

  // Initialize year selectors
  initYearSelectors();

  // Initialize forms
  initUpdateForm();
  initEventPhotoForm();
  initGalleryPhotoForm();
  initChapterPhotoForm();
  initReunionPhotoForm();
  initContentForms();
  initHomepagePhotoForms();

  // Initialize user management (for Super Admin/Admin)
  if (canManageAdmins()) {
    initUserManagement();
    initApprovalManagement();
  }

  // Load data
  loadUpdates();
  loadUserActivity();
  loadRegistrations();
  loadDonations();
  
  // Load pending approvals (for Super Admin/Admin)
  if (hasFullPermissions()) {
    loadPendingApprovals();
  }
  
  // Load my pending posts (for Representative Admin)
  if (needsApproval()) {
    loadMyPendingPosts();
  }
  
  // Update statistics
  updateStatistics();
}

// Load my pending posts (for Representative Admin)
function loadMyPendingPosts(): void {
  const container = document.getElementById('my-pending-posts-list');
  if (!container) return;
  
  const currentUser = getCurrentUser();
  if (!currentUser) return;
  
  const pendingApprovals = JSON.parse(localStorage.getItem('nsm_pending_approvals') || '[]');
  const myPending = pendingApprovals.filter((a: PendingApproval) => 
    a.submittedBy === currentUser.id && a.status === 'pending'
  );
  
  if (myPending.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No pending posts. Your submissions will appear here.</p>';
    return;
  }
  
  const typeLabels: Record<PendingApproval['type'], string> = {
    update: 'Update',
    event_photo: 'Event Photo',
    gallery_photo: 'Gallery Photo',
    chapter_photo: 'Chapter Photo',
    reunion_photo: 'Reunion Photo',
    content: 'Content Update',
  };
  
  container.innerHTML = myPending
    .sort((a: PendingApproval, b: PendingApproval) => b.submittedAt - a.submittedAt)
    .map((approval: PendingApproval) => `
      <div class="pending-post-item">
        <div class="pending-post-header">
          <span class="pending-post-type">${typeLabels[approval.type]}</span>
          <span class="pending-post-status">
            <i class="fas fa-clock"></i> Pending Review
          </span>
        </div>
        <div class="pending-post-content">
          ${approval.type === 'update' ? `
            <h4>${approval.data.title}</h4>
            <p>${approval.data.content.substring(0, 150)}${approval.data.content.length > 150 ? '...' : ''}</p>
          ` : approval.type.includes('photo') ? `
            <p><strong>${approval.type === 'event_photo' ? `Event: ${approval.data.eventName}` : approval.type === 'gallery_photo' ? `Year: ${approval.data.year}` : approval.type === 'chapter_photo' ? `Chapter: ${approval.data.chapterType} - Year: ${approval.data.year}` : `Year: ${approval.data.year}`}</strong></p>
            <p>Photos: ${approval.data.photos?.length || 0}</p>
          ` : '<p>Content update</p>'}
          <p style="margin-top: 8px; font-size: 12px; color: var(--gray-500);">
            Submitted: ${new Date(approval.submittedAt).toLocaleString()}
          </p>
        </div>
      </div>
    `).join('');
}

// Update UI based on user role
function updateUIForRole(): void {
  const hasFull = hasFullPermissions();
  const needsApprovalCheck = needsApproval();
  
  // Hide/show navigation items
  const userManagementNav = document.querySelector('[data-page="user-management"]');
  const approvalsNav = document.querySelector('[data-page="approvals"]');
  const myPendingNav = document.querySelector('[data-page="my-pending"]');
  
  if (userManagementNav) {
    (userManagementNav as HTMLElement).style.display = hasFull ? 'flex' : 'none';
  }
  if (approvalsNav) {
    (approvalsNav as HTMLElement).style.display = hasFull ? 'flex' : 'none';
  }
  if (myPendingNav) {
    (myPendingNav as HTMLElement).style.display = needsApprovalCheck ? 'flex' : 'none';
  }
  
  // Update form labels to show approval status
  if (needsApprovalCheck) {
    const submitButtons = document.querySelectorAll('.btn-primary[type="submit"]');
    submitButtons.forEach((btn) => {
      const btnText = (btn as HTMLElement).textContent || '';
      if (!btnText.includes('Submit for Approval') && !btnText.includes('Upload')) {
        (btn as HTMLElement).textContent = btnText.replace('Add', 'Submit for Approval').replace('Upload', 'Submit for Approval');
      }
    });
  }
  
  // Update approvals count badge
  if (hasFull) {
    const pendingApprovals = JSON.parse(localStorage.getItem('nsm_pending_approvals') || '[]');
    const pendingCount = pendingApprovals.filter((a: PendingApproval) => a.status === 'pending').length;
    const badge = document.getElementById('approvals-count-badge');
    if (badge) {
      badge.textContent = pendingCount.toString();
      badge.style.display = pendingCount > 0 ? 'inline-flex' : 'none';
    }
  }
  
  // Add notification click handler
  const notificationWrapper = document.getElementById('notification-wrapper');
  if (notificationWrapper) {
    notificationWrapper.addEventListener('click', () => {
      if (hasFull) {
        const approvalsNavBtn = document.querySelector('[data-page="approvals"]') as HTMLElement;
        if (approvalsNavBtn) {
          approvalsNavBtn.click();
        }
      } else if (needsApprovalCheck) {
        const myPendingNavBtn = document.querySelector('[data-page="my-pending"]') as HTMLElement;
        if (myPendingNavBtn) {
          myPendingNavBtn.click();
        }
      }
    });
  }
}

// Load pending approvals (for Super Admin/Admin)
function loadPendingApprovals(): void {
  const container = document.getElementById('pending-approvals-list');
  if (!container) return;
  
  const pendingApprovals = JSON.parse(localStorage.getItem('nsm_pending_approvals') || '[]');
  const pending = pendingApprovals.filter((a: PendingApproval) => a.status === 'pending');
  
  if (pending.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No pending approvals</p>';
    return;
  }
  
  container.innerHTML = pending
    .sort((a: PendingApproval, b: PendingApproval) => b.submittedAt - a.submittedAt)
    .map((approval: PendingApproval) => {
      const typeLabels: Record<PendingApproval['type'], string> = {
        update: 'Update',
        event_photo: 'Event Photo',
        gallery_photo: 'Gallery Photo',
        chapter_photo: 'Chapter Photo',
        reunion_photo: 'Reunion Photo',
        content: 'Content Update',
      };
      
      return `
        <div class="approval-item">
          <div class="approval-header">
            <div class="approval-type">${typeLabels[approval.type]}</div>
            <div class="approval-meta">
              <span>Submitted by: ${approval.submittedByName}</span>
              <span>${new Date(approval.submittedAt).toLocaleString()}</span>
            </div>
          </div>
          <div class="approval-content">
            ${approval.type === 'update' ? `
              <h4>${approval.data.title}</h4>
              <p>${approval.data.content.substring(0, 200)}${approval.data.content.length > 200 ? '...' : ''}</p>
            ` : approval.type.includes('photo') ? `
              <p>${approval.type === 'event_photo' ? `Event: ${approval.data.eventName}` : ''}</p>
              <p>Photos: ${approval.data.photos?.length || 0}</p>
            ` : '<p>Content update</p>'}
          </div>
          <div class="approval-actions">
            <button class="btn btn-success" onclick="approveContent('${approval.id}')">
              <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn btn-danger" onclick="rejectContentPrompt('${approval.id}')">
              <i class="fas fa-times"></i> Reject
            </button>
          </div>
        </div>
      `;
    }).join('');
}

// Load Representative Admins
function loadRepresentativeAdmins(): void {
  const container = document.getElementById('representative-admins-list');
  if (!container) return;
  
  const admins = getRepresentativeAdmins();
  
  if (admins.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No Representative Admins yet</p>';
    return;
  }
  
  container.innerHTML = admins
    .sort((a, b) => b.createdAt - a.createdAt)
    .map((admin) => `
      <div class="admin-item">
        <div class="admin-info">
          <div class="admin-name">${admin.name}</div>
          <div class="admin-details">
            <span>${admin.username}</span>
            <span>${admin.email}</span>
            <span>Added: ${new Date(admin.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <button class="btn btn-danger" onclick="removeRepresentativeAdminPrompt('${admin.id}')">
          <i class="fas fa-trash"></i> Remove
        </button>
      </div>
    `).join('');
}

// Initialize user management
function initUserManagement(): void {
  const form = document.getElementById('add-representative-admin-form') as HTMLFormElement;
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = (document.getElementById('rep-admin-username') as HTMLInputElement).value.trim();
    const email = (document.getElementById('rep-admin-email') as HTMLInputElement).value.trim();
    const password = (document.getElementById('rep-admin-password') as HTMLInputElement).value;
    const name = (document.getElementById('rep-admin-name') as HTMLInputElement).value.trim();
    
    if (!username || !email || !password || !name) {
      showSuccess('Please fill in all fields');
      return;
    }
    
    addRepresentativeAdmin(username, email, password, name);
    form.reset();
  });
  
  loadRepresentativeAdmins();
}

// Initialize approval management
function initApprovalManagement(): void {
  // Approval functions are already defined above
  loadPendingApprovals();
}

// Helper functions for global access
(window as any).approveContent = approveContent;
(window as any).rejectContentPrompt = (id: string) => {
  const notes = prompt('Rejection reason (optional):');
  rejectContent(id, notes || undefined);
};
(window as any).removeRepresentativeAdminPrompt = (id: string) => {
  if (confirm('Are you sure you want to remove this Representative Admin?')) {
    removeRepresentativeAdmin(id);
  }
};

// Navigation between pages
function initNavigation(): void {
  const navBtns = document.querySelectorAll('.nav-tab-btn');
  const pageSections = document.querySelectorAll('.admin-page-section');

  navBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const page = btn.getAttribute('data-page');
      if (!page) return;

      // Remove active from all buttons and sections
      navBtns.forEach((b) => b.classList.remove('active'));
      pageSections.forEach((s) => s.classList.remove('active'));

      // Add active to clicked button
      btn.classList.add('active');

      // Show corresponding page
      const targetPage = document.getElementById(`page-${page}`);
      if (targetPage) {
        targetPage.classList.add('active');
      }
    });
  });
}

// Update statistics
function updateStatistics(): void {
  const updates = getUpdates();
  const eventPhotos = getEventPhotos();
  const galleryPhotos = getGalleryPhotos();
  const reunionPhotos = getReunionPhotos();
  const users = JSON.parse(localStorage.getItem('nsm_users') || '[]');
  const donations = JSON.parse(localStorage.getItem('nsm_donations') || '[]');
  
  const updatesCount = document.getElementById('updates-count');
  const eventsCount = document.getElementById('events-count');
  const galleryCount = document.getElementById('gallery-count');
  const reunionCount = document.getElementById('reunion-count');
  const usersCount = document.getElementById('users-count');
  const donationsCount = document.getElementById('donations-count');
  
  if (updatesCount) updatesCount.textContent = updates.length.toString();
  if (eventsCount) eventsCount.textContent = eventPhotos.length.toString();
  if (galleryCount) {
    const totalGalleryPhotos = galleryPhotos.reduce((sum, gallery) => sum + gallery.photos.length, 0);
    galleryCount.textContent = totalGalleryPhotos.toString();
  }
  if (reunionCount) {
    const totalReunionPhotos = reunionPhotos.reduce((sum, reunion) => sum + reunion.photos.length, 0);
    reunionCount.textContent = totalReunionPhotos.toString();
  }
  if (usersCount) usersCount.textContent = users.length.toString();
  if (donationsCount) donationsCount.textContent = donations.length.toString();
}

// Tab functionality
function initTabs(): void {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      if (!tabName) return;

      // Remove active from all tabs and contents
      document.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((c) => c.classList.remove('active'));

      // Add active to clicked tab and corresponding content
      btn.classList.add('active');
      const content = document.getElementById(tabName);
      if (content) {
        content.classList.add('active');
      }

      // Load data if needed
      if (tabName === 'manage-updates') {
        loadUpdates();
      }
    });
  });
}

// Initialize year selectors
function initYearSelectors(): void {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let year = currentYear; year >= 1993; year--) {
    years.push(year);
  }

  const yearSelects = ['gallery-year', 'chapter-year', 'reunion-year'];
  yearSelects.forEach((selectId) => {
    const select = document.getElementById(selectId) as HTMLSelectElement;
    if (select) {
      years.forEach((year) => {
        const option = document.createElement('option');
        option.value = year.toString();
        option.textContent = year.toString();
        select.appendChild(option);
      });
    }
  });
}

// Photo upload functionality
function initPhotoUpload(
  uploadAreaId: string,
  fileInputId: string,
  previewId: string,
  countId?: string
): void {
  const uploadArea = document.getElementById(uploadAreaId);
  const fileInput = document.getElementById(fileInputId) as HTMLInputElement;
  const preview = document.getElementById(previewId);
  const countDisplay = countId ? document.getElementById(countId) : null;

  if (!uploadArea || !fileInput || !preview) return;

  // Update photo count
  function updatePhotoCount(): void {
    if (countDisplay && preview) {
      const count = preview.querySelectorAll('.photo-preview-item').length;
      if (count > 0) {
        countDisplay.style.display = 'block';
        countDisplay.textContent = `${count} photo${count !== 1 ? 's' : ''} selected`;
      } else {
        countDisplay.style.display = 'none';
      }
    }
  }

  // Click to upload
  uploadArea.addEventListener('click', () => {
    fileInput.click();
  });

  // Drag and drop
  uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
  });

  uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
  });

  uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const files = e.dataTransfer?.files;
    if (files) {
      handleFiles(files, preview, fileInput);
      updatePhotoCount();
    }
  });

  // File input change
  fileInput.addEventListener('change', (e) => {
    const target = e.target as HTMLInputElement;
    if (target.files) {
      handleFiles(target.files, preview, fileInput);
      updatePhotoCount();
    }
  });

  // Make remove button update count
  if (preview) {
    preview.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('.remove-photo')) {
        setTimeout(updatePhotoCount, 0);
      }
    });
  }

  // Initial count update
  updatePhotoCount();
}

function handleFiles(
  files: FileList,
  preview: HTMLElement,
  _fileInput: HTMLInputElement
): void {
  const fileArray = Array.from(files).filter(file => file.type.startsWith('image/'));
  
  if (fileArray.length === 0) {
    alert('Please select image files only');
    return;
  }

  fileArray.forEach((file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      const photoItem = document.createElement('div');
      photoItem.className = 'photo-preview-item';
      photoItem.dataset.fileName = file.name;
      photoItem.innerHTML = `
        <img src="${url}" alt="${file.name}">
        <button type="button" class="remove-photo" onclick="this.parentElement.remove(); updatePhotoCountForPreview('${preview.id}')">
          <i class="fas fa-times"></i>
        </button>
      `;
      preview.appendChild(photoItem);
    };
    reader.readAsDataURL(file);
  });
}

// Global function to update photo count after removal
(window as any).updatePhotoCountForPreview = (previewId: string): void => {
  const preview = document.getElementById(previewId);
  if (!preview) return;
  
  // Find the count display element (it should be the next sibling or in the same parent)
  const parent = preview.parentElement;
  if (parent) {
    const countDisplay = parent.querySelector('.photo-count') as HTMLElement;
    if (countDisplay) {
      const count = preview.querySelectorAll('.photo-preview-item').length;
      if (count > 0) {
        countDisplay.style.display = 'block';
        countDisplay.textContent = `${count} photo${count !== 1 ? 's' : ''} selected`;
      } else {
        countDisplay.style.display = 'none';
      }
    }
  }
};

function getPreviewPhotos(previewId: string): string[] {
  const preview = document.getElementById(previewId);
  if (!preview) return [];

  const photos: string[] = [];
  preview.querySelectorAll('img').forEach((img) => {
    photos.push(img.src);
  });
  return photos;
}

// Update form
function initUpdateForm(): void {
  const form = document.getElementById('update-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = (document.getElementById('update-title') as HTMLInputElement).value;
    const content = (document.getElementById('update-content') as HTMLTextAreaElement).value;
    const date = (document.getElementById('update-date') as HTMLInputElement).value;

    const update: Update = {
      id: Date.now().toString(),
      title,
      content,
      date,
      createdAt: Date.now(),
    };

    // Check if approval is needed
    if (needsApproval()) {
      submitForApproval('update', update);
    } else {
      saveUpdate(update);
      showSuccess('Update added successfully!');
    }
    form.reset();
  });
}

function saveUpdate(update: Update): void {
  const updates = getUpdates();
  updates.push(update);
  localStorage.setItem('nsm_updates', JSON.stringify(updates));
  updateStatistics();
}

function getUpdates(): Update[] {
  const stored = localStorage.getItem('nsm_updates');
  return stored ? JSON.parse(stored) : [];
}

function loadUpdates(): void {
  const updates = getUpdates();
  const list = document.getElementById('updates-list');
  if (!list) return;

  list.innerHTML = '';

  if (updates.length === 0) {
    list.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No updates yet</p>';
    return;
  }

  updates
    .sort((a, b) => b.createdAt - a.createdAt)
    .forEach((update) => {
      const item = document.createElement('div');
      item.className = 'item-card';
      item.innerHTML = `
        <div class="item-card-info">
          <h3>${update.title}</h3>
          <p>${update.date} • ${new Date(update.createdAt).toLocaleDateString()}</p>
        </div>
        <div class="item-card-actions">
          <button class="btn btn-danger btn-small" onclick="deleteUpdate('${update.id}')">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      `;
      list.appendChild(item);
    });
}

// Make deleteUpdate available globally
(window as any).deleteUpdate = (id: string) => {
  if (confirm('Are you sure you want to delete this update?')) {
    const updates = getUpdates();
    const filtered = updates.filter((u) => u.id !== id);
    localStorage.setItem('nsm_updates', JSON.stringify(filtered));
    loadUpdates();
    updateStatistics();
    showSuccess('Update deleted successfully!');
  }
};

// Event photo form
function initEventPhotoForm(): void {
  initPhotoUpload('event-upload-area', 'event-photos', 'event-photo-preview', 'event-photo-count');

  const form = document.getElementById('event-photo-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const eventName = (document.getElementById('event-name') as HTMLInputElement).value;
    const eventDate = (document.getElementById('event-date') as HTMLInputElement).value;
    const photos = getPreviewPhotos('event-photo-preview');

    if (photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    const eventPhoto: EventPhoto = {
      id: Date.now().toString(),
      eventName,
      eventDate,
      photos: photos.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        name: `Event Photo ${index + 1}`,
        uploadedAt: Date.now(),
      })),
      createdAt: Date.now(),
    };

    // Check if approval is needed
    if (needsApproval()) {
      submitForApproval('event_photo', eventPhoto);
    } else {
      saveEventPhoto(eventPhoto);
      showSuccess('Event photos uploaded successfully!');
    }
    form.reset();
    document.getElementById('event-photo-preview')!.innerHTML = '';
  });
}

function saveEventPhoto(eventPhoto: EventPhoto): void {
  const events = getEventPhotos();
  events.push(eventPhoto);
  localStorage.setItem('nsm_event_photos', JSON.stringify(events));
  updateStatistics();
}

function getEventPhotos(): EventPhoto[] {
  const stored = localStorage.getItem('nsm_event_photos');
  return stored ? JSON.parse(stored) : [];
}

// Gallery photo form
function initGalleryPhotoForm(): void {
  initPhotoUpload('gallery-upload-area', 'gallery-photos', 'gallery-photo-preview', 'gallery-photo-count');

  const form = document.getElementById('gallery-photo-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const year = parseInt((document.getElementById('gallery-year') as HTMLSelectElement).value);
    const photos = getPreviewPhotos('gallery-photo-preview');

    if (photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    const galleryPhoto: GalleryPhoto = {
      id: Date.now().toString(),
      year,
      photos: photos.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        name: `Gallery Photo ${index + 1}`,
        uploadedAt: Date.now(),
      })),
      createdAt: Date.now(),
    };

    // Check if approval is needed
    if (needsApproval()) {
      submitForApproval('gallery_photo', galleryPhoto);
    } else {
      saveGalleryPhoto(galleryPhoto);
      showSuccess('Gallery photos uploaded successfully!');
    }
    form.reset();
    document.getElementById('gallery-photo-preview')!.innerHTML = '';
  });
}

function saveGalleryPhoto(galleryPhoto: GalleryPhoto): void {
  const galleries = getGalleryPhotos();
  galleries.push(galleryPhoto);
  localStorage.setItem('nsm_gallery_photos', JSON.stringify(galleries));
  updateStatistics();
}

function getGalleryPhotos(): GalleryPhoto[] {
  const stored = localStorage.getItem('nsm_gallery_photos');
  return stored ? JSON.parse(stored) : [];
}

// Chapter photo form
function initChapterPhotoForm(): void {
  initPhotoUpload('chapter-upload-area', 'chapter-photos', 'chapter-photo-preview', 'chapter-photo-count');

  const form = document.getElementById('chapter-photo-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const chapterType = (document.getElementById('chapter-type') as HTMLSelectElement).value;
    const year = parseInt((document.getElementById('chapter-year') as HTMLSelectElement).value);
    const photos = getPreviewPhotos('chapter-photo-preview');

    if (photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    const chapterPhoto: ChapterPhoto = {
      id: Date.now().toString(),
      chapterType,
      year,
      photos: photos.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        name: `Chapter Photo ${index + 1}`,
        uploadedAt: Date.now(),
      })),
      createdAt: Date.now(),
    };

    // Check if approval is needed
    if (needsApproval()) {
      submitForApproval('chapter_photo', chapterPhoto);
    } else {
      saveChapterPhoto(chapterPhoto);
      showSuccess('Chapter photos uploaded successfully!');
    }
    form.reset();
    document.getElementById('chapter-photo-preview')!.innerHTML = '';
  });
}

function saveChapterPhoto(chapterPhoto: ChapterPhoto): void {
  const chapters = getChapterPhotos();
  chapters.push(chapterPhoto);
  localStorage.setItem('nsm_chapter_photos', JSON.stringify(chapters));
}

function getChapterPhotos(): ChapterPhoto[] {
  const stored = localStorage.getItem('nsm_chapter_photos');
  return stored ? JSON.parse(stored) : [];
}

// Reunion photo form
function initReunionPhotoForm(): void {
  initPhotoUpload('reunion-upload-area', 'reunion-photos', 'reunion-photo-preview', 'reunion-photo-count');

  const form = document.getElementById('reunion-photo-form') as HTMLFormElement;
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const year = parseInt((document.getElementById('reunion-year') as HTMLSelectElement).value);
    const photos = getPreviewPhotos('reunion-photo-preview');

    if (photos.length === 0) {
      alert('Please upload at least one photo');
      return;
    }

    const reunionPhoto: ReunionPhoto = {
      id: Date.now().toString(),
      year,
      photos: photos.map((url, index) => ({
        id: `${Date.now()}-${index}`,
        url,
        name: `Reunion Photo ${index + 1}`,
        uploadedAt: Date.now(),
      })),
      createdAt: Date.now(),
    };

    // Check if approval is needed
    if (needsApproval()) {
      submitForApproval('reunion_photo', reunionPhoto);
    } else {
      saveReunionPhoto(reunionPhoto);
      showSuccess('Reunion photos uploaded successfully!');
    }
    form.reset();
    document.getElementById('reunion-photo-preview')!.innerHTML = '';
  });
}

function saveReunionPhoto(reunionPhoto: ReunionPhoto): void {
  const reunions = getReunionPhotos();
  reunions.push(reunionPhoto);
  localStorage.setItem('nsm_reunion_photos', JSON.stringify(reunions));
  updateStatistics();
}

function getReunionPhotos(): ReunionPhoto[] {
  const stored = localStorage.getItem('nsm_reunion_photos');
  return stored ? JSON.parse(stored) : [];
}

// Content forms
function initContentForms(): void {
  // Home content form
  const homeForm = document.getElementById('home-content-form') as HTMLFormElement;
  if (homeForm) {
    homeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const heroTitle = (document.getElementById('hero-title') as HTMLInputElement).value;
      const heroQuote = (document.getElementById('hero-quote') as HTMLInputElement).value;

      const contentData = {
        key: 'nsm_hero_content',
        value: JSON.stringify({ title: heroTitle, quote: heroQuote }),
      };

      // Check if approval is needed
      if (needsApproval()) {
        submitForApproval('content', contentData);
      } else {
        if (heroTitle) {
          localStorage.setItem('nsm_hero_title', heroTitle);
        }
        if (heroQuote) {
          localStorage.setItem('nsm_hero_quote', heroQuote);
        }
        showSuccess('Home page content updated successfully!');
      }
    });
  }

  // About content form
  const aboutForm = document.getElementById('about-content-form') as HTMLFormElement;
  if (aboutForm) {
    aboutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const section = (document.getElementById('about-section') as HTMLSelectElement).value;
      const content = (document.getElementById('about-content') as HTMLTextAreaElement).value;

      const contentData = {
        key: `nsm_about_${section}`,
        value: content,
      };

      // Check if approval is needed
      if (needsApproval()) {
        submitForApproval('content', contentData);
      } else {
        localStorage.setItem(`nsm_about_${section}`, content);
        showSuccess('About page content updated successfully!');
      }
    });
  }
}

// Homepage photo forms
function initHomepagePhotoForms(): void {
  // Middle box photos
  const middleBoxForm = document.getElementById('middle-box-photo-form') as HTMLFormElement;
  if (middleBoxForm) {
    initPhotoUpload('middle-box-upload-area', 'middle-box-photos', 'middle-box-photo-preview', 'middle-box-photo-count');
    
    middleBoxForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const photos = getPreviewPhotos('middle-box-photo-preview');
      if (photos.length === 0) {
        alert('Please upload at least one photo');
        return;
      }
      
      const photoItems: PhotoItem[] = photos.map((url, index) => ({
        id: Date.now().toString() + index,
        url,
        name: `Middle Box Photo ${index + 1}`,
        uploadedAt: Date.now()
      }));
      
      localStorage.setItem('nsm_homepage_middle_box_photos', JSON.stringify(photoItems));
      showSuccess('Homepage middle box photos updated successfully!');
      middleBoxForm.reset();
      document.getElementById('middle-box-photo-preview')!.innerHTML = '';
      document.getElementById('middle-box-photo-count')!.style.display = 'none';
    });
  }

  // Homepage gallery photos
  const homepageGalleryForm = document.getElementById('homepage-gallery-photo-form') as HTMLFormElement;
  if (homepageGalleryForm) {
    initPhotoUpload('homepage-gallery-upload-area', 'homepage-gallery-photos', 'homepage-gallery-photo-preview', 'homepage-gallery-photo-count');
    
    homepageGalleryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const photos = getPreviewPhotos('homepage-gallery-photo-preview');
      if (photos.length === 0) {
        alert('Please upload at least one photo');
        return;
      }
      
      const photoItems: PhotoItem[] = photos.map((url, index) => ({
        id: Date.now().toString() + index,
        url,
        name: `Homepage Gallery Photo ${index + 1}`,
        uploadedAt: Date.now()
      }));
      
      localStorage.setItem('nsm_homepage_gallery_photos', JSON.stringify(photoItems));
      showSuccess('Homepage gallery photos updated successfully!');
      homepageGalleryForm.reset();
      document.getElementById('homepage-gallery-photo-preview')!.innerHTML = '';
      document.getElementById('homepage-gallery-photo-count')!.style.display = 'none';
    });
  }
}

// Load user activity
function loadUserActivity(): void {
  const activityBody = document.getElementById('user-activity-body');
  if (!activityBody) return;
  
  const logins = JSON.parse(localStorage.getItem('nsm_user_logins') || '[]');
  
  if (logins.length === 0) {
    activityBody.innerHTML = `
      <tr>
        <td colspan="4" class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No login activity yet</h3>
          <p>User login records will appear here</p>
        </td>
      </tr>
    `;
    return;
  }
  
  activityBody.innerHTML = logins
    .sort((a: any, b: any) => b.timestamp - a.timestamp)
    .map((login: any) => `
      <tr>
        <td>${new Date(login.timestamp).toLocaleString('en-IN')}</td>
        <td>${login.email || login.contact || 'N/A'}</td>
        <td><span class="badge badge-info">${login.method || 'Email'}</span></td>
        <td><span class="badge badge-success">Success</span></td>
      </tr>
    `).join('');
}

// Load registrations
function loadRegistrations(): void {
  const registrationsBody = document.getElementById('registrations-body');
  if (!registrationsBody) return;
  
  const users = JSON.parse(localStorage.getItem('nsm_users') || '[]');
  
  if (users.length === 0) {
    registrationsBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-state">
          <i class="fas fa-inbox"></i>
          <h3>No registrations yet</h3>
          <p>Registration records will appear here</p>
        </td>
      </tr>
    `;
    return;
  }
  
  registrationsBody.innerHTML = users
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((user: any) => `
      <tr>
        <td>${user.firstName || ''} ${user.surname || ''}</td>
        <td>${user.email || 'N/A'}</td>
        <td>${user.telcode || ''}${user.mobile || ''}</td>
        <td>${user.course || 'N/A'}</td>
        <td>${user.from || ''} - ${user.to || ''}</td>
        <td><span class="badge badge-primary">${user.paymentMethod || 'N/A'}</span></td>
        <td>₹${user.donationAmount ? parseFloat(user.donationAmount).toLocaleString('en-IN') : '0'}</td>
        <td>${new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
      </tr>
    `).join('');
}

// Load donations
function loadDonations(): void {
  const donationsBody = document.getElementById('donations-body');
  const filterBtns = document.querySelectorAll('.filter-tab-btn');
  
  if (!donationsBody) return;
  
  function renderDonations(filter: string = 'all'): void {
    if (!donationsBody) return;
    
    let donations = JSON.parse(localStorage.getItem('nsm_donations') || '[]');
    
    if (filter === 'nsm') {
      donations = donations.filter((d: any) => d.category === 'nsm');
    } else if (filter === 'general') {
      donations = donations.filter((d: any) => d.category === 'general');
    }
    
    if (donations.length === 0) {
      donationsBody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <i class="fas fa-inbox"></i>
            <h3>No donations yet</h3>
            <p>Donation records will appear here</p>
          </td>
        </tr>
      `;
      return;
    }
    
    donationsBody.innerHTML = donations
      .sort((a: any, b: any) => b.timestamp - a.timestamp)
      .map((donation: any) => `
        <tr>
          <td>${new Date(donation.timestamp).toLocaleString('en-IN')}</td>
          <td>${donation.name || 'Anonymous'}</td>
          <td>${donation.email || 'N/A'}</td>
          <td><span class="badge ${donation.category === 'nsm' ? 'badge-primary' : 'badge-info'}">${donation.category === 'nsm' ? 'NSM Student/Alumni' : 'General Public'}</span></td>
          <td>₹${parseFloat(donation.amount).toLocaleString('en-IN')}</td>
          <td>${donation.method || 'N/A'}</td>
          <td>${donation.transactionId || 'N/A'}</td>
        </tr>
      `).join('');
  }
  
  // Filter buttons
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';
      renderDonations(filter);
    });
  });
  
  renderDonations('all');
}

// Success message
function showSuccess(message: string): void {
  const successMsg = document.getElementById('success-message');
  if (successMsg) {
    successMsg.textContent = message;
    successMsg.classList.add('show');
    setTimeout(() => {
      successMsg.classList.remove('show');
    }, 3000);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAdminDashboard);
} else {
  initAdminDashboard();
}

