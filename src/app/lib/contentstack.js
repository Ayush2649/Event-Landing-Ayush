import Contentstack from "contentstack";

const Stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,

  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,

  environment: process.env.CONTENTSTACK_ENVIRONMENT,

  live_preview: {
    preview_token: process.env.CONTENTSTACK_PREVIEW_TOKEN,
    enable: process.env.CONTENTSTACK_LIVE_PREVIEW === "true",
    host: process.env.CONTENTSTACK_PREVIEW_HOST,
  },
});

export default Stack;
