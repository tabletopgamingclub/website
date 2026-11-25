# Backend — Tabletop Gaming Club

API REST del Tabletop Gaming Club.

## Stack

- Node.js 22.20.5 LTS
- TypeScript en modo ESM
- Express 5
- Prisma 7 con PostgreSQL y `@prisma/adapter-pg`
- Autenticación con JWT (HS256) y contraseñas con Argon2id
- Pino para logging

## Requisitos

- Node.js 22.20.5 LTS
- Podman con soporte para `podman compose`
- PostgreSQL local (lo levanta `npm run db:up` desde la raíz del repositorio)

## Estructura

```
src/
├── app.ts          Composición de Express
├── server.ts       Arranque HTTP y cierre ordenado
├── routes.ts       Router raíz montado en /api
├── config/         Variables de entorno
├── errors/         Errores de aplicación
├── lib/            Logger y cliente de Prisma
├── middlewares/    Logging, 404 y manejo de errores
├── modules/        Módulos de dominio
└── generated/      Cliente de Prisma generado (no editar)
```

## Puesta en marcha

Desde la raíz del repositorio, levantar la base de datos:

```bash
npm run db:up
podman compose ps
```

Esperar a que el contenedor figure como `healthy` antes de aplicar migraciones.

Luego, en `backend/`:

```bash
cd backend
cp .env.example .env
# Completar JWT_ACCESS_SECRET en .env, por ejemplo:
# openssl rand -base64 48
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

La API queda disponible en `http://localhost:3000/api`.

## Variables de entorno

| Variable                | Descripción                                                         | Por defecto             |
| ----------------------- | ------------------------------------------------------------------- | ----------------------- |
| `NODE_ENV`              | Entorno: `development`, `production` o `test`                       | `development`           |
| `PORT`                  | Puerto HTTP                                                         | `3000`                  |
| `LOG_LEVEL`             | Nivel de logs de Pino                                               | `info`                  |
| `CORS_ORIGIN`           | Orígenes permitidos por CORS, separados por coma                    | `http://localhost:3001` |
| `DATABASE_URL`          | Cadena de conexión a PostgreSQL (obligatoria; pooled en producción) | —                       |
| `DIRECT_DATABASE_URL`   | Conexión directa para migraciones (opcional, solo producción)       | —                       |
| `JWT_ACCESS_SECRET`     | Secreto para firmar los JWT (obligatorio, mínimo 32 caracteres)     | —                       |
| `JWT_ACCESS_EXPIRES_IN` | Vigencia del token (`s`, `m`, `h` o `d`)                            | `7d`                    |

En producción `CORS_ORIGIN` es obligatoria y no admite `*`.

## Endpoints

| Método | Ruta                | Descripción                                |
| ------ | ------------------- | ------------------------------------------ |
| `GET`  | `/api/health`       | Estado del servicio                        |
| `GET`  | `/api/health/ready` | Estado de la conexión con la base de datos |
| `POST` | `/api/auth/login`   | Inicia sesión y devuelve un JWT            |
| `GET`  | `/api/profile`      | Perfil del usuario autenticado             |

## Scripts

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

La API responde en `http://localhost:3000/api`. El estado se verifica con `GET /api/health`.
