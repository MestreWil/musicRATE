'use client';

import { useAudio } from '@/contexts/AudioContext';
import Image from 'next/image';

export function AudioPlayer() {
  const { currentTrack, isPlaying, currentTime, duration, pause, resume, next, previous, seek } = useAudio();

  if (!currentTrack) return null;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50">
      <div className="max-w-screen-2xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Track Info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {currentTrack.image && (
              <div className="w-14 h-14 relative rounded overflow-hidden shrink-0">
                <Image 
                  src={currentTrack.image} 
                  alt={currentTrack.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-neutral-100 truncate">
                {currentTrack.name}
              </div>
              <div className="text-xs text-neutral-400 truncate">
                {currentTrack.artist}
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-col items-center gap-2 flex-1">
            <div className="flex items-center gap-4">
              <button
                onClick={previous}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Previous"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/>
                </svg>
              </button>

              <button
                onClick={isPlaying ? pause : resume}
                className="w-10 h-10 rounded-full bg-white text-black hover:scale-105 transition-transform flex items-center justify-center"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              <button
                onClick={next}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Next"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/>
                </svg>
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full flex items-center gap-2">
              <span className="text-xs text-neutral-400 w-10 text-right">
                {formatTime(currentTime)}
              </span>
              <div className="flex-1 h-1 bg-neutral-700 rounded-full overflow-hidden group cursor-pointer">
                <div 
                  className="h-full bg-white group-hover:bg-red-500 transition-colors"
                  style={{ width: `${progress}%` }}
                  onClick={(e) => {
                    const rect = e.currentTarget.parentElement!.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const percentage = x / rect.width;
                    seek(percentage * duration);
                  }}
                />
              </div>
              <span className="text-xs text-neutral-400 w-10">
                {formatTime(duration)}
              </span>
            </div>
          </div>

          {/* Spacer for symmetry */}
          <div className="flex-1" />
        </div>
      </div>
    </div>
  );
}
