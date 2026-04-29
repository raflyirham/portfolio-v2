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
};

export default nextConfig;
