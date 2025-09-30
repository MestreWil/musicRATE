import Image from 'next/image';
import Link from 'next/link';

export interface ArtistCardProps {
  id: string;
  name: string;
  image?: string | null;
  followers?: number;
  genres?: string[];
  popularity?: number;
}

export function ArtistCard({ id, name, image, followers, genres, popularity }: ArtistCardProps) {
  return (
    <Link href={`/artists/${id}`} className="group rounded-lg border border-border p-4 flex gap-4 hover:shadow-sm transition bg-background/70">
      <div className="relative w-20 h-20 shrink-0 rounded-md overflow-hidden bg-neutral-200 dark:bg-neutral-800">
        {image ? (
          <Image src={image} alt={name} fill sizes="80px" className="object-cover" />
        ) : (
          <div className="w-full h-full grid place-items-center text-xs text-neutral-500">Sem imagem</div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <h3 className="font-semibold truncate group-hover:underline">{name}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {followers ? Intl.NumberFormat('pt-BR').format(followers) + ' seguidores' : 'Seguidores desconhecidos'}
        </p>
        {genres && genres.length > 0 && (
          <p className="text-[11px] mt-1 line-clamp-1 text-neutral-500 dark:text-neutral-400">{genres.slice(0,3).join(', ')}</p>
        )}
        {typeof popularity === 'number' && (
          <div className="mt-auto text-[11px] text-neutral-400">Popularidade: {popularity}</div>
        )}
      </div>
    </Link>
  );
}
