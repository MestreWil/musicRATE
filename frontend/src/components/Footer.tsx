export function Footer() {
  return (
    <footer className="border-t border-border mt-16 py-10 text-sm text-neutral-500 dark:text-neutral-400">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-2">
        <p>MusicRate © {new Date().getFullYear()} – Plataforma para destacar artistas independentes.</p>
        <p className="text-xs">Versão inicial. Feedbacks são bem-vindos.</p>
      </div>
    </footer>
  );
}
