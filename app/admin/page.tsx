"use client";

import { useEffect } from "react";

export default function AdminPage() {
  useEffect(() => {
    // In development, TinaCMS admin is accessed via the dev server
    // The cms:dev script runs both Next.js and TinaCMS
    // Access at http://localhost:3000/admin when both are running
    if (typeof window !== "undefined") {
      // Check if we're in an iframe (TinaCMS loads in iframe)
      if (window.self !== window.top) {
        // We're in an iframe, TinaCMS will handle the content
        return;
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center">
      <div className="text-white text-center max-w-md">
        <h1 className="text-2xl font-semibold mb-4">TinaCMS Admin</h1>
        <p className="text-gray-400 mb-4">
          To access the CMS admin interface, make sure you're running:
        </p>
        <code className="block bg-gray-800 px-4 py-2 rounded mb-4 text-sm">
          npm run cms:dev
        </code>
        <p className="text-sm text-gray-500">
          This will start both Next.js and TinaCMS dev servers.
          The admin interface will be available at this URL.
        </p>
      </div>
    </div>
  );
}

