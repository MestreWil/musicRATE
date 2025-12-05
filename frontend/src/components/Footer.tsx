import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-neutral-900 text-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Top: Brand + Social */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Se você tiver um arquivo /logo.png, ele será exibido aqui */}
            <Link href="/" aria-label="Página inicial" className="flex items-center gap-2">
              <Image src="/logo.png" alt="MusicRate" width={130} height={32} className="h-8 w-auto" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            {[
              { label: 'Facebook', href: '#', src: '/social/facebook.svg' },
              { label: 'Instagram', href: '#', src: '/social/instagram.svg' },
              { label: 'X', href: '#', src: '/social/x.svg' },
              { label: 'YouTube', href: '#', src: '/social/youtube.svg' },
            ].map((s) => (
              <a key={s.label} href={s.href} aria-label={s.label} className="h-9 w-9 grid place-items-center rounded-md bg-red-600 hover:bg-red-500">
                {/* Use imagens oficiais em /public/social/. Ajuste o path se necessário. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.src} alt="" className="h-4 w-4 object-contain" />
              </a>
            ))}
          </div>
        </div>

        <hr className="my-6 border-neutral-800" />

        {/* Middle: Grid content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <h3 className="text-neutral-400 mb-2">Call Us</h3>
            <p>(51) 98484-4424</p>
            <p>(92) 98147-1090</p>
          </div>
          <div>
            <h3 className="text-neutral-400 mb-2">Infos</h3>
            <p>About us</p>
            <p>Porto Alegre, RS - Brazil</p>
          </div>
          <div>
            <h3 className="text-neutral-400 mb-2">E-mail Us</h3>
            <p>musicrate@gmail.com</p>
          </div>
        </div>

        <hr className="my-6 border-neutral-800" />

        {/* Bottom: Apps + Language */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h3 className="text-neutral-400 mb-3">Apps</h3>
            {/* Recomendado: baixe os badges oficiais e salve em /public/badges/
                - App Store: https://developer.apple.com/app-store/marketing/guidelines/
                - Google Play: https://play.google.com/intl/en_us/badges/ */}
            <div className="flex items-center gap-4">
              <a href="#" aria-label="App Store" className="inline-block">
                {/* Usar <img> (não next/image) para evitar erro caso o arquivo não exista ainda */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/badges/app-store.svg" alt="Download on the App Store" className="block h-10 md:h-11 w-auto"/>
              </a>
              <a href="#" aria-label="Google Play" className="inline-block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/badges/google-play.svg" alt="Get it on Google Play" className="block h-10 md:h-16 w-auto"/>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-neutral-400 mb-3">Language</h3>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm hover:bg-neutral-700">Português</button>
              <button className="px-3 py-1.5 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-200 text-sm hover:bg-neutral-700">Español</button>
              <button className="px-3 py-1.5 rounded-md bg-neutral-700 text-neutral-100 text-sm">English</button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-xs text-neutral-500">MusicRate © {year}</div>
      </div>
    </footer>
  );
}
