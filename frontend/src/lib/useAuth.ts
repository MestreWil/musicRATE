'use client';

import { useEffect, useState } from 'react';
import { config } from './config';

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
      const token = localStorage.getItem('sanctum_token');
      
      console.log('🔐 useAuth: Checking authentication...');
      console.log('🔑 Token from localStorage:', token ? `${token.substring(0, 20)}...` : 'NULL');
      
      if (!token) {
        console.log('❌ No token found');
        setAuthState({
          authenticated: false,
          user: null,
          loading: false,
        });
        return;
      }

      console.log('🌐 Calling:', `${config.apiUrl}/auth/me`);
      
      const response = await fetch(`${config.apiUrl}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        cache: 'no-store',
      });

      console.log('📡 Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('📦 Response data:', data);
        
        if (data.authenticated && data.user) {
          console.log('✅ User authenticated:', data.user.name);
          
          // Cache user data in localStorage for getSessionClient()
          localStorage.setItem('user_data', JSON.stringify(data.user));
          
          setAuthState({
            authenticated: true,
            user: data.user,
            loading: false,
          });
          return;
        }
      }

      // Token inválido, remover
      console.warn('⚠️ Token invalid, removing...');
      localStorage.removeItem('sanctum_token');
      localStorage.removeItem('user_data');
      setAuthState({
        authenticated: false,
        user: null,
        loading: false,
      });
    } catch (error) {
      console.error('❌ Auth check failed:', error);
      localStorage.removeItem('sanctum_token');
      localStorage.removeItem('user_data');
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

  const logout = async () => {
    try {
      const token = localStorage.getItem('sanctum_token');
      
      if (token) {
        const baseUrl = config.apiUrl;
        await fetch(`${baseUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('sanctum_token');
      localStorage.removeItem('user_data');
      setAuthState({
        authenticated: false,
        user: null,
        loading: false,
      });
      window.location.href = '/';
    }
  };

  return {
    ...authState,
    logout,
    refetch: checkAuth, // Allow manual refetch after login
  };
}
