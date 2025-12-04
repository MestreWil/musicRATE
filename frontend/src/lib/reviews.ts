// Helpers para integração com a API de Reviews do backend

import { apiGet, apiPost, apiDelete } from './api';

export interface Review {
  id: string;
  user_id: string;
  target_type: 'album' | 'track' | 'single';
  target_spotify_id: string;
  spotify_album_id?: string;
  album_name?: string;
  artist_name?: string;
  album_image_url?: string;
  rating: number;
  review_text?: string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    display_name: string;
    email: string;
    avatar_url?: string;
  };
}

export interface ReviewStats {
  total_reviews: number;
  average_rating: number;
  total_users: number;
  total_albums_reviewed: number;
  top_rated_albums: Array<{
    spotify_album_id: string;
    album_name: string;
    artist_name: string;
    album_image_url?: string;
    avg_rating: number;
    review_count: number;
  }>;
  recent_reviews: Review[];
}

export interface AlbumReviewsResponse {
  reviews: Review[];
  stats: {
    total: number;
    average_rating: number;
    rating_distribution: Record<number, number>;
  };
}

export interface CreateReviewData {
  target_type: 'album' | 'track' | 'single';
  target_spotify_id: string;
  rating: number;
  review_text?: string;
}

export interface UpdateReviewData {
  rating?: number;
  review_text?: string;
}

/**
 * Lista todas as reviews (com paginação)
 */
export async function getAllReviews(page = 1, perPage = 15): Promise<{
  data: Review[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}> {
  return apiGet(`/reviews?page=${page}&per_page=${perPage}`);
}

/**
 * Obtém detalhes de uma review
 */
export async function getReview(id: string): Promise<Review> {
  return apiGet(`/reviews/${id}`);
}

/**
 * Obtém reviews de um álbum específico
 */
export async function getAlbumReviews(spotifyAlbumId: string): Promise<AlbumReviewsResponse> {
  return apiGet(`/reviews/album/${spotifyAlbumId}`);
}

/**
 * Obtém estatísticas gerais de reviews
 */
export async function getReviewStats(): Promise<ReviewStats> {
  return apiGet('/reviews/stats');
}

/**
 * Obtém reviews do usuário logado (requer autenticação)
 */
export async function getMyReviews(): Promise<{
  data: Review[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}> {
  return apiGet('/reviews/me');
}

/**
 * Cria uma nova review (requer autenticação)
 */
export async function createReview(data: CreateReviewData): Promise<{
  message: string;
  review: Review;
}> {
  return apiPost('/reviews', data);
}

/**
 * Atualiza uma review existente (requer autenticação)
 */
export async function updateReview(id: string, data: UpdateReviewData): Promise<{
  message: string;
  review: Review;
}> {
  return apiPost(`/reviews/${id}`, { ...data, _method: 'PUT' });
}

/**
 * Deleta uma review (requer autenticação)
 */
export async function deleteReview(id: string): Promise<{
  message: string;
}> {
  return apiDelete(`/reviews/${id}`);
}

/**
 * Calcula a média de rating a partir de um array de reviews
 */
export function calculateAverageRating(reviews: Review[]): number {
  if (reviews.length === 0) return 0;
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Math.round((sum / reviews.length) * 10) / 10; // Arredonda para 1 casa decimal
}

/**
 * Formata data relativa (ex: "2 dias atrás")
 */
export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'agora mesmo';
  if (diffMins < 60) return `${diffMins} minuto${diffMins > 1 ? 's' : ''} atrás`;
  if (diffHours < 24) return `${diffHours} hora${diffHours > 1 ? 's' : ''} atrás`;
  if (diffDays < 7) return `${diffDays} dia${diffDays > 1 ? 's' : ''} atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''} atrás`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} mês${Math.floor(diffDays / 30) > 1 ? 'es' : ''} atrás`;
  return `${Math.floor(diffDays / 365)} ano${Math.floor(diffDays / 365) > 1 ? 's' : ''} atrás`;
}
