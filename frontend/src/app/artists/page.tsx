'use client';

import { useState, useEffect } from 'react';
import { searchArtists } from '@/lib/spotify';
import { Artist } from '@/lib/types';
import { ArtistCard } from '@/components/ArtistCard';

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const genres = [
    { value: 'all', label: 'Todos os Gêneros' },
    { value: 'rock', label: 'Rock' },
    { value: 'pop', label: 'Pop' },
    { value: 'indie', label: 'Indie' },
    { value: 'electronic', label: 'Eletrônica' },
    { value: 'hip hop', label: 'Hip Hop' },
    { value: 'jazz', label: 'Jazz' },
    { value: 'metal', label: 'Metal' },
    { value: 'folk', label: 'Folk' },
    { value: 'r&b', label: 'R&B' },
  ];

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    setLoading(true);
    try {
      // Busca inicial com termo genérico
      const result = await searchArtists('indie rock pop', 50);
      setArtists(result.items);
    } catch (error) {
      console.error('Erro ao carregar artistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadArtists();
      return;
    }

    setLoading(true);
    try {
      const result = await searchArtists(searchQuery, 50);
      setArtists(result.items);
    } catch (error) {
      console.error('Erro ao buscar artistas:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists
    .filter(artist => {
      if (genre === 'all') return true;
      return artist.genres?.some(g => g.toLowerCase().includes(genre.toLowerCase()));
    })
    .sort((a, b) => {
      if (sortBy === 'popularity') {
        return (b.popularity || 0) - (a.popularity || 0);
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'followers') {
        return (b.followers || 0) - (a.followers || 0);
      }
      return 0;
    });

  return (
    <div className="bg-black text-white pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Artistas</h1>
          <p className="text-neutral-400">Descubra e explore artistas de todo o mundo</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar artistas..."
              className="flex-1 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>

          {/* Genre and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Gênero</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                {genres.map(g => (
                  <option key={g.value} value={g.value}>{g.label}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="popularity">Popularidade</option>
                <option value="name">Nome (A-Z)</option>
                <option value="followers">Seguidores</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-neutral-400">
          {loading ? (
            'Carregando...'
          ) : (
            `${filteredArtists.length} ${filteredArtists.length === 1 ? 'artista encontrado' : 'artistas encontrados'}`
          )}
        </div>

        {/* Artists Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-lg bg-neutral-800 mb-3" />
                <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-neutral-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredArtists.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {filteredArtists.map((artist) => (
              <ArtistCard
                key={artist.id}
                id={artist.id}
                name={artist.name}
                image={artist.image}
                followers={artist.followers}
                genres={artist.genres}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎤</div>
            <p className="text-xl text-neutral-400 mb-2">Nenhum artista encontrado</p>
            <p className="text-neutral-500">Tente ajustar os filtros ou fazer uma nova busca</p>
          </div>
        )}
      </div>
    </div>
  );
}
