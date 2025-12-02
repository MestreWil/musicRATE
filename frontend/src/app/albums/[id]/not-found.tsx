import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="bg-black text-white flex items-center justify-center px-4 py-24">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <span className="text-8xl">💿</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">Álbum não encontrado</h1>
        <p className="text-neutral-400 mb-8">
          O álbum que você está procurando não existe ou foi removido.
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
            Fazer uma busca
          </Link>
        </div>
      </div>
    </div>
  );
}
