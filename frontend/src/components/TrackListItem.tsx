import { msToTime } from '@/lib/mockData';
import { Track } from '@/lib/types';
import Link from 'next/link';

export function TrackListItem({ track }: { readonly track: Track & { readonly trackNumber?: number } }) {
  return (
    <div className="flex items-center gap-3 p-2 rounded-md bg-neutral-800/60 border border-neutral-700">
      <div className="w-10 text-center text-sm text-neutral-400">{track.trackNumber ?? '-'}</div>
      <div className="h-10 w-10 rounded bg-neutral-700 grid place-items-center text-[10px] text-neutral-300">Art</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-white truncate">{track.name}</div>
        <div className="text-xs text-neutral-400 truncate">
          {track.artists.map((a, i) => (
            <span key={a.id}>
              <Link href={`/artists/${a.id}`} className="hover:underline text-white">
                {a.name}
              </Link>
              {i < track.artists.length - 1 && ', '}
            </span>
          ))}
        </div>
      </div>
      <div className="text-xs text-neutral-400">{msToTime(track.durationMs)}</div>
    </div>
  );
}
