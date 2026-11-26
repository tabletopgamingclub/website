import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/session";
import { homePathForRole } from "@/lib/roles";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Iniciar sesión | Club Lúdico",
};

export default async function LoginPage() {
  const user = await getCurrentUser();

  if (user) {
    redirect(homePathForRole(user.role));
  }

  return (
    <main className="flex flex-1 items-center justify-center px-6 py-16">
      <section className="w-full max-w-sm rounded-xl border border-black/10 p-6 shadow-sm dark:border-white/15">
        <h1 className="text-2xl font-semibold">Iniciar sesión</h1>
        <p className="mt-1 mb-6 text-sm opacity-70">
          Ingresá con tu usuario y contraseña del club.
        </p>
        <LoginForm />
        <p className="mt-6 text-center text-sm opacity-70">
          <Link href="/" className="underline underline-offset-4 hover:opacity-100">
            Volver al inicio
          </Link>
        </p>
      </section>
    </main>
  );
}
