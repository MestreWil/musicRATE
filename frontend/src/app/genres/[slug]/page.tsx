import { searchAlbums, searchArtists } from '@/lib/spotify';
import { HorizontalScroll } from '@/components/HorizontalScroll';
import { AlbumCard } from '@/components/AlbumCard';
import { ArtistCard } from '@/components/ArtistCard';

interface GenrePageProps {
  params: Promise<{ slug: string }>;
}

export default async function GenrePage({ params }: GenrePageProps) {
  const { slug } = await params;
  
  // Decodificar e formatar nome do gênero
  const genreName = decodeURIComponent(slug).replace(/-/g, ' ');
  
  let artists: { items: any[] } = { items: [] };
  let albums: { items: any[] } = { items: [] };

  try {
    console.log(`🔍 Buscando por gênero: "${genreName}"`);
    
    // Buscar artistas e álbuns do gênero com mais resultados
    const results = await Promise.allSettled([
      searchArtists(genreName, 30),
      searchAlbums(genreName, 50),
    ]);

    if (results[0].status === 'fulfilled') {
      artists = results[0].value;
      
      // Filtrar artistas que realmente têm o gênero (busca flexível)
      const filteredArtists = (artists.items || []).filter((artist: any) => {
        const genres = artist.genres || [];
        // Buscar por correspondência parcial (mais flexível)
        return genres.some((g: string) => {
          const genreLower = g.toLowerCase();
          const searchLower = genreName.toLowerCase();
          return genreLower.includes(searchLower) || searchLower.includes(genreLower);
        });
      });
      
      // Se o filtro for muito restritivo e não retornar nada, usar resultados originais
      artists.items = filteredArtists.length > 0 ? filteredArtists : artists.items;
      
      console.log(`✅ Artists for "${genreName}":`, artists.items?.length || 0);
      if (filteredArtists.length === 0 && artists.items.length > 0) {
        console.log(`⚠️ Filtro de gênero não encontrou matches exatos, mostrando resultados gerais`);
      }
    } else {
      console.error(`❌ Artists failed:`, results[0].reason);
    }
    
    if (results[1].status === 'fulfilled') {
      albums = results[1].value;
      console.log(`✅ Albums for "${genreName}":`, albums.items?.length || 0);
    } else {
      console.error(`❌ Albums failed:`, results[1].reason);
    }
  } catch (error) {
    console.error(`Erro ao carregar gênero "${genreName}":`, error);
  }

  // Separar singles e álbuns
  const allReleases = albums.items || [];
  
  const singles = allReleases.filter((album: any) => {
    const tracks = album.total_tracks || album.totalTracks || 0;
    return tracks > 0 && tracks <= 3;
  });

  const fullAlbums = allReleases.filter((album: any) => {
    const tracks = album.total_tracks || album.totalTracks || 0;
    return tracks >= 4;
  });

  return (
    <div className="space-y-16 px-4 sm:px-6 lg:px-8 py-8 max-w-[1800px] mx-auto">
      
      {/* Header do gênero */}
      <header className="space-y-3">
        <h1 className="text-4xl sm:text-5xl font-bold text-white capitalize">
          {genreName}
        </h1>
        <p className="text-neutral-400 text-lg">
          Explore artistas, álbuns e singles de {genreName}
        </p>
      </header>

      {/* Singles */}
      {singles.length > 0 && (
        <HorizontalScroll title="Singles">
          {singles.slice(0, 20).map((album: any) => (
            <AlbumCard 
              key={album.id} 
              id={album.id} 
              name={album.name} 
              image={album.images?.[0]?.url || album.image}
              artists={album.artists?.map((a: any) => ({ 
                id: a.id, 
                name: a.name 
              })) || []}
              releaseDate={album.release_date || album.releaseDate}
              totalTracks={album.total_tracks || album.totalTracks}
            />
          ))}
        </HorizontalScroll>
      )}

      {/* Álbuns */}
      {fullAlbums.length > 0 && (
        <HorizontalScroll title="Albums">
          {fullAlbums.slice(0, 20).map((album: any) => (
            <AlbumCard 
              key={album.id} 
              id={album.id} 
              name={album.name} 
              image={album.images?.[0]?.url || album.image}
              artists={album.artists?.map((a: any) => ({ 
                id: a.id, 
                name: a.name 
              })) || []}
              releaseDate={album.release_date || album.releaseDate}
              totalTracks={album.total_tracks || album.totalTracks}
            />
          ))}
        </HorizontalScroll>
      )}

      {/* Artistas */}
      {artists.items && artists.items.length > 0 && (
        <HorizontalScroll title="Artists">
          {artists.items.slice(0, 20).map((artist: any) => (
            <ArtistCard 
              key={artist.id}
              id={artist.id}
              name={artist.name}
              image={artist.images?.[0]?.url || artist.image}
              genres={artist.genres}
              followers={artist.followers?.total}
              popularity={artist.popularity}
            />
          ))}
        </HorizontalScroll>
      )}

      {/* Mensagem se não houver resultados */}
      {singles.length === 0 && fullAlbums.length === 0 && artists.items.length === 0 && (
        <div className="text-center py-20">
          <p className="text-neutral-400 text-lg">
            Nenhum conteúdo encontrado para "{genreName}"
          </p>
        </div>
      )}
    </div>
  );
}

// Gerar metadata dinâmica
export async function generateMetadata({ params }: GenrePageProps) {
  const { slug } = await params;
  const genreName = decodeURIComponent(slug).replace(/-/g, ' ');
  
  return {
    title: `${genreName.charAt(0).toUpperCase() + genreName.slice(1)} - MusicRate`,
    description: `Descubra artistas, álbuns e singles de ${genreName} no MusicRate`,
  };
}
