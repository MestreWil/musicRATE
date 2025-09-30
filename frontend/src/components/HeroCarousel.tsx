"use client";
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Slide {
  id: string;
  title?: string;
  subtitle?: string;
  image: string;
  href?: string;
  accent?: string; // tailwind gradient accent
}

// Mock slides – futuramente substituir por fetch (ex: /api/highlights)
const slides: Slide[] = [
  {
    id: '1',
    title: 'Novo Single em Destaque',
    subtitle: 'Descubra lançamentos de artistas independentes agora',
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=60',
    href: '/tracks/t1',
    accent: 'from-red-600/80 to-pink-500/60'
  },
  {
    id: '2',
    title: 'Álbum Recomendado',
    subtitle: 'Curadoria baseada em suas avaliações recentes',
    image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1200&q=60',
    href: '/albums/al2',
    accent: 'from-indigo-600/80 to-violet-500/60'
  },
  {
    id: '3',
    title: 'Artista em Ascensão',
    subtitle: 'Acompanhe a evolução e participe avaliando',
    image: 'https://images.unsplash.com/photo-1533237264985-ee62b051b210?auto=format&fit=crop&w=1200&q=60',
    href: '/artists/a3',
    accent: 'from-emerald-600/80 to-teal-500/60'
  }
];

interface HeroCarouselProps {
  autoPlayMs?: number;
}

export function HeroCarousel({ autoPlayMs = 6000 }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = slides.length;

  const next = useCallback(() => setIndex(i => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex(i => (i - 1 + total) % total), [total]);

  // Auto play
  useEffect(() => {
    const id = setTimeout(next, autoPlayMs);
    return () => clearTimeout(id);
  }, [index, next, autoPlayMs]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  return (
    <div className="relative group rounded-xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 h-64 md:h-72 lg:h-80 shadow-sm">
      {slides.map((s, i) => {
        const active = i === index;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${active ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={!active}
          >
            <Image
              src={s.image}
              alt={s.title || 'Highlight'}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
            <div className={`absolute inset-0 bg-gradient-to-r ${s.accent || 'from-black/70 to-black/40'}`} />
            <div className="absolute inset-0 flex flex-col justify-end p-8 gap-3 text-white max-w-xl">
              {s.title && <h3 className="text-2xl md:text-3xl font-semibold drop-shadow-sm">{s.title}</h3>}
              {s.subtitle && <p className="text-sm md:text-base text-white/90 line-clamp-2">{s.subtitle}</p>}
              {s.href && (
                <Link href={s.href} className="mt-2 inline-flex w-fit items-center gap-2 bg-white/90 hover:bg-white text-neutral-900 text-sm font-medium px-4 py-2 rounded-md shadow">
                  Ver mais
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </Link>
              )}
            </div>
          </div>
        );
      })}

      {/* Dots */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-3">
        {slides.map((s, i) => (
          <button
            key={s.id}
            aria-label={`Ir para slide ${i + 1}`}
            onClick={() => setIndex(i)}
            className={`h-3 w-3 rounded-full transition ${i === index ? 'bg-red-600 scale-110' : 'bg-neutral-400 hover:bg-neutral-300'}`}
          />
        ))}
      </div>
    </div>
  );
}
