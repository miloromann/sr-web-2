"use client";

import { useEffect } from "react";

/** Registers the service worker that caches videos + static assets. */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Local `next dev` often fights SW caching — skip there
    if (process.env.NODE_ENV !== "production") return;

    const register = () => {
      void navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration optional */
      });
    };

    if (document.readyState === "complete") register();
    else window.addEventListener("load", register, { once: true });
  }, []);

  return null;
}
