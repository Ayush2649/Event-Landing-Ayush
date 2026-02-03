import ContentstackLivePreview from "@contentstack/live-preview-utils";

/**
 * Initialize Contentstack Live Preview in client-side components
 * This enables real-time content updates in Visual Builder
 */
export function initializeLivePreview() {
  if (typeof window !== "undefined") {
    try {
      ContentstackLivePreview.init({
        enable: true,
        stackDetails: {
          apiKey: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
          environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
        },
        clientUrlParams: {
          protocol: "https",
          host: "app.contentstack.com",
          port: 443,
        },
        ssr: false,
      });
      console.log("Live Preview SDK initialized successfully");
    } catch (error) {
      console.error("Failed to initialize Live Preview SDK:", error);
    }
  }
}

/**
 * Check if we're in Live Preview mode based on URL params
 * Used in server components to determine preview behavior
 */
export function isLivePreviewEnabled(searchParams) {
  return (
    searchParams?.live_preview === "true" ||
    searchParams?.live_preview === "enable"
  );
}

/**
 * Get live preview hash from URL params
 * This hash is used to fetch the correct preview content
 */
export function getLivePreviewHash(searchParams) {
  return searchParams?.content_type_uid || "";
}

/**
 * Subscribe to content changes in Live Preview
 * Returns an unsubscribe function to clean up
 */
export function onEntryChange(callback) {
  if (typeof window !== "undefined") {
    return ContentstackLivePreview.onEntryChange(callback);
  }
  return () => {};
}

/**
 * Apply live preview editable data attributes to entries
 * This enables Visual Builder's click-to-edit functionality
 */
export function getEditableProps(entryUid, contentTypeUid, locale = "en-us") {
  if (typeof window === "undefined") {
    return {};
  }
  
  return {
    "data-cslp": `${contentTypeUid}.${entryUid}.${locale}`,
  };
}
