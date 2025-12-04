'use client';

import { useState } from 'react';
import { searchTracks } from '@/lib/spotify';
import { Track } from '@/lib/types';
import TrackCard from '@/components/TrackCard';

export default function TracksPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const result = await searchTracks(searchQuery, 50);
      setTracks(result.items);
    } catch (error) {
      console.error('Erro ao buscar faixas:', error);
    } finally {
      setLoading(false);
    }
  };

  const sortedTracks = [...tracks].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'artist') {
      return (a.artists[0]?.name || '').localeCompare(b.artists[0]?.name || '');
    } else if (sortBy === 'duration') {
      return (a.durationMs || 0) - (b.durationMs || 0);
    } else if (sortBy === 'popularity') {
      return (b.popularity || 0) - (a.popularity || 0);
    }
    return 0; // relevance - mantém ordem original
  });

  return (
    <div className="bg-black text-white pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Faixas</h1>
          <p className="text-neutral-400">Descubra músicas de todos os estilos e épocas</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar faixas, artistas ou álbuns..."
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {/* Sort */}
          {tracks.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 sm:max-w-xs">
                <label className="block text-sm font-medium text-neutral-400 mb-2">Ordenar por</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="relevance">Relevância</option>
                  <option value="popularity">Popularidade</option>
                  <option value="name">Nome (A-Z)</option>
                  <option value="artist">Artista (A-Z)</option>
                  <option value="duration">Duração</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        {searched && (
          <div className="mb-6 text-sm text-neutral-400">
            {loading ? (
              'Carregando...'
            ) : (
              `${sortedTracks.length} ${sortedTracks.length === 1 ? 'faixa encontrada' : 'faixas encontradas'}`
            )}
          </div>
        )}

        {/* Tracks List */}
        {loading ? (
          <div className="space-y-1">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center gap-4 p-4 rounded-lg bg-neutral-900">
                <div className="w-12 h-12 bg-neutral-800 rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-neutral-800 rounded w-1/3 mb-2" />
                  <div className="h-3 bg-neutral-800 rounded w-1/4" />
                </div>
                <div className="h-3 bg-neutral-800 rounded w-12" />
              </div>
            ))}
          </div>
        ) : sortedTracks.length > 0 ? (
          <div className="space-y-1">
            {sortedTracks.map((track, index) => (
              <TrackCard key={track.id} track={track} index={index} />
            ))}
          </div>
        ) : searched ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-xl text-neutral-400 mb-2">Nenhuma faixa encontrada</p>
            <p className="text-neutral-500">Tente fazer uma nova busca com outros termos</p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎵</div>
            <p className="text-xl text-neutral-400 mb-2">Busque por suas músicas favoritas</p>
            <p className="text-neutral-500">Digite o nome da música, artista ou álbum no campo acima</p>
          </div>
        )}
      </div>
    </div>
  );
}
