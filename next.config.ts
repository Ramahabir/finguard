import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // This makes `next build` skip ESLint errors during production builds
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
