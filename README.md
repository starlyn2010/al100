# AL100 - Plataforma Inteligente de Recolección de Residuos Urbanos

Plataforma que **previene** que la basura llegue a las calles mediante monitoreo GPS en tiempo real, predicción de generación de residuos por sector, y optimización del sistema de recolección.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/starlyn2010/al100)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](LICENSE)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green)
![Supabase](https://img.shields.io/badge/Supabase-Free-3ECF8E)

## 🚀 Deploy en 5 minutos

### 1. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) y haz login
2. Clic en **"New Project"**
3. Nombre: `al100`, contraseña segura, región cercana
4. Espera 2 min a que se cree

### 2. Configurar base de datos

1. En Supabase, ve a **SQL Editor**
2. Abre el archivo `supabase/seed.sql` de este repo
3. Copia TODO el contenido
4. Pégalo en SQL Editor y clic **Run**

### 3. Obtener llaves

En Supabase ve a **Project Settings → API** y copia:
- `Project URL`
- `anon public key`

En [Mapbox](https://account.mapbox.com/access-tokens) copia tu token público.

### 4. Desplegar en Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/starlyn2010/al100)

O manual:

```bash
cd apps/web
npx vercel --prod
```

Te pedirá las 3 variables de entorno:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_MAPBOX_TOKEN`

### 5. ¡Listo!

Abre la URL que te dé Vercel. Usa estos códigos de acceso:

| Código | Rol | Qué puedes hacer |
|--------|-----|-----------------|
| `ADMIN` | Admin | Dashboard completo, gestión de flota |
| `CHOFER01` | Chofer | Iniciar ruta, GPS, reportar |
| `CIUDADANO` | Ciudadano | Ver camión en vivo, reportar |

## Arquitectura

```
Next.js 15 (Vercel) ←→ FastAPI Clean Architecture ←→ Supabase
     ↕                          ↕
  Mapbox GL JS          AI Rules Engine
```

**Clean Architecture:** `domain/` → `application/` → `infrastructure/` → `interface/`

## Módulos

| Módulo | Funcionalidad |
|--------|--------------|
| 👤 **Ciudadano** | Ruta del camión en vivo, reportar incidencias, horarios |
| 🚛 **Chofer** | Iniciar/finalizar ruta, GPS tiempo real, reportar averías |
| 🏛️ **Ayuntamiento** | Dashboard, mapa de flota, CRUD usuarios/camiones/sectores |
| 🤖 **IA** | Predicción de volumen (festivos: +40%, comercial: +50%, finde: +25%) |

## Desarrollo local

```bash
# Frontend
cd apps/web
cp .env.example .env.local  # Llena las llaves
npm run dev

# Backend (opcional)
cd apps/api
source venv/bin/activate
uvicorn src.main:app --reload
```

## Licencia

MIT
