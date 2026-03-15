"use client"

import { useEffect } from "react"

export function TrackVisitor({ projectId }: { projectId: string }) {
  useEffect(() => {
    // Fire-and-forget tracking call
    fetch("/api/track", {
      method: "POST",
      body: JSON.stringify({ projectId }),
      headers: { "Content-Type": "application/json" },
      keepalive: true, // Ensures the request completes even if page is closed
    }).catch(err => console.error("Tracking failed:", err));
  }, [projectId]);

  return null;
}
