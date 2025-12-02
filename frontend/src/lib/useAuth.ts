'use client';

import { useEffect, useState } from 'react';

interface SpotifyUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  authenticated: boolean;
  user: SpotifyUser | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    authenticated: false,
    user: null,
    loading: true,
  });

  const checkAuth = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://127.0.0.1:8000/api';
      const response = await fetch(`${baseUrl}/auth/me`, {
        method: 'GET',
        credentials: 'include', // Important: send cookies with request
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setAuthState({
            authenticated: true,
            user: data.user,
            loading: false,
          });
          return;
        }
      }

      // Not authenticated
      setAuthState({
        authenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        authenticated: false,
        user: null,
        loading: false,
      });
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen for login events from callback page
    const handleAuthLogin = () => {
      checkAuth();
    };

    window.addEventListener('auth:login', handleAuthLogin);
    return () => window.removeEventListener('auth:login', handleAuthLogin);
  }, []);

  return {
    ...authState,
    refetch: checkAuth, // Allow manual refetch after login
  };
}
