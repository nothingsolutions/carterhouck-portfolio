import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Using server-side rendering for OAuth support
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
