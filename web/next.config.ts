import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    // TODO: re-enable once existing lint errors are cleared
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Kept from the previous next.config.js so existing builds don't break.
    // TODO: set to false after the remaining type errors are fixed.
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
};

export default nextConfig;
