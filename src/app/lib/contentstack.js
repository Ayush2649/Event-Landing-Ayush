import Contentstack from "contentstack";

const Stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,

  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,

  environment: process.env.CONTENTSTACK_ENVIRONMENT,

  live_preview: {
    preview_token: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    enable: true,
    host: process.env.CONTENTSTACK_PREVIEW_HOST || "api.contentstack.io",
  },
});

/**
 * Helper to get Stack instance configured for Live Preview
 * Use this when you need live preview in API routes or server components
 */
export function getStackWithLivePreview(options = {}) {
  const { includePreviewToken = false } = options;

  return Contentstack.Stack({
    api_key: process.env.CONTENTSTACK_API_KEY,
    delivery_token: includePreviewToken 
      ? process.env.CONTENTSTACK_PREVIEW_TOKEN 
      : process.env.CONTENTSTACK_DELIVERY_TOKEN,
    environment: process.env.CONTENTSTACK_ENVIRONMENT,
    live_preview: {
      preview_token: process.env.CONTENTSTACK_PREVIEW_TOKEN,
      enable: includePreviewToken,
      host: process.env.CONTENTSTACK_PREVIEW_HOST || "api.contentstack.io",
    },
  });
}

/**
 * Configure query for live preview mode
 * Adds necessary parameters for preview content
 */
export function configureQueryForPreview(query, isPreview = false) {
  if (isPreview) {
    query.includeContentType();
    query.includeFallback();
  }
  return query;
}

export default Stack;
