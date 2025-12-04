'use client';

import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { UserReviewCard } from '@/components/UserReviewCard';
import { getMyReviews, Review } from '@/lib/reviews';

export default function UserProfilePage() {
  const { authenticated, user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'all' | 'tracks' | 'albums' | 'singles'>('all');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    // Só redireciona se terminou de carregar E não está autenticado
    if (!loading && !authenticated) {
      console.log('Redirecting to login - not authenticated');
      router.push('/login?return_to=/profile');
    } else if (authenticated && user) {
      console.log('User authenticated:', user);
    }
  }, [loading, authenticated, router, user]);

  useEffect(() => {
    // Buscar reviews do usuário da API
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const data = await getMyReviews();
        // A API retorna paginação, pegar os dados
        setReviews(data.data || []);
      } catch (error) {
        console.error('Failed to fetch reviews:', (error as any).status || error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    if (authenticated && user) {
      fetchReviews();
    }
  }, [authenticated, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!authenticated || !user) {
    return null;
  }

  const filteredReviews = activeTab === 'all' 
    ? reviews 
    : reviews.filter(r => {
        if (activeTab === 'tracks') return r.target_type === 'track';
        if (activeTab === 'albums') return r.target_type === 'album';
        if (activeTab === 'singles') return r.target_type === 'single';
        return true;
      });

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 pb-16">
      {/* Banner & Header */}
      <section className="relative">
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
              <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-green-500 border-4 border-neutral-950" 
                   title="Online" />
            </div>

            {/* User Info & Stats */}
            <div className="flex-1 pb-4 md:pb-0">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold text-neutral-100 mb-1">
                    {user.name}
                  </h1>
                  <p className="text-neutral-400 text-sm md:text-base mb-3">
                    @{user.id}
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

                {/* Action Buttons */}
                <div className="flex items-center gap-3 mt-4 md:mt-0">
                  <button className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 rounded-lg text-sm font-medium transition-colors">
                    Edit Profile
                  </button>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-medium transition-colors">
                    Share Profile
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
              onClick={() => setActiveTab('tracks')}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'tracks'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-neutral-400 hover:text-neutral-300'
              }`}
            >
              Tracks
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
          </nav>
        </div>
      </section>

      {/* Reviews List */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {reviewsLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-red-600"></div>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 mb-4">
              <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-neutral-200 mb-2">
              {activeTab === 'all' ? 'No reviews yet' : `No ${activeTab} reviews yet`}
            </h3>
            <p className="text-neutral-400 mb-6">
              Start reviewing your favorite music to see them here!
            </p>
            <Link 
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Discover Music
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredReviews.map((review) => (
              <UserReviewCard key={review.id} review={review} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
