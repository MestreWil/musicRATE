import Image from 'next/image';
import { SpotifyLoginButton } from '@/components/SpotifyLoginButton';

export const metadata = {
  title: 'Login — MusicRate',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-neutral-950">
      {/* Background visual */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,0,0,0.25),transparent_60%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.06),transparent_60%)]" />
        <div className="absolute inset-0 backdrop-blur-[2px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 lg:px-6 py-10 grid place-items-center">
        <div className="w-full max-w-md rounded-xl bg-neutral-900/95 border border-neutral-800 shadow-xl p-6 sm:p-8">
          {/* Small glyph logo replaced by the minimal logo from /public */}
          <Image src="/logo_minimal.png" alt="MusicRate" width={40} height={40} className="mx-auto mb-4 h-10 w-10 object-contain" />
          <h1 className="text-2xl font-bold text-white text-center">Welcome to MusicRATE!</h1>

          {/* Static inputs for layout only */}
          <form className="mt-6 space-y-4" aria-describedby="oauth-note">
            <div>
              <label className="block text-sm text-neutral-300 mb-1" htmlFor="email">E-mail</label>
              <input id="email" placeholder="E-mail" className="w-full h-11 rounded-md bg-neutral-800/80 text-neutral-100 placeholder:text-neutral-400 px-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="block text-sm text-neutral-300 mb-1" htmlFor="password">Password</label>
              <input id="password" type="password" placeholder="Password" className="w-full h-11 rounded-md bg-neutral-800/80 text-neutral-100 placeholder:text-neutral-400 px-3 focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="text-right text-sm">
              <a className="text-neutral-400 hover:text-neutral-200" href="/login#forgot">Forgot password?</a>
            </div>
            <button className="w-full h-11 rounded-md bg-red-600 hover:bg-red-500 text-white font-semibold" type="button" aria-describedby="oauth-note">Enter</button>
            <div className="flex items-center gap-3 text-neutral-400 text-sm select-none">
              <span className="flex-1 h-px bg-neutral-800" />
              <span>or</span>
              <span className="flex-1 h-px bg-neutral-800" />
            </div>
            {/* Social placeholders intentionally non-functional; only Spotify is functional */}
            <button className="w-full h-11 rounded-md bg-[#1877f2] text-white font-semibold opacity-50 cursor-not-allowed" type="button" aria-disabled>Continue with Facebook</button>
            <button className="w-full h-11 rounded-md bg-white text-neutral-900 font-semibold opacity-50 cursor-not-allowed" type="button" aria-disabled>Continue with Google</button>
            <div id="oauth-note" className="sr-only">Login real é feito apenas via OAuth do Spotify</div>
          </form>

          {/* Real OAuth path */}
          <div className="mt-6">
            <SpotifyLoginButton />
          </div>
          <p className="mt-3 text-center text-xs text-neutral-400">We authenticate only with Spotify. Your password is never stored here.</p>
        </div>
      </div>
    </div>
  );
}
