import Contentstack from "contentstack";

// Server-side Stack configuration
// Use non-NEXT_PUBLIC_ prefixed variables for server components
// Note: Live preview is handled client-side, so we don't need it here
const ServerStack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT,
  region: process.env.CONTENTSTACK_REGION || 'US',
});

export default ServerStack;