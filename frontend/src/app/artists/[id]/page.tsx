import Image from 'next/image';
import Link from 'next/link';
import { getMockArtistDetail, getMockAlbumDetail } from '@/lib/mockData';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { FollowButton } from '@/components/FollowButton';

function Stars({ value, size = 16, prefix = 'star' }: Readonly<{ value: number; size?: number; prefix?: string }>) {
  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const n = i + 1;
        const fraction = Math.max(0, Math.min(1, value - (n - 1)));
        const percent = Math.round(fraction * 100);
        return (
          <span key={`${prefix}-${n}`} className="relative inline-block" style={{ width: size, height: size }}>
            <svg width={size} height={size} viewBox="0 0 20 20" className="absolute left-0 top-0 text-neutral-500">
              <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" fill="none" stroke="currentColor" />
            </svg>
            <div className="absolute left-0 top-0 overflow-hidden" style={{ width: `${percent}%`, height: size }}>
              <svg width={size} height={size} viewBox="0 0 20 20" className="text-yellow-500">
                <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" fill="currentColor" stroke="currentColor" />
              </svg>
            </div>
          </span>
        );
      })}
    </div>
  );
}

interface Params { params: Promise<{ id: string }> }

export default async function ArtistDetailPage({ params }: Readonly<Params>) {
  const { id } = await params;
  const artist = getMockArtistDetail(id);

  if (!artist) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10 text-neutral-200">
        <h1 className="text-2xl font-bold">Artista não encontrado</h1>
        <Link href="/artists" className="text-red-400 hover:underline mt-2 inline-block">Voltar</Link>
      </div>
    );
  }

  // calcula média do artista a partir das médias dos álbuns
  const albumAverages = (artist.albums ?? [])
    .map(al => getMockAlbumDetail(al.id)?.avgRating)
    .filter((n): n is number => typeof n === 'number');
  const artistAvg = albumAverages.length
    ? albumAverages.reduce((a, b) => a + b, 0) / albumAverages.length
    : null;


  return (
    <div className="bg-neutral-950 text-neutral-100">
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="rounded-2xl overflow-hidden bg-neutral-800/40">
          <div className="relative w-full h-48 md:h-56">
            {artist.bannerImage ? (
              <Image src={artist.bannerImage} alt="Banner" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-neutral-800" />
            )}
            {/* Overlay suave apenas para dar contraste na borda inferior */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
          </div>
        </div>
      </section>

      {/* Header do perfil */}
      <section className="max-w-7xl mx-auto px-6">
        {/* Grid com 2 colunas: esquerda (avatar+nome+@), direita (métricas e ações) */}
  <div className="relative -mt-5 md:-mt-6 grid grid-cols-[auto_1fr] gap-4 items-end px-3 md:px-6">
          {/* Coluna esquerda: Avatar e abaixo Nome/@ */}
          <div className="min-w-[6rem]">
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-3 ring-red-600 -mt-10 md:-mt-16">
              {artist.image ? (
                <Image src={artist.image} alt={artist.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-700" />
              )}
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 border-2 border-neutral-900" aria-hidden="true" />
            </div>
            <div className="mt-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-extrabold text-neutral-100 truncate max-w-[12ch] sm:max-w-[18ch]">{artist.name}</h1>
                  {artist.verified && <VerifiedBadge size={14} className="text-red-600" />}
                </div>
              <div className="text-sm text-neutral-400 truncate max-w-[22ch] mb-2 md:mb-3">{artist.handle || '@artist'}</div>
            </div>
          </div>

          {/* Coluna direita: métricas e ações alinhadas à direita */}
          <div className="flex items-center justify-end gap-6 text-sm">
            <div><span className="font-semibold text-neutral-100">{Intl.NumberFormat('en-US').format(artist.followersCount ?? artist.followers ?? 0)}</span> <span className="text-neutral-400">Followers</span></div>
            <div><span className="font-semibold text-neutral-100">{Intl.NumberFormat('en-US').format(artist.followingCount ?? 0)}</span> <span className="text-neutral-400">Follow</span></div>
            {typeof artistAvg === 'number' && (
              <div className="flex items-center gap-2">
                <Stars value={artistAvg} size={16} prefix={`artist-${artist.id}`} />
                <span className="text-neutral-300">{artistAvg.toFixed(1)}<span className="text-neutral-500"> / 5</span></span>
              </div>
            )}
            <FollowButton artistId={id} />
            <button className="rounded-full border border-neutral-700 h-9 w-9 grid place-items-center text-neutral-300" aria-label="Notificações">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
            </button>
          </div>
        </div>

  {/* Pontos de status e bio abaixo, alinhados com o nome/@ (sem indent adicional) */}
  <div className="mt-4 md:mt-5 px-3 md:px-6">
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neutral-500 inline-block"/> Lorem ipsum</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neutral-500 inline-block"/> Lorem ipsum</div>
          </div>
          <p className="mt-3 text-neutral-300 text-sm leading-relaxed max-w-3xl">{artist.bio}</p>
        </div>
      </section>

      {/* Abas simples */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <div className="border-b border-neutral-800 text-sm flex gap-6">
          <button className="py-2 text-red-500 border-b-2 border-red-500">Albums</button>
          <button className="py-2 text-neutral-400">Playlists</button>
          <button className="py-2 text-neutral-400">Highlights</button>
        </div>
      </section>

      {/* Lista de álbuns do artista */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {artist.albums?.map(al => (
            <Link key={al.id} href={`/albums/${al.id}`} className="block">
              <div className="grid grid-cols-[120px_1fr] gap-4 rounded-xl border border-neutral-800 bg-neutral-900/60 p-3 hover:bg-neutral-900">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-neutral-800">
                  {al.image ? (
                    <Image src={al.image} alt={al.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <div className="text-neutral-200 font-semibold">{al.name} <span className="text-neutral-400 font-normal">{al.year ? ` ${al.year}` : ''}</span></div>
                  <div className="text-sm text-red-400">{artist.name}</div>
                  {typeof getMockAlbumDetail(al.id)?.avgRating === 'number' && (
                    <div className="mt-1 flex items-center gap-2">
                      <Stars value={getMockAlbumDetail(al.id)!.avgRating!} size={16} prefix={`al-${al.id}`} />
                      <span className="text-xs text-neutral-300">{getMockAlbumDetail(al.id)!.avgRating!.toFixed(1)}<span className="text-neutral-500">/5</span></span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
