'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { UserReviewCard } from '@/components/UserReviewCard';
import { FollowButton } from '@/components/FollowButton';
import { apiGet } from '@/lib/api';
import { getSessionClient } from '@/lib/auth';
import { config } from '@/lib/config';
import { FollowersModal } from '@/components/FollowersModal';

interface Review {
  id: string;
  target_type: 'album' | 'track' | 'single';
  target_spotify_id: string;
  album_name?: string;
  artist_name?: string;
  album_image_url?: string | null;
  rating: number;
  review_text?: string | null;
  created_at: string;
}

interface UserProfile {
  id: string;
  name: string;
  username?: string;
  email?: string;
  avatar?: string | null;
  created_at: string;
  reviews_count: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const userId = params.userId as string;
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'tracks' | 'albums' | 'singles'>('all');
  const [error, setError] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isFollowModalOpen, setIsFollowModalOpen] = useState(false);
  const [followModalType, setFollowModalType] = useState<'followers' | 'following'>('followers');
  const [copySuccess, setCopySuccess] = useState(false);

  // Function to fetch followers/following counts
  const fetchCounts = async () => {
    try {
      const followersData = await apiGet<{ count: number }>(`/users/${userId}/followers`, { auth: false });
      setFollowersCount(followersData.count);
    } catch (e) {
      console.error('Error fetching followers:', e);
    }

    try {
      // Use the new endpoint that includes users + artists
      const followingData = await apiGet<{ 
        users_count: number;
        artists_count: number;
        total_count: number;
      }>(`/users/${userId}/following-total`, { auth: false });
      setFollowingCount(followingData.total_count);
    } catch (e) {
      console.error('Error fetching following:', e);
    }
  };

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = config.apiUrl;
        
        // Buscar dados do usuário
        const userResponse = await fetch(`${baseUrl}/users/${userId}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
          }
        });
        if (!userResponse.ok) {
          throw new Error('Usuário não encontrado');
        }
        const userData = await userResponse.json();
        console.log('User data from API:', userData);
        setUser(userData);

        // Check if viewing own profile
        const session = getSessionClient();
        if (session?.user?.id) {
          setIsOwnProfile(session.user.id === userId);
        }

        // Buscar reviews do usuário
        const reviewsResponse = await fetch(`${baseUrl}/reviews/user/${userId}`, {
          cache: 'no-store'
        });
        if (!reviewsResponse.ok) {
          throw new Error('Erro ao carregar reviews');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.data || []);

        // Fetch followers/following counts
        await fetchCounts();

        // Check if current user follows this user
        if (session?.user?.id && session.user.id !== userId) {
          try {
            const checkData = await apiGet<{ is_following: boolean }>(`/users/${userId}/check-following`);
            setIsFollowing(checkData.is_following);
          } catch (e) {
            console.error('Error checking following status:', e);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError(err instanceof Error ? err.message : 'Erro ao carregar perfil');
      } finally {
        setLoading(false);
      }
    }

    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);

  // Update counts periodically and on visibility change
  useEffect(() => {
    if (!userId) return;

    // Fetch counts immediately
    fetchCounts();

    // Set up interval to refresh counts every 30 seconds
    const interval = setInterval(() => {
      fetchCounts();
    }, 30000);

    // Refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchCounts();
      }
    };

    // Listen for follow/unfollow events
    const handleFollowChange = () => {
      fetchCounts();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('follow:changed', handleFollowChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('follow:changed', handleFollowChange);
    };
  }, [userId]);

  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : reviews.filter(r => {
        if (activeTab === 'tracks') return r.target_type === 'track';
        if (activeTab === 'albums') return r.target_type === 'album';
        if (activeTab === 'singles') return r.target_type === 'single';
        return true;
      });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-neutral-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold mb-2">Usuário não encontrado</h1>
          <p className="text-neutral-400 mb-6">{error}</p>
          <a href="/" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
            Voltar para Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-16">
      {/* Banner & Header */}
      <section className="relative pb-8 md:pb-12">
        {/* Banner com gradient */}
        <div className="h-48 md:h-64 bg-gradient-to-b from-red-900/20 via-neutral-900/50 to-neutral-950 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(220,38,38,0.15),transparent_50%)]" />
        </div>

        {/* Profile Info */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative -mt-20 md:-mt-24 flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden ring-4 ring-neutral-950 bg-neutral-800">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={user.name} 
                    width={160} 
                    height={160} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl md:text-5xl text-neutral-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            {/* User Info & Stats */}
            <div className="flex-1 pb-4 md:pb-0">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-1">
                    {user.name}
                  </h1>
                  <p className="text-neutral-400 text-sm md:text-base mb-3">
                    @{user.username || user.name.toLowerCase().replace(/\s+/g, '')}
                  </p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <span className="font-semibold text-neutral-100">{reviews.length}</span>
                      <span className="text-neutral-400 ml-1">reviews</span>
                    </div>
                    <button
                      onClick={() => {
                        setFollowModalType('followers');
                        setIsFollowModalOpen(true);
                      }}
                      className="hover:text-red-400 transition-colors"
                    >
                      <span className="font-semibold text-neutral-100">{followersCount}</span>
                      <span className="text-neutral-400 ml-1">followers</span>
                    </button>
                    <button
                      onClick={() => {
                        setFollowModalType('following');
                        setIsFollowModalOpen(true);
                      }}
                      className="hover:text-red-400 transition-colors"
                    >
                      <span className="font-semibold text-neutral-100">{followingCount}</span>
                      <span className="text-neutral-400 ml-1">following</span>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                {isOwnProfile ? (
                  <div className="flex items-center gap-3 mt-6 md:mt-4">
                    <button 
                      onClick={() => {
                        const profileUrl = `${window.location.origin}/profile/${userId}`;
                        navigator.clipboard.writeText(profileUrl);
                        setCopySuccess(true);
                        setTimeout(() => setCopySuccess(false), 2000);
                      }}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      {copySuccess ? '✓ Copiado!' : 'Share Profile'}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 mt-6 md:mt-4">
                    <FollowButton userId={userId} initialFollowing={isFollowing} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="border-b border-neutral-800">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'all'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-neutral-300'
              }`}
            >
              All Reviews
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'albums'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-neutral-300'
              }`}
            >
              Albums
            </button>
            <button
              onClick={() => setActiveTab('singles')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'singles'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-neutral-300'
              }`}
            >
              Singles
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'tracks'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-neutral-300'
              }`}
            >
              Tracks
            </button>
          </nav>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {filteredReviews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredReviews.map((review) => (
              <UserReviewCard key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-neutral-300 mb-2">
              Nenhuma review ainda
            </h3>
            <p className="text-neutral-500">
              {user.name} ainda não fez nenhuma avaliação.
            </p>
          </div>
        )}
      </section>

      {/* Followers/Following Modal */}
      <FollowersModal
        isOpen={isFollowModalOpen}
        onClose={() => setIsFollowModalOpen(false)}
        userId={userId}
        type={followModalType}
      />
    </div>
  );
}
