"use client";

import { useEffect, useState } from "react";

/**
 * Diagnostic component to check Live Preview configuration
 * Add this to your page temporarily to debug Live Preview issues
 * 
 * Usage: <LivePreviewDiagnostics />
 */
export default function LivePreviewDiagnostics() {
  const [diagnostics, setDiagnostics] = useState(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    
    const results = {
      // URL Parameters
      urlParams: {
        live_preview: searchParams.get("live_preview") || "Not set",
        content_type_uid: searchParams.get("content_type_uid") || "Not set",
        entry_uid: searchParams.get("entry_uid") || "Not set",
      },
      
      // Environment Variables
      envVars: {
        NEXT_PUBLIC_CONTENTSTACK_API_KEY: process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY 
          ? `${process.env.NEXT_PUBLIC_CONTENTSTACK_API_KEY.substring(0, 8)}...` 
          : "❌ NOT SET",
        NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT: process.env.NEXT_PUBLIC_CONTENTSTACK_ENVIRONMENT || "❌ NOT SET",
      },
      
      // Preview Mode Detection
      isPreviewMode: 
        searchParams.get("live_preview") === "true" ||
        searchParams.get("live_preview") === "enable",
      
      // Current URL
      currentUrl: window.location.href,
    };
    
    setDiagnostics(results);
    console.log("🔍 Live Preview Diagnostics:", results);
  }, []);

  if (!diagnostics) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      background: "#1e1e1e",
      color: "#fff",
      padding: "20px",
      borderRadius: "8px",
      maxWidth: "400px",
      fontSize: "12px",
      fontFamily: "monospace",
      zIndex: 9999,
      boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
    }}>
      <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
        🔍 Live Preview Diagnostics
      </h3>
      
      <div style={{ marginBottom: "10px" }}>
        <strong>Preview Mode:</strong> {diagnostics.isPreviewMode ? "✅ ENABLED" : "❌ DISABLED"}
      </div>
      
      <div style={{ marginBottom: "10px" }}>
        <strong>URL Parameters:</strong>
        <pre style={{ margin: "5px 0", fontSize: "11px" }}>
          {JSON.stringify(diagnostics.urlParams, null, 2)}
        </pre>
      </div>
      
      <div style={{ marginBottom: "10px" }}>
        <strong>Environment Variables:</strong>
        <pre style={{ margin: "5px 0", fontSize: "11px" }}>
          {JSON.stringify(diagnostics.envVars, null, 2)}
        </pre>
      </div>
      
      <div style={{ fontSize: "10px", opacity: 0.7 }}>
        Check browser console for more details
      </div>
    </div>
  );
}
