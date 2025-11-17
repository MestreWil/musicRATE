import Link from 'next/link';
import Image from 'next/image';
import { Track } from '@/lib/types';

// Futuro: trocar para buscar dados dinâmicos da API (getTrackDetail)
export function TrackCard({ track }: { track: Track }) {
  return (
    <Link
      href={`/tracks/${track.id}`}
      className="w-44 p-3 rounded-lg border border-border hover:shadow-sm transition bg-background/70 flex flex-col gap-2"
      prefetch={false} // para evitar prefetch massivo em listas grandes
    >
      <div className="aspect-square w-full rounded-md bg-neutral-200 dark:bg-neutral-800 grid place-items-center text-xs text-neutral-500 overflow-hidden">
        {/* Quando integrar API, usar track.image se disponível */}
        {track.image ? (
          <Image src={track.image} alt={track.name} fill className="object-cover" />
        ) : (
          'Cover'
        )}
      </div>
      <div className="min-w-0 flex flex-col">
        <h3 className="text-sm font-medium truncate hover:underline">{track.name}</h3>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{track.artists.map(a => a.name).join(', ')}</p>
      </div>
    </Link>
  );
}
