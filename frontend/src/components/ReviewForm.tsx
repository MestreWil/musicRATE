"use client";
import { useState } from 'react';
import { RatingStars } from './RatingStars';
import { apiPost } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  entityType: 'album' | 'track' | 'artist';
  entityId: string;
  minLength?: number;
}

export function ReviewForm({ entityType, entityId, minLength = 10 }: ReviewFormProps) {
  const [text, setText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isValid = rating > 0 && text.trim().length >= minLength;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await apiPost('/reviews', {
        entityType,
        entityId,
        rating,
        text: text.trim(),
      });
      setText('');
      setRating(0);
      // Atualiza dados do server component (quando houver integração real)
      router.refresh();
    } catch (err: any) {
      setError(err?.message || 'Falha ao enviar review');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-full bg-neutral-700 grid place-items-center text-neutral-300">👤</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-sm text-neutral-300">Sua avaliação:</span>
          <RatingStars value={rating} onChange={setRating} />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Faça sua Review aqui"
          rows={2}
          className="w-full rounded-md bg-neutral-900 border border-neutral-800 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-500"
        />
        <div className="mt-1 text-xs text-neutral-500">
          {text.trim().length}/{minLength} caracteres mínimos
        </div>
        {error && <div className="mt-1 text-xs text-red-500">{error}</div>}
      </div>
      <button
        type="submit"
        disabled={!isValid || submitting}
        className="h-11 px-4 rounded-md bg-red-600 disabled:bg-neutral-700 disabled:text-neutral-400 hover:bg-red-500 text-white text-sm font-medium"
      >
        {submitting ? 'Enviando...' : 'Send'}
      </button>
    </form>
  );
}
