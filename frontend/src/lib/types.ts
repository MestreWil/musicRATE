// Tipos compartilhados para domínio da aplicação MusicRate

export interface Artist {
  id: string;
  name: string;
  image?: string | null;
  genres?: string[];
  followers?: number;
  popularity?: number; // métrica do Spotify
}

export interface Album {
  id: string;
  name: string;
  image?: string | null;
  artists: Pick<Artist, 'id' | 'name'>[];
  releaseDate?: string; // ISO
  totalTracks?: number;
}

export interface Track {
  id: string;
  name: string;
  image?: string | null; // imagem da track (quando disponível)
  durationMs?: number;
  artists: Pick<Artist, 'id' | 'name'>[];
  album?: Pick<Album, 'id' | 'name' | 'image'>;
  previewUrl?: string | null;
  popularity?: number;
}

export interface Rating {
  id: string;
  userId: string;
  entityType: 'artist' | 'album' | 'track';
  entityId: string;
  score: number; // 1-5
  createdAt: string; // ISO
}

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
}

export interface ApiError {
  status: number;
  message: string;
}
