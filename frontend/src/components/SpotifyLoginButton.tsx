"use client";
import { useCallback } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { getSpotifyLoginUrl } from '@/lib/auth';

export function SpotifyLoginButton({ className = '' }: { className?: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onClick = useCallback(() => {
    const qs = searchParams?.toString() || '';
    const current = `${window.location.origin}${pathname}${qs ? `?${qs}` : ''}`;
    const returnTo = searchParams?.get('return_to') || current;
    const url = getSpotifyLoginUrl(returnTo);
    window.location.href = url; // full redirect to backend OAuth start
  }, [pathname, searchParams]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold h-11 rounded-md shadow ${className}`}
      aria-label="Continue with Spotify"
    >
      {/* Spotify logo */}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.49 17.35a.75.75 0 0 1-1.03.25 13.26 13.26 0 0 0-6.92-1.6 13.2 13.2 0 0 0-3.73.58.75.75 0 1 1-.43-1.43 14.7 14.7 0 0 1 4.16-.65c2.77 0 5.26.63 7.33 1.88.35.21.46.66.22.97zm1.36-2.78a.93.93 0 0 1-1.27.31c-2.2-1.35-4.76-2.06-7.58-2.06-1.61 0-3.23.23-4.82.7a.93.93 0 0 1-1.17-.64.94.94 0 0 1 .64-1.17 16.6 16.6 0 0 1 5.35-.78c3.18 0 6.04.79 8.51 2.36.44.27.58.86.34 1.28zm.18-2.99a1.11 1.11 0 0 1-1.52.38c-2.52-1.55-5.5-2.37-8.86-2.37-1.83 0-3.68.23-5.49.69a1.11 1.11 0 0 1-.54-2.16 24.4 24.4 0 0 1 6.03-.77c3.79 0 7.18.91 10.07 2.71a1.11 1.11 0 0 1 .31 1.52z" />
      </svg>
      Continue with Spotify
    </button>
  );
}
