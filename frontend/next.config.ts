import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
