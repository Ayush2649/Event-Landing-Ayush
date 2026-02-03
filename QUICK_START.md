# 🚀 Quick Start: Live Preview Setup

## Issues You Reported

### 1. ❌ "Page not found" with `{entry.slug}` URL
**Why?** The `{entry.slug}` is a Contentstack variable placeholder - it's NOT meant to be pasted directly in your browser.

**Solution:** Configure it in Contentstack dashboard, and Contentstack will replace it automatically when you click "Live Preview".

### 2. ❌ "Please initialize the Live Preview SDK"
**Why?** Missing or incorrect `NEXT_PUBLIC_*` environment variables.

**Solution:** Follow the steps below.

---

## ✅ Step-by-Step Fix

### Step 1: Create `.env.local` file

In your project root (`/Users/ayush.sahu/Desktop/event-landing-ayush/`), create a file named `.env.local`:

```bash
# Copy these from your Contentstack dashboard
CONTENTSTACK_API_KEY=blt1234567890abcdef
CONTENTSTACK_DELIVERY_TOKEN=cs1234567890abcdef
CONTENTSTACK_ENVIRONMENT=production
CONTENTSTACK_PREVIEW_TOKEN=cs9876543210abcdef
CONTENTSTACK_PREVIEW_HOST=api.contentstack.io

# IMPORTANT: These must match the values above
NEXT_PUBLIC_CONTENTSTACK_API_KEY=blt1234567890abcdef
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=production
```

**Get your credentials:**
1. Login to Contentstack
2. Go to Settings → Tokens
3. Copy API Key, Delivery Token, and Preview Token

### Step 2: Configure Contentstack Dashboard

1. **Go to Settings → Live Preview**

2. **Click "+ New" or "Edit" existing configuration**

3. **Add this URL:**
   ```
   https://event-landing-ayush.eu-contentstackapps.com/events/{entry.slug}?live_preview=true
   ```
   
   ⚠️ **Important:** Don't change `{entry.slug}` - Contentstack will replace it automatically!

4. **Select Content Type:** `event_ayush`

5. **Click Save**

### Step 3: Deploy Your Changes

Since you're using the deployed URL, you need to:

1. **Add environment variables to your deployment platform:**
   - If using Vercel/Netlify/etc., add the same env vars from `.env.local`
   - Make sure to include the `NEXT_PUBLIC_*` variables

2. **Deploy your latest code:**
   ```bash
   git add .
   git commit -m "Add Live Preview support"
   git push
   ```

3. **Wait for deployment to complete**

### Step 4: Test Live Preview

1. **In Contentstack:**
   - Open any event entry (e.g., the one with UID: `blt7e2590a22ad586f4`)
   - Click "Live Preview" button in the right sidebar

2. **You should see:**
   - Your deployed site loads in the preview pane
   - Console message: "Live Preview SDK initialized successfully"

3. **Make a change:**
   - Edit the event title
   - The change should appear instantly (without saving)

---

## 🧪 Testing Locally (Optional)

If you want to test locally before deploying:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Add local URL to Contentstack:**
   ```
   http://localhost:3000/events/{entry.slug}?live_preview=true
   ```

3. **Test a specific event manually:**
   ```
   http://localhost:3000/events/your-event-slug?live_preview=true
   ```
   
   Replace `your-event-slug` with an actual event slug from your Contentstack entries.

---

## 🐛 Debugging

### Add Diagnostics Component (Temporary)

To see what's happening, add this to your event detail page:

```javascript
import LivePreviewDiagnostics from "@/components/LivePreviewDiagnostics";

// In your component
<LivePreviewDiagnostics />
```

This will show a debug panel in the bottom-right corner with:
- Whether preview mode is active
- URL parameters
- Environment variables status

### Check Browser Console

Open DevTools (F12) and look for:
- ✅ "Live Preview SDK initialized successfully"
- ✅ "Live Preview Mode: true"
- ✅ Environment variables with "✓ Set"

### Common Issues

**"API Key missing"**
→ Add `NEXT_PUBLIC_CONTENTSTACK_API_KEY` to `.env.local`

**"Changes not appearing"**
→ Make sure URL has `?live_preview=true` parameter

**"404 Not Found"**
→ Don't manually type `{entry.slug}` - use actual slug or click "Live Preview" button in Contentstack

---

## ✅ Success Checklist

- [ ] `.env.local` file created with all variables
- [ ] `NEXT_PUBLIC_*` variables match regular variables
- [ ] Environment variables added to deployment platform
- [ ] Code deployed to: `https://event-landing-ayush.eu-contentstackapps.com/`
- [ ] Live Preview URL configured in Contentstack: `https://event-landing-ayush.eu-contentstackapps.com/events/{entry.slug}?live_preview=true`
- [ ] Content type `event_ayush` selected
- [ ] Browser console shows "Live Preview SDK initialized successfully"
- [ ] Making edits shows changes instantly

---

## 📞 Still Not Working?

Run these checks:

```bash
# 1. Check if env vars are in the file
cat .env.local

# 2. Restart dev server
npm run dev

# 3. Test with actual event slug
# Visit: http://localhost:3000/events/ACTUAL-SLUG?live_preview=true
```

In browser console, check:
```javascript
console.log(process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY);
// Should show: "blt..." not "undefined"
```

If it shows `undefined`, your environment variables aren't loaded correctly.

---

Need more help? Check [LIVE_PREVIEW_SETUP.md](./LIVE_PREVIEW_SETUP.md) for detailed troubleshooting.
