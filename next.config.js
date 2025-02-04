/** @type {import('next').NextConfig} */
const nextConfig = {
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['hebbkx1anhila5yf.public.blob.vercel-storage.com'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    }
  },
  serverExternalPackages: ['pdf-parse'],
  typescript: {
    ignoreBuildErrors: false
  }
}

module.exports = nextConfig 