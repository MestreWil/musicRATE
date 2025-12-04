"use client";
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Slide {
  id: string;
  type: 'artist' | 'album' | 'track';
  title: string;
  subtitle?: string;
  image: string;
  href: string;
  accent: string;
  stats?: {
    followers?: string;
    tracks?: number;
    popularity?: number;
    releaseDate?: string;
  };
}

interface HeroCarouselProps {
  slides: Slide[];
  autoPlayMs?: number;
}

export function HeroCarousel({ slides, autoPlayMs = 5000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = slides.length;

  const next = useCallback(() => setIndex(i => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex(i => (i - 1 + total) % total), [total]);

  // Auto play
  useEffect(() => {
    if (isPaused || total === 0) return;
    const id = setTimeout(next, autoPlayMs);
    return () => clearTimeout(id);
  }, [index, next, autoPlayMs, isPaused, total]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  if (slides.length === 0) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-neutral-900 to-neutral-800 h-[300px] md:h-[400px] lg:h-[480px] shadow-2xl flex items-center justify-center">
        <div className="text-center text-neutral-500">
          <div className="text-6xl mb-4">🎵</div>
          <p>Carregando destaques...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative group rounded-2xl overflow-hidden h-[300px] md:h-[400px] lg:h-[480px] shadow-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => {
        const active = i === index;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ${
              active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
            }`}
            aria-hidden={!active}
          >
            {/* Background Image with Ken Burns effect */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1400px"
                className={`object-cover transition-transform duration-[8000ms] ${
                  active ? 'scale-110' : 'scale-100'
                }`}
              />
              {/* Gradient overlays */}
              <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-12 lg:p-16 pb-16 sm:pb-20 md:pb-12 lg:pb-16">
              <div className="max-w-2xl space-y-3 md:space-y-4">
                {/* Type Badge */}
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600/90 backdrop-blur-sm text-white text-xs font-semibold rounded-full uppercase tracking-wide">
                    {slide.type === 'artist' && '🎤 Artista'}
                    {slide.type === 'album' && '💿 Álbum'}
                    {slide.type === 'track' && '🎵 Faixa'}
                  </span>
                  {slide.stats?.popularity && slide.stats.popularity > 70 && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-500/90 backdrop-blur-sm text-black text-xs font-bold rounded-full">
                      🔥 Em alta
                    </span>
                  )}
                </div>

                {/* Title */}
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white drop-shadow-2xl leading-tight">
                  {slide.title}
                </h2>

                {/* Subtitle */}
                {slide.subtitle && (
                  <p className="text-base sm:text-lg md:text-xl text-white/90 drop-shadow-lg line-clamp-2">
                    {slide.subtitle}
                  </p>
                )}

                {/* Stats */}
                {slide.stats && (
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-white/80">
                    {slide.stats.followers && (
                      <div className="flex items-center gap-1.5">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                          <circle cx="9" cy="7" r="4"/>
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                        </svg>
                        <span className="font-semibold">{slide.stats.followers}</span>
                      </div>
                    )}
                    {slide.stats.tracks && (
                      <>
                        <span className="text-white/40">•</span>
                        <span>{slide.stats.tracks} {slide.stats.tracks === 1 ? 'faixa' : 'faixas'}</span>
                      </>
                    )}
                    {slide.stats.releaseDate && (
                      <>
                        <span className="text-white/40">•</span>
                        <span>{new Date(slide.stats.releaseDate).getFullYear()}</span>
                      </>
                    )}
                  </div>
                )}

                {/* CTA Button */}
                <div className="pt-2">
                  <Link 
                    href={slide.href}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white hover:bg-red-600 text-black hover:text-white font-semibold rounded-full transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
                  >
                    <span>Ver agora</span>
                    <svg 
                      width="18" 
                      height="18" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      className="group-hover:translate-x-1 transition-transform"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={next}
        aria-label="Próximo slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>

      {/* Dots Navigation */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full z-10">
        {slides.map((slide, i) => (
          <button
            key={slide.id}
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === index 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/70 w-2'
            }`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      {!isPaused && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
          <div 
            className="h-full bg-red-600 transition-all"
            style={{
              width: '100%',
              animation: `progress ${autoPlayMs}ms linear`,
            }}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
