---
description: Migration Plan - Single Page to Multi-Page React Application
---

# Migration Plan: Single Page to Multi-Page React Application

## Current State
- Everything in `index.html` (570KB) with visibility toggles
- `main.ts` (165KB) manages page switching
- Some React components exist but aren't being used

## Target State
- Clean `index.html` with just React mount point
- All sections split into separate React pages
- Proper React Router navigation
- `main.ts` simplified to only handle sliders and utilities

---

## Pages to Create/Update

### 1. Home Page ✅
- Already exists: `src/pages/Home.tsx`
- Needs update to include the three-column layout from index.html

### 2. About Section
- `src/pages/about/About.tsx` - Landing page
- `src/pages/about/AboutOverview.tsx` ✅ - Already exists
- `src/pages/about/PresidentsMessage.tsx` ✅ - Already exists
- `src/pages/about/ExecutiveCommittee.tsx` ✅ - Already exists
- `src/pages/about/AlumniChapters.tsx` ✅ - Exists, needs content
- `src/pages/about/AlumniBenefits.tsx` ✅ - Exists, needs content
- `src/pages/about/AnnualReports.tsx` ✅ - Already exists

### 3. Connect Section
- `src/pages/connect/Connect.tsx` ✅ - Already exists
- `src/pages/connect/MyProfile.tsx` ✅ - Already exists
- `src/pages/connect/AlumniEvent.tsx` ✅ - Already exists
- `src/pages/connect/AlumniDirectory.tsx` ✅ - Exists, needs content
- `src/pages/connect/BusinessDirectory.tsx` ✅ - Exists, needs content
- `src/pages/connect/HowToGive.tsx` ✅ - Exists, needs content
- `src/pages/connect/ConnectWithUs.tsx` ✅ - Exists, needs content

### 4. Events Page
- `src/pages/Events.tsx` - Needs full content from index.html

### 5. Reunion Section
- `src/pages/reunion/Reunion.tsx` ✅ - Already exists
- `src/pages/reunion/AboutReunion.tsx` - Create
- `src/pages/reunion/ReunionGallery.tsx` - Create

### 6. Gallery Section
- `src/pages/gallery/Gallery.tsx` ✅ - Already exists
- `src/pages/gallery/PhotoGallery.tsx` - Create from index.html
- `src/pages/gallery/VideoGallery.tsx` - Create from index.html

### 7. Other Pages
- `src/pages/FAQ.tsx` ✅ - Already exists
- `src/pages/Contact.tsx` ✅ - Exists, needs content
- `src/pages/Member.tsx` ✅ - Exists, needs content
- `src/pages/Dashboard.tsx` ✅ - Exists, needs content

---

## Implementation Steps

### Step 1: Extract Home Page Content
Extract the three-column layout from index.html into Home.tsx

### Step 2: Create Missing Gallery Pages
- PhotoGallery.tsx - Extract year-wise photo gallery
- VideoGallery.tsx - Extract video gallery section

### Step 3: Create Missing Reunion Pages
- AboutReunion.tsx - Extract about reunion content
- ReunionGallery.tsx - Extract reunion photo gallery

### Step 4: Fill in Stub Pages
- AlumniChapters.tsx
- AlumniBenefits.tsx
- AlumniDirectory.tsx (Connect)
- BusinessDirectory.tsx
- HowToGive.tsx
- ConnectWithUs.tsx
- Contact.tsx
- Member.tsx
- Events.tsx
- Dashboard.tsx

### Step 5: Update index.html
Replace massive HTML with minimal React mount point

### Step 6: Refactor main.ts
Remove visibility toggle logic, keep only:
- Slider initialization
- Modal handlers
- Utility functions

### Step 7: Update App.tsx
Ensure all routes are properly configured

### Step 8: Test Navigation
Verify all pages load correctly with routing

---

## Files to Modify

1. `index.html` - Simplify to bare minimum
2. `src/main.ts` - Remove page-switching logic
3. `src/main.tsx` - Entry point (already correct)
4. `src/App.tsx` - Verify routes
5. Create 10+ new page components

---

## Benefits

✅ Better code organization
✅ Easier maintenance
✅ Faster page loads (code splitting)
✅ Better SEO
✅ Cleaner URLs for each section
✅ Proper browser back/forward navigation
✅ Easier to add new pages

---

## Estimated Files to Create/Update

- Create: ~10 new page components
- Update: ~15 existing components
- Modify: index.html, main.ts, App.tsx

Total: ~25 files to touch
