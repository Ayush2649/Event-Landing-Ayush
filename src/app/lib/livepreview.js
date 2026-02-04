import ContentstackLivePreview from "@contentstack/live-preview-utils";
import Stack from "./contentstack";

export function LivePreviewInit(){
  const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
  const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT;

  ContentstackLivePreview.init({
    enable: true,
    ssr: false,
    stackSdk: Stack,
    // Enable edit button for Visual Builder
    editButton: {
      enable: true,
      exclude: [], // Include all content types
      position: "top-right", // Edit button position
    },
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

// Helper function to generate data-cslp attributes
export function addEditableTags(entry, fieldPath) {
  return ContentstackLivePreview.hash({
    content_type_uid: entry._content_type_uid || entry.content_type_uid,
    entry_uid: entry.uid,
    locale: entry.locale || 'en-us',
    cslpValue: fieldPath,
  });
}

