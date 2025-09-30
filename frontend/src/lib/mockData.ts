import { Artist, Album, Track } from './types';

export interface GenreHighlight {
  id: string;
  name: string;
  slug: string;
  color: string; // tailwind color class or hex
  image?: string; // future banner
}

export const genreHighlights: GenreHighlight[] = [
  { id: 'trap', name: 'TRAP', slug: 'trap', color: 'from-red-600 to-orange-500' },
  { id: 'pop', name: 'POP', slug: 'pop', color: 'from-pink-500 to-rose-400' },
  { id: 'rock', name: 'ROCK', slug: 'rock', color: 'from-indigo-500 to-purple-500' },
  { id: 'emo', name: 'EMO', slug: 'emo', color: 'from-sky-500 to-cyan-400' },
  { id: 'indie', name: 'INDIE', slug: 'indie', color: 'from-teal-500 to-emerald-400' }
];

export const mockArtists: Artist[] = [
  { id: 'a1', name: 'Matue', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=60', followers: 2000000, genres: ['trap'], popularity: 62 },
  { id: 'a2', name: 'Billie Eilish', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=60', followers: 5000000, genres: ['pop'], popularity: 85 },
  { id: 'a3', name: 'Sabrina Carpenter', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=60', followers: 4000000, genres: ['pop'], popularity: 80 },
  { id: 'a4', name: 'Linkin Park', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=60', followers: 900000, genres: ['rock'], popularity: 78 },
  { id: 'a5', name: 'Gorillaz', image: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=200&q=60', followers: 800000, genres: ['alternative'], popularity: 73 }
];

export const mockAlbums: Album[] = [
  { id: 'al1', name: '333', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=60', artists: [{ id: 'a1', name: 'Matue' }], releaseDate: '2023-09-17', totalTracks: 12 },
  { id: 'al2', name: 'HIT ME HARD AND SOFT', image: 'https://images.unsplash.com/photo-1533237264985-ee62b051b210?auto=format&fit=crop&w=200&q=60', artists: [{ id: 'a2', name: 'Billie Eilish' }], releaseDate: '2024-01-20', totalTracks: 10 },
  { id: 'al3', name: 'Demon Days', image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=200&q=60', artists: [{ id: 'a5', name: 'Gorillaz' }], releaseDate: '2005-05-23', totalTracks: 15 },
  { id: 'al4', name: 'Master of Puppets', image: 'https://images.unsplash.com/photo-1446057032654-9d8885db76c6?auto=format&fit=crop&w=200&q=60', artists: [{ id: 'a9', name: 'Metallica' }], releaseDate: '1986-03-03', totalTracks: 8 },
  { id: 'al5', name: 'Positions', image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=200&q=60', artists: [{ id: 'a10', name: 'Ariana Grande' }], releaseDate: '2020-10-30', totalTracks: 14 },
  { id: 'al6', name: 'Nectar', image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=200&q=60', artists: [{ id: 'a11', name: 'Joji' }], releaseDate: '2020-09-25', totalTracks: 18 }
];

export const mockTracks: Track[] = [
  { id: 't1', name: 'Crawling', artists: [{ id: 'a4', name: 'Linkin Park' }], durationMs: 209000, popularity: 70 },
  { id: 't2', name: 'Creep', artists: [{ id: 'a12', name: 'Radiohead' }], durationMs: 240000, popularity: 88 },
  { id: 't3', name: 'I Wonder', artists: [{ id: 'a13', name: 'Kanye West' }], durationMs: 225000, popularity: 75 },
  { id: 't4', name: 'Your Love', artists: [{ id: 'a14', name: 'The Outfield' }], durationMs: 232000, popularity: 67 },
  { id: 't5', name: 'Need 2', artists: [{ id: 'a15', name: 'Pinegrove' }], durationMs: 250000, popularity: 60 }
];

// Utility helpers para futura padronização
export function formatFollowers(n?: number) {
  if (!n) return '—';
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return n.toString();
}
