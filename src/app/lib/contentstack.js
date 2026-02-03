import Contentstack from "contentstack";
const preview_token = process.env.NEXT_PUBLIC_CONTENTSTACK_PREVIEW_TOKEN;

const Stack = Contentstack.Stack({
  api_key: process.env.CONTENTSTACK_API_KEY,
  delivery_token: process.env.CONTENTSTACK_DELIVERY_TOKEN,
  environment: process.env.CONTENTSTACK_ENVIRONMENT,
  live_preview: {
    preview_token: preview_token ,
    enable: true,
    host: 'rest-preview.contentstack.com' // recommended
  },
});

export default Stack;
