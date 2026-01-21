import Contentstack from "contentstack";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

const Stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,

  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,

  environment: process.env.CONTENTSTACK_ENVIRONMENT,

  live_preview: {
    preview_token: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    enable: true,
    host: process.env.CONTENTSTACK_PREVIEW_HOST,
  },
});

ContentstackLivePreview.init({
  enable: true,
  ssr: false,
  stackSdk: Stack,

  // Recommended: Enables Edit Tags
  editButton: { enable: true },
  stackDetails: {
    apiKey: process.env.CONTENTSTACK_API_KEY,
    environment: process.env.CONTENTSTACK_ENVIRONMENT,
    branch: process.env.CONTENTSTACK_BRANCH || "main",
  },
  clientUrlParams: {
    protocol: "https",
    host: "app.contentstack.com", // Use region-specific host if applicable
    port: 443,
  },
});

export default Stack;
