import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-16">
      <h1 className="text-3xl font-semibold">Club Lúdico</h1>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/login"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Iniciar sesión
        </Link>
        <Link
          href="/profile"
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          Mi perfil
        </Link>
      </div>
    </main>
  );
}
