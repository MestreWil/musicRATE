import Image from 'next/image';
import Link from 'next/link';
import { getAlbum, getAlbumTracks } from '@/lib/spotify';
import TrackCard from '@/components/TrackCard';
import { notFound } from 'next/navigation';
import { AlbumReviewsSection } from './AlbumReviewsSection';
import { AlbumActionsBar } from '@/components/AlbumActionsBar';

interface Params { params: Promise<{ id: string }> }

export default async function AlbumDetailPage({ params }: Readonly<Params>) {
  const { id } = await params;
  
  let album;
  let tracks;

  try {
    // Buscar dados reais do álbum e suas tracks
    [album, tracks] = await Promise.all([
      getAlbum(id),
      getAlbumTracks(id, 50)
    ]);
  } catch (error) {
    console.error('Erro ao carregar álbum:', error);
    notFound();
  }

  // Calcular duração total do álbum
  const totalDurationMs = tracks.items.reduce((acc, track) => acc + (track.durationMs || 0), 0);
  const totalMinutes = Math.floor(totalDurationMs / 60000);
  const totalSeconds = Math.floor((totalDurationMs % 60000) / 1000);

  // Extrair ano da data de lançamento
  const releaseYear = album.releaseDate ? new Date(album.releaseDate).getFullYear() : null;

  // Definir cor de gradiente baseada no nome do álbum
  const getBackgroundGradient = () => {
    const gradients = [
      'from-purple-900/30 to-purple-700/20',
      'from-blue-900/30 to-blue-700/20',
      'from-pink-900/30 to-pink-700/20',
      'from-green-900/30 to-green-700/20',
      'from-orange-900/30 to-orange-700/20',
      'from-red-900/30 to-red-700/20',
      'from-teal-900/30 to-teal-700/20',
      'from-indigo-900/30 to-indigo-700/20',
    ];
    const index = album.name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className={`bg-gradient-to-b ${getBackgroundGradient()} pt-24 pb-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Album Cover */}
            <div className="flex-shrink-0">
              <div className="relative w-full max-w-[280px] mx-auto md:mx-0 md:w-[280px] aspect-square rounded-lg overflow-hidden bg-neutral-800 shadow-2xl">
                {album.image ? (
                  <Image 
                    src={album.image} 
                    alt={album.name} 
                    fill 
                    sizes="(max-width: 768px) 280px, 280px" 
                    className="object-cover" 
                    priority
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-5xl text-neutral-600">
                    💿
                  </div>
                )}
              </div>
            </div>

            {/* Album Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-end">
              <p className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-2">
                Álbum
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 break-words">
                {album.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                {/* Artists */}
                <div className="flex items-center gap-2">
                  {album.artists.map((artist, idx) => (
                    <span key={artist.id} className="flex items-center">
                      <Link 
                        href={`/artists/${artist.id}`}
                        className="font-semibold hover:underline"
                      >
                        {artist.name}
                      </Link>
                      {idx < album.artists.length - 1 && <span className="ml-2 text-white/50">,</span>}
                    </span>
                  ))}
                </div>

                {/* Metadata */}
                <span className="text-white/50">•</span>
                {releaseYear && <span>{releaseYear}</span>}
                
                {album.totalTracks && (
                  <>
                    <span className="text-white/50">•</span>
                    <span>{album.totalTracks} {album.totalTracks === 1 ? 'música' : 'músicas'}</span>
                  </>
                )}

                {totalDurationMs > 0 && (
                  <>
                    <span className="text-white/50">•</span>
                    <span>{totalMinutes}:{totalSeconds.toString().padStart(2, '0')}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions Bar */}
      <AlbumActionsBar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Tracklist */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Faixas</h2>
            <div className="space-y-1">
              {tracks.items.map((track, index) => (
                <TrackCard key={track.id} track={track} index={index} />
              ))}
            </div>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            {/* Album Info Card */}
            <div className="bg-neutral-900/50 rounded-lg p-6 border border-neutral-800">
              <h3 className="text-lg font-semibold mb-4">Sobre o álbum</h3>
              <div className="space-y-3 text-sm">
                {releaseYear && (
                  <div>
                    <p className="text-neutral-400">Lançamento</p>
                    <p className="text-white font-medium">{album.releaseDate}</p>
                  </div>
                )}
                
                {album.totalTracks && (
                  <div>
                    <p className="text-neutral-400">Total de faixas</p>
                    <p className="text-white font-medium">{album.totalTracks}</p>
                  </div>
                )}

                {totalDurationMs > 0 && (
                  <div>
                    <p className="text-neutral-400">Duração</p>
                    <p className="text-white font-medium">
                      {totalMinutes} min {totalSeconds} seg
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Placeholder for future features */}
            <div className="bg-gradient-to-br from-red-900/20 to-red-700/10 rounded-lg p-6 border border-red-800/30">
              <h3 className="text-lg font-semibold mb-2">Rate this album</h3>
              <p className="text-sm text-neutral-300">
                Share your thoughts and help others discover great music.
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <AlbumReviewsSection albumId={id} />
      </div>
    </div>
  );
}
