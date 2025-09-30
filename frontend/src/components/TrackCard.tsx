import Link from 'next/link';
import { Track } from '@/lib/types';

export function TrackCard({ track }: { track: Track }) {
  return (
    <Link href={`/tracks/${track.id}`} className="w-44 p-3 rounded-lg border border-border hover:shadow-sm transition bg-background/70 flex flex-col gap-2">
      <div className="aspect-square w-full rounded-md bg-neutral-200 dark:bg-neutral-800 grid place-items-center text-xs text-neutral-500">
        Cover
      </div>
      <div className="min-w-0 flex flex-col">
        <h3 className="text-sm font-medium truncate hover:underline">{track.name}</h3>
        <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{track.artists.map(a => a.name).join(', ')}</p>
      </div>
    </Link>
  );
}
