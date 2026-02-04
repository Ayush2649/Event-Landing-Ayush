import ContentstackLivePreview from "@contentstack/live-preview-utils";
import Stack from "./contentstack";

export function LivePreviewInit(){
  const apiKey = process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY;
  const environment = process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT;
  const branch = process.env.NEXT_PUBLIC_CONTENTSTACK_BRANCH || "main";

  ContentstackLivePreview.init({
    enable: true,
    ssr: false,
    stackSdk: Stack,
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

