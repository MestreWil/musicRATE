"use client";
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost, apiDelete, apiGet } from '@/lib/api';
import { buildLoginPath, getSessionClient } from '@/lib/auth';

interface FollowButtonProps {
  userId?: string; // For following users
  artistId?: string; // For following artists
  initialFollowing?: boolean;
}

export function FollowButton({ userId, artistId, initialFollowing = false }: Readonly<FollowButtonProps>) {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(initialFollowing);
  const [checkingStatus, setCheckingStatus] = useState(true);
  const router = useRouter();

  // Check following status on mount if user is authenticated
  useEffect(() => {
    const checkFollowingStatus = async () => {
      const session = getSessionClient();
      if (!session) {
        setCheckingStatus(false);
        return;
      }

      try {
        if (artistId) {
          const data = await apiGet<{ is_following: boolean }>(`/artists/${artistId}/check-following`);
          setFollowing(data.is_following);
        } else if (userId) {
          const data = await apiGet<{ is_following: boolean }>(`/users/${userId}/check-following`);
          setFollowing(data.is_following);
        }
      } catch (e) {
        console.error('[FollowButton] Error checking status:', e);
      } finally {
        setCheckingStatus(false);
      }
    };

    checkFollowingStatus();
  }, [userId, artistId]);

  const onClick = useCallback(async () => {
    if (loading) return;

    // Lazy auth: if no session, go to login and return here afterwards
    if (!getSessionClient()) {
      const href = typeof window !== 'undefined' ? window.location.href : '/';
      window.location.href = buildLoginPath(href);
      return;
    }

    try {
      setLoading(true);
      
      if (userId) {
        // Follow/unfollow user
        if (following) {
          await apiDelete(`/users/${userId}/unfollow`);
          setFollowing(false);
        } else {
          await apiPost(`/users/${userId}/follow`, {});
          setFollowing(true);
        }
        
        // Dispatch event to update counts on profile pages
        window.dispatchEvent(new CustomEvent('follow:changed'));
      } else if (artistId) {
        // Follow/unfollow artist
        if (following) {
          await apiDelete(`/artists/${artistId}/unfollow`);
          setFollowing(false);
        } else {
          await apiPost(`/artists/${artistId}/follow`, {});
          setFollowing(true);
        }
        
        // Dispatch event to update counts on profile pages
        window.dispatchEvent(new CustomEvent('follow:changed'));
      }
      
      router.refresh();
    } catch (e) {
      console.error('[FollowButton] Error:', e);
    } finally {
      setLoading(false);
    }
  }, [userId, artistId, following, loading, router]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || checkingStatus}
      className={`
        w-full py-2.5 px-5 rounded-lg font-bold text-sm transition-all duration-200
        ${following 
          ? 'bg-neutral-800/80 hover:bg-neutral-700/80 text-white border border-neutral-600' 
          : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
        }
        ${(loading || checkingStatus) ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-pressed={following}
    >
      {(loading || checkingStatus) ? '...' : following ? 'Following' : 'Follow'}
    </button>
  );
}
