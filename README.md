# AL100 - Plataforma Inteligente de Recolección de Residuos Urbanos

Plataforma que previene que la basura llegue a las calles mediante monitoreo GPS en tiempo real, predicción de generación de residuos por sector, y optimización del sistema de recolección.

## Arquitectura

```
┌──────────────────────────────────────────────────┐
│              Next.js App (Vercel)                 │
│  ┌──────────┐ ┌──────────┐ ┌───────────────────┐ │
│  │ Ciudadano│ │  Chofer  │ │   Ayuntamiento    │ │
│  │ (PWA)    │ │ (PWA)    │ │  (Dashboard Web)  │ │
│  └──────────┘ └──────────┘ └───────────────────┘ │
└──────────────────────┬───────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────┐
│              FastAPI (Python 3.12)               │
│           Clean Architecture + DDD               │
└──────────────────────┬───────────────────────────┘
                       │
┌──────────────────────▼───────────────────────────┐
│              Supabase (Free Tier)                 │
│     PostgreSQL │ Auth │ Realtime (WebSocket)      │
└──────────────────────────────────────────────────┘
```

## Tech Stack

- **Frontend:** Next.js 15, shadcn/ui, Tailwind CSS 4, Mapbox GL JS
- **Backend:** FastAPI 0.115+, Python 3.12+, SQLAlchemy 2.0, Alembic
- **Infra:** Supabase (DB/Auth/Realtime), Vercel, Docker

## Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar frontend
cd apps/web && npm run dev

# Iniciar backend
cd apps/api && uvicorn src.main:app --reload
```

## Módulos

| Módulo | Descripción |
|--------|-------------|
| Ciudadano | Ver ruta del camión en vivo, reportar incidencias, notificaciones |
| Chofer | Iniciar ruta, GPS en tiempo real, reportar averías/bloqueos |
| Ayuntamiento | Dashboard admin, mapa general, gestión de usuarios/camiones |
| IA | Predicción de volumen de residuos por sector con reglas determinísticas |

## Licencia

MIT
