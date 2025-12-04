import type { NextConfig } from "next";

// Validação de variáveis de ambiente obrigatórias
const requiredEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
};

// Log das variáveis durante build (apenas primeiros caracteres por segurança)
console.log('🔧 Environment variables check:');
Object.entries(requiredEnvVars).forEach(([key, value]) => {
  if (value) {
    console.log(`  ✅ ${key}: ${value.substring(0, 30)}...`);
  } else {
    console.log(`  ⚠️  ${key}: NOT SET (will use fallback)`);
  }
});

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
