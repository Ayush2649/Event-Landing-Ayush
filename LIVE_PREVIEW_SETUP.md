# Contentstack Live Preview Setup Guide

## 🔧 Step 1: Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# Server-side Contentstack credentials
CONTENTSTACK_API_KEY=your_api_key_here
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token_here
CONTENTSTACK_ENVIRONMENT=your_environment_here
CONTENTSTACK_PREVIEW_TOKEN=your_preview_token_here
CONTENTSTACK_PREVIEW_HOST=api.contentstack.io

# Client-side variables (required for Live Preview SDK)
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your_api_key_here
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=your_environment_here
```

**Important**: The `NEXT_PUBLIC_*` variables MUST match your server-side `CONTENTSTACK_API_KEY` and `CONTENTSTACK_ENVIRONMENT`.

---

## 🌐 Step 2: Configure Live Preview in Contentstack

1. **Login to Contentstack Dashboard**
   - Go to your stack

2. **Navigate to Settings → Live Preview**
   - Click "Settings" in the left sidebar
   - Click "Live Preview"

3. **Add Preview URL Configuration**
   
   For **Production/Deployed** environment:
   ```
   https://event-landing-ayush.eu-contentstackapps.com/events/{entry.slug}?live_preview=true
   ```
   
   For **Local Development** (optional):
   ```
   http://localhost:3000/events/{entry.slug}?live_preview=true
   ```

4. **Configure Content Type**
   - Select content type: `event_ayush`
   - Enable Live Preview for this content type

5. **Save Configuration**

---

## 🚀 Step 3: Test Live Preview

### Option A: Using Deployed URL (Recommended)

1. Make sure your site is deployed at: `https://event-landing-ayush.eu-contentstackapps.com/`

2. In Contentstack:
   - Open any `event_ayush` entry
   - Click "Live Preview" button in the sidebar
   - The preview should load your deployed site with the entry

3. Make edits to any field → changes should appear instantly in the preview pane

### Option B: Using Local Development

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Make sure it's running on `http://localhost:3000`

3. In Contentstack:
   - Open any `event_ayush` entry
   - Click "Live Preview" button
   - The preview will load from your local server

---

## 🐛 Troubleshooting

### Issue: "Please initialize the Live Preview SDK"

**Cause**: Environment variables are not properly set or not exposed to the client.

**Solution**:
1. Verify `.env.local` has all `NEXT_PUBLIC_*` variables
2. Restart your dev server: `npm run dev`
3. Check browser console for initialization logs
4. Ensure variables don't have quotes or extra spaces

### Issue: "Page not found" with `{entry.slug}`

**Cause**: The URL pattern uses a Contentstack variable that gets replaced dynamically.

**Solution**:
- The URL `{entry.slug}` is a placeholder that Contentstack replaces automatically
- Don't manually paste this URL in your browser
- Instead, use the "Live Preview" button in Contentstack dashboard
- For manual testing, use actual slug like: `/events/tech-summit-2026?live_preview=true`

### Issue: Changes not reflecting in Live Preview

**Solution**:
1. Open browser DevTools console
2. Look for: "Live Preview SDK initialized successfully"
3. If not present, check environment variables
4. Verify the URL includes `?live_preview=true` parameter

### Issue: Visual Builder not highlighting editable fields

**Solution**:
1. Ensure `data-cslp` attributes are present in HTML
2. Check browser inspector: elements should have `data-cslp="event_ayush.blt123.title"` attributes
3. Make sure you're using the deployed URL, not localhost (Visual Builder works better with deployed sites)

---

## ✅ Verification Checklist

Before using Live Preview, verify:

- [ ] `.env.local` file exists with all required variables
- [ ] `NEXT_PUBLIC_CONTENTSTACK_API_KEY` matches `CONTENTSTACK_API_KEY`
- [ ] `NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT` matches `CONTENTSTACK_ENVIRONMENT`
- [ ] Development server is running (for local) OR site is deployed
- [ ] Live Preview URL is configured in Contentstack Settings
- [ ] `{entry.slug}` placeholder is used (not a hardcoded slug)
- [ ] Content type `event_ayush` is selected in Live Preview settings

---

## 📝 Example Entry Test

To test with a specific entry:

1. Get your entry's slug (e.g., "tech-summit-2026")
2. Visit: `https://event-landing-ayush.eu-contentstackapps.com/events/tech-summit-2026?live_preview=true`
3. Open DevTools console
4. You should see: "Live Preview SDK initialized successfully"

If you see this, Live Preview is working! Now use the Contentstack dashboard to get the full Visual Builder experience.

---

## 🎯 Expected Behavior

When properly configured:

✅ Opening an entry in Contentstack → "Live Preview" button appears  
✅ Clicking "Live Preview" → Your site loads in the preview pane  
✅ Editing a field → Changes appear instantly (no save needed)  
✅ Hovering over content → Visual Builder shows edit controls  
✅ Clicking on content → Corresponding field is highlighted in the form  

---

Need help? Check the console for error messages and refer to the troubleshooting section above.
