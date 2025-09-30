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
    ref.current.scrollBy({ left: dir * itemWidth * 3, behavior: 'smooth' });
  }
  return (
    <section className="space-y-4">
      {title && <h2 className="text-base font-semibold tracking-tight flex items-center gap-4">{title}</h2>}
      <div className="relative">
        <div ref={ref} className="flex gap-4 overflow-x-auto scrollbar-thin pb-2" style={{ scrollSnapType: 'x proximity' }}>
          {children}
        </div>
        <button onClick={() => scroll(-1)} className="hidden md:grid place-items-center absolute left-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:scale-105">‹</button>
        <button onClick={() => scroll(1)} className="hidden md:grid place-items-center absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-neutral-200 dark:bg-neutral-700 hover:scale-105">›</button>
      </div>
    </section>
  );
}
