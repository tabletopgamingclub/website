# Frontend — Tabletop Gaming Club

Aplicación web del Tabletop Gaming Club, construida con Next.js, React, TypeScript y Tailwind CSS.

## Stack

- Next.js 16
- React 19 con React Compiler
- TypeScript
- Tailwind CSS 4
- axios

## Requisitos

- Node.js 22.20.5 LTS
- Backend disponible en `http://localhost:3000/api`
- El backend debe permitir el origen del frontend mediante `CORS_ORIGIN`

## Estructura

```
src/
├── app/    Rutas y layout de Next.js
└── lib/    Cliente HTTP de la API
```

## Puesta en marcha

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:3001`. Las peticiones a la API se realizan directamente contra la URL definida en `NEXT_PUBLIC_API_URL` mediante el cliente axios de `src/lib/api.ts`. En local, el backend debe tener `CORS_ORIGIN=http://localhost:3001`.

## Variables de entorno

| Variable              | Descripción                                                     | Por defecto                 |
| --------------------- | --------------------------------------------------------------- | --------------------------- |
| `NEXT_PUBLIC_API_URL` | URL base del backend para las peticiones HTTP desde el frontend | `http://localhost:3000/api` |

Copiar `.env.example` a `.env` y ajustar la variable si el backend corre en otra URL.

```ts
import { api } from "@/lib/api";

const { data } = await api.get("/health");
```

## Scripts

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
