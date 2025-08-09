/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure for proxy environments
  experimental: {
    serverActions: {
      allowedOrigins: ['183.82.144.125', 'localhost:3000'],
      bodySizeLimit: '2mb',
    },
  },
  // Trust proxy headers
  serverRuntimeConfig: {
    trustProxy: true,
  },
  // Additional headers configuration
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ]
  },
}

export default nextConfig
