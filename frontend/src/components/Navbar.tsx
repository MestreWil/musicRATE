"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/useAuth';

const links = [
  { href: '/', label: 'Início' },
  { href: '/artists', label: 'Artistas' },
  { href: '/albums', label: 'Álbuns' },
  { href: '/tracks', label: 'Faixas' }
];

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [openMenu, setOpenMenu] = useState(false);
  const [query, setQuery] = useState('');
  const { authenticated, user, loading } = useAuth();

  const currentUrl = typeof window !== 'undefined'
    ? `${window.location.origin}${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ''}`
    : pathname;
  const loginHref = `/login?return_to=${encodeURIComponent(currentUrl)}`;

  return (
    <header className="sticky top-0 z-40 bg-neutral-900 text-white border-b-4 border-red-600">
      <nav className="max-w-7xl mx-auto flex items-center gap-4 px-4 lg:px-6 h-20 text-sm">
        {/* Botão menu hamburguer */}
        <button
          className="p-2 rounded hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          aria-label="Abrir menu"
          onClick={() => setOpenMenu(o => !o)}
        >
          <div className="space-y-1.5">
            <span className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${openMenu ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-opacity duration-300 ${openMenu ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-current transition-transform duration-300 ${openMenu ? '-rotate-45 -translate-y-2' : ''}`} />
          </div>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center group" aria-label="Página inicial">
          <Image
            src="/logo.png"
            alt="MusicRate"
            width={118}
            height={32}
            priority
            className="h-10 w-auto select-none transition-all duration-300 group-hover:opacity-80 group-hover:scale-105"
          />
        </Link>

        {/* Barra de busca - apenas desktop */}
        <div className="flex-1 hidden md:flex justify-center">
          <form
            onSubmit={(e) => { 
              e.preventDefault(); 
              if (query.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
              }
            }}
            className="relative w-full max-w-xl"
            role="search"
            aria-label="Buscar"
          >
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="What we gonna listen today?"
              className="w-full bg-white text-neutral-900 placeholder:text-neutral-400 rounded-md h-10 pl-4 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-500 transition-colors"
              aria-label="Buscar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors text-xl leading-none"
                aria-label="Limpar busca"
              >×</button>
            )}
          </form>
        </div>

        {/* Ações lado direito */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Notificações */}
          <button className="relative flex flex-col items-center text-[11px] font-medium hover:text-red-400 transition-colors">
            <span className="relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">2</span>
            </span>
            <span className="hidden xl:inline mt-0.5">Notifications</span>
          </button>

          {/* Divider */}
          <span className="hidden md:inline h-6 w-px bg-neutral-700" aria-hidden="true" />

          {/* Usuário / Avatar / Login */}
          <div className="flex items-center gap-2">
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-neutral-700 animate-pulse" />
                <span className="hidden md:inline text-sm text-neutral-500">...</span>
              </div>
            ) : authenticated && user ? (
              // Usuário logado - mostrar avatar e nome
              <Link href="/profile" aria-label="Abrir perfil" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-neutral-300 text-neutral-700 grid place-items-center text-xs overflow-hidden ring-2 ring-transparent group-hover:ring-red-400 transition-all">
                  {user.avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="select-none font-medium">{user.name.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden md:inline text-sm group-hover:text-red-400 transition-colors">{user.name} ▾</span>
              </Link>
            ) : (
              // Não logado - botão "Acessar"
              <Link 
                href={loginHref} 
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md transition-colors font-medium text-sm"
                aria-label="Acessar com Spotify"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                </svg>
                <span>Acessar</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Menu mobile dropdown com transição suave */}
      <div 
        className={`
          border-t border-neutral-800 bg-neutral-900 overflow-hidden
          transition-all duration-300 ease-in-out
          ${openMenu ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="px-4 py-4 space-y-3">
          {/* Barra de busca mobile - apenas em telas pequenas */}
          <form
            onSubmit={(e) => { 
              e.preventDefault(); 
              setOpenMenu(false);
              if (query.trim()) {
                window.location.href = `/search?q=${encodeURIComponent(query)}`;
              }
            }}
            className="relative md:hidden"
            role="search"
          >
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-neutral-800 rounded-md h-10 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition-shadow"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-400 transition-colors" 
              aria-label="Buscar"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
          </form>

          {/* Links de navegação */}
          <ul className="grid gap-1">
            {links.map(l => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                      active 
                        ? 'bg-red-600 text-white' 
                        : 'hover:bg-neutral-800 text-neutral-200'
                    }`}
                    onClick={() => setOpenMenu(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Botão Acessar (apenas se não estiver logado) */}
          {!authenticated && !loading && (
            <Link 
              href={loginHref} 
              className="flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 rounded-md py-2.5 text-sm font-medium transition-colors" 
              onClick={() => setOpenMenu(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
              </svg>
              Acessar com Spotify
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
