import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-black text-white flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="text-8xl mb-4">🎤</div>
          <h1 className="text-6xl font-bold mb-4">404</h1>
        </div>
        
        <h2 className="text-3xl font-bold mb-4">Artista não encontrado</h2>
        
        <p className="text-neutral-400 text-lg mb-8 leading-relaxed">
          O artista que você procura não existe ou foi removido. 
          Talvez você tenha digitado um ID incorreto ou o link esteja quebrado.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/" 
            className="px-6 py-3 bg-red-600 hover:bg-red-700 rounded-full font-medium transition-colors"
          >
            Voltar para o início
          </Link>
          <Link 
            href="/search" 
            className="px-6 py-3 bg-neutral-800 hover:bg-neutral-700 rounded-full font-medium transition-colors"
          >
            Buscar artistas
          </Link>
        </div>
      </div>
    </div>
  );
}
