# Contentstack Live Preview Setup Guide

This document captures all issues encountered and solutions for configuring Contentstack Live Preview in a Next.js application.

---

## 🎯 Final Working Configuration

### 1. Environment Variables (.env.local)

```env
# Server-side variables (for API routes and server components)
CONTENTSTACK_API_KEY=your_api_key
CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
CONTENTSTACK_ENVIRONMENT=development
CONTENTSTACK_REGION=US
CONTENTSTACK_PREVIEW_TOKEN=your_preview_token
CONTENTSTACK_PREVIEW_HOST=rest-preview.contentstack.com
CONTENTSTACK_LIVE_PREVIEW=true

# Client-side variables (must have NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_CONTENTSTACK_API_KEY=your_api_key
NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN=your_delivery_token
NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT=development
NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN=your_preview_token
NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST=rest-preview.contentstack.com
NEXT_PUBLIC_CONTENTSTACK_APP_HOST=app.contentstack.com
```

### 2. Client-Side Stack Configuration (src/app/lib/contentstack.js)

```javascript
import Contentstack from "contentstack";

// Client-side Stack configuration
// Use NEXT_PUBLIC_ prefixed variables for client components
const Stack = Contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  // DO NOT include region - it causes DNS issues (us-cdn.contentstack.com doesn't resolve)
  live_preview: {
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN, // Use preview_token, not management_token
    enable: true,
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || 'rest-preview.contentstack.com'
  },
});

export default Stack;
```

### 3. Live Preview Initialization (src/app/lib/livepreview.js)

```javascript
import ContentstackLivePreview from "@contentstack/live-preview-utils";
import Stack from "./contentstack";

export function LivePreviewInit(){
  const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
  const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT;

  ContentstackLivePreview.init({
    enable: true,
    ssr: false,
    stackSdk: Stack,
    stackDetails: {
      apiKey: apiKey,
      environment: environment,
    },
    clientUrlParams: {
      protocol: "https",
      host: process.env.NEXT_PUBLIC_CONTENTSTACK_APP_HOST || "app.contentstack.com",
      port: 443,
    },
  });
}

export const onEntryChange = ContentstackLivePreview.onEntryChange;
```

### 4. Client Component with Live Preview (Example)

```javascript
"use client";
import { useEffect, useState } from "react";
import Stack from "./lib/contentstack";
import { LivePreviewInit, onEntryChange } from "./lib/livepreview";

export default function HomePage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize live preview
    LivePreviewInit();

    // Fetch data function
    async function fetchData() {
      try {
        setLoading(true);
        const Query = Stack.ContentType("your_content_type").Query();
        const result = await Query.find();
        setData(result[0] || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }

    // Initial fetch
    fetchData();

    // Listen for live preview changes
    const unsubscribe = onEntryChange(() => {
      console.log("Entry changed, refetching...");
      fetchData();
    });

    // Cleanup
    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return <div>{/* Your content */}</div>;
}
```

---

## 🐛 Issues Encountered & Solutions

### Issue #1: Infinite Loop - ERR_INSUFFICIENT_RESOURCES

**Problem:**
```
GET https://cdn.contentstack.io/v3/content_types/event_ayush/entries/ 
net::ERR_INSUFFICIENT_RESOURCES
```
Component repeatedly making API calls causing infinite loop.

**Root Cause:**
- Mixing `async` server component pattern with `"use client"` directive
- API calls running on every render without proper `useEffect` control

**Solution:**
1. Remove `async` from component function
2. Move API calls inside `useEffect` with empty dependency array `[]`
3. Add proper state management (`useState` for data, loading, error)

```javascript
// ❌ WRONG
"use client";
export default async function HomePage() {
  const result = await Query.find(); // Runs on every render!
}

// ✅ CORRECT
"use client";
export default function HomePage() {
  useEffect(() => {
    async function fetchData() {
      const result = await Query.find();
    }
    fetchData();
  }, []); // Empty array ensures it runs once
}
```

---

### Issue #2: Invalid Key Error - stackSdk.live_preview

