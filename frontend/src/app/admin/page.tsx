import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  getAdminUsersRequest,
  isForbiddenError,
  isUnauthorizedError,
  type AdminUser,
} from "@/lib/backend";
import { requireAdmin } from "@/lib/guards";
import { ROLE_LABELS } from "@/lib/roles";

export const metadata: Metadata = {
  title: "Panel de administración | Club Lúdico",
};

const dateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "medium" });

async function loadUsers(token: string): Promise<AdminUser[]> {
  try {
    return await getAdminUsersRequest(token);
  } catch (error) {
    if (isUnauthorizedError(error)) {
      redirect("/login");
    }

    if (isForbiddenError(error)) {
      redirect("/profile");
    }

    throw error;
  }
}

export default async function AdminPage() {
  const { token } = await requireAdmin();
  const users = await loadUsers(token);

  return (
    <main className="flex flex-1 justify-center px-6 py-16">
      <section className="w-full max-w-4xl">
        <p className="text-sm uppercase tracking-wide opacity-60">Panel de administración</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <h1 className="text-3xl font-semibold">Usuarios del club</h1>
          <Link
            href="/profile"
            className="text-sm underline underline-offset-4 opacity-70 hover:opacity-100"
          >
            Volver a mi perfil
          </Link>
        </div>

        {users.length === 0 ? (
          <p className="mt-8 text-sm opacity-70">Todavía no hay usuarios registrados.</p>
        ) : (
          <div className="mt-8 overflow-x-auto rounded-xl border border-black/10 shadow-sm dark:border-white/15">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-black/10 bg-black/[0.03] dark:border-white/15 dark:bg-white/5">
                <tr>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Nombre
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Usuario
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Rol
                  </th>
                  <th scope="col" className="px-4 py-3 font-medium">
                    Alta
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-black/5 last:border-0 dark:border-white/10"
                  >
                    <td className="px-4 py-3">{user.name}</td>
                    <td className="px-4 py-3 opacity-80">{user.username}</td>
                    <td className="px-4 py-3">{ROLE_LABELS[user.role]}</td>
                    <td className="px-4 py-3 opacity-80">
                      {dateFormatter.format(new Date(user.createdAt))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
