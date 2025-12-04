'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { UserReviewCard } from '@/components/UserReviewCard';

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

  useEffect(() => {
    async function fetchUserProfile() {
      try {
        setLoading(true);
        setError(null);

        const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://127.0.0.1:8000/api';
        
        // Buscar dados do usuário
        const userResponse = await fetch(`${baseUrl}/users/${userId}`);
        if (!userResponse.ok) {
          throw new Error('Usuário não encontrado');
        }
        const userData = await userResponse.json();
        setUser(userData);

        // Buscar reviews do usuário
        const reviewsResponse = await fetch(`${baseUrl}/reviews/user/${userId}`);
        if (!reviewsResponse.ok) {
          throw new Error('Erro ao carregar reviews');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.data || []);
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
                    <div>
                      <span className="font-semibold text-neutral-100">0</span>
                      <span className="text-neutral-400 ml-1">followers</span>
                    </div>
                    <div>
                      <span className="font-semibold text-neutral-100">0</span>
                      <span className="text-neutral-400 ml-1">following</span>
                    </div>
                  </div>
                </div>

                {/* Follow Button */}
                <div className="flex items-center gap-3 mt-6 md:mt-4">
                  <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-all hover:scale-105 shadow-lg">
                    Follow
                  </button>
                </div>
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
    </div>
  );
}
