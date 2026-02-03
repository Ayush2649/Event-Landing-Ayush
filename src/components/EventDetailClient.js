"use client";

import { useEffect, useState } from "react";
import { onEntryChange, initializeLivePreview } from "../utils/livePreview";

/**
 * Hook for subscribing to live preview updates
 * Use this in client components that need to react to content changes
 */
export function useLivePreview(initialData, contentTypeUid) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Check if we're in preview mode
    const searchParams = new URLSearchParams(window.location.search);
    const isPreview = 
      searchParams.get("live_preview") === "true" ||
      searchParams.get("live_preview") === "enable";

    console.log("Live Preview Mode:", isPreview);
    console.log("Environment Variables:", {
      apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY ? "✓ Set" : "✗ Missing",
      environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT ? "✓ Set" : "✗ Missing",
    });

    if (isPreview) {
      // Initialize live preview
      initializeLivePreview();

      // Subscribe to changes
      const unsubscribe = onEntryChange((updatedEntry) => {
        console.log("Live preview update received:", updatedEntry);
        setData(updatedEntry);
      });

      return () => {
        if (typeof unsubscribe === "function") {
          unsubscribe();
        }
      };
    }
  }, [contentTypeUid]);

  return data;
}

/**
 * Simple client component wrapper for event detail display
 * Handles live preview updates and re-renders on change
 */
export default function EventDetailClient({ initialEvent }) {
  const event = useLivePreview(initialEvent, "event_ayush");

  // Return null - actual rendering handled by parent
  // This component just manages the live preview state
  return null;
}
