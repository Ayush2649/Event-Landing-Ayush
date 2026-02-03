"use client";

import { useEffect, useState } from "react";
import { initializeLivePreview, onEntryChange } from "@/utils/livePreview";

/**
 * Client-side wrapper for Live Preview functionality
 * Initializes the Live Preview SDK and listens for content changes
 * 
 * Usage:
 * <LivePreviewProvider initialData={serverData} onUpdate={setData}>
 *   {children}
 * </LivePreviewProvider>
 */
export default function LivePreviewProvider({ 
  initialData, 
  contentTypeUid = "event_ayush",
  children 
}) {
  const [data, setData] = useState(initialData);
  const [isLivePreviewActive, setIsLivePreviewActive] = useState(false);

  useEffect(() => {
    // Check if we're in Live Preview mode
    const urlParams = new URLSearchParams(window.location.search);
    const livePreviewEnabled = 
      urlParams.get("live_preview") === "true" ||
      urlParams.get("live_preview") === "enable";
    
    setIsLivePreviewActive(livePreviewEnabled);

    if (livePreviewEnabled) {
      // Initialize Live Preview SDK
      initializeLivePreview();

      // Listen for content changes
      const unsubscribe = onEntryChange((updatedData) => {
        console.log("Live Preview: Content updated", updatedData);
        setData(updatedData);
      });

      return () => {
        if (unsubscribe) {
          unsubscribe();
        }
      };
    }
  }, []);

  // Pass both the data and live preview status to children
  return typeof children === "function" 
    ? children({ data, isLivePreviewActive })
    : children;
}
