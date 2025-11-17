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
      className={`rounded-full text-white text-sm px-4 py-1.5 ${following ? 'bg-neutral-700' : 'bg-red-600 hover:bg-red-500'} ${loading ? 'opacity-70' : ''}`}
      aria-pressed={following}
    >
      {following ? 'Seguindo' : 'Seguir'}
    </button>
  );
}