**Problem:**
```
Invalid key: stackSdk.live_preview
```

**Root Cause:**
Environment variables not accessible in client components (missing `NEXT_PUBLIC_` prefix).

**Solution:**
Use `NEXT_PUBLIC_` prefix for all environment variables used in client components:

```javascript
// ❌ WRONG (in client component)
api_key: process.env.CONTENTSTACK_API_KEY

// ✅ CORRECT (in client component)
api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY
```

---

### Issue #3: DNS Resolution Error - ERR_NAME_NOT_RESOLVED

**Problem:**
```
Failed to load resource: net::ERR_NAME_NOT_RESOLVED
https://us-cdn.contentstack.com/v3/content_types/...
```

**Root Cause:**
Including `region: 'US'` in Stack configuration causes SDK to use `us-cdn.contentstack.com` which doesn't resolve.

**Solution:**
Remove the `region` configuration entirely. The SDK will default to `cdn.contentstack.io`:

```javascript
// ❌ WRONG
const Stack = Contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  region: 'US', // This breaks DNS!
});

// ✅ CORRECT
const Stack = Contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  // No region config - uses cdn.contentstack.io
});
```

---

### Issue #4: Preview Token vs Management Token

**Problem:**
Confusion between using `preview_token` vs `management_token` in live_preview config.

**Solution:**
Use `preview_token` (newer SDK version uses this instead of `management_token`):

```javascript
// ✅ CORRECT (New Version)
live_preview: {
  preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,
  enable: true,
  host: 'rest-preview.contentstack.com'
}
```

---

### Issue #5: Server vs Client Components

**Problem:**
500 errors when server components try to use client-side Stack configuration.

**Solutions:**

**Option A: Convert Everything to Client-Side (Recommended for Live Preview)**
```javascript
"use client";
import Stack from "./lib/contentstack"; // Client stack
```

**Option B: Separate Stacks for Server and Client**

Create `contentstack-server.js` for server components:
```javascript
// Server-side Stack (no NEXT_PUBLIC_ prefix, no live_preview)
const ServerStack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT,
});
```

---

## 📋 Checklist for Setting Up Live Preview

- [ ] Install dependencies: `npm install contentstack @contentstack/live-preview-utils`
- [ ] Create `.env.local` with both server and client variables
- [ ] Configure Stack without `region` property
- [ ] Use `preview_token` in live_preview config
- [ ] Convert components to `"use client"`
- [ ] Initialize LivePreview in `useEffect`
- [ ] Set up `onEntryChange` listener for real-time updates
- [ ] Add proper cleanup in `useEffect` return function
- [ ] Use `NEXT_PUBLIC_` prefix for all client-side env vars
- [ ] Test in Contentstack Live Preview mode

---

## 🔑 Key Takeaways

1. **Client Components Only**: Live Preview works best with client components (`"use client"`)
2. **No Region Config**: Remove region to avoid DNS issues
3. **NEXT_PUBLIC_ Prefix**: Required for client-side environment variables
4. **useEffect Control**: Always fetch data inside `useEffect` with proper dependencies
5. **onEntryChange**: Essential for real-time live preview updates
6. **Cleanup**: Always return cleanup function in `useEffect` to prevent memory leaks
7. **preview_token**: Use this instead of management_token in newer SDK versions
8. **No Async in Client**: Client components with "use client" cannot be async

---

## 🚀 Quick Start Template

```javascript
"use client";
import { useEffect, useState } from "react";
import Stack from "./lib/contentstack";
import { LivePreviewInit, onEntryChange } from "./lib/livepreview";

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    LivePreviewInit();

    async function fetchData() {
      try {
        setLoading(true);
        const result = await Stack.ContentType("content_type").Query().find();
        setData(result[0] || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();

    const unsubscribe = onEntryChange(() => fetchData());
    return () => unsubscribe?.();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render data */}</div>;
}
```

---

**Last Updated:** February 4, 2026  
**Next.js Version:** 16.1.1  
**Contentstack SDK:** Latest with preview_token support
