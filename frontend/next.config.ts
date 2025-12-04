import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Desabilita ESLint durante build de produção
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Desabilita type checking durante build (opcional)
    // ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.scdn.co' },
      { protocol: 'https', hostname: 'mosaic.scdn.co' },
      { protocol: 'https', hostname: 't.scdn.co' },
      { protocol: 'https', hostname: 'campaigns-service.spotifycdn.com' },
      { protocol: 'https', hostname: '**.spotifycdn.com' },
      { protocol: 'https', hostname: 'platform-lookaside.fbsbx.com' }
    ]
  },
};

export default nextConfig;
