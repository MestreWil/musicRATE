"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    // After backend sets cookies, redirect to original target
    const returnTo = sp.get('return_to') || '/';
    
    // Dispatch a custom event to notify auth hooks that login completed
    window.dispatchEvent(new CustomEvent('auth:login'));
    
    const delay = setTimeout(() => {
      router.replace(returnTo);
    }, 600);
    return () => clearTimeout(delay);
  }, [router, sp]);

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
