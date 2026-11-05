# Backend

API REST del Tabletop Gaming Club. Cada carpeta del repositorio es independiente: este backend tiene sus propias dependencias, scripts y variables de entorno.

## Stack

- Node.js 22.20.5 LTS (`.nvmrc`)
- TypeScript en modo ESM (`"type": "module"`)
- Express 5 con CORS
- Prisma 7 con PostgreSQL y `@prisma/adapter-pg`
- Pino para logging
- ESLint + Prettier

## Estructura

```
src/
├── app.ts          Composición de Express (sin listen, exportable)
├── server.ts       Arranque HTTP y cierre ordenado
├── routes.ts       Router raíz montado en /api
├── config/         Lectura de variables de entorno
├── errors/         Errores de aplicación
├── lib/            Logger y cliente de Prisma
├── middlewares/    Logging, 404 y manejo centralizado de errores
├── modules/        Un directorio por módulo de dominio
└── generated/      Cliente de Prisma generado (no editar ni versionar)
```

Los módulos exponen un router propio. Para agregar uno, crear `src/modules/<nombre>/` con controlador y rutas, y montarlo en `src/routes.ts`.

## Convenciones

- Mantener la lógica de negocio fuera de los routers y controladores.
- Lanzar `AppError` para errores esperados con su código HTTP y código de error.
- No devolver detalles internos en producción; el manejador de errores ya lo resuelve.
- Leer variables de entorno desde `src/config/env.ts`, no desde `process.env` disperso.
- Los orígenes permitidos por CORS se configuran con `CORS_ORIGIN` y se leen desde `env.corsOrigins`.
- Usar imports relativos con extensión `.js`, como exige Node en modo ESM.
- No editar `src/generated/`; se regenera con `npm run db:generate`.
- Mensajes de error y commits en español, con el formato `type(scope): descripción`.

## Comandos

| Comando               | Acción                             |
| --------------------- | ---------------------------------- |
| `npm run dev`         | Servidor de desarrollo con recarga |
| `npm run build`       | Genera Prisma y compila a `dist/`  |
| `npm start`           | Ejecuta la versión compilada       |
| `npm run lint`        | Análisis estático                  |
| `npm run typecheck`   | Verificación de tipos              |
| `npm run format`      | Formatea el código                 |
| `npm run db:generate` | Genera el cliente de Prisma        |
| `npm run db:migrate`  | Crea y aplica migraciones          |
| `npm run db:deploy`   | Aplica migraciones pendientes      |
| `npm run db:seed`     | Carga datos de ejemplo             |
| `npm run db:studio`   | Abre Prisma Studio                 |

La API responde en `http://localhost:3000/api`. El estado se verifica con `GET /api/health`.
