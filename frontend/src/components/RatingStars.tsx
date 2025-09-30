"use client";
import { useState, useId } from 'react';

interface RatingStarsProps {
  value?: number;
  max?: number;
  onChange?: (n: number) => void;
  size?: number;
}

export function RatingStars({ value = 0, max = 5, onChange, size = 18 }: RatingStarsProps) {
  const [hover, setHover] = useState<number | null>(null);
  const name = useId();
  return (
    <fieldset className="flex items-center gap-1" aria-label="Avaliação">
      <legend className="sr-only">Avaliação</legend>
      {Array.from({ length: max }).map((_, i) => {
        const n = i + 1;
        const active = hover ? n <= hover : n <= value;
        return (
          <label key={n} className="cursor-pointer">
            <span className="sr-only">{n} estrela{n > 1 ? 's' : ''}</span>
            <input
              type="radio"
              className="sr-only"
              name={name}
              value={n}
              checked={value === n}
              onChange={() => onChange?.(n)}
              onFocus={() => setHover(n)}
              onBlur={() => setHover(null)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(null)}
            />
            <div className="transition-transform hover:scale-110" style={{ lineHeight: 0 }}>
              <svg width={size} height={size} viewBox="0 0 20 20" fill={active ? 'currentColor' : 'none'} stroke="currentColor" className={active ? 'text-yellow-500' : 'text-neutral-400'}>
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
              </svg>
            </div>
          </label>
        );
      })}
    </fieldset>
  );
}
