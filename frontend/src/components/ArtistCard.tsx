"use client";
import Image from 'next/image';
import Link from 'next/link';
import { FollowButton } from './FollowButton';

// Ícone de pessoas (seguidores)
function PeopleIcon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="16" 
      height="16" 
      fill="currentColor" 
      viewBox="0 0 16 16"
      className={className}
    >
      <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5"/>
    </svg>
  );
}

export interface ArtistCardProps {
  id: string;
  name: string;
  image?: string | null;
  followers?: number;
  genres?: string[];
  popularity?: number;
}

export function ArtistCard({ id, name, image, followers, genres, popularity }: ArtistCardProps) {
  // Formatar número de seguidores
  const formatFollowers = (count?: number) => {
    if (!count) return null;
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`;
    }
    return count.toString();
  };

  // Definir cor de fundo gradiente baseado em popularidade ou aleatório
  const getBackgroundGradient = () => {
    const gradients = [
      'from-blue-500/20 to-blue-700/40',
      'from-purple-500/20 to-purple-700/40',
      'from-pink-500/20 to-pink-700/40',
      'from-green-500/20 to-green-700/40',
      'from-orange-500/20 to-orange-700/40',
      'from-red-500/20 to-red-700/40',
      'from-teal-500/20 to-teal-700/40',
      'from-indigo-500/20 to-indigo-700/40',
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <div className={`
      group flex-shrink-0 w-[200px] sm:w-[220px] md:w-[240px] 
      flex flex-col gap-4 p-5 rounded-xl 
      bg-gradient-to-br ${getBackgroundGradient()}
      hover:scale-[1.02] transition-all duration-300 
      shadow-lg hover:shadow-2xl
      relative overflow-hidden
      min-h-[340px]
    `}>
      {/* Conteúdo do card */}
      <div className="flex flex-col items-center gap-3 text-center h-full">
        {/* Foto do artista - circular */}
        <Link href={`/artists/${id}`} className="relative w-32 h-32 shrink-0 rounded-full overflow-hidden bg-neutral-800 ring-4 ring-white/10 group-hover:ring-white/20 transition-all shadow-xl">
          {image ? (
            <Image 
              src={image} 
              alt={name} 
              fill 
              sizes="128px" 
              className="object-cover group-hover:scale-110 transition-transform duration-300" 
            />
          ) : (
            <div className="w-full h-full grid place-items-center text-2xl text-neutral-500">
              🎤
            </div>
          )}
        </Link>

        {/* Nome do artista */}
        <div className="min-w-0 w-full">
          <Link href={`/artists/${id}`}>
            <h3 className="font-bold text-lg text-white truncate hover:underline cursor-pointer">
              {name}
            </h3>
          </Link>
          
          {/* Gênero - altura fixa para consistência */}
          <div className="h-5 mt-0.5">
            {genres && genres.length > 0 && (
              <p className="text-xs text-white/70 capitalize truncate">
                {genres[0]}
              </p>
            )}
          </div>
        </div>

        {/* Estatísticas - altura fixa */}
        <div className="flex items-center gap-3 text-sm h-6">
          {followers && (
            <div className="flex items-center gap-1.5 text-white/90">
              <PeopleIcon className="text-red-400" />
              <span className="font-semibold">{formatFollowers(followers)}</span>
            </div>
          )}
          {/* Removido popularity/estrelas - será substituído por média de reviews */}
        </div>

        {/* Spacer para empurrar o botão para o final */}
        <div className="flex-grow" />

        {/* Botão Follow - sempre no mesmo lugar */}
        <div className="w-full mt-auto">
          <FollowButton artistId={id} />
        </div>
      </div>
    </div>
  );
}
