'use client';

import Image from 'next/image';
import Link from 'next/link';

interface UserReviewCardProps {
  review: {
    id: string;
    target_type: 'album' | 'track' | 'single';
    target_spotify_id: string;
    album_name?: string;
    artist_name?: string;
    album_image_url?: string | null;
    rating: number;
    review_text?: string | null;
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
    <article className="group bg-gradient-to-br from-neutral-900/90 to-neutral-900/50 border border-neutral-800/50 rounded-xl p-5 md:p-6 hover:border-red-600/50 hover:shadow-xl hover:shadow-red-900/20 hover:scale-[1.02] transition-all duration-300">
      <div className="flex flex-col sm:flex-row gap-4 md:gap-5">
        {/* Cover Image */}
        <Link href={getTargetUrl()} className="flex-shrink-0 mx-auto sm:mx-0">
          <div className="relative w-28 h-28 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-xl overflow-hidden bg-neutral-800 shadow-lg group-hover:shadow-red-900/40 transition-all duration-300">
            {review.album_image_url ? (
              <Image
                src={review.album_image_url}
                alt={review.album_name || 'Album cover'}
                width={128}
                height={128}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-600 group-hover:text-neutral-500 transition-colors">
                <svg className="w-12 h-12 md:w-14 md:h-14" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Review Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-3">
            <div className="flex-1 min-w-0 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-red-900/40 to-red-800/40 text-red-400 text-xs font-semibold rounded-full border border-red-700/30">
                  {getTypeLabel()}
                </span>
              </div>
              <Link href={getTargetUrl()} className="group/title">
                <h3 className="font-bold text-white text-lg md:text-xl mb-1 group-hover/title:text-red-500 transition-colors duration-200 line-clamp-1">
                  {review.album_name || 'Unknown Title'}
                </h3>
              </Link>
              <p className="text-neutral-400 text-sm md:text-base line-clamp-1">{review.artist_name || 'Unknown Artist'}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center sm:justify-start gap-1 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 md:w-6 md:h-6 transition-all duration-200 ${
                    i < review.rating 
                      ? 'text-yellow-400 fill-current drop-shadow-[0_0_4px_rgba(250,204,21,0.5)] group-hover:scale-110' 
                      : 'text-neutral-700'
                  }`}
                  fill={i < review.rating ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
          </div>

          {review.review_text && (
            <p className="text-neutral-300 text-sm md:text-base leading-relaxed line-clamp-2 md:line-clamp-3 mb-4 px-2 sm:px-0 text-center sm:text-left">
              {review.review_text}
            </p>
          )}

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-auto pt-3 border-t border-neutral-800/50">
            <span className="text-xs md:text-sm text-neutral-500 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(review.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <Link
              href={getTargetUrl()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-semibold rounded-lg shadow-lg shadow-red-900/30 hover:shadow-red-900/50 hover:scale-105 transition-all duration-200"
            >
              View Details
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
