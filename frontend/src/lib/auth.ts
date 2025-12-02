// Simple auth helpers optimized for backend OAuth integration
// NOTE: Do not store any Spotify secrets in the frontend.

export type Session = {
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
} | null;

// Detects a session using a backend-set cookie (e.g., `mr_session=<token>`)
// This is a harmless stub; real session fetching should come from the backend.
export function getSessionClient(): Session {
  if (typeof document === 'undefined') return null;
  const hasCookie = document.cookie.split('; ').some((c) => c.startsWith('mr_session='));
  if (!hasCookie) return null;
  return { user: { id: 'me', name: 'You' } };
}

// Build the backend OAuth start URL with "redirect_uri" (frontend callback) and optional return path.
export function getSpotifyLoginUrl(returnTo?: string): string {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://127.0.0.1:8000/api';
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
