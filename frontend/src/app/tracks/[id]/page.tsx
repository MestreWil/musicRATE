import Image from 'next/image';
import Link from 'next/link';
import { getTrack } from '@/lib/spotify';
import { ReviewCard } from '@/components/ReviewCard';
import { ReviewForm } from '@/components/ReviewForm';
import { notFound } from 'next/navigation';

interface Params { params: Promise<{ id: string }> }

export default async function TrackDetailPage({ params }: Readonly<Params>) {
  const { id } = await params;
  
  let track;

  try {
    track = await getTrack(id);
  } catch (error) {
    console.error('Erro ao carregar track:', error);
    notFound();
  }

  // Formatar duração (ms para mm:ss)
  const formatDuration = (ms?: number) => {
    if (!ms) return '--:--';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Definir cor de gradiente baseada no nome da track
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
    const index = track.name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className="bg-black text-white">
      {/* Hero Section */}
      <section className={`bg-gradient-to-b ${getBackgroundGradient()} pt-24 pb-8`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* Track Cover */}
            <div className="flex-shrink-0">
              <div className="relative w-full max-w-[280px] mx-auto md:mx-0 md:w-[280px] aspect-square rounded-lg overflow-hidden bg-neutral-800 shadow-2xl">
                {track.image ? (
                  <Image 
                    src={track.image} 
                    alt={track.name} 
                    fill 
                    sizes="(max-width: 768px) 280px, 280px" 
                    className="object-cover" 
                    priority
                  />
                ) : (
                  <div className="w-full h-full grid place-items-center text-5xl text-neutral-600">
                    🎵
                  </div>
                )}
              </div>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-end">
              <p className="text-sm font-semibold text-white/70 uppercase tracking-wide mb-2">
                Faixa
              </p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 break-words">
                {track.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
                {/* Artists */}
                <div className="flex items-center gap-2">
                  {track.artists.map((artist, idx) => (
                    <span key={artist.id} className="flex items-center">
                      <Link 
                        href={`/artists/${artist.id}`}
                        className="font-semibold hover:underline"
                      >
                        {artist.name}
                      </Link>
                      {idx < track.artists.length - 1 && <span className="ml-2 text-white/50">,</span>}
                    </span>
                  ))}
                </div>

                {/* Album */}
                {track.album && (
                  <>
                    <span className="text-white/50">•</span>
                    <Link 
                      href={`/albums/${track.album.id}`}
                      className="hover:underline"
                    >
                      {track.album.name}
                    </Link>
                  </>
                )}

                {/* Duration */}
                {track.durationMs && (
                  <>
                    <span className="text-white/50">•</span>
                    <span>{formatDuration(track.durationMs)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Actions Bar */}
      <section className="bg-black/40 backdrop-blur-sm border-b border-neutral-800 sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <button 
              className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 hover:scale-105 transition-all shadow-lg"
              aria-label="Play track"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M8 5v14l11-7z"/>
              </svg>
            </button>

            <button 
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Adicionar aos favoritos"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            <button 
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Adicionar à playlist"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>

            <button 
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Compartilhar"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3"/>
                <circle cx="6" cy="12" r="3"/>
                <circle cx="18" cy="19" r="3"/>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Track Info Card */}
            <div className="bg-neutral-900/50 rounded-lg p-6 border border-neutral-800">
              <h2 className="text-2xl font-bold mb-6">Sobre a faixa</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {track.durationMs && (
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">Duração</p>
                    <p className="text-white font-medium text-lg">{formatDuration(track.durationMs)}</p>
                  </div>
                )}

                {track.popularity !== undefined && (
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">Popularidade</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-600 rounded-full transition-all"
                          style={{ width: `${track.popularity}%` }}
                        />
                      </div>
                      <span className="text-white font-medium text-lg">{track.popularity}</span>
                    </div>
                  </div>
                )}

                {track.album && (
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">Álbum</p>
                    <Link 
                      href={`/albums/${track.album.id}`}
                      className="text-red-400 hover:underline font-medium text-lg"
                    >
                      {track.album.name}
                    </Link>
                  </div>
                )}

                {track.artists && track.artists.length > 0 && (
                  <div>
                    <p className="text-neutral-400 text-sm mb-1">
                      {track.artists.length === 1 ? 'Artista' : 'Artistas'}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {track.artists.map((artist) => (
                        <Link 
                          key={artist.id}
                          href={`/artists/${artist.id}`}
                          className="text-red-400 hover:underline font-medium text-lg"
                        >
                          {artist.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audio Preview (if available) */}
            {track.previewUrl && (
              <div className="bg-neutral-900/50 rounded-lg p-6 border border-neutral-800">
                <h3 className="text-lg font-semibold mb-4">Preview de 30 segundos</h3>
                <audio 
                  controls 
                  className="w-full"
                  style={{ 
                    filter: 'invert(1) hue-rotate(180deg)',
                    height: '40px'
                  }}
                >
                  <source src={track.previewUrl} type="audio/mpeg" />
                  Seu navegador não suporta o elemento de áudio.
                </audio>
              </div>
            )}

            {/* Lyrics Placeholder */}
            <div className="bg-gradient-to-br from-red-900/20 to-red-700/10 rounded-lg p-6 border border-red-800/30">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18V5l12-2v13"/>
                  <circle cx="6" cy="18" r="3"/>
                  <circle cx="18" cy="16" r="3"/>
                </svg>
                Letra da música
              </h3>
              <p className="text-neutral-300 text-sm">
                A API do Spotify não fornece letras de músicas. Para ver a letra, acesse plataformas especializadas como Genius ou Letras.mus.br.
              </p>
            </div>
          </div>

          {/* Right Column - Album Card */}
          <div className="space-y-6">
            {track.album && (
              <Link 
                href={`/albums/${track.album.id}`}
                className="block bg-neutral-900/50 rounded-lg p-6 border border-neutral-800 hover:border-red-600/50 transition-colors group"
              >
                <h3 className="text-lg font-semibold mb-4">Do álbum</h3>
                <div className="space-y-4">
                  {track.album.image && (
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-800">
                      <Image 
                        src={track.album.image} 
                        alt={track.album.name} 
                        fill 
                        sizes="300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-300" 
                      />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-white group-hover:text-red-400 transition-colors">
                      {track.album.name}
                    </h4>
                    {track.artists && track.artists.length > 0 && (
                      <p className="text-sm text-neutral-400 mt-1">
                        {track.artists.map((a) => a.name).join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            )}

            {/* Placeholder for future features */}
            <div className="bg-gradient-to-br from-purple-900/20 to-purple-700/10 rounded-lg p-6 border border-purple-800/30">
              <h3 className="text-lg font-semibold mb-2">Músicas similares</h3>
              <p className="text-sm text-neutral-300">
                Recomendações baseadas nesta faixa estarão disponíveis em breve.
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews da Comunidade</h2>

          {/* Review Form */}
          <div className="mb-8">
            <ReviewForm entityType="track" entityId={id} />
          </div>

          {/* Reviews List - Placeholder */}
          <div className="grid md:grid-cols-2 gap-4">
            <ReviewCard 
              author="MusicLover" 
              rating={5} 
              text="Faixa incrível! A produção é impecável e a melodia fica na cabeça." 
            />
            <ReviewCard 
              author="Ouvinte" 
              rating={4} 
              text="Muito boa! Um dos destaques do álbum." 
            />
          </div>
        </section>
      </div>
    </div>
  );
}
