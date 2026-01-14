// Next.js configuration
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // Use Webpack instead of Turbopack for build
  // Turbopack has path resolution issues with Vercel Root Directory setting
  experimental: {
    bundlePagesRouterDependencies: true,
  },
}

export default nextConfig
