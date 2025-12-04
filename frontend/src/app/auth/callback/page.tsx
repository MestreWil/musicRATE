"use client";
import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function CallbackContent() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const token = sp.get('token');
    const returnTo = sp.get('return_to') || '/';

    console.log('🔑 Callback received token:', token);
    console.log('📍 Return to:', returnTo);

    if (token) {
      // Salvar token no localStorage
      localStorage.setItem('sanctum_token', token);
      console.log('✅ Token saved to localStorage');
      
      // Verificar se foi salvo
      const saved = localStorage.getItem('sanctum_token');
      console.log('🔍 Token verification:', saved ? 'Found' : 'NOT FOUND');
      
      // Dispatch event to notify auth hooks
      window.dispatchEvent(new CustomEvent('auth:login'));
      
      // Usar router do Next.js em vez de window.location para evitar hard reload
      console.log('🚀 Redirecting to:', returnTo);
      router.push(returnTo);
    } else {
      console.error('❌ No token received, redirecting to login');
      router.push('/login');
    }
  }, [sp, router]);

  return (
    <div className="min-h-[calc(100vh-80px)] grid place-items-center bg-neutral-950 text-neutral-200">
      <div className="text-center">
        <div className="mx-auto w-10 h-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin mb-4" aria-hidden />
        <h1 className="text-lg font-semibold">Finalizing login…</h1>
        <p className="text-sm text-neutral-400 mt-1">You will be redirected shortly.</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100vh-80px)] grid place-items-center bg-neutral-950 text-neutral-200">
        <div className="text-center">
          <div className="mx-auto w-10 h-10 rounded-full border-2 border-red-500 border-t-transparent animate-spin mb-4" aria-hidden />
          <h1 className="text-lg font-semibold">Loading…</h1>
        </div>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
