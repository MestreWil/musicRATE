import { RatingStars } from './RatingStars';

export interface ReviewCardProps {
  author: string;
  avatar?: string;
  rating: number;
  text: string;
  date?: string;
}

export function ReviewCard({ author, avatar, rating, text, date }: ReviewCardProps) {
  return (
    <article className="rounded-lg border border-neutral-800 bg-neutral-900 p-4 text-sm text-neutral-200">
      <header className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-full bg-neutral-700 overflow-hidden grid place-items-center text-xs">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt="" className="w-full h-full object-cover" />
          ) : (
            <span>👤</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{author}</div>
          <div className="text-[11px] text-neutral-400 truncate">{date || 'agora'}</div>
        </div>
        {/* Render estático para não enviar event handlers do Server -> Client props */}
        <div className="flex items-center gap-1 text-yellow-500">
          {Array.from({ length: 5 }).map((_, i) => (
            <svg key={i} width="18" height="18" viewBox="0 0 20 20" fill={i < rating ? 'currentColor' : 'none'} stroke="currentColor" className={i < rating ? '' : 'text-neutral-500'}>
              <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
            </svg>
          ))}
        </div>
      </header>
      <p className="text-neutral-300 text-sm leading-relaxed">{text}</p>
    </article>
  );
}
