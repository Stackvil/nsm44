# Single-Page to Multi-Page Migration Guide

## 🎯 Goal
Convert the current single-page application (SPA) with visibility toggles to a proper multi-page React application with routing.

## 📋 Current Issues
1. **Huge `index.html`** (570KB) contains ALL page content
2. **`main.ts`** (165KB) manages visibility toggling instead of routing  
3. React app exists but isn't being used for most content
4. Navigation uses `data-page` attributes instead of React Router

## ✅ Solution Overview

### Phase 1: Switch to React App Entry Point ✅
**File: `index_new.html`** - Clean HTML that only mounts React app

Replace current `index.html` with `index_new.html` which:
- Removes all inline content (570KB → 2KB)
- Only has `<div id="root">` mount point
- Loads `main.tsx` instead of `main.ts`
- Includes minimal loading state

### Phase 2: Update Navbar to Use React Router
**File: `src/components/Navbar.tsx`**

Change navigation from:
```typescript
<a href="#" data-page="home">Home</a>
```

To:
```typescript
<Link to="/">Home</Link>
```

### Phase 3: Fill in Missing Page Content

Each stub page needs actual content from index.html:

#### High Priority Pages (Extract from index.html):

1. **Events.tsx** - Events calendar and listings
2. **PhotoGallery.tsx** - Year-wise photo gallery (1993-2025)
3. **VideoGallery.tsx** - Video gallery with uploads
4. **Contact.tsx** - Contact form and information
5. **Member.tsx** -Membership registration
6. **Dashboard.tsx** - Admin dashboard

#### Medium Priority (Fill content):

7. **AlumniChapters.tsx** - Chapter information
8. **AlumniBenefits.tsx** - Benefits listing
9. **AlumniDirectory.tsx** (Connect) - Directory listing
10. **BusinessDirectory.tsx** - Business listings
11. **HowToGive.tsx** - Donation information
12. **ConnectWithUs.tsx** - Connection options
13. **AboutReunion.tsx** - Reunion information
14. **ReunionGallery.tsx** - Reunion photos

### Phase 4: Refactor main.ts

Keep only:
- Image slider initialization
- Modal handlers  
- Utility functions for IndexedDB
- Event management helpers

Remove:
- Page visibility toggling logic
- Navigation click handlers
- `data-page` attribute processing

### Phase 5: Testing

Test all routes:
- `/` - Home
- `/about/*` - All about pages
- `/connect/*` - All connect pages
- `/events` - Events page
- `/reunion/*` - Reunion pages
- `/gallery/*` - Gallery pages
- `/faq` - FAQ
- `/contact` - Contact
- `/member` - Membership

## 📁 File Checklist

- [ ] Replace `index.html` with `index_new.html`
- [ ] Update `Navbar.tsx` to use React Router Links
- [ ] Update `Footer.tsx` to use React Router Links
- [ ] Fill in all 14 stub pages with content
- [ ] Refactor `main.ts` to remove page logic
- [ ] Test all navigation
- [ ] Verify IndexedDB still works
- [ ] Test admin dashboard
- [ ] Test forms and modals

## 🚀 Quick Start Instructions

1. **Backup current files**:
   ```bash
   cp index.html index_old.html
   cp src/main.ts src/main_old.ts
   ```

2. **Switch to new index.html**:
   ```bash
   cp index_new.html index.html
   ```

3. **Run dev server**:
   ```bash
   npm run dev
   ```

4. **Verify React app loads** at `http://localhost:3000`

5. **Update pages one by one** - Start with Home, then About, then Events

## ⚠️ Important Notes

- **Don't delete `main.ts` yet** - It has slider/modal logic we need
- **Extract reusable logic** from main.ts into separate utility files
- **Test after each page update** to ensure nothing breaks
- **IndexedDB logic** should work without changes
- **Keep all image paths** as-is in `/public/images/`

## 📊 Progress Tracker

### Completed ✅
- [x] Created clean index_new.html
- [x] Migration plan documented
- [x] App.tsx routes configured

### In Progress 🚧
- [ ] Update Navbar navigation
- [ ] Fill in page content

### Not Started ❌
- [ ] Refactor main.ts
- [ ] Final testing
- [ ] Deployment

---

**Estimated Time**: 4-6 hours for full migration
**Risk Level**: Medium (backup everything first!)
**Benefits**: Better performance, cleaner code, easier maintenance
