// Helpers para integração com backend Laravel que faz proxy da API do Spotify
// O frontend NÃO chama a API do Spotify diretamente para evitar expor credenciais

import { Artist, Album, Track, Paginated } from './types';
import { apiGet } from './api';

/**
 * Normaliza dados do Spotify (converte estruturas da API para nosso formato)
 */
function normalizeSpotifyImage(images?: any[]): string | null {
  if (!images || !Array.isArray(images) || images.length === 0) return null;
  return images[0]?.url || null;
}

function normalizeArtist(raw: any): Artist {
  return {
    id: raw.id,
    name: raw.name,
    image: normalizeSpotifyImage(raw.images),
    genres: raw.genres || [],
    followers: raw.followers?.total,
    popularity: raw.popularity
  };
}

function normalizeAlbum(raw: any): Album {
  return {
    id: raw.id,
    name: raw.name,
    image: normalizeSpotifyImage(raw.images),
    artists: raw.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
    releaseDate: raw.release_date,
    totalTracks: raw.total_tracks
  };
}

function normalizeTrack(raw: any): Track {
  return {
    id: raw.id,
    name: raw.name,
    image: normalizeSpotifyImage(raw.album?.images),
    durationMs: raw.duration_ms,
    artists: raw.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
    album: raw.album ? {
      id: raw.album.id,
      name: raw.album.name,
      image: normalizeSpotifyImage(raw.album.images)
    } : undefined,
    previewUrl: raw.preview_url,
    popularity: raw.popularity
  };
}

// Normalizador específico para tracks que vêm do endpoint de álbum
// (não incluem informação do álbum, então precisamos injetar)
function normalizeAlbumTrack(raw: any, albumId: string, albumName: string, albumImage: string | null): Track {
  return {
    id: raw.id,
    name: raw.name,
    image: albumImage,
    durationMs: raw.duration_ms,
    artists: raw.artists?.map((a: any) => ({ id: a.id, name: a.name })) || [],
    album: {
      id: albumId,
      name: albumName,
      image: albumImage
    },
    previewUrl: raw.preview_url,
    popularity: raw.popularity
  };
}

/**
 * Busca artistas no Spotify via backend
 */
export async function searchArtists(q: string, limit = 20): Promise<Paginated<Artist>> {
  const response = await apiGet<any>(`/spotify/search/artists?q=${encodeURIComponent(q)}&limit=${limit}`);
  // O backend já retorna o objeto artists diretamente (com items, total, etc)
  return {
    items: (response.items || []).map(normalizeArtist),
    total: response.total || 0,
    limit,
    offset: response.offset || 0
  };
}

/**
 * Obtém detalhes de um artista
 */
export async function getArtist(id: string): Promise<Artist> {
  const raw = await apiGet<any>(`/spotify/artists/${id}`);
  return normalizeArtist(raw);
}

/**
 * Obtém álbuns de um artista
 */
export async function getArtistAlbums(id: string, limit = 20): Promise<Paginated<Album>> {
  const response = await apiGet<any>(`/spotify/artists/${id}/albums?limit=${limit}`);
  return {
    items: (response.items || []).map(normalizeAlbum),
    total: response.total || 0,
    limit,
    offset: response.offset || 0
  };
}

/**
 * Obtém top tracks de um artista
 */
export async function getArtistTopTracks(id: string): Promise<Track[]> {
  const response = await apiGet<any>(`/spotify/artists/${id}/top-tracks`);
  return (response.tracks || []).map(normalizeTrack);
}

/**
 * Busca álbuns no Spotify via backend
 */
export async function searchAlbums(q: string, limit = 20): Promise<Paginated<Album>> {
  const response = await apiGet<any>(`/spotify/search/albums?q=${encodeURIComponent(q)}&limit=${limit}`);
  // O backend já retorna o objeto albums diretamente (com items, total, etc)
  return {
    items: (response.items || []).map(normalizeAlbum),
    total: response.total || 0,
    limit,
    offset: response.offset || 0
  };
}

/**
 * Obtém detalhes de um álbum
 */
