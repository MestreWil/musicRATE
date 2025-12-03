"use client";
import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  targetType: 'album' | 'track' | 'single';
  targetSpotifyId: string;
  existingReview?: {
    id: string;
    rating: number;
    review_text: string;
  };
  onSuccess?: () => void;
}

export function ReviewForm({ targetType, targetSpotifyId, existingReview, onSuccess }: ReviewFormProps) {
  const { authenticated, loading: authLoading } = useAuth();
  const router = useRouter();
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState(existingReview?.review_text || '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authenticated) {
      router.push(`/login?return_to=${window.location.pathname}`);
      return;
    }

    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess(false);

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
      const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || 'http://127.0.0.1:8000/api';
      
      // Get CSRF cookie first for Sanctum authentication
      await fetch(`${backendUrl}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });
      
      const url = existingReview 
        ? `${baseUrl}/reviews/${existingReview.id}`
        : `${baseUrl}/reviews`;
      
      const method = existingReview ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          target_type: targetType,
          target_spotify_id: targetSpotifyId,
          rating,
          review_text: reviewText || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if it's a new review
      if (!existingReview) {
        setRating(0);
        setReviewText('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-800 rounded w-1/4 mb-4"></div>
          <div className="h-10 bg-neutral-800 rounded mb-4"></div>
          <div className="h-32 bg-neutral-800 rounded"></div>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 text-center">
        <h3 className="text-lg font-semibold text-neutral-200 mb-2">Sign in to leave a review</h3>
        <p className="text-neutral-400 text-sm mb-4">
          You need to be signed in with Spotify to rate and review music
        </p>
        <button
          onClick={() => router.push(`/login?return_to=${window.location.pathname}`)}
          className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors"
        >
          Sign in with Spotify
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-neutral-100 mb-4">
        {existingReview ? 'Edit Your Review' : 'Write a Review'}
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Stars */}
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Your Rating *
          </label>
          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
              >
                <svg
                  className={`w-8 h-8 md:w-10 md:h-10 ${
                    star <= (hoverRating || rating)
                      ? 'text-yellow-500 fill-current'
                      : 'text-neutral-600'
                  }`}
                  fill={star <= (hoverRating || rating) ? 'currentColor' : 'none'}
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
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-neutral-400">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
        </div>

        {/* Review Text */}
        <div>
          <label htmlFor="review-text" className="block text-sm font-medium text-neutral-300 mb-2">
            Your Review (Optional)
          </label>
          <textarea
            id="review-text"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            maxLength={2000}
            rows={6}
            placeholder="Share your thoughts about this music..."
            className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
          />
          <div className="mt-1 text-xs text-neutral-500 text-right">
            {reviewText.length}/2000
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-800 rounded-lg p-3">
            <p className="text-sm text-green-400">
              {existingReview ? 'Review updated successfully!' : 'Review submitted successfully!'}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || rating === 0}
            className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-500 disabled:bg-neutral-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : existingReview ? (
              'Update Review'
            ) : (
              'Submit Review'
            )}
          </button>
          
          {existingReview && (
            <button
              type="button"
              onClick={() => {
                setRating(existingReview.rating);
                setReviewText(existingReview.review_text);
                setError('');
                setSuccess(false);
              }}
              className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
