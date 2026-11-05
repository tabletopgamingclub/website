# Tabletop Gaming Club

Aplicación web para la gestión de las actividades de un club de juegos de mesa: socios, ingenios (salas de juego), reservas de juegos y calendario de actividades. Desarrollada como proyecto de una materia de la facultad y pensada para uso real por las personas del club.

## Tecnologías

| Parte         | Tecnologías                                                                  |
| ------------- | ---------------------------------------------------------------------------- |
| Frontend      | TypeScript, Next.js 16, React 19 (con React Compiler), Tailwind CSS 4, axios |
| Backend       | TypeScript (ESM), Express 5, Prisma 7, Pino                                  |
| Base de datos | PostgreSQL                                                                   |
| Contenedores  | Podman (solo para la base de datos local)                                    |
| Despliegue    | Vercel (frontend), Render (backend), Neon (base de datos)                    |

## Requisitos

- Node.js 22.20.5 LTS (fijada en los archivos `.nvmrc`)
- npm
- Podman con soporte para `podman compose`

## Estructura

```
.
├── backend/       API REST
├── frontend/      Aplicación web
├── compose.yml    Base de datos local en contenedor
├── package.json   Atajos de scripts comunes
├── .nvmrc         Versión de Node del proyecto
└── AGENTS.md      Guía para agentes de código
```

Cada carpeta es independiente: tiene sus propias dependencias, scripts y variables de entorno. No hay workspaces ni herramientas de monorepo.

## Puesta en marcha

1. Levantar la base de datos local (desde la raíz):

   ```bash
   npm run db:up
   podman compose ps
   ```

   Esperar a que el contenedor figure como `healthy` antes de aplicar migraciones. El comando `db:up` no espera a que PostgreSQL esté listo.

2. Iniciar el backend:

   ```bash
   cd backend
   cp .env.example .env
   npm install
   npm run db:migrate
   npm run db:seed
   npm run dev
   ```

   La API queda disponible en `http://localhost:3000/api`. Para verificar el estado: `GET /api/health`. Para comprobar la conexión con la base de datos: `GET /api/health/ready`.

3. Iniciar el frontend, en otra terminal:

   ```bash
   cd frontend
   cp .env.example .env
   npm install
   npm run dev
   ```

   La aplicación queda disponible en `http://localhost:3001`. Las peticiones a la API se hacen directamente al backend en `http://localhost:3000/api`; el backend acepta ese origen mediante CORS.

Para detener la base de datos conservando sus datos:

```bash
npm run db:down
```

## Variables de entorno

El backend incluye `backend/.env.example` y el frontend `frontend/.env.example`. Copiar cada uno a `.env` y ajustar los valores. El frontend no expone secretos: `NEXT_PUBLIC_API_URL` es pública y solo indica la URL del backend.

| Variable              | Descripción                                                                 | Por defecto                 |
| --------------------- | --------------------------------------------------------------------------- | --------------------------- |
| `NODE_ENV`            | Entorno: `development`, `production` o `test`                               | `development`               |
| `PORT`                | Puerto HTTP                                                                 | `3000`                      |
| `LOG_LEVEL`           | Nivel de logs: `fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent` | `info`                      |
| `CORS_ORIGIN`         | Orígenes permitidos por CORS, separados por coma                            | `http://localhost:3001`     |
| `DATABASE_URL`        | Cadena de conexión a PostgreSQL (obligatoria; pooled en producción)         | —                           |
| `DIRECT_DATABASE_URL` | Conexión directa para migraciones (opcional, solo producción)               | —                           |
| `NEXT_PUBLIC_API_URL` | URL base del backend para las peticiones del frontend                       | `http://localhost:3000/api` |

En producción, `CORS_ORIGIN` debe incluir el dominio del frontend en Vercel; el backend no arranca sin esa variable. Los secretos de producción se cargan únicamente en el panel de cada plataforma, nunca en el repositorio.

