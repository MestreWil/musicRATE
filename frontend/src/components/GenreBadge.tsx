import Link from 'next/link';
import { GenreHighlight } from '@/lib/mockData';

export function GenreBadge({ genre }: { genre: GenreHighlight }) {
  return (
    <Link
      href={`/genres/${genre.slug}`}
      className={`relative px-4 py-6 rounded-lg overflow-hidden group border border-border flex items-end h-40 w-48 bg-gradient-to-br ${genre.color}`}
    >
      <span className="text-white font-semibold drop-shadow-sm text-sm tracking-wide group-hover:underline">
        {genre.name}
      </span>
    </Link>
  );
}
