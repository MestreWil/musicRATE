// Simple auth helpers optimized for backend OAuth integration
// NOTE: Do not store any Spotify secrets in the frontend.

import { config } from './config';

export type Session = {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
} | null;

// Detects a session using localStorage sanctum_token
export function getSessionClient(): Session {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('sanctum_token');
  if (!token) return null;
  
  // Try to get user data from localStorage cache
  const userDataStr = localStorage.getItem('user_data');
  if (userDataStr) {
    try {
      const userData = JSON.parse(userDataStr);
      return { user: { id: userData.id, name: userData.name, avatar: userData.avatar } };
    } catch (e) {
      console.error('Failed to parse user_data:', e);
    }
  }
  
  // Fallback: token exists but no user data cached
  return { user: { id: 'unknown', name: 'User' } };
}

// Build the backend OAuth start URL with "redirect_uri" (frontend callback) and optional return path.
export function getSpotifyLoginUrl(returnTo?: string): string {
  const base = config.apiUrl;
  // Frontend callback path (the backend should redirect here after finishing OAuth and setting cookies)
  const frontendCallback =
    typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '/auth/callback';
  const rt =
    returnTo || (typeof window !== 'undefined' ? window.location.href : '/');

  // Construir URL corretamente: base já tem /api, então adicionar /auth/spotify
  const authUrl = `${base}/auth/spotify`;
  const url = new URL(authUrl);
  url.searchParams.set('redirect_uri', frontendCallback);
  url.searchParams.set('return_to', rt);
  return url.toString();
}

// Build a frontend login path including the original location
export function buildLoginPath(returnTo?: string): string {
  const rt =
    returnTo || (typeof window !== 'undefined' ? window.location.href : '/');
  const encoded = encodeURIComponent(rt);
  return `/login?return_to=${encoded}`;
}
