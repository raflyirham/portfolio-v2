import type { NextConfig } from "next";

const r2PublicBaseUrl = process.env.R2_PUBLIC_BASE_URL;
const r2Hostname = r2PublicBaseUrl
  ? new URL(r2PublicBaseUrl).hostname
  : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: r2Hostname
      ? [
          {
            protocol: "https",
            hostname: r2Hostname,
          },
        ]
      : [],
  },
  // Admin project forms upload thumbnail + multiple preview images via Server Actions (default limit is 1 MB).
  experimental: {
    serverActions: {
      bodySizeLimit: "15mb",
    },
  },
};

export default nextConfig;
