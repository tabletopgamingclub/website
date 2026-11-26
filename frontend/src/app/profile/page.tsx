import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "./actions";

export const metadata: Metadata = {
  title: "Sección de socio | Club Lúdico",
};

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-md rounded-xl border border-black/10 p-6 shadow-sm dark:border-white/15">
        <p className="text-sm uppercase tracking-wide opacity-60">Sección de {user.role}</p>
        <h1 className="mt-2 text-3xl font-semibold">Hola, {user.name}</h1>
        <p className="mt-2 text-sm opacity-70">Usuario: {user.username}</p>

        <div className="mt-8 flex items-center gap-4">
          <form action={logoutAction}>
            <button
              type="submit"
              className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              Cerrar sesión
            </button>
          </form>
          <Link
            href="/"
            className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
