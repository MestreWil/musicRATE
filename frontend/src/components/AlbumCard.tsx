import Image from 'next/image';
import Link from 'next/link';

export interface AlbumCardProps {
  id: string;
  name: string;
  image?: string | null;
  artists?: { id: string; name: string }[];
  releaseDate?: string;
  totalTracks?: number;
  avgRating?: number;
}

export function AlbumCard({ id, name, image, artists, releaseDate, totalTracks, avgRating }: Readonly<AlbumCardProps>) {
  return (
    <Link 
      href={`/albums/${id}`} 
      className="group flex-shrink-0 w-[180px] sm:w-[200px] md:w-[220px] flex flex-col gap-3 p-4 rounded-lg bg-neutral-900/40 hover:bg-neutral-800/60 transition-all duration-200 cursor-pointer"
    >
      {/* Album Cover */}
      <div className="relative w-full aspect-square rounded-md overflow-hidden bg-neutral-800 shadow-lg">
        {image ? (
          <Image 
            src={image} 
            alt={name} 
            fill 
            sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, 220px" 
            className="object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-sm text-neutral-500">
            <span>🎵</span>
          </div>
        )}
      </div>

      {/* Album Info */}
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="font-semibold text-sm text-white truncate group-hover:underline">
          {name}
        </h3>
        
        {artists && artists.length > 0 && (
          <p className="text-xs text-neutral-400 truncate">
            {artists.map((a) => a.name).join(', ')}
          </p>
        )}
        
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mt-0.5">
          {typeof totalTracks === 'number' && (
            <span>{totalTracks} {totalTracks === 1 ? 'faixa' : 'faixas'}</span>
          )}
          {releaseDate && typeof totalTracks === 'number' && <span>•</span>}
          {releaseDate && (
            <span>{new Date(releaseDate).getFullYear()}</span>
          )}
        </div>

        {typeof avgRating === 'number' && (
          <div className="mt-1 flex items-center gap-1 text-xs">
            <span className="text-yellow-500">★</span>
            <span className="text-white font-medium">{avgRating.toFixed(1)}</span>
            <span className="text-neutral-500">/ 5</span>
          </div>
        )}
      </div>
    </Link>
  );
}
