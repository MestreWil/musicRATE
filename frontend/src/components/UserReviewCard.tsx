'use client';

import Image from 'next/image';
import Link from 'next/link';

interface UserReviewCardProps {
  review: {
    id: string;
    target_type: 'album' | 'track' | 'single';
    target_spotify_id: string;
    album_name: string;
    artist_name: string;
    album_image_url: string | null;
    rating: number;
    review_text: string | null;
    created_at: string;
  };
}

export function UserReviewCard({ review }: UserReviewCardProps) {
  const getTargetUrl = () => {
    switch (review.target_type) {
      case 'album':
      case 'single':
        return `/albums/${review.target_spotify_id}`;
      case 'track':
        return `/tracks/${review.target_spotify_id}`;
      default:
        return '#';
    }
  };

  const getTypeLabel = () => {
    switch (review.target_type) {
      case 'album':
        return 'Album';
      case 'track':
        return 'Track';
      case 'single':
        return 'Single';
      default:
        return review.target_type;
    }
  };

  return (
    <article className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-4 hover:bg-neutral-900/70 transition-colors">
      <div className="flex gap-4">
        {/* Cover Image */}
        <Link href={getTargetUrl()} className="flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-neutral-800 hover:opacity-80 transition-opacity">
            {review.album_image_url ? (
              <Image
                src={review.album_image_url}
                alt={review.album_name}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600">
                <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
            )}
          </div>
        </Link>

        {/* Review Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block px-2 py-0.5 bg-red-900/30 text-red-400 text-xs font-medium rounded">
                  {getTypeLabel()}
                </span>
              </div>
              <Link href={getTargetUrl()} className="hover:text-red-500 transition-colors">
                <h3 className="font-semibold text-neutral-100 text-lg truncate">
                  {review.album_name}
                </h3>
              </Link>
              <p className="text-neutral-400 text-sm truncate">{review.artist_name}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating ? 'text-yellow-500 fill-current' : 'text-neutral-600'
                  }`}
                  fill={i < review.rating ? 'currentColor' : 'none'}
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
          </div>

          {review.review_text && (
            <p className="text-neutral-300 text-sm leading-relaxed line-clamp-2 md:line-clamp-3 mb-3">
              {review.review_text}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>
              {new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <Link
              href={getTargetUrl()}
              className="text-red-500 hover:text-red-400 font-medium transition-colors"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
