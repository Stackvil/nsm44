# NSMOSA Multi-Page Migration - Quick Start

## ✅ STEP 1: Backup Current Files

```bash
# Backup the old single-page files
cp index.html index_old_backup.html
cp src/main.ts src/main_old_backup.ts
```

## ✅ STEP 2: Replace index.html

```bash
# Replace with the new clean React-only version
cp index_new.html index.html
```

## ✅ STEP 3: Test the React App

```bash
# Start the dev server
npm run dev
```

Visit `http://localhost:3000` - You should see:
- ✅ React app loads
- ✅ Home page appears
- ✅ Navigation works
- ❌ Some pages show "coming soon" (expected)

## ✅ STEP 4: Verify Navigation

Test these URLs in your browser:
- `http://localhost:3000/` - Home ✅
- `http://localhost:3000/about/overview` - About ✅
- `http://localhost:3000/events` - Events (stub)
- `http://localhost:3000/gallery/photo` - Photo Gallery (stub)
- `http://localhost:3000/contact` - Contact (stub)

## 🎉 SUCCESS CRITERIA

After Step 3, you should have:
- [x] Clean index.html (2KB instead of 570KB)
- [x] React Router working
- [x] All navigation functional
- [ ] Some pages need content (we'll fill these next)

## 📝 NEXT STEPS

Once basic migration works, we'll:
1. Fill in stub pages with content from old index.html
2. Migrate slider/modal logic from main.ts
3. Test all features
4. Deploy to Vercel

---

## ⚠️ IMPORTANT NOTES

**DO NOT DELETE** `main_old_backup.ts` yet - we need to extract:
- Image slider initialization
- Modal handlers
- IndexedDB utilities
- Event management functions

These will be refactored into proper React hooks/utilities.

---

## 🐛 Troubleshooting

### Issue: Blank page after migration
**Solution**: Check browser console for errors. Likely missing CSS imports.

### Issue: Navigation doesn't work
**Solution**: Verify `App.tsx` routes match the URLs in `Navbar.tsx`

### Issue: Images don't load
**Solution**: Ensure `/public/images/` folder exists and paths are correct

---

**Ready to proceed?** Run the commands above! 🚀
