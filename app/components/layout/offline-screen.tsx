"use client";

import { useState, useEffect } from "react";

export function OfflineScreen() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);

    setOffline(!navigator.onLine);

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--bg)]">
      <div className="text-center px-6 max-w-[400px]">
        {/* Disconnected icon */}
        <div className="w-16 h-16 rounded-[var(--card-r)] bg-[var(--surface)] grid place-items-center mx-auto mb-6">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--fg-3)"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 1l22 22" />
            <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55" />
            <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39" />
            <path d="M10.71 5.05A16 16 0 0 1 22.56 9" />
            <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
            <path d="M12 20h.01" />
          </svg>
        </div>

        <h1 className="font-display font-extrabold text-2xl tracking-tight mb-2 text-fg">
          You&apos;re offline
        </h1>
        <p className="text-sm text-fg-2 mb-8 leading-relaxed">
          Check your internet connection and try again.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
