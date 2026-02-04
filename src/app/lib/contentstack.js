import Contentstack from "contentstack";

// Client-side Stack configuration
// Use NEXT_PUBLIC_ prefixed variables for client components
const Stack = Contentstack.Stack({
  api_key: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY,
  delivery_token: process.env.NEXT_PUBLIC_CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT,
  live_preview: {
    preview_token: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN,
    enable: true,
    host: process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_HOST || 'rest-preview.contentstack.com'
  },
});

export default Stack;
