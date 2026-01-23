"use client";

import { useEffect } from "react";

export default function PersonalizeInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const waitForSDK = () => {
      if (window.csPersonalize) {
        window.csPersonalize.init({
          projectUid: "6972fc62a489f537407f2fc7",
        });

        console.log("✅ csPersonalize initialized");
      } else {
        setTimeout(waitForSDK, 50);
      }
    };

    waitForSDK();
  }, []);

  return null;
}
