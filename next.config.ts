import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Allow Vercel Blob Storage URLs in production
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Keep unoptimized off so Next.js can optimize remote images
    unoptimized: false,
  },
}

export default nextConfig
