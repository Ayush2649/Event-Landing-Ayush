"use client";

import { useEffect } from "react";
import ContentstackLivePreview from "@contentstack/live-preview-utils";

ContentstackLivePreview.init({
    enable: true
});

export default function LivePreviewReload() {
  useEffect(() => {
    ContentstackLivePreview.onEntryChange(() => {
    //   window.location.reload();
    });
  }, []);

  return null;
}