export async function getAlbum(id: string): Promise<Album> {
  const raw = await apiGet<any>(`/spotify/albums/${id}`);
  return normalizeAlbum(raw);
}

/**
 * Obtém tracks de um álbum
 */
export async function getAlbumTracks(id: string, limit = 50): Promise<Paginated<Track>> {
  // Buscar álbum e tracks em paralelo para ter informações completas
  const [album, tracksResponse] = await Promise.all([
    apiGet<any>(`/spotify/albums/${id}`),
    apiGet<any>(`/spotify/albums/${id}/tracks?limit=${limit}`)
  ]);

  const albumImage = normalizeSpotifyImage(album.images);

  return {
    items: (tracksResponse.items || []).map((track: any) => 
      normalizeAlbumTrack(track, id, album.name, albumImage)
    ),
    total: tracksResponse.total || 0,
    limit,
    offset: tracksResponse.offset || 0
  };
}

/**
 * Busca tracks no Spotify via backend
 */
export async function searchTracks(q: string, limit = 20): Promise<Paginated<Track>> {
  const response = await apiGet<any>(`/spotify/search?q=${encodeURIComponent(q)}&type=track&limit=${limit}`);
  // O backend já retorna o objeto tracks diretamente (com items, total, etc)
  return {
    items: (response.items || []).map(normalizeTrack),
    total: response.total || 0,
    limit,
    offset: response.offset || 0
  };
}

/**
 * Obtém detalhes de uma track
 */
export async function getTrack(id: string): Promise<Track> {
  const raw = await apiGet<any>(`/spotify/tracks/${id}`);
  return normalizeTrack(raw);
}

/**
 * Obtém novos lançamentos
 */
export async function getNewReleases(limit = 20): Promise<Paginated<Album>> {
  const response = await apiGet<any>(`/spotify/browse/new-releases?limit=${limit}`);
  // O backend já retorna o objeto albums diretamente (com items, total, etc)
  return {
    items: (response.items || []).map(normalizeAlbum),
    total: response.total || 0,
    limit,
    offset: response.offset || 0
  };
}

/**
 * Busca geral (álbuns, artistas e tracks)
 */
export async function searchAll(q: string, limit = 20): Promise<{
  artists: Paginated<Artist>;
  albums: Paginated<Album>;
  tracks: Paginated<Track>;
}> {
  const response = await apiGet<any>(`/spotify/search?q=${encodeURIComponent(q)}&type=artist,album,track&limit=${limit}`);
  
  return {
    artists: {
      items: (response.artists?.items || []).map(normalizeArtist),
      total: response.artists?.total || 0,
      limit,
      offset: response.artists?.offset || 0
    },
    albums: {
      items: (response.albums?.items || []).map(normalizeAlbum),
      total: response.albums?.total || 0,
      limit,
      offset: response.albums?.offset || 0
    },
    tracks: {
      items: (response.tracks?.items || []).map(normalizeTrack),
      total: response.tracks?.total || 0,
      limit,
      offset: response.tracks?.offset || 0
    }
  };
}

/**
 * Obtém categorias/gêneros do Spotify
 */
export async function getCategories(limit = 20): Promise<Paginated<any>> {
  const response = await apiGet<any>(`/spotify/browse/categories?limit=${limit}`);
  return {
    items: response.items || [],
    total: response.total || 0,
    limit,
    offset: response.offset || 0
  };
}

/**
 * Obtém tracks trending (com mais reviews)
 */
export async function getTrendingTracks(limit = 12): Promise<Array<{
  spotify_data: Track;
  reviews_count: number;
  avg_rating: number;
}>> {
  const response = await apiGet<any>(`/reviews/trending/tracks?limit=${limit}`);
  return response || [];
}

/**
 * Obtém albums trending (com mais reviews)
 */
export async function getTrendingAlbums(limit = 12): Promise<Array<{
  spotify_data: Album;
  reviews_count: number;
  avg_rating: number;
}>> {
  const response = await apiGet<any>(`/reviews/trending/albums?limit=${limit}`);
  return response || [];
}

