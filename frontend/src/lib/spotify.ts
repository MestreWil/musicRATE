// Placeholder helpers para integração com backend proxy do Spotify
// O frontend NÃO chama a API do Spotify diretamente para evitar expor segredos.

import { Artist, Album, Track, Paginated } from './types';
import { apiGet } from './api';

// Exemplos de endpoints esperados no backend Laravel
// /spotify/search?query=...&type=artist,album,track
// /spotify/artists/:id
// /spotify/albums/:id

export async function searchArtists(q: string, limit = 20, offset = 0): Promise<Paginated<Artist>> {
  return apiGet(`/spotify/search?type=artist&query=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`);
}

export async function getArtist(id: string): Promise<Artist> {
  return apiGet(`/spotify/artists/${id}`);
}

export async function searchAlbums(q: string, limit = 20, offset = 0): Promise<Paginated<Album>> {
  return apiGet(`/spotify/search?type=album&query=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`);
}

export async function getAlbum(id: string): Promise<Album> {
  return apiGet(`/spotify/albums/${id}`);
}

export async function searchTracks(q: string, limit = 20, offset = 0): Promise<Paginated<Track>> {
  return apiGet(`/spotify/search?type=track&query=${encodeURIComponent(q)}&limit=${limit}&offset=${offset}`);
}

export async function getTrack(id: string): Promise<Track> {
  return apiGet(`/spotify/tracks/${id}`);
}
