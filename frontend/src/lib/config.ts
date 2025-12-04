// Configuração centralizada da aplicação
export const config = {
  // URL da API backend - usa NEXT_PUBLIC_API_URL (Vercel) ou NEXT_PUBLIC_BACKEND_API_BASE_URL (local)
  apiUrl: process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://localhost:8000/api',
  
  // URL base do app frontend
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
} as const;
