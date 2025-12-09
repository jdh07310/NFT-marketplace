import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  // Next.js 16: turbopack 설정으로 webpack externals 처리
  turbopack: {
    resolveAlias: {
      'pino-pretty': false,
      'lokijs': false,
      'encoding': false,
    },
  },
};

export default nextConfig;
