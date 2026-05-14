import type { NextConfig } from "next";
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
  sw: "sw.js",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "blob.vercel-storage.com",
      },
    ],
  },
  turbopack: {},
  experimental: {
    optimizePackageImports: ["@headlessui/react"],
  },
};

export default withPWA(nextConfig);
