"use client";
import { PropsWithChildren, useRef } from 'react';

interface HorizontalScrollProps {
  title?: string;
  itemWidth?: number; // for arrow scroll step
}

export function HorizontalScroll({ children, title, itemWidth = 200 }: PropsWithChildren<HorizontalScrollProps>) {
  const ref = useRef<HTMLDivElement | null>(null);
  function scroll(dir: 1 | -1) {
    if (!ref.current) return;
    ref.current.scrollBy({ left: dir * itemWidth * 2.5, behavior: 'smooth' });
  }
  return (
    <section className="space-y-5">
      {title && (
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {title}
        </h2>
      )}
      <div className="relative group/scroll">
        <div 
          ref={ref} 
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pt-2 -mx-2 px-2"
          style={{ scrollSnapType: 'x proximity' }}
        >
          {children}
        </div>
        
        {/* Scroll Buttons - aparecem no hover */}
        <button 
          onClick={() => scroll(-1)} 
          className="hidden lg:grid opacity-0 group-hover/scroll:opacity-100 transition-opacity place-items-center absolute left-2 top-[40%] -translate-y-1/2 h-10 w-10 rounded-full bg-black/80 hover:bg-black hover:scale-110 text-white text-xl font-bold shadow-xl z-10"
          aria-label="Scroll left"
        >
          ‹
        </button>
        <button 
          onClick={() => scroll(1)} 
          className="hidden lg:grid opacity-0 group-hover/scroll:opacity-100 transition-opacity place-items-center absolute right-2 top-[40%] -translate-y-1/2 h-10 w-10 rounded-full bg-black/80 hover:bg-black hover:scale-110 text-white text-xl font-bold shadow-xl z-10"
          aria-label="Scroll right"
        >
          ›
        </button>
      </div>
    </section>
  );
}
