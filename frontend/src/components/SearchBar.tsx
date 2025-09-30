"use client";
import { useState } from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (q: string) => void;
  delay?: number;
}

export function SearchBar({ placeholder = 'Buscar...', onSearch, delay = 400 }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setValue(v);
    if (timer) clearTimeout(timer);
    const t = setTimeout(() => onSearch?.(v.trim()), delay);
    setTimer(t);
  }

  return (
    <div className="w-full max-w-md relative">
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white"
      />
      {value && (
        <button
          onClick={() => { setValue(''); onSearch?.(''); }}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-neutral-500 hover:text-neutral-700"
        >Limpar</button>
      )}
    </div>
  );
}
