import Image from 'next/image';
import Link from 'next/link';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { getMockUserProfile, getMockUserReviews } from '@/lib/mockData';

export default function UserProfilePage() {
  const user = getMockUserProfile();
  const reviews = getMockUserReviews();

  return (
    <div className="bg-neutral-950 text-neutral-100">
      {/* Banner */}
      <section className="max-w-7xl mx-auto px-6 pt-8">
        <div className="rounded-2xl overflow-hidden bg-neutral-800/40">
          <div className="relative w-full h-40 md:h-56">
            {user.bannerImage ? (
              <Image src={user.bannerImage} alt="Banner" fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-neutral-800" />
            )}
          </div>
        </div>
      </section>

      {/* Header */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="relative -mt-5 md:-mt-6 grid grid-cols-[auto_1fr] gap-4 items-end px-3 md:px-6">
          {/* Avatar + nome */}
          <div className="min-w-[6rem]">
            <div className="relative w-24 h-24 rounded-full overflow-hidden ring-3 ring-red-600 -mt-10 md:-mt-16">
              {user.avatar ? (
                <Image src={user.avatar} alt={user.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-neutral-700" />
              )}
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 border-2 border-neutral-900" aria-hidden="true" />
            </div>
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <h1 className="text-xl md:text-2xl font-extrabold text-neutral-100 truncate">{user.name}</h1>
                {/* Usuário pode ser verificado futuramente */}
                {/* <VerifiedBadge size={14} className="text-red-600" /> */}
              </div>
              <div className="text-sm text-neutral-400 truncate mb-2 md:mb-3">{user.handle}</div>
            </div>
          </div>

          {/* Métricas e ações */}
          <div className="flex items-center justify-end gap-6 text-sm">
            <div><span className="font-semibold text-neutral-100">{Intl.NumberFormat('en-US').format(user.followers ?? 0)}</span> <span className="text-neutral-400">Followers</span></div>
            <div><span className="font-semibold text-neutral-100">{Intl.NumberFormat('en-US').format(user.following ?? 0)}</span> <span className="text-neutral-400">Follow</span></div>
            <button className="rounded-full border border-neutral-700 px-3 py-1.5 text-neutral-300">Edit Profile</button>
          </div>
        </div>

        {/* Status e bio */}
        <div className="mt-5 px-3 md:px-6">
          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neutral-500 inline-block"/> Lorem ipsum</div>
            <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-neutral-500 inline-block"/> Lorem ipsum</div>
          </div>
          {user.bio && (
            <p className="mt-3 text-neutral-300 text-sm leading-relaxed max-w-3xl">{user.bio}</p>
          )}
        </div>
      </section>

      {/* Abas */}
      <section className="max-w-7xl mx-auto px-6 mt-6">
        <div className="border-b border-neutral-800 text-sm flex gap-6">
          <button className="py-2 text-red-500 border-b-2 border-red-500">All Rates</button>
          <button className="py-2 text-neutral-400">Playlists</button>
          <button className="py-2 text-neutral-400">Highlights</button>
        </div>
      </section>

      {/* Lista de avaliações */}
      <section className="max-w-7xl mx-auto px-6 py-6">
        <div className="space-y-4">
          {reviews.map(r => (
            <article key={r.id} className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-3 md:p-4">
              <div className="grid grid-cols-[80px_1fr_auto] gap-4 md:gap-5 items-start">
                <div className="relative w-20 h-20 rounded-md overflow-hidden bg-neutral-800">
                  {r.cover ? (
                    <Image src={r.cover} alt={r.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <div className="min-w-0">
                  <div className="text-neutral-200 font-semibold flex items-center gap-2">
                    {r.title}
                    <span className="text-neutral-400 font-normal">{r.year ?? ''}</span>
                  </div>
                  {r.subtitle && (
                    <div className="text-sm text-red-400">{r.subtitle}</div>
                  )}
                  <div className="text-sm text-neutral-300 mt-2 line-clamp-3">{r.excerpt}</div>
                </div>
                <div className="flex flex-col items-end gap-2 pr-3 md:pr-5 lg:pr-6">
                  {/* Estrelas simples (estático) */}
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} width="16" height="16" viewBox="0 0 20 20" fill={i < r.rating ? 'currentColor' : 'none'} stroke="currentColor" className={i < r.rating ? '' : 'text-neutral-500'}>
                        <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
                      </svg>
                    ))}
                  </div>
                  <div className="text-xs text-neutral-400">{Intl.NumberFormat('en-US').format(r.likes ?? 0)} likes • {Intl.NumberFormat('en-US').format(r.comments ?? 0)} comments</div>
                  <Link href={`/${r.type}s/${r.entityId}`} className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white text-xs font-medium px-3 py-1.5 rounded-md">See Rate</Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
