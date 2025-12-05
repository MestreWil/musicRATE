'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { apiGet } from '@/lib/api';

interface UserFollow {
  id: string;
  name: string;
  username?: string;
  avatar?: string | null;
  created_at: string;
}

interface ArtistFollow {
  spotify_artist_id: string;
  artist_name: string;
  artist_image_url?: string | null;
  followed_at: string;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  type: 'followers' | 'following';
}

export function FollowersModal({ isOpen, onClose, userId, type }: FollowersModalProps) {
  const [users, setUsers] = useState<UserFollow[]>([]);
  const [artists, setArtists] = useState<ArtistFollow[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'artists'>('users');

  useEffect(() => {
    if (!isOpen) return;

    async function fetchData() {
      setLoading(true);
      try {
        if (type === 'followers') {
          // Followers são apenas usuários
          const data = await apiGet<{ followers: UserFollow[] }>(`/users/${userId}/followers`);
          setUsers(data.followers || []);
          setArtists([]);
        } else {
          // Following pode ser usuários e artistas
          const [usersData, artistsData] = await Promise.all([
            apiGet<{ following: UserFollow[] }>(`/users/${userId}/following`).catch(() => ({ following: [] })),
            apiGet<{ artists: ArtistFollow[] }>(`/users/${userId}/following-artists`).catch(() => ({ artists: [] }))
          ]);
          setUsers(usersData.following || []);
          setArtists(artistsData.artists || []);
        }
      } catch (error) {
        console.error('Error fetching follow data:', error);
        setUsers([]);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isOpen, userId, type]);

  if (!isOpen) return null;

  const totalCount = users.length + artists.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-neutral-900 rounded-lg shadow-xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800">
          <h2 className="text-xl font-bold text-white">
            {type === 'followers' ? 'Seguidores' : 'Seguindo'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-neutral-800 rounded-full transition-colors"
            aria-label="Fechar"
          >
            <svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs (only for following) */}
        {type === 'following' && (users.length > 0 || artists.length > 0) && (
          <div className="flex border-b border-neutral-800">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-neutral-300'
              }`}
            >
              Usuários ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`flex-1 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'artists'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-neutral-300'
              }`}
            >
              Artistas ({artists.length})
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : totalCount === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">👥</div>
              <p className="text-neutral-400">
                {type === 'followers' 
                  ? 'Nenhum seguidor ainda' 
                  : 'Não está seguindo ninguém ainda'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Users List */}
              {(type === 'followers' || activeTab === 'users') && users.map((user) => (
                <Link
                  key={user.id}
                  href={`/profile/${user.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-800/50 rounded-lg transition-colors group"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-800 flex-shrink-0">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg text-neutral-600">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white group-hover:text-red-400 transition-colors truncate">
                      {user.name}
                    </p>
                    <p className="text-sm text-neutral-500 truncate">
                      @{user.username || user.name.toLowerCase().replace(/\s+/g, '')}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}

              {/* Artists List */}
              {type === 'following' && activeTab === 'artists' && artists.map((artist) => (
                <Link
                  key={artist.spotify_artist_id}
                  href={`/artists/${artist.spotify_artist_id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 hover:bg-neutral-800/50 rounded-lg transition-colors group"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-800 flex-shrink-0">
                    {artist.artist_image_url ? (
                      <Image
                        src={artist.artist_image_url}
                        alt={artist.artist_name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg text-neutral-600">
                        🎤
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white group-hover:text-red-400 transition-colors truncate">
                      {artist.artist_name}
                    </p>
                    <p className="text-sm text-neutral-500">
                      Artista
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-neutral-600 group-hover:text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
