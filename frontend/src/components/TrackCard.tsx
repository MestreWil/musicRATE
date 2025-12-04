'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Track } from '@/lib/types';
import { useAudio } from '@/contexts/AudioContext';

// Componente para exibir track em formato de lista (usado em resultados de busca)
export default function TrackCard({ track, index }: { track: Track; index?: number }) {
  const { play, currentTrack, isPlaying, pause } = useAudio();
  
  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;
  // Formatar duração (ms para mm:ss)
  const formatDuration = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Usar a capa do álbum como imagem da track
  const coverImage = track.album?.image || track.image;

  return (
    <div className="group flex items-center gap-4 p-3 rounded-lg hover:bg-neutral-800/50 transition-colors">
      {/* Número/Play Button */}
      <div className="w-8 text-center text-neutral-400 text-sm shrink-0">
        {typeof index === 'number' && !isCurrentlyPlaying ? (
          <span className="group-hover:hidden">{index + 1}</span>
        ) : null}
        {isCurrentlyPlaying ? (
          <div className="flex items-center justify-center">
            <div className="w-4 h-4 flex items-center justify-center gap-0.5">
              <span className="w-0.5 h-3 bg-red-500 animate-pulse"></span>
              <span className="w-0.5 h-4 bg-red-500 animate-pulse" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-0.5 h-2 bg-red-500 animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
          </div>
        ) : (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              if (track.previewUrl) {
                play({
                  id: track.id,
                  name: track.name,
                  artist: track.artists.map(a => a.name).join(', '),
                  previewUrl: track.previewUrl,
                  image: coverImage || undefined,
                });
              } else {
                alert('Prévia de áudio não disponível para esta faixa.\n\nO Spotify pode restringir previews em algumas regiões ou para certas músicas.');
              }
            }}
            disabled={false}
            className={`${typeof index === 'number' ? 'hidden' : ''} group-hover:block text-white hover:scale-110 transition-transform cursor-pointer`}
            aria-label="Play"
            title={track.previewUrl ? 'Tocar prévia' : 'Prévia não disponível (clique para mais informações)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        )}
      </div>

      {/* Capa */}
      <div className="w-12 h-12 relative shrink-0 rounded overflow-hidden bg-neutral-800">
        {coverImage ? (
          <Image 
            src={coverImage} 
            alt={track.name}
            fill
            sizes="48px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-neutral-600">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
            </svg>
          </div>
        )}
      </div>

      {/* Info da Track */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/tracks/${track.id}`}
          className="block hover:underline"
        >
          <h3 className="text-white font-medium truncate">{track.name}</h3>
        </Link>
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <span className="truncate">
            {track.artists.map((artist, i) => (
              <span key={artist.id}>
                {i > 0 && ', '}
                <Link 
                  href={`/artists/${artist.id}`}
                  className="hover:underline hover:text-white transition-colors"
                >
                  {artist.name}
                </Link>
              </span>
            ))}
          </span>
        </div>
      </div>

      {/* Álbum */}
      {track.album && (
        <div className="hidden md:block flex-1 min-w-0 text-sm text-neutral-400">
          <Link 
            href={`/albums/${track.album.id}`}
            className="hover:underline hover:text-white truncate block transition-colors"
          >
            {track.album.name}
          </Link>
        </div>
      )}

      {/* Duração */}
      <div className="text-sm text-neutral-400 shrink-0">
        {track.durationMs ? formatDuration(track.durationMs) : '--:--'}
      </div>

      {/* Ações */}
      <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          className="text-neutral-400 hover:text-white transition-colors"
          aria-label="Adicionar aos favoritos"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
        <button 
          className="text-neutral-400 hover:text-white transition-colors"
          aria-label="Mais opções"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="5" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="19" r="1.5"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
