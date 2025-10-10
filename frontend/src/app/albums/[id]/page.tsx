import Image from 'next/image';
import Link from 'next/link';
import { getMockAlbumDetail } from '@/lib/mockData';
import { TrackListItem } from '@/components/TrackListItem';
import { ReviewCard } from '@/components/ReviewCard';

interface Params { params: Promise<{ id: string }> }

export default async function AlbumDetailPage({ params }: Params) {
  const { id } = await params;
  const album = getMockAlbumDetail(id);

  if (!album) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 text-neutral-200">
        <h1 className="text-2xl font-bold">Álbum não encontrado</h1>
        <p className="mt-2 text-neutral-400">Verifique o link ou volte à página inicial.</p>
        <Link href="/" className="text-red-400 hover:underline mt-4 inline-block">Voltar</Link>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950">
      {/* Hero com info do álbum */}
      <section className="max-w-7xl mx-auto px-6 pt-8 pb-6">
        <div className="rounded-xl bg-gradient-to-r from-sky-900/40 to-blue-700/30 border border-neutral-800 p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-[220px_1fr_320px] gap-5 items-start">
            {/* Capa */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-800">
              {album.image ? (
                <Image src={album.image} alt={album.name} fill sizes="220px" className="object-cover" />
              ) : (
                <div className="w-full h-full grid place-items-center text-neutral-500">Sem capa</div>
              )}
            </div>
            {/* Info principal */}
            <div className="min-w-0 text-neutral-100">
              <h1 className="text-3xl font-bold">{album.name}</h1>
              <p className="text-neutral-300">{album.artists.map(a => a.name).join(', ')}</p>
              <div className="mt-3 text-sm text-neutral-300 space-y-1">
                {album.genres && <p><span className="text-neutral-400">Gênero:</span> {album.genres.join(', ')}</p>}
                {album.year && <p><span className="text-neutral-400">Release:</span> {album.year}</p>}
                {album.label && <p><span className="text-neutral-400">Label:</span> {album.label}</p>}
                {typeof album.totalTracks === 'number' && <p><span className="text-neutral-400">Faixas:</span> {album.totalTracks}</p>}
              </div>
              {album.youtubeUrl && (
                <a href={album.youtubeUrl} target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 bg-neutral-200 text-neutral-900 px-4 py-2 rounded-md text-sm font-medium hover:bg-white">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.6 3.5 12 3.5 12 3.5s-7.6 0-9.4.6A3 3 0 0 0 .5 6.2 31.9 31.9 0 0 0 0 12a31.9 31.9 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.8.6 9.4.6 9.4.6s7.6 0 9.4-.6a3 3 0 0 0 2.1-2.1c.5-1.8.5-5.8.5-5.8s0-4-.5-5.8ZM9.8 15.5v-7l6.1 3.5-6.1 3.5Z"/></svg>
                  Escute no YouTube
                </a>
              )}
            </div>
            {/* Lista de faixas */}
            <div className="rounded-lg bg-neutral-900/60 border border-neutral-800 p-3 max-h-[280px] overflow-y-auto">
              <div className="space-y-2">
                {album.tracks.map(t => (
                  <TrackListItem key={t.id} track={t} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Banner/cta lateral (placeholder vermelho do wireframe) */}
      <section className="max-w-7xl mx-auto px-6 pb-8">
        <div className="rounded-lg bg-red-700/80 h-40 md:h-56 border border-red-900" />
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <h2 className="text-neutral-200 text-base font-semibold mb-4">Reviews</h2>

  {/* Caixa de review (mock). Para interatividade real, converta para Client Component. */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-neutral-700 grid place-items-center text-neutral-300">👤</div>
          <input className="flex-1 h-11 rounded-md bg-neutral-900 border border-neutral-800 px-3 text-sm text-neutral-100 placeholder:text-neutral-500" placeholder="Faça sua Review aqui" />
          <button className="h-11 px-4 rounded-md bg-red-600 hover:bg-red-500 text-white text-sm font-medium">Send</button>
        </div>

        {/* Lista de reviews mock */}
        <div className="grid md:grid-cols-2 gap-4">
          <ReviewCard author="MestreWILL" rating={5} text="Achei o álbum equilibrado e dinâmico. As músicas variam entre faixas animadas e momentos mais introspectivos. Excelente trabalho!" />
          <ReviewCard author="Usuário 2" rating={4} text="Ótima produção e coesão geral." />
        </div>
      </section>
    </div>
  );
}
