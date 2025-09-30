import { genreHighlights, mockArtists, mockAlbums, mockTracks } from '@/lib/mockData';
import { GenreBadge } from '@/components/GenreBadge';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { TrackCard } from '@/components/TrackCard';
import { AlbumCard } from '@/components/AlbumCard';
import { ArtistCard } from '@/components/ArtistCard';
import { SearchBar } from '@/components/SearchBar';
import { HeroCarousel } from '@/components/HeroCarousel';

// FUTURA INTEGRAÇÃO:
// Substituir mocks por chamadas fetch em Server Components usando funções
// ex: const tracks = await getRecommendedTracks(); (RSC) e passar para client quando precisar de interação.
// Poderá usar revalidate/tagging para caching incremental.
export default function Home() {
  return (
    <div className="space-y-12 px-6 py-8 max-w-7xl mx-auto">

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Highlights (gêneros) */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold tracking-tight m-0">Highlights</h2>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {genreHighlights.map(g => (
            <GenreBadge key={g.id} genre={g} />
          ))}
        </div>
      </section>

      {/* Singles */}
      <HorizontalScroll title="Singles for you">
        {mockTracks.map(t => (
          <TrackCard key={t.id} track={t} />
        ))}
      </HorizontalScroll>

      {/* Albums */}
      <HorizontalScroll title="Albums for you">
        {mockAlbums.map(a => (
          <AlbumCard key={a.id} id={a.id} name={a.name} image={a.image} artists={a.artists} releaseDate={a.releaseDate} totalTracks={a.totalTracks} />
        ))}
      </HorizontalScroll>

      {/* Artists */}
      <HorizontalScroll title="Artists for you">
        {mockArtists.map(ar => (
          <ArtistCard key={ar.id} {...ar} />
        ))}
      </HorizontalScroll>
    </div>
  );
}
