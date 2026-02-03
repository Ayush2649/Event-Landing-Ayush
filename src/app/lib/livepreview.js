import ContentstackLivePreview from "@contentstack/live-preview-utils";
import Stack from "./contentstack";
const apiKey = process.env.CONTENTSTACK_API_KEY;
const environment = process.env.CONTENTSTACK_ENVIRONMENT;
const branch = process.env.CONTENTSTACK_BRANCH || "main";

export function LivePreviewInit(){

    ContentstackLivePreview.init({
  enable: true,
  ssr: false,
  stackSdk: Stack,

  // Recommended: Enables Edit Tags
  editButton: { enable: true },
  stackDetails: {
    apiKey: apiKey,
    environment: environment,
    branch: branch,
  },
  clientUrlParams: {
    protocol: "https",
    host: "app.contentstack.com", // Use region-specific host if applicable
    port: 443,
  },
});
}

export const onEntryChange = ContentstackLivePreview.onEntryChange;

