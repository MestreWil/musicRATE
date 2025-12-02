'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { searchAll } from '@/lib/spotify';
import { Artist, Album, Track } from '@/lib/types';
import { AlbumCard } from '@/components/AlbumCard';
import { ArtistCard } from '@/components/ArtistCard';
import TrackCard from '@/components/TrackCard';

export default function SearchResultsClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [singles, setSingles] = useState<Album[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!query) {
      router.push('/');
      return;
    }

    async function fetchResults() {
      setLoading(true);
      setError(null);

      try {
        const results = await searchAll(query, 10);

        setArtists(results.artists.items);

        // Separar singles (1-3 tracks) de álbuns (4+ tracks)
        const albumsList: Album[] = [];
        const singlesList: Album[] = [];

        results.albums.items.forEach((album) => {
          if (album.totalTracks && album.totalTracks <= 3) {
            singlesList.push(album);
          } else {
            albumsList.push(album);
          }
        });

        setAlbums(albumsList);
        setSingles(singlesList);
        setTracks(results.tracks.items);

        console.log('Resultados da busca:', {
          query,
          artists: results.artists.items.length,
          albums: albumsList.length,
          singles: singlesList.length,
          tracks: results.tracks.items.length,
          // Debug: verificar imagens
          firstArtistImage: results.artists.items[0]?.image,
          firstAlbumImage: results.albums.items[0]?.image,
          firstTrackImage: results.tracks.items[0]?.image
        });
      } catch (err) {
        console.error('Erro ao buscar:', err);
        setError('Erro ao carregar resultados da busca. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [query, router]);

  if (loading) {
    return (
      <div className="bg-black text-white pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-800 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-gray-800 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black text-white pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500 mb-4">Erro</h1>
            <p className="text-gray-400">{error}</p>
            <button
              onClick={() => router.push('/')}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
            >
              Voltar para o início
            </button>
          </div>
        </div>
      </div>
    );
  }

  const hasResults = artists.length > 0 || albums.length > 0 || singles.length > 0 || tracks.length > 0;

  return (
    <div className="bg-black text-white pt-32 px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Resultados para: <span className="text-red-500">{query}</span>
          </h1>
          <p className="text-gray-400">
            {hasResults ? (
              `${artists.length + albums.length + singles.length + tracks.length} resultados encontrados`
            ) : (
              'Nenhum resultado encontrado'
            )}
          </p>
        </div>

        {!hasResults && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">
              Não encontramos nada para "{query}"
            </p>
            <p className="text-gray-500 text-sm">
              Tente usar outras palavras-chave ou verificar a ortografia
            </p>
          </div>
        )}

        {/* Artistas */}
        {artists.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Artistas</h2>
              <span className="text-gray-400 text-sm">{artists.length} encontrados</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {artists.map((artist) => (
                <ArtistCard 
                  key={artist.id} 
                  id={artist.id}
                  name={artist.name}
                  image={artist.image}
                  followers={artist.followers}
                  genres={artist.genres}
                  popularity={artist.popularity}
                />
              ))}
            </div>
          </section>
        )}

        {/* Singles */}
        {singles.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Singles</h2>
              <span className="text-gray-400 text-sm">{singles.length} encontrados</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {singles.map((single) => (
                <AlbumCard 
                  key={single.id}
                  id={single.id}
                  name={single.name}
                  image={single.image}
                  artists={single.artists}
                  releaseDate={single.releaseDate}
                  totalTracks={single.totalTracks}
                />
              ))}
            </div>
          </section>
        )}

        {/* Álbuns */}
        {albums.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Álbuns</h2>
              <span className="text-gray-400 text-sm">{albums.length} encontrados</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {albums.map((album) => (
                <AlbumCard 
                  key={album.id}
                  id={album.id}
                  name={album.name}
                  image={album.image}
                  artists={album.artists}
                  releaseDate={album.releaseDate}
                  totalTracks={album.totalTracks}
                />
              ))}
            </div>
          </section>
        )}

        {/* Faixas */}
        {tracks.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold">Faixas</h2>
              <span className="text-gray-400 text-sm">{tracks.length} encontradas</span>
            </div>
            <div className="space-y-2">
              {tracks.map((track, index) => (
                <TrackCard key={track.id} track={track} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
