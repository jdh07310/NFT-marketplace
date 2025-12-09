import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.externals.push(
      'pino-pretty',
      'lokijs',
      'encoding',
      '@react-native-async-storage/async-storage'
    );
    return config;
  },
};

export default nextConfig;
