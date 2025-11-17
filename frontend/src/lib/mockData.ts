import { Artist, Album, Track } from './types';

// Detalhe do álbum (p/ página /albums/[id])
export interface AlbumDetail extends Album {
  label?: string;
  genres?: string[];
  year?: number;
  description?: string;
  youtubeUrl?: string;
  tracks: Array<Track & { trackNumber?: number }>; // ordem de faixas
  avgRating?: number; // média 0-5
  ratingsCount?: number; // total de avaliações
}

// Detalhe de artista para página /artists/[id]
export interface ArtistDetail extends Artist {
  handle?: string; // @user
  bannerImage?: string;
  verified?: boolean;
  followersCount?: number; // redundante a compatibilidade
  followingCount?: number;
  bio?: string;
  albums?: Array<Album & { year?: number }>; // destaque
}

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

export const mockAlbumDetails: Record<string, AlbumDetail> = {
  al1: {
    id: 'al1',
    name: '333',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=60',
    artists: [{ id: 'a1', name: 'Matue' }],
    releaseDate: '2024-05-01',
    totalTracks: 12,
    label: 'Indie Records',
    genres: ['Trap'],
    year: 2024,
    description: 'Álbum equilibrado e dinâmico com momentos introspectivos.',
    youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    avgRating: 4.3,
    ratingsCount: 1287,
    tracks: [
      { id: 't101', name: 'Crack com Mussilon', durationMs: 176000, artists: [{ id: 'a1', name: 'Matue' }], trackNumber: 1 },
      { id: 't102', name: 'Imagina esse Cenário', durationMs: 182000, artists: [{ id: 'a1', name: 'Matue' }], trackNumber: 2 },
      { id: 't103', name: 'Isso é Sério', durationMs: 192000, artists: [{ id: 'a1', name: 'Matue' }], trackNumber: 3 },
      { id: 't104', name: '1993', durationMs: 168000, artists: [{ id: 'a1', name: 'Matue' }], trackNumber: 4 },
      { id: 't105', name: '4Tal', durationMs: 174000, artists: [{ id: 'a1', name: 'Matue' }], trackNumber: 5 }
    ]
  }
};

export function getMockAlbumDetail(id: string): AlbumDetail | null {
  return mockAlbumDetails[id] ?? null;
}

export function msToTime(ms?: number) {
  if (!ms) return '0:00';
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export const mockArtistDetails: Record<string, ArtistDetail> = {
  a1: {
    id: 'a1',
    name: 'Matue',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=60',
    bannerImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1400&q=60',
    handle: '@matue',
    verified: true,
    genres: ['Trap'],
    followers: 2000000,
    followersCount: 2000000,
    followingCount: 100,
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.',
    albums: [
      { id: 'al1', name: '333', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=200&q=60', artists: [{ id: 'a1', name: 'Matue' }], releaseDate: '2024-05-01', totalTracks: 12, },
    ].map(a => ({ ...a, year: a.releaseDate ? Number(a.releaseDate.slice(0,4)) : undefined }))
  },
  a3: {
    id: 'a3',
    name: 'Sabrina Carpenter',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=60',
    bannerImage: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=1400&q=60',
    handle: '@sabrina',
    verified: true,
    genres: ['Pop'],
    followers: 4000000,
    followersCount: 4000000,
    followingCount: 120,
    bio: 'Cantora e compositora. Experiência em pop contemporâneo com forte presença em redes sociais.',
    albums: [
      { id: 'al2', name: 'HIT ME HARD AND SOFT', image: 'https://images.unsplash.com/photo-1533237264985-ee62b051b210?auto=format&fit=crop&w=200&q=60', artists: [{ id: 'a2', name: 'Billie Eilish' }], releaseDate: '2024-01-20', totalTracks: 10 },
    ].map(a => ({ ...a, year: a.releaseDate ? Number(a.releaseDate.slice(0,4)) : undefined }))
  }
};

export function getMockArtistDetail(id: string): ArtistDetail | null {
  return mockArtistDetails[id] ?? null;
}

// ====== User Profile mocks ======
export interface UserProfile {
  id: string;
  name: string;
  handle: string; // @user
  avatar?: string;
  bannerImage?: string;
  followers?: number;
  following?: number;
  bio?: string;
}

export type ReviewEntityType = 'album' | 'track' | 'artist';
export interface UserReviewItem {
  id: string;
  type: ReviewEntityType;
  entityId: string;
  title: string; // entity name
  subtitle?: string; // artist name
  year?: number;
  cover?: string; // image url
  excerpt: string;
  rating: number; // 1-5
  likes?: number;
  comments?: number;
}

export const mockUserProfile: UserProfile = {
  id: 'u1',
  name: 'Robertinho',
  handle: '@Robertinho',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=160&q=60',
  bannerImage: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1400&q=60',
  followers: 100,
  following: 100,
  bio: 'Sorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus.'
};

export const mockUserReviews: UserReviewItem[] = [
  {
    id: 'r1',
    type: 'track',
    entityId: 't200',
    title: 'PARANOIA',
    subtitle: 'Maggie Lindemann',
    year: 2021,
    cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&q=60',
    excerpt: 'Top music Crash and Burn',
    rating: 5,
    likes: 1000,
    comments: 0
  },
  {
    id: 'r2',
    type: 'album',
    entityId: 'al1',
    title: 'Lorem',
    subtitle: 'Lorem Ipsum',
    year: 2021,
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=160&q=60',
    excerpt: 'Top music Lorem',
    rating: 4,
    likes: 1200,
    comments: 25
  }
];

export function getMockUserProfile(): UserProfile {
  return mockUserProfile;
}

export function getMockUserReviews(): UserReviewItem[] {
  return mockUserReviews;
}

// ====== Track Detail mocks ======
export interface TrackDetail extends Track {
  image?: string;
  description?: string;
  lyrics?: string;
  youtubeUrl?: string;
  avgRating?: number;
  ratingsCount?: number;
}

export const mockTrackDetails: Record<string, TrackDetail> = {
  t1: {
    id: 't1',
    name: 'Crawling',
    artists: [{ id: 'a4', name: 'Linkin Park' }],
    durationMs: 209000,
    popularity: 70,
    image: 'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=600&q=60',
    youtubeUrl: 'https://www.youtube.com/watch?v=Gd9OhYroLN0',
    avgRating: 4.5,
    ratingsCount: 5234,
    lyrics: `Crawling in my skin\nThese wounds, they will not heal\nFear is how I fall\nConfusing what is real...`
  },
  t2: {
    id: 't2',
    name: 'Creep',
    artists: [{ id: 'a12', name: 'Radiohead' }],
    durationMs: 240000,
    popularity: 88,
    image: 'https://images.unsplash.com/photo-1533237264985-ee62b051b210?auto=format&fit=crop&w=600&q=60',
    youtubeUrl: 'https://www.youtube.com/watch?v=XFkzRNyygfk',
    avgRating: 4.7,
    ratingsCount: 8123,
    lyrics: `But I'm a creep, I'm a weirdo\nWhat the hell am I doin' here?\nI don't belong here...`
  }
};

export function getMockTrackDetail(id: string): TrackDetail | null {
  return mockTrackDetails[id] ?? null;
}
