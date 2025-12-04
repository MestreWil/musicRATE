'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getArtist, getArtistAlbums, getArtistTopTracks } from '@/lib/spotify';
import { Artist, Album, Track } from '@/lib/types';
import { AlbumCard } from '@/components/AlbumCard';
import TrackCard from '@/components/TrackCard';
import { ArtistActionsBar } from '@/components/ArtistActionsBar';

type TabType = 'albums' | 'singles' | 'tracks';

export default function ArtistDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [artist, setArtist] = useState<Artist | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [singles, setSingles] = useState<Album[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabType>('albums');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const [artistData, albumsData, tracksData] = await Promise.all([
          getArtist(id),
          getArtistAlbums(id, 50),
          getArtistTopTracks(id)
        ]);

        setArtist(artistData);
        
        // Separar singles e álbuns
        const albumsList: Album[] = [];
        const singlesList: Album[] = [];

        albumsData.items.forEach((album) => {
          if (album.totalTracks && album.totalTracks <= 3) {
            singlesList.push(album);
          } else {
            albumsList.push(album);
          }
        });

        setAlbums(albumsList);
        setSingles(singlesList);
        setTopTracks(tracksData);

        console.log('Artist data loaded:', {
          artist: artistData.name,
          albums: albumsList.length,
          singles: singlesList.length,
          topTracks: tracksData.length
        });
      } catch (err) {
        console.error('Erro ao carregar artista:', err);
        setError('Erro ao carregar dados do artista.');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  // Formatar número de seguidores
  const formatFollowers = (count?: number) => {
    if (!count) return '0';
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  // Definir cor de gradiente baseada no nome do artista
  const getBackgroundGradient = () => {
    if (!artist) return 'from-neutral-900/50 to-neutral-800/30';
    const gradients = [
      'from-purple-900/50 to-purple-700/30',
      'from-blue-900/50 to-blue-700/30',
      'from-pink-900/50 to-pink-700/30',
      'from-green-900/50 to-green-700/30',
      'from-orange-900/50 to-orange-700/30',
      'from-red-900/50 to-red-700/30',
      'from-teal-900/50 to-teal-700/30',
      'from-indigo-900/50 to-indigo-700/30',
    ];
    const index = artist.name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  if (loading) {
    return (
      <div className="bg-black text-white pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-neutral-800 rounded-lg" />
            <div className="flex gap-6">
              <div className="w-48 h-48 bg-neutral-800 rounded-full" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-neutral-800 rounded w-1/3" />
                <div className="h-4 bg-neutral-800 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="bg-black text-white flex items-center justify-center px-4 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Artista não encontrado</h1>
          <p className="text-neutral-400 mb-8">{error || 'O artista que você procura não existe.'}</p>
          <Link href="/" className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-colors">
            Voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      {/* Hero Section com Banner */}
      <section className={`relative bg-gradient-to-b ${getBackgroundGradient()} pt-24 pb-0`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Artist Header */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 pb-8">
            {/* Artist Image */}
            <div className="flex-shrink-0">
              <div className="relative w-48 h-48 mx-auto md:mx-0 rounded-full overflow-hidden bg-neutral-800 shadow-2xl ring-4 ring-white/10">
                {artist.image ? (
                  <Image 
                    src={artist.image} 
                    alt={artist.name} 
                    fill 
                    sizes="192px" 
                    className="object-cover" 
                    priority
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-6xl text-neutral-600">
                    🎤
                  </div>
                )}
              </div>
            </div>

            {/* Artist Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-end">
              <p className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-2">
                Artista
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 break-words">
                {artist.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
                {/* Followers */}
                {artist.followers !== undefined && (
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white/70">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    <span className="font-semibold">{formatFollowers(artist.followers)}</span>
                    <span className="text-white/70">seguidores</span>
                  </div>
                )}

                {/* Genres */}
                {artist.genres && artist.genres.length > 0 && (
                  <>
                    <span className="text-white/50">•</span>
                    <div className="flex flex-wrap gap-2">
                      {artist.genres.slice(0, 3).map((genre, idx) => (
                        <span 
                          key={idx}
                          className="px-3 py-1 bg-white/10 rounded-full text-xs font-medium capitalize"
                        >
                          {genre}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {/* Popularity */}
                {artist.popularity !== undefined && (
                  <>
                    <span className="text-white/50">•</span>
                    <div className="flex items-center gap-2">
                      <span className="text-white/70">Popularidade:</span>
                      <span className="font-semibold">{artist.popularity}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions Bar */}
      <ArtistActionsBar artistId={id} />

      {/* Tabs */}
      <section className="bg-black border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6 md:gap-8 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('albums')}
              className={`py-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'albums'
                  ? 'text-white border-red-600'
                  : 'text-neutral-400 border-transparent hover:text-white'
              }`}
            >
              Álbuns {albums.length > 0 && `(${albums.length})`}
            </button>
            <button
              onClick={() => setActiveTab('singles')}
              className={`py-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'singles'
                  ? 'text-white border-red-600'
                  : 'text-neutral-400 border-transparent hover:text-white'
              }`}
            >
              Singles {singles.length > 0 && `(${singles.length})`}
            </button>
            <button
              onClick={() => setActiveTab('tracks')}
              className={`py-4 px-2 font-medium text-sm whitespace-nowrap transition-colors border-b-2 ${
                activeTab === 'tracks'
                  ? 'text-white border-red-600'
                  : 'text-neutral-400 border-transparent hover:text-white'
              }`}
            >
              Mais tocadas {topTracks.length > 0 && `(${topTracks.length})`}
            </button>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Albums Tab */}
        {activeTab === 'albums' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Álbuns</h2>
            {albums.length > 0 ? (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[640px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4 min-[1280px]:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
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
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-400">Nenhum álbum encontrado.</p>
              </div>
            )}
          </div>
        )}

        {/* Singles Tab */}
        {activeTab === 'singles' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Singles e EPs</h2>
            {singles.length > 0 ? (
              <div className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[640px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4 min-[1280px]:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
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
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-400">Nenhum single encontrado.</p>
              </div>
            )}
          </div>
        )}

        {/* Top Tracks Tab */}
        {activeTab === 'tracks' && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Mais tocadas</h2>
            {topTracks.length > 0 ? (
              <div className="space-y-1">
                {topTracks.map((track, index) => (
                  <TrackCard key={track.id} track={track} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-400">Nenhuma faixa encontrada.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
