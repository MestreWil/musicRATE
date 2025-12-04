'use client';

import { useEffect, useState } from 'react';
import { ReviewForm } from '@/components/ReviewForm';
import { ReviewCard } from '@/components/ReviewCard';

interface Review {
  id: string;
  rating: number;
  review_text: string | null;
  created_at: string;
  user: {
    id: string;
    display_name: string;
    email: string;
    avatar_url: string | null;
  };
}

interface ReviewStats {
  total: number;
  average_rating: number;
  rating_distribution: Record<string, number>;
}

interface TrackReviewsSectionProps {
  trackId: string;
}

export function TrackReviewsSection({ trackId }: TrackReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://127.0.0.1:8000/api';
      // Usar a rota byTarget que filtra por target_type e target_spotify_id
      const response = await fetch(`${baseUrl}/reviews/track/${trackId}`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data.reviews || []);
        setStats(data.stats || null);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackId]);

  return (
    <section className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Community Reviews</h2>
        {stats && stats.total > 0 && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(stats.average_rating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-neutral-600'
                  }`}
                  fill={i < Math.round(stats.average_rating) ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
            <span className="text-sm text-neutral-400">
              {stats.average_rating.toFixed(1)} ({stats.total} {stats.total === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="mb-8">
        <ReviewForm 
          targetType="track" 
          targetSpotifyId={trackId}
          onSuccess={fetchReviews}
        />
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-neutral-800"></div>
                <div className="flex-1">
                  <div className="h-4 bg-neutral-800 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-neutral-800 rounded w-32"></div>
                </div>
              </div>
              <div className="h-20 bg-neutral-800 rounded"></div>
            </div>
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              author={review.user.display_name}
              avatar={review.user.avatar_url || undefined}
              rating={review.rating}
              text={review.review_text || 'No review text provided.'}
              date={new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 mb-4">
            <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-neutral-200 mb-2">No reviews yet</h3>
          <p className="text-neutral-400 text-sm">Be the first to review this track!</p>
        </div>
      )}
    </section>
  );
}
