"use client";

import { useEffect } from "react";

export function VisitorTracker({ projectId }: { projectId: string }) {
  useEffect(() => {
    const record = async () => {
      try {
        await fetch("/api/visit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ projectId })
        });
      } catch {
        // non-blocking, ignore failures
      }
    };

    record();
  }, [projectId]);

  return null;
}

