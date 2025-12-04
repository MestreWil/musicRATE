// Força renderização dinâmica para evitar erro de build
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getNewReleases, searchAlbums, searchArtists, getCategories, getTrendingTracks, getTrendingAlbums } from '@/lib/spotify';
import { GenreBadge } from '@/components/GenreBadge';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { AlbumCard } from '@/components/AlbumCard';
import { ArtistCard } from '@/components/ArtistCard';
import { HeroCarousel } from '@/components/HeroCarousel';
import TrackCard from '@/components/TrackCard';

export default async function Home() {
  // Buscar dados reais da API do Spotify
  let newReleases: { items: any[] } = { items: [] };
  let artists: { items: any[] } = { items: [] };
  let albumSearch: { items: any[] } = { items: [] };
  let categories: { items: any[] } = { items: [] };
  let trendingTracks: any[] = [];
  let trendingAlbums: any[] = [];

  try {
    // Buscar dados com foco em artistas independentes/menores
    // Estratégia: buscar por gêneros indie e filtrar por popularidade
    const results = await Promise.allSettled([
      getNewReleases(50), // Novos lançamentos (agora com filtro de popularidade <= 65)
      // Buscar artistas de diferentes gêneros indie/underground
      Promise.all([
        searchArtists('indie', 15),
        searchArtists('alternative', 15),
        searchArtists('underground', 10),
        searchArtists('lo-fi', 10),
      ]),
      searchAlbums('indie', 30), // Álbuns indie
      getCategories(10), // Categorias/gêneros
      getTrendingTracks(12), // Tracks com mais reviews
      getTrendingAlbums(12), // Albums com mais reviews
    ]);

    if (results[0].status === 'fulfilled') {
      newReleases = results[0].value;
      console.log('✅ New Releases:', newReleases.items?.length || 0, 'items');
    } else {
      console.error('❌ New Releases failed:', results[0].reason);
    }
    
    if (results[1].status === 'fulfilled') {
      // Combinar resultados de múltiplas buscas de artistas
      const allArtistSearches = results[1].value;
      const combinedArtists = allArtistSearches.flatMap((result: any) => result.items || []);
      
      // Remover duplicatas por ID
      const uniqueArtists = Array.from(
        new Map(combinedArtists.map((artist: any) => [artist.id, artist])).values()
      );
      
      // Filtrar e priorizar artistas menores/independentes
      // Critérios: popularidade < 60 E seguidores < 500k
      const independentArtists = uniqueArtists
        .filter((artist: any) => {
          const popularity = artist.popularity || 0;
          const followers = artist.followers || 0;
          // Priorizar artistas com menos de 500k seguidores e popularidade < 60
          return followers < 500000 && popularity < 60;
        })
        .sort((a: any, b: any) => {
          // Ordenar por popularidade (menor primeiro = mais independente)
          return (a.popularity || 0) - (b.popularity || 0);
        });
      
      artists = { items: independentArtists };
      console.log('✅ Independent Artists (filtered):', artists.items?.length || 0, 'items');
      console.log('📊 Popularidade média:', 
        artists.items.length > 0 
          ? (artists.items.reduce((acc: number, a: any) => acc + (a.popularity || 0), 0) / artists.items.length).toFixed(1)
          : 0
      );
    } else {
      console.error('❌ Artists failed:', results[1].reason);
    }

    if (results[2].status === 'fulfilled') {
      albumSearch = results[2].value;
      console.log('✅ Album Search:', albumSearch.items?.length || 0, 'items');
    } else {
      console.error('❌ Album Search failed:', results[2].reason);
    }

    if (results[3].status === 'fulfilled') {
      categories = results[3].value;
      console.log('✅ Categories:', categories.items?.length || 0, 'items');
    } else {
      console.error('❌ Categories failed:', results[3].reason);
    }

    if (results[4].status === 'fulfilled') {
      trendingTracks = results[4].value;
      console.log('✅ Trending Tracks:', trendingTracks.length || 0, 'items');
    } else {
      console.error('❌ Trending Tracks failed:', results[4].reason);
    }

    if (results[5].status === 'fulfilled') {
      trendingAlbums = results[5].value;
      console.log('✅ Trending Albums:', trendingAlbums.length || 0, 'items');
    } else {
      console.error('❌ Trending Albums failed:', results[5].reason);
    }
  } catch (error) {
    console.error('Erro ao carregar dados da home:', error);
  }

  // Separar por tipo de lançamento
  const albums = newReleases.items || [];
  console.log('📀 Total albums:', albums.length);
  
  // Função auxiliar para detectar artistas independentes/menores
  const isIndependentRelease = (album: any) => {
    // Verificar se os artistas do álbum têm características indie
    const artists = album.artists || [];
    if (artists.length === 0) return true; // Se não tem info, incluir por padrão
    
    // Considerar indie se: tem gêneros indie OU é artista menos conhecido
    // (infelizmente a API de browse/new-releases não retorna popularidade dos artistas)
    const hasIndieGenre = artists.some((artist: any) => {
      const genres = artist.genres || [];
      return genres.some((g: string) => 
        g.includes('indie') || 
        g.includes('alternative') || 
        g.includes('underground') ||
        g.includes('lo-fi') ||
        g.includes('bedroom')
      );
    });
    
    return hasIndieGenre;
  };
  
  // Singles (1-3 faixas) - priorizar independentes
  const allSingles = albums.filter((album: any) => {
    const tracks = album.totalTracks || 0;
    return tracks > 0 && tracks <= 3;
  });
  
  // Separar singles independentes e mainstream
  const independentSingles = allSingles.filter(isIndependentRelease);
  const otherSingles = allSingles.filter((s: any) => !isIndependentRelease(s));
  
  // Priorizar independentes (70% indie, 30% mainstream)
  const singles = [...independentSingles, ...otherSingles].slice(0, 20);
  console.log('🎵 Singles:', singles.length, `(${independentSingles.length} indie)`);

  // Álbuns completos (4+ faixas) - combinar novos lançamentos + busca adicional
  const fullAlbumsFromReleases = albums.filter((album: any) => {
    const tracks = album.totalTracks || 0;
    return tracks >= 4;
  });
  
  const fullAlbumsFromSearch = (albumSearch.items || []).filter((album: any) => {
    const tracks = album.totalTracks || 0;
    return tracks >= 4;
  });

  // Combinar e remover duplicatas (por ID)
  const allFullAlbums = [...fullAlbumsFromReleases, ...fullAlbumsFromSearch];
  const uniqueAlbumIds = new Set();
  const deduplicatedAlbums = allFullAlbums.filter((album: any) => {
    if (uniqueAlbumIds.has(album.id)) {
      return false;
    }
    uniqueAlbumIds.add(album.id);
    return true;
  });
  
  // Priorizar álbuns independentes
  const independentAlbums = deduplicatedAlbums.filter(isIndependentRelease);
  const otherAlbums = deduplicatedAlbums.filter((a: any) => !isIndependentRelease(a));
  const fullAlbums = [...independentAlbums, ...otherAlbums];
  
  console.log('💿 Full Albums (combined):', fullAlbums.length, `(${independentAlbums.length} indie)`);

  // Criar slides para o carrossel usando dados reais do Spotify
  const formatFollowers = (count?: number) => {
    if (!count) return '';
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const carouselSlides = [
    // Top 3 álbuns mais recentes
    ...fullAlbums.slice(0, 2).map((album: any) => ({
      id: album.id,
      type: 'album' as const,
      title: album.name,
      subtitle: album.artists?.map((a: any) => a.name).join(', ') || 'Artista Desconhecido',
      image: album.image || '/placeholder-album.jpg',
      href: `/albums/${album.id}`,
      accent: 'from-purple-900/70 via-purple-800/50 to-transparent',
      stats: {
        tracks: album.totalTracks,
        releaseDate: album.releaseDate,
      }
    })),
    // Top 2 artistas
    ...artists.items.slice(0, 2).map((artist: any) => ({
      id: artist.id,
      type: 'artist' as const,
      title: artist.name,
      subtitle: artist.genres?.slice(0, 2).join(' • ') || 'Artista Independente',
      image: artist.image || '/placeholder-artist.jpg',
      href: `/artists/${artist.id}`,
      accent: 'from-blue-900/70 via-blue-800/50 to-transparent',
      stats: {
        followers: formatFollowers(artist.followers),
        popularity: artist.popularity,
      }
    })),
    // Top single
    ...singles.slice(0, 1).map((single: any) => ({
      id: single.id,
      type: 'album' as const,
      title: single.name,
      subtitle: single.artists?.map((a: any) => a.name).join(', ') || 'Artista Desconhecido',
      image: single.image || '/placeholder-album.jpg',
      href: `/albums/${single.id}`,
      accent: 'from-pink-900/70 via-pink-800/50 to-transparent',
      stats: {
        tracks: single.totalTracks,
        releaseDate: single.releaseDate,
      }
    })),
  ].filter(slide => slide.image && slide.image !== '/placeholder-album.jpg' && slide.image !== '/placeholder-artist.jpg');

  return (
    <div className="space-y-16 px-4 sm:px-6 lg:px-8 py-8 max-w-[1800px] mx-auto">

      {/* Hero Carousel */}
      <HeroCarousel slides={carouselSlides} />

      {/* Highlights (gêneros/categorias) */}
      {categories.items.length > 0 && (
        <HorizontalScroll title="Highlights" itemWidth={180}>
          {categories.items.map((category: any) => (
            <GenreBadge 
              key={category.id} 
              id={category.id}
              name={category.name}
              slug={category.name.toLowerCase().replace(/\s+/g, '-')}
              icons={category.icons}
            />
          ))}
        </HorizontalScroll>
      )}

      {/* Trending Tracks - Faixas com mais reviews */}
      {trendingTracks.length > 0 && (
        <HorizontalScroll title="Trending Tracks">
          {trendingTracks.map((item: any) => (
            <div key={item.spotify_data.id} className="relative">
              <TrackCard 
                track={{
                  id: item.spotify_data.id,
                  name: item.spotify_data.name,
                  image: item.spotify_data.album?.image || item.spotify_data.image,
                  artists: item.spotify_data.artists || [],
                  album: item.spotify_data.album,
                  durationMs: item.spotify_data.durationMs || item.spotify_data.duration_ms || 0,
                  previewUrl: item.spotify_data.previewUrl || item.spotify_data.preview_url,
                }}
              />
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                ⭐ {item.avg_rating} • {item.reviews_count} reviews
              </div>
            </div>
          ))}
        </HorizontalScroll>
      )}

      {/* Trending Albums - Álbuns com mais reviews */}
      {trendingAlbums.length > 0 && (
        <HorizontalScroll title="Trending Albums">
          {trendingAlbums.map((item: any) => (
            <div key={item.spotify_data.id} className="relative">
              <AlbumCard 
                id={item.spotify_data.id}
                name={item.spotify_data.name}
                image={item.spotify_data.image}
                artists={item.spotify_data.artists || []}
                releaseDate={item.spotify_data.releaseDate}
                totalTracks={item.spotify_data.totalTracks}
              />
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                ⭐ {item.avg_rating} • {item.reviews_count} reviews
              </div>
            </div>
          ))}
        </HorizontalScroll>
      )}

      {/* Singles for you */}
      {singles.length > 0 && (
        <HorizontalScroll title="Singles for you">
          {singles.slice(0, 20).map((album: any) => (
            <AlbumCard 
              key={album.id} 
              id={album.id} 
              name={album.name} 
              image={album.image}
              artists={album.artists || []}
              releaseDate={album.releaseDate}
              totalTracks={album.totalTracks}
            />
          ))}
        </HorizontalScroll>
      )}

      {/* Albums for you */}
      {fullAlbums.length > 0 && (
        <HorizontalScroll title="Albums for you">
          {fullAlbums.slice(0, 20).map((album: any) => (
            <AlbumCard 
              key={album.id} 
              id={album.id} 
              name={album.name} 
              image={album.image}
              artists={album.artists || []}
              releaseDate={album.releaseDate}
              totalTracks={album.totalTracks}
            />
          ))}
        </HorizontalScroll>
      )}

      {/* Artists for you */}
      {artists.items && artists.items.length > 0 && (
        <HorizontalScroll title="Artists for you">
          {artists.items.slice(0, 20).map((artist: any) => (
            <ArtistCard 
              key={artist.id}
              id={artist.id}
              name={artist.name}
              image={artist.image}
              genres={artist.genres}
              followers={artist.followers}
              popularity={artist.popularity}
            />
          ))}
        </HorizontalScroll>
      )}
    </div>
  );
}
