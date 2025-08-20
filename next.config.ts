import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // next.config.js

  experimental: { serverComponentsExternalPackages: ["pdf-parse"] },

};

export default nextConfig;
