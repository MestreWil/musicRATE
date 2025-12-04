'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface Track {
  id: string;
  name: string;
  artist: string;
  previewUrl: string | null;
  image?: string;
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  playlist: Track[];
  currentIndex: number;
  play: (track: Track) => void;
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
  pause: () => void;
  resume: () => void;
  next: () => void;
  previous: () => void;
  seek: (time: number) => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Inicializar o elemento de áudio
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      // Auto play next if in playlist
      if (playlist.length > 0 && currentIndex < playlist.length - 1) {
        next();
      }
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
    };
  }, [playlist, currentIndex]);

  const play = (track: Track) => {
    if (!track.previewUrl) {
      alert('Prévia não disponível para esta música');
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    // Se for a mesma track, apenas resume
    if (currentTrack?.id === track.id && audio.src) {
      audio.play();
      setIsPlaying(true);
      return;
    }

    setCurrentTrack(track);
    setPlaylist([track]);
    setCurrentIndex(0);
    audio.src = track.previewUrl;
    audio.play();
    setIsPlaying(true);
  };

  const playPlaylist = (tracks: Track[], startIndex = 0) => {
    const validTracks = tracks.filter(t => t.previewUrl);
    
    if (validTracks.length === 0) {
      alert('Nenhuma prévia disponível nesta lista');
      return;
    }

    setPlaylist(validTracks);
    setCurrentIndex(startIndex);
    
    const trackToPlay = validTracks[startIndex];
    setCurrentTrack(trackToPlay);
    
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.src = trackToPlay.previewUrl!;
    audio.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const resume = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const next = () => {
    if (playlist.length === 0) return;
    
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentIndex(nextIndex);
    
    const nextTrack = playlist[nextIndex];
    setCurrentTrack(nextTrack);
    
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.src = nextTrack.previewUrl!;
    audio.play();
    setIsPlaying(true);
  };

  const previous = () => {
    if (playlist.length === 0) return;
    
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    
    const prevTrack = playlist[prevIndex];
    setCurrentTrack(prevTrack);
    
    const audio = audioRef.current;
    if (!audio) return;
    
    audio.src = prevTrack.previewUrl!;
    audio.play();
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        duration,
        playlist,
        currentIndex,
        play,
        playPlaylist,
        pause,
        resume,
        next,
        previous,
        seek,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
}
