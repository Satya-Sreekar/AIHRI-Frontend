/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for CloudFront deployment
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Configure for CloudFront deployment
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', '*.cloudfront.net', '*.amazonaws.com'],
      bodySizeLimit: '2mb',
    },
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
