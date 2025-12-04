'use client';

import { useState, useEffect } from 'react';
import { searchAlbums, getNewReleases } from '@/lib/spotify';
import { Album } from '@/lib/types';
import { AlbumCard } from '@/components/AlbumCard';

export default function AlbumsPage() {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    loadAlbums();
  }, []);

  const loadAlbums = async () => {
    setLoading(true);
    try {
      // Carrega novos lançamentos por padrão
      const result = await getNewReleases(50);
      setAlbums(result.items);
    } catch (error) {
      console.error('Erro ao carregar álbuns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      loadAlbums();
      return;
    }

    setLoading(true);
    try {
      const result = await searchAlbums(searchQuery, 50);
      setAlbums(result.items);
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlbums = albums
    .filter(album => {
      if (filterType === 'all') return true;
      if (filterType === 'album') return (album.totalTracks || 0) > 3;
      if (filterType === 'single') return (album.totalTracks || 0) <= 3;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.releaseDate || 0).getTime() - new Date(a.releaseDate || 0).getTime();
      } else if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'artist') {
        return (a.artists[0]?.name || '').localeCompare(b.artists[0]?.name || '');
      }
      return 0;
    });

  return (
    <div className="bg-black text-white pt-8 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Álbuns</h1>
          <p className="text-neutral-400">Explore os lançamentos mais recentes e populares</p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar álbuns ou artistas..."
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

          {/* Type and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Tipo</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="all">Todos</option>
                <option value="album">Álbuns (4+ faixas)</option>
                <option value="single">Singles/EPs (até 3 faixas)</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium text-neutral-400 mb-2">Ordenar por</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
              >
                <option value="recent">Mais Recentes</option>
                <option value="name">Nome (A-Z)</option>
                <option value="artist">Artista (A-Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="mb-6 text-sm text-neutral-400">
          {loading ? (
            'Carregando...'
          ) : (
            `${filteredAlbums.length} ${filteredAlbums.length === 1 ? 'resultado encontrado' : 'resultados encontrados'}`
          )}
        </div>

        {/* Albums Grid */}
        {loading ? (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[640px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4 min-[1280px]:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-lg bg-neutral-800 mb-3" />
                <div className="h-4 bg-neutral-800 rounded w-3/4 mb-2" />
                <div className="h-3 bg-neutral-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : filteredAlbums.length > 0 ? (
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 min-[640px]:grid-cols-2 min-[768px]:grid-cols-3 min-[1024px]:grid-cols-4 min-[1280px]:grid-cols-5 gap-4 sm:gap-6 justify-items-center">
            {filteredAlbums.map((album) => (
              <AlbumCard
                key={album.id}
                id={album.id}
                name={album.name}
                image={album.image}
                artists={album.artists}
                releaseDate={album.releaseDate}
                totalTracks={album.totalTracks}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💿</div>
            <p className="text-xl text-neutral-400 mb-2">Nenhum álbum encontrado</p>
            <p className="text-neutral-500">Tente ajustar os filtros ou fazer uma nova busca</p>
          </div>
        )}
      </div>
    </div>
  );
}
