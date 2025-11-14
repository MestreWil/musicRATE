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
    <div className="group w-44 flex flex-col gap-2 rounded-lg border border-border p-3 hover:shadow-sm transition bg-background/70">
      <Link href={`/albums/${id}`} className="block">
        <div className="relative w-full aspect-square rounded-md overflow-hidden bg-neutral-200 dark:bg-neutral-800">
          {image ? (
            <Image src={image} alt={name} fill sizes="176px" className="object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-xs text-neutral-500">Sem capa</div>
          )}
        </div>
        <h3 className="font-medium text-sm truncate group-hover:underline mt-2">{name}</h3>
      </Link>
      <div className="flex flex-col min-w-0">
        {artists && (
          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
            {artists.map((a, i) => (
              <span key={a.id}>
                <Link href={`/artists/${a.id}`} className="hover:underline text-white">
                  {a.name}
                </Link>
                {i < artists.length - 1 && ', '}
              </span>
            ))}
          </p>
        )}
        {releaseDate && (
          <p className="text-[10px] text-neutral-400 mt-1">{releaseDate}</p>
        )}
        {typeof totalTracks === 'number' && (
          <p className="text-[10px] text-neutral-400">{totalTracks} faixas</p>
        )}
        {typeof avgRating === 'number' && (
          <div className="mt-1 flex items-center gap-1 text-[11px] text-neutral-300">
            <span>{avgRating.toFixed(1)}</span>
            <span className="text-neutral-500">/ 5</span>
          </div>
        )}
      </div>
    </div>
  );
}
