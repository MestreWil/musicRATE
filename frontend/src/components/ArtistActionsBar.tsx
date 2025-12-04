'use client';

import { useState, useEffect } from 'react';
import { FollowButton } from './FollowButton';

interface ArtistActionsBarProps {
  artistId: string;
}

export function ArtistActionsBar({ artistId }: ArtistActionsBarProps) {
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down & past threshold
        setIsNavbarVisible(false);
      } else {
        // Scrolling up
        setIsNavbarVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <section 
      className={`bg-black/40 backdrop-blur-sm border-b border-neutral-800 sticky z-30 transition-all duration-300 ${
        isNavbarVisible ? 'top-20' : 'top-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          <button 
            className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 hover:scale-105 transition-all shadow-lg"
            aria-label="Play"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>

          <FollowButton artistId={artistId} />

          <button 
            className="p-3 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Mais opções"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="19" cy="12" r="2"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
