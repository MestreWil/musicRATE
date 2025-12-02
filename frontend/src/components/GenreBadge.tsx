"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export interface GenreBadgeProps {
  id: string;
  name: string;
  slug: string;
  image?: string;
  icons?: { url: string }[];
}

// Cores de gradiente para fallback
const gradientColors = [
  'from-red-500 to-orange-600',
  'from-pink-500 to-purple-600',
  'from-blue-500 to-indigo-600',
  'from-cyan-500 to-blue-600',
  'from-green-500 to-teal-600',
  'from-yellow-500 to-orange-600',
  'from-purple-500 to-pink-600',
  'from-indigo-500 to-purple-600',
];

export function GenreBadge({ id, name, slug, image, icons }: GenreBadgeProps) {
  const [imageError, setImageError] = useState(false);
  
  // Usar imagem se disponível, senão usar ícone da categoria do Spotify
  const imageUrl = image || icons?.[0]?.url;
  
  // Selecionar cor baseada no nome
  const colorIndex = name.charCodeAt(0) % gradientColors.length;
  const gradientColor = gradientColors[colorIndex];
  
  return (
    <Link
      href={`/genres/${slug}`}
      className="group relative flex-shrink-0 w-[180px] h-[180px] rounded-xl overflow-hidden bg-gradient-to-br from-neutral-800 to-neutral-900 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
    >
      {/* Imagem de fundo ou gradiente colorido */}
      {imageUrl && !imageError ? (
        <div className="absolute inset-0">
          <Image 
            src={imageUrl} 
            alt={name} 
            fill 
            sizes="180px"
            className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
            onError={() => setImageError(true)}
          />
          {/* Overlay gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-br ${gradientColor} opacity-80`} />
      )}
      
      {/* Texto do gênero */}
      <div className="absolute inset-0 flex items-end p-4">
        <span className="text-white font-bold text-lg drop-shadow-lg group-hover:underline z-10 uppercase">
          {name}
        </span>
      </div>
      
      {/* Badge de ícone (canto superior) */}
      <div className="absolute top-3 right-3 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="white" viewBox="0 0 16 16">
          <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0M8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m.256 7a4.5 4.5 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10q.39 0 .74.025c.226-.341.496-.65.804-.918Q8.844 9.002 8 9c-5 0-6 3-6 4s1 1 1 1z"/>
          <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-1.993-1.679a.5.5 0 0 0-.686.172l-1.17 1.95-.547-.547a.5.5 0 0 0-.708.708l.774.773a.75.75 0 0 0 1.174-.144l1.335-2.226a.5.5 0 0 0-.172-.686"/>
        </svg>
      </div>
    </Link>
  );
}
