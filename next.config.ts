import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  transpilePackages:[
    '@tomo-inc/tomo-evm-kit',
    '@tomo-wallet/uikit-lite',
    '@tomo-inc/shared-type',
  ]
}

export default nextConfig