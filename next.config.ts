import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Next.js 16: Turbopack 빈 설정 (webpack 없이)
  turbopack: {},
};

export default nextConfig;