## Scripts

En la raíz (atajos comunes):

| Comando                | Acción                                |
| ---------------------- | ------------------------------------- |
| `npm run dev:front`    | Servidor de desarrollo del front      |
| `npm run dev:back`     | Servidor de desarrollo del back       |
| `npm run db:up`        | Levanta la base de datos              |
| `npm run db:down`      | Detiene la base de datos              |
| `npm run lint`         | Lint de front y back                  |
| `npm run typecheck`    | Verificación de tipos de front y back |
| `npm run format`       | Formatea front y back                 |
| `npm run format:check` | Verifica el formato de front y back   |
| `npm run check`        | Lint, tipos y formato                 |
| `npm run build`        | Compila front y back                  |

En `backend/`:

| Comando                | Acción                                     |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Servidor de desarrollo con recarga         |
| `npm run build`        | Genera Prisma y compila a `dist/`          |
| `npm start`            | Ejecuta la versión compilada               |
| `npm run lint`         | Análisis estático                          |
| `npm run format`       | Formatea el código                         |
| `npm run format:check` | Verifica el formato                        |
| `npm run typecheck`    | Verificación de tipos                      |
| `npm run db:generate`  | Genera el cliente de Prisma                |
| `npm run db:migrate`   | Crea y aplica migraciones (solo local)     |
| `npm run db:deploy`    | Aplica migraciones pendientes (producción) |
| `npm run db:seed`      | Carga datos de ejemplo                     |
| `npm run db:studio`    | Abre Prisma Studio                         |

En `frontend/`:

| Comando                | Acción                        |
| ---------------------- | ----------------------------- |
| `npm run dev`          | Servidor de desarrollo (3001) |
| `npm run build`        | Compilación para producción   |
| `npm start`            | Ejecuta la versión compilada  |
| `npm run lint`         | Análisis estático             |
| `npm run format`       | Formatea el código            |
| `npm run format:check` | Verifica el formato           |
| `npm run typecheck`    | Verificación de tipos         |

`typecheck` ejecuta `next typegen` antes de `tsc` para generar los tipos de rutas de Next.js.

## Infraestructura

Hay dos entornos: local y producción.

**Local.** Podman corre un único contenedor con PostgreSQL persistido en un volumen nombrado. El puerto de la base de datos solo queda expuesto en `127.0.0.1`, nunca hacia la red. El frontend se sirve en el puerto 3001 y el backend en el 3000. El navegador llama directamente a `http://localhost:3000/api`; el backend permite ese origen con `CORS_ORIGIN=http://localhost:3001`.

**Producción.** Tres servicios independientes:

- **Vercel** despliega el frontend. La URL del backend se configura con `NEXT_PUBLIC_API_URL` en el panel de Vercel.
- **Render** ejecuta la API. El build instala dependencias, compila y aplica las migraciones pendientes contra Neon; el start corre la versión compilada. `CORS_ORIGIN` debe incluir el dominio del frontend en Vercel.
- **Neon** hospeda la base de datos. La aplicación usa la conexión pooled (adecuada para muchos clientes) y las migraciones usan la conexión directa.

El navegador habla con dos orígenes distintos: el frontend en Vercel y la API en Render. El backend controla el acceso con CORS y el frontend conoce la URL de la API a través de `NEXT_PUBLIC_API_URL`.

## Flujo de trabajo

- `main` contiene la versión en producción y `dev` la de desarrollo.
- Cada funcionalidad se desarrolla en una rama `feat/<nombre>` creada desde `dev`.
- Los commits siguen la convención `type(scope): descripción` en español y minúsculas, por ejemplo `feat(back): agregar inicio de sesión`.
- Una rama se integra a `dev` mediante un pull request que pasa `npm run check` y `npm run build` en local y es aprobado por otro integrante del equipo.
- Al completar las funcionalidades de un paquete de trabajo, `dev` se integra a `main`.
