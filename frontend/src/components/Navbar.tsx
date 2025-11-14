"use client";
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

// Placeholder de logo: substitua <div className="logo-circle"/> por <Image src="/logo.png" ... /> quando tiver o arquivo.

const links = [
  { href: '/', label: 'Início' },
  { href: '/artists', label: 'Artistas' },
  { href: '/albums', label: 'Álbuns' },
  { href: '/tracks', label: 'Faixas' },
  { href: '/trending', label: 'Tendências' }
];

export function Navbar() {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState(false);
  const [query, setQuery] = useState('');

  return (
    <header className="sticky top-0 z-40 bg-neutral-900 text-white border-b-4 border-red-600">
      <nav className="max-w-7xl mx-auto flex items-center gap-4 px-4 lg:px-6 h-20 text-sm">
        {/* Botão menu */}
        <button
          className="p-2 rounded hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          aria-label="Abrir menu"
          onClick={() => setOpenMenu(o => !o)}
        >
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current mb-1" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center" aria-label="Página inicial">
          <Image
            src="/logo.png"
            alt="MusicRate"
            width={118}
            height={32}
            priority
            className="h-10 w-auto select-none"
          />
        </Link>

        {/* Barra de busca custom */}
        <div className="flex-1 hidden md:flex justify-center">
          <form
            onSubmit={(e) => { e.preventDefault(); /* futura navegação /search?q= */ }}
            className="relative w-full max-w-xl"
            role="search"
            aria-label="Buscar"
          >
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="What we gonna listen today?"
              className="w-full bg-white text-neutral-900 placeholder:text-neutral-400 rounded-md h-10 pl-4 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-red-600 hover:text-red-500"
              aria-label="Buscar"
            >
              {/* Ícone lupa */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-8 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label="Limpar busca"
              >×</button>
            )}
          </form>
        </div>

        {/* Links removidos do header em telas grandes – agora apenas dentro do menu hamburguer */}

        {/* Ações lado direito */}
        <div className="flex items-center gap-6 ml-auto">
          {/* Notificações */}
          <button className="relative flex flex-col items-center text-[11px] font-medium hover:text-red-400">
            <span className="relative">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" /><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" /></svg>
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">2</span>
            </span>
            <span className="hidden xl:inline mt-0.5">Notifications</span>
          </button>

            {/* Divider */}
            <span className="hidden md:inline h-6 w-px bg-neutral-700" aria-hidden="true" />

          {/* Usuário / Avatar */}
          <div className="flex items-center gap-2">
            {/* FUTURO: trocar /profile por /login se não autenticado; pegar displayName e avatar reais da API */}
            <Link href="/profile" aria-label="Abrir perfil" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-neutral-300 text-neutral-700 grid place-items-center text-xs overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {/* FUTURO: quando houver avatar real, renderizar <img src={user.avatar} alt="" /> */}
                <span className="select-none">ME</span>
              </div>
              <span className="hidden md:inline text-sm group-hover:text-red-400">Me ▾</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Menu mobile dropdown */}
      {openMenu && (
        <div className="border-t border-neutral-800 bg-neutral-900 px-4 py-3 space-y-2">
          <form
            onSubmit={(e) => { e.preventDefault(); setOpenMenu(false); }}
            className="relative"
            role="search"
          >
            <input
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full bg-neutral-800 rounded-md h-10 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" aria-label="Buscar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </button>
          </form>
          <ul className="grid gap-1">
            {links.map(l => {
              const active = pathname === l.href;
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className={`block px-3 py-2 rounded-md text-sm ${active ? 'bg-red-600 text-white' : 'hover:bg-neutral-800 text-neutral-200'}`}
                    onClick={() => setOpenMenu(false)}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-2 pt-2">
            <button className="flex-1 border border-neutral-700 rounded-md py-2 text-sm hover:bg-neutral-800">Login</button>
            <button className="flex-1 bg-red-600 rounded-md py-2 text-sm hover:bg-red-500">Sign up</button>
          </div>
        </div>
      )}
    </header>
  );
}
