"use client";
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from '@/lib/api';
import { buildLoginPath, getSessionClient } from '@/lib/auth';

interface FollowButtonProps {
  artistId: string;
  initialFollowing?: boolean;
}

export function FollowButton({ artistId, initialFollowing = false }: Readonly<FollowButtonProps>) {
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState(initialFollowing);
  const router = useRouter();

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
      // Generic endpoint; adjust on backend as needed
      await apiPost('/follows', { entityType: 'artist', entityId: artistId });
      setFollowing(true);
      router.refresh();
    } catch (e) {
      // noop for now; could surface toast later
    } finally {
      setLoading(false);
    }
  }, [artistId, loading, router]);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className={`
        w-full py-2.5 px-5 rounded-lg font-bold text-sm transition-all duration-200
        ${following 
          ? 'bg-neutral-800/80 hover:bg-neutral-700/80 text-white border border-neutral-600' 
          : 'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg'
        }
        ${loading ? 'opacity-70 cursor-wait' : 'cursor-pointer'}
        disabled:opacity-50 disabled:cursor-not-allowed
      `}
      aria-pressed={following}
    >
      {loading ? '...' : following ? 'Following' : 'Follow'}
    </button>
  );
}
