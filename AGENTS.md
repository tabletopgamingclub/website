# Tabletop Gaming Club

Guía general para agentes de código. El repositorio tiene dos proyectos independientes: `frontend/` y `backend/`. Antes de modificar uno, leer su `AGENTS.md` específico.

## Estructura

```
.
├── backend/       API REST (Express 5 + Prisma 7 + PostgreSQL)
├── frontend/      Aplicación web (Next.js 16 + React 19 + Tailwind CSS 4)
├── compose.yml    PostgreSQL local con Podman
└── package.json   Scripts comunes
```

## Comandos

| Comando                | Acción                                |
| ---------------------- | ------------------------------------- |
| `npm run dev:back`     | Servidor de desarrollo del backend    |
| `npm run dev:front`    | Servidor de desarrollo del frontend   |
| `npm run db:up`        | Levanta PostgreSQL                    |
| `npm run db:down`      | Detiene PostgreSQL                    |
| `npm run lint`         | Lint de front y back                  |
| `npm run typecheck`    | Verificación de tipos de front y back |
| `npm run format`       | Formatea front y back                 |
| `npm run format:check` | Verifica el formato                   |
| `npm run check`        | Lint, tipos y formato                 |
| `npm run build`        | Compila front y back                  |

## Arquitectura

- El frontend corre en el puerto 3001 y el backend en el 3000.
- El navegador llama directamente a la API usando `NEXT_PUBLIC_API_URL`.
- El backend habilita CORS con `CORS_ORIGIN` (uno o varios orígenes separados por coma).
- En producción, el frontend se despliega en Vercel, la API en Render y la base de datos en Neon.
- No hay workspaces ni herramientas de monorepo: cada carpeta se instala y ejecuta por separado.

## Tooling

- Frontend: ESLint 9. `eslint-config-next` y sus plugins todavía no declaran soporte para ESLint 10; no forzar la actualización.
- Backend: ESLint 10.
- TypeScript 5.9.x. `typescript-eslint` 8.x no soporta TypeScript 7.

## Convenciones

- Mensajes de error, documentación y commits en español.
- Commits con el formato `type(scope): descripción`, por ejemplo `feat(back): agregar inicio de sesión`.
- No editar `backend/src/generated/`; se regenera con `npm run db:generate`.
- No versionar secretos: usar `.env` locales y variables del panel de cada plataforma.
- Mantener los imports relativos con extensión `.js` en el backend.
- Antes de cerrar un cambio, ejecutar `npm run check` y `npm run build`.
