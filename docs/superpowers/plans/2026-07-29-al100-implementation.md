# AL100 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-quality smart urban waste collection platform MVP in 2 days with GPS tracking, citizen/driver/admin modules, and AI predictions.

**Architecture:** Next.js 15 (frontend) + FastAPI/Clean Architecture (backend) + Supabase (DB/Auth/Realtime) + Mapbox (maps). Hybrid rendering (RSC/CSR), WebSocket GPS tracking, deterministic AI engine with ML-ready ports.

**Tech Stack:** Next.js 15, shadcn/ui, Tailwind CSS 4, Mapbox GL JS, FastAPI 0.115+, Python 3.12+, SQLAlchemy 2.0, Alembic, Supabase, Turborepo

## Global Constraints

- Node >= 22, npm >= 10
- Python >= 3.12
- Supabase free tier (500 users, 500MB DB)
- Mapbox free tier (50k map loads/mo)
- Vercel deployment (GitHub integration)
- Dark mode OLED theme: bg `#0F172A`, primary `#1E293B`, accent `#22C55E`
- Typography: Poppins (headings) + Open Sans (body)
- Icons: Lucide SVG (no emojis)
- All text in Spanish (Dominican Republic context)

---
## Task 0: Project Scaffold & GitHub Setup

**Files:**
- Create: `al100/`
- Create: `.gitignore`
- Create: `README.md`
- Create: `LICENSE`
- Create: `CONTRIBUTING.md`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/deploy.yml`
- Create: `docker-compose.yml`

- [ ] **Step 1: Initialize monorepo with Turborepo**

```bash
cd /home/starlyn/Escritorio/AL100
npx create-turbo@latest . --example with-vite --package-manager npm
```

After creation, remove vite example and set up Next.js + FastAPI manually.

- [ ] **Step 2: Create .gitignore**

```gitignore
node_modules/
.next/
.env
.env.local
*.pyc
__pycache__/
.pytest_cache/
.alembic/
venv/
.vercel/
dist/
coverage/
*.log
.DS_Store
```

- [ ] **Step 3: Create README.md**

Professional README with:
- Project title and description (AL100 - Plataforma Inteligente de Recolección de Residuos)
- Architecture diagram (ASCII)
- Tech stack badges
- Quick start (setup instructions)
- Module descriptions (Ciudadano, Chofer, Ayuntamiento, IA)
- Screenshots placeholder
- License

- [ ] **Step 4: Create LICENSE**

Use MIT License.

- [ ] **Step 5: Create GitHub Actions CI**

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
```

- [ ] **Step 6: Create Docker Compose**

```yaml
# docker-compose.yml
services:
  api:
    build: apps/api
    ports: ["8000:8000"]
    env_file: .env
  web:
    build: apps/web
    ports: ["3000:3000"]
    depends_on: [api]
```

- [ ] **Step 7: Initialize git and push**

```bash
cd /home/starlyn/Escritorio/AL100
git init
git add .
git commit -m "chore: initial scaffold"
```

---
## Task 1: Setup Next.js 15 with shadcn/ui + Tailwind + Mapbox

**Files:**
- Create: `apps/web/package.json`
- Create: `apps/web/tsconfig.json`
- Create: `apps/web/next.config.ts`
- Create: `apps/web/tailwind.config.ts`
- Create: `apps/web/postcss.config.mjs`
- Create: `apps/web/src/app/globals.css`
- Create: `apps/web/src/app/layout.tsx`
- Create: `apps/web/src/lib/utils.ts`
- Create: `apps/web/src/lib/supabase.ts`
- Create: `apps/web/src/lib/mapbox.ts`
- Create: `apps/web/src/types/index.ts`

- [ ] **Step 1: Create Next.js app**

```bash
cd /home/starlyn/Escritorio/AL100
npx create-next-app@latest apps/web --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

- [ ] **Step 2: Install dependencies**

```bash
cd apps/web
npm install @supabase/supabase-js @supabase/ssr react-map-gl mapbox-gl lucide-react class-variance-authority clsx tailwind-merge next-themes
npm install -D @types/mapbox-gl
```

- [ ] **Step 3: Install shadcn/ui**

```bash
cd apps/web
npx shadcn@latest init -d --force
npx shadcn@latest add button card dialog form input label select table tabs toast sheet dropdown-menu avatar badge separator skeleton progress
```

- [ ] **Step 4: Configure globals.css with dark theme**

```css
/* apps/web/src/app/globals.css */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@300;400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');

:root {
  --background: #0F172A;
  --foreground: #F8FAFC;
  --primary: #1E293B;
  --primary-foreground: #FFFFFF;
  --accent: #22C55E;
  --accent-foreground: #FFFFFF;
  --muted: #272F42;
  --muted-foreground: #94A3B8;
  --border: #475569;
  --destructive: #EF4444;
  --card: #1E293B;
  --card-foreground: #F8FAFC;
  --radius: 0.5rem;
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Open Sans', sans-serif;
}

* { @apply border-border; }
body {
  @apply bg-background text-foreground font-body antialiased;
  font-family: var(--font-body);
}
h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
```

- [ ] **Step 5: Create layout.tsx with providers**

```tsx
// apps/web/src/app/layout.tsx
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "AL100 - Recolección Inteligente",
  description: "Plataforma inteligente de recolección de residuos urbanos",
  manifest: "/manifest.json",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 6: Create Supabase client**

```tsx
// apps/web/src/lib/supabase.ts
import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 7: Create types**

```tsx
// apps/web/src/types/index.ts
export type UserRole = "citizen" | "driver" | "admin"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  code: string
  phone?: string
}

export interface Truck {
  id: string
  name: string
  plate: string
  sector_id: string
  driver_id?: string
  status: "available" | "on_route" | "maintenance"
}

export interface Route {
  id: string
  truck_id: string
  driver_id: string
  date: string
  start_time?: string
  end_time?: string
  status: "pending" | "active" | "completed" | "cancelled"
}

export interface GPSLog {
  id: number
  route_id: string
  latitude: number
  longitude: number
  timestamp: string
}

export interface Incident {
  id: string
  user_id: string
  type: "blocked_road" | "breakdown" | "trash_spill" | "overflow" | "other"
  description?: string
  photo_url?: string
  location: { lat: number; lng: number }
  status: "reported" | "in_progress" | "resolved"
  created_at: string
}

export interface Sector {
  id: string
  name: string
  geometry: any
  population_density: number
}

export interface Prediction {
  id: string
  sector_id: string
  date: string
  predicted_volume: number
  confidence: number
  recommendation: string
  factors: Record<string, number>
}

export interface Notification {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  read: boolean
  created_at: string
}
```

- [ ] **Step 8: Create Mapbox config**

```tsx
// apps/web/src/lib/mapbox.ts
export const mapboxConfig = {
  token: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "",
  style: "mapbox://styles/mapbox/dark-v11",
  defaultCenter: [-69.889, 18.486] as [number, number], // Santo Domingo
  defaultZoom: 12,
}
```

---
## Task 2: Setup FastAPI + Clean Architecture Foundation

**Files:**
- Create: `apps/api/pyproject.toml`
- Create: `apps/api/src/__init__.py`
- Create: `apps/api/src/main.py`
- Create: `apps/api/src/domain/__init__.py`
- Create: `apps/api/src/domain/entities/__init__.py`
- Create: `apps/api/src/domain/entities/user.py`
- Create: `apps/api/src/domain/entities/route.py`
- Create: `apps/api/src/domain/entities/truck.py`
- Create: `apps/api/src/domain/entities/sector.py`
- Create: `apps/api/src/domain/entities/incident.py`
- Create: `apps/api/src/domain/entities/prediction.py`
- Create: `apps/api/src/domain/entities/gps_log.py`
- Create: `apps/api/src/domain/entities/notification.py`
- Create: `apps/api/src/domain/value_objects/__init__.py`
- Create: `apps/api/src/domain/value_objects/location.py`
- Create: `apps/api/src/application/__init__.py`
- Create: `apps/api/src/application/ports/__init__.py`
- Create: `apps/api/src/application/use_cases/__init__.py`
- Create: `apps/api/src/infrastructure/database/__init__.py`
- Create: `apps/api/src/infrastructure/database/models.py`
- Create: `apps/api/src/infrastructure/ai/__init__.py`
- Create: `apps/api/src/interface/api/__init__.py`
- Create: `apps/api/src/interface/schemas/__init__.py`
- Create: `apps/api/.env.example`

- [ ] **Step 1: Create pyproject.toml**

```toml
# apps/api/pyproject.toml
[project]
name = "al100-api"
version = "0.1.0"
requires-python = ">=3.12"
dependencies = [
    "fastapi>=0.115.0",
    "uvicorn[standard]>=0.30.0",
    "sqlalchemy[asyncio]>=2.0.0",
    "asyncpg>=0.30.0",
    "alembic>=1.13.0",
    "pydantic>=2.0.0",
    "pydantic-settings>=2.0.0",
    "supabase>=2.0.0",
    "python-jose[cryptography]>=3.3.0",
    "httpx>=0.27.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=8.0.0",
    "pytest-asyncio>=0.24.0",
    "httpx>=0.27.0",
]
```

- [ ] **Step 2: Create main.py**

```python
# apps/api/src/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AL100 API",
    description="Plataforma Inteligente de Recolección de Residuos",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
```

- [ ] **Step 3: Create domain entities**

```python
# apps/api/src/domain/entities/user.py
from dataclasses import dataclass, field
from datetime import datetime
from uuid import uuid4, UUID

@dataclass
class User:
    name: str
    role: str  # citizen | driver | admin
    code: str
    email: str | None = None
    phone: str | None = None
    id: UUID = field(default_factory=uuid4)
    created_at: datetime = field(default_factory=datetime.utcnow)
```

```python
# apps/api/src/domain/value_objects/location.py
from dataclasses import dataclass

@dataclass(frozen=True)
class Location:
    latitude: float
    longitude: float

    def to_dict(self) -> dict:
        return {"lat": self.latitude, "lng": self.longitude}
```

Create similarly minimal dataclasses for: Route, Truck, Sector, Incident, Prediction, GPSLog, Notification.

---
## Task 3: Database Setup + Alembic Migrations

**Files:**
- Create: `apps/api/alembic.ini`
- Create: `apps/api/alembic/env.py`
- Create: `apps/api/alembic/versions/001_initial.py`
- Modify: `apps/api/src/infrastructure/database/models.py`

- [ ] **Step 1: Config Database URL**

```python
# apps/api/src/infrastructure/database/models.py
from sqlalchemy import Column, String, Float, DateTime, Boolean, JSON, ForeignKey, Text, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.sql import func
import uuid

class Base(DeclarativeBase):
    pass

# Define all SQLAlchemy models matching the spec's SQL schema
# Users, Sectors, Trucks, Routes, GPSLogs, Incidents, Predictions, Notifications
```

- [ ] **Step 2: Create initial migration**

```bash
cd apps/api
alembic init alembic
# Configure alembic/env.py to point to models
alembic revision --autogenerate -m "initial"
alembic upgrade head
```

- [ ] **Step 3: Create Supabase project + env file**

Create `.env` with Supabase URL + anon key. Set up the Supabase project with SQL from the spec.

---
## Task 4: FastAPI Auth + User Management

**Files:**
- Create: `apps/api/src/interface/api/routes/__init__.py`
- Create: `apps/api/src/interface/api/routes/auth.py`
- Create: `apps/api/src/interface/api/dependencies.py`
- Create: `apps/api/src/interface/schemas/user.py`
- Create: `apps/api/src/application/ports/i_user_repo.py`
- Create: `apps/api/src/infrastructure/database/repositories/user_repo.py`
- Create: `apps/api/src/application/use_cases/create_user.py`
- Create: `apps/api/src/application/use_cases/auth_user.py`

- [ ] **Step 1: Define auth schemas**

```python
# apps/api/src/interface/schemas/user.py
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    name: str
    role: str = "citizen"
    email: str | None = None
    code: str

class UserLogin(BaseModel):
    code: str
    password: str = "AL1002024"  # default password for MVP
```

- [ ] **Step 2: Create auth routes**

```python
# apps/api/src/interface/api/routes/auth.py
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register")
async def register():
    pass  # Admin creates user with code

@router.post("/login")
async def login():
    pass  # Login with code

@router.get("/me")
async def me():
    pass  # Get current user profile
```

- [ ] **Step 3: Implement user repository (SQLAlchemy)**

---
## Task 5: Routes + GPS Tracking (FastAPI)

**Files:**
- Create: `apps/api/src/interface/api/routes/routes.py`
- Create: `apps/api/src/interface/api/routes/trucks.py`
- Create: `apps/api/src/application/use_cases/start_route.py`
- Create: `apps/api/src/application/use_cases/end_route.py`
- Create: `apps/api/src/application/ports/i_route_repo.py`
- Create: `apps/api/src/infrastructure/database/repositories/route_repo.py`

- [ ] **Step 1: Create route endpoints**

```python
# apps/api/src/interface/api/routes/routes.py
@router.get("/api/routes/active")
async def get_active_route():
    """Get active route for authenticated driver"""

@router.post("/api/routes/start")
async def start_route(truck_id: str):
    """Start a new route"""

@router.post("/api/routes/{id}/end")
async def end_route(id: str):
    """End an active route"""
```

- [ ] **Step 2: GPS tracking via Supabase Realtime**

Driver sends GPS via Supabase Realtime channel `gps:{route_id}`.
FastAPI inserts logs into `gps_logs` table. Supabase Realtime broadcasts to subscribers.

---
## Task 6: Incidents API

**Files:**
- Create: `apps/api/src/interface/api/routes/incidents.py`
- Create: `apps/api/src/interface/schemas/incident.py`
- Create: `apps/api/src/application/ports/i_incident_repo.py`
- Create: `apps/api/src/infrastructure/database/repositories/incident_repo.py`

```python
# apps/api/src/interface/api/routes/incidents.py
@router.post("/api/incidents")
async def create_incident():
    """Report an incident (citizen/driver)"""

@router.get("/api/incidents")
async def list_incidents(status: str = None):
    """List incidents with optional status filter"""

@router.put("/api/incidents/{id}")
async def update_incident_status(id: str, status: str):
    """Update incident status (admin)"""
```

---
## Task 7: AI Prediction Engine (Rules-based)

**Files:**
- Create: `apps/api/src/application/ports/i_prediction_engine.py`
- Create: `apps/api/src/infrastructure/ai/rules_engine.py`
- Create: `apps/api/src/interface/api/routes/predictions.py`
- Create: `apps/api/src/domain/entities/prediction.py`

```python
# apps/api/src/application/ports/i_prediction_engine.py
from abc import ABC, abstractmethod
from uuid import UUID

class IPredictionEngine(ABC):
    @abstractmethod
    async def predict(self, sector_id: UUID, date: str) -> dict:
        pass
```

```python
# apps/api/src/infrastructure/ai/rules_engine.py
class RulesEngine(IPredictionEngine):
    async def predict(self, sector_id: UUID, date: str) -> dict:
        # Determine day of week
        # Check if holiday (simple list)
        # Check sector type (commercial vs residential)
        # Apply multipliers
        # Return prediction with recommendation
        pass
```

**Prediction rules:**
- Base volume: random 2000-5000 based on sector
- Holiday: +40%
- Weekend (Sat-Sun): +25% residential
- Commercial sector: +50%
- Rain forecast: -20%
- Event: +100%

Prediction endpoint:
```python
@router.get("/api/predictions/{sector_id}")
async def get_prediction(sector_id: str, date: str = None):
    """Get AI prediction for a sector"""
```

---
## Task 8: Admin Dashboard API

**Files:**
- Create: `apps/api/src/interface/api/routes/admin.py`

```python
@router.get("/api/admin/stats")
async def get_stats():
    """Total trucks, active routes, incidents, predictions"""

@router.get("/api/admin/alerts")
async def get_alerts():
    """Active incidents, overdue routes, high-prediction sectors"""

@router.get("/api/admin/users")
async def list_users():
    """CRUD users (admin only)"""

@router.get("/api/admin/trucks")
async def list_trucks():
    """CRUD trucks (admin only)"""
```

---
## Task 9: Frontend — Auth + Layout

**Files:**
- Create: `apps/web/src/app/(auth)/login/page.tsx`
- Create: `apps/web/src/components/layout/Sidebar.tsx`
- Create: `apps/web/src/components/layout/Navbar.tsx`
- Create: `apps/web/src/components/layout/MobileNav.tsx`
- Create: `apps/web/src/components/layout/AuthGuard.tsx`
- Create: `apps/web/src/hooks/useAuth.ts`

- [ ] **Step 1: Login page with shadcn/ui**

```tsx
// Apps/web/src/app/(auth)/login/page.tsx
"use client"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-heading">AL100</CardTitle>
          <p className="text-muted-foreground text-sm">Accede con tu código</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="code">Código</Label>
              <Input id="code" placeholder="Ej: CAM-001" />
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```

- [ ] **Step 2: Create auth hook**

```tsx
// Apps/web/src/hooks/useAuth.ts
"use client"
import { createClient } from "@/lib/supabase"
import { User } from "@/types"

export function useAuth() {
  const supabase = createClient()
  // Login, logout, getUser logic
}
```

- [ ] **Step 3: Create sidebar layout**

```tsx
// Apps/web/src/components/layout/Sidebar.tsx
// shadcn/ui Sheet + Lucide icons
// Role-based nav items:
// - Admin: Dashboard, Mapa, Rutas, Camiones, Sectores, Usuarios, Incidencias
// - Driver: Conducir, Reportar
// - Citizen: Ruta en Vivo, Reportar, Notificaciones
```

- [ ] **Step 4: Create AuthGuard**

```tsx
// Apps/web/src/components/layout/AuthGuard.tsx
// Redirects to /login if not authenticated
// Checks user role for route access
```

---
## Task 10: Frontend — Módulo Chofer (Driver)

**Files:**
- Create: `apps/web/src/app/(driver)/layout.tsx`
- Create: `apps/web/src/app/(driver)/conducir/page.tsx`
- Create: `apps/web/src/app/(driver)/reportar/page.tsx`
- Create: `apps/web/src/hooks/useGeolocation.ts`
- Create: `apps/web/src/hooks/useRealtimeGPS.ts`
- Create: `apps/web/src/components/driver/GPSSender.tsx`

- [ ] **Step 1: Create useGeolocation hook**

```tsx
// Apps/web/src/hooks/useGeolocation.ts
"use client"
import { useState, useEffect } from "react"

interface GeoPosition {
  lat: number
  lng: number
}

export function useGeolocation() {
  const [position, setPosition] = useState<GeoPosition | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocalización no soportada")
      return
    }
    const watchId = navigator.geolocation.watchPosition(
      (pos) => setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 5000 }
    )
    return () => navigator.geolocation.clearWatch(watchId)
  }, [])

  return { position, error }
}
```

- [ ] **Step 2: Create GPS sender (Supabase Realtime)**

```tsx
// Apps/web/src/hooks/useRealtimeGPS.ts
// Sends GPS position every 3s to Supabase Realtime channel gps:{route_id}
// Receives updates for other vehicles
```

- [ ] **Step 3: Driver page — Start route + GPS**

```tsx
// Apps/web/src/app/(driver)/conducir/page.tsx
// Mapbox map showing truck location
// "Iniciar Ruta" / "Finalizar Ruta" buttons
// GPS status indicator (green pulsing dot)
// Route timer
```

---
## Task 11: Frontend — Módulo Ciudadano (Citizen)

**Files:**
- Create: `apps/web/src/app/(citizen)/layout.tsx`
- Create: `apps/web/src/app/(citizen)/ruta/page.tsx`
- Create: `apps/web/src/app/(citizen)/reportar/page.tsx`
- Create: `apps/web/src/app/(citizen)/notificaciones/page.tsx`
- Create: `apps/web/src/components/map/TruckMap.tsx`
- Create: `apps/web/src/components/map/TruckMarker.tsx`

- [ ] **Step 1: TruckMap component (Mapbox)**

```tsx
// Apps/web/src/components/map/TruckMap.tsx
"use client"
import Map, { Marker, NavigationControl, Popup } from "react-map-gl"
import "mapbox-gl/dist/mapbox-gl.css"

interface TruckMapProps {
  trucks: Array<{ id: string; lat: number; lng: number; name: string; status: string }>
  center?: [number, number]
  zoom?: number
}

export function TruckMap({ trucks, center = [-69.889, 18.486], zoom = 12 }: TruckMapProps) {
  return (
    <Map
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      initialViewState={{ longitude: center[0], latitude: center[1], zoom }}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: "100%", height: "100%" }}
    >
      <NavigationControl position="top-right" />
      {trucks.map((truck) => (
        <Marker key={truck.id} longitude={truck.lng} latitude={truck.lat}>
          <div className="relative">
            <div className="w-4 h-4 bg-accent rounded-full animate-ping absolute opacity-75" />
            <div className="w-4 h-4 bg-accent rounded-full relative" />
          </div>
        </Marker>
      ))}
    </Map>
  )
}
```

- [ ] **Step 2: Citizen route page**

Shows:
- Mapbox map with truck position (live via Realtime)
- "Último paso: hace 5 min"
- "Próximo paso: en 15 min"
- Schedule info

- [ ] **Step 3: Citizen report page**

shadcn/ui form: type selector, description, photo upload, location.

---
## Task 12: Frontend — Módulo Ayuntamiento (Admin Dashboard)

**Files:**
- Create: `apps/web/src/app/(admin)/layout.tsx`
- Create: `apps/web/src/app/(admin)/dashboard/page.tsx`
- Create: `apps/web/src/app/(admin)/mapa/page.tsx`
- Create: `apps/web/src/app/(admin)/rutas/page.tsx`
- Create: `apps/web/src/app/(admin)/camiones/page.tsx`
- Create: `apps/web/src/app/(admin)/sectores/page.tsx`
- Create: `apps/web/src/app/(admin)/usuarios/page.tsx`
- Create: `apps/web/src/app/(admin)/incidencias/page.tsx`
- Create: `apps/web/src/components/admin/StatsCard.tsx`
- Create: `apps/web/src/components/admin/AlertBanner.tsx`

- [ ] **Step 1: Dashboard page**

```tsx
// apps/web/src/app/(admin)/dashboard/page.tsx
// Grid of StatsCards: Camiones activos, Rutas hoy, Incidencias, Predicciones
// Mini map preview
// Recent alerts list
// Quick action buttons
```

StatsCard:
```tsx
// Apps/web/src/components/admin/StatsCard.tsx
import { Card, CardContent } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: "up" | "down"
}

export function StatsCard({ title, value, icon: Icon, description, trend }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 rounded-lg bg-accent/10">
          <Icon className="w-6 h-6 text-accent" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold font-heading">{value}</p>
          {description && <p className="text-xs text-muted-foreground">{description}</p>}
        </div>
      </CardContent>
    </Card>
  )
}
```

- [ ] **Step 2: Admin map page**

Full-screen Mapbox map with all trucks, color-coded by status (green=active, yellow=pending, red=breakdown). Click truck -> popup with details.

- [ ] **Step 3: Users management page**

shadcn/ui Table with search, filter by role, create user dialog.

- [ ] **Step 4: Sectors page with AI predictions**

Table of sectors + prediction volume + recommendation badge (increase/decrease/maintain).

---
## Task 13: Connect Frontend to Backend

**Files:**
- Create: `apps/web/src/lib/api.ts`
- Modify: All page files to use API

- [ ] **Step 1: Create API client**

```tsx
// apps/web/src/lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

async function fetchAPI<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export const api = {
  auth: {
    login: (code: string) => fetchAPI("/api/auth/login", { method: "POST", body: JSON.stringify({ code }) }),
    me: () => fetchAPI("/api/auth/me"),
  },
  routes: {
    active: () => fetchAPI("/api/routes/active"),
    start: (truckId: string) => fetchAPI("/api/routes/start", { method: "POST", body: JSON.stringify({ truck_id: truckId }) }),
    end: (id: string) => fetchAPI(`/api/routes/${id}/end`, { method: "POST" }),
  },
  trucks: {
    list: () => fetchAPI("/api/trucks"),
    location: (id: string) => fetchAPI(`/api/trucks/${id}/location`),
  },
  sectors: {
    list: () => fetchAPI("/api/sectors"),
    prediction: (id: string, date?: string) => fetchAPI(`/api/predictions/${id}${date ? `?date=${date}` : ""}`),
  },
  incidents: {
    create: (data: any) => fetchAPI("/api/incidents", { method: "POST", body: JSON.stringify(data) }),
    list: (status?: string) => fetchAPI(`/api/incidents${status ? `?status=${status}` : ""}`),
    update: (id: string, status: string) => fetchAPI(`/api/incidents/${id}`, { method: "PUT", body: JSON.stringify({ status }) }),
  },
  admin: {
    stats: () => fetchAPI("/api/admin/stats"),
    alerts: () => fetchAPI("/api/admin/alerts"),
    users: () => fetchAPI("/api/admin/users"),
    trucks: () => fetchAPI("/api/admin/trucks"),
  },
}
```

- [ ] **Step 2: Wire all pages**

Connect each page to real API endpoints using TanStack Query or SWR.

---
## Task 14: Notifications

**Files:**
- Create: `apps/web/src/hooks/useNotifications.ts`
- Create: `apps/web/src/components/NotificationBell.tsx`

- [ ] **Step 1: Subscribe to Supabase Realtime notifications channel**

```tsx
// Apps/web/src/hooks/useNotifications.ts
// Subscribe to notifications:{user_id} channel
// Show toast on new notification
// Update notification badge count
```

- [ ] **Step 2: NotificationBell component**

shadcn/ui dropdown with unread count badge, list of notifications, mark as read.

---
## Task 15: PWA + Polish

**Files:**
- Create: `apps/web/public/manifest.json`
- Create: `apps/web/public/sw.js`
- Modify: `apps/web/src/app/layout.tsx`

- [ ] **Step 1: Add PWA manifest**

```json
{
  "name": "AL100 - Recolección Inteligente",
  "short_name": "AL100",
  "description": "Plataforma de recolección de residuos",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0F172A",
  "theme_color": "#0F172A",
  "icons": []
}
```

- [ ] **Step 2: Generate app icon**

Use a simple SVG icon for AL100.

- [ ] **Step 3: Final polish pass**

- Check all pages on mobile 375px viewport
- Verify dark mode consistency
- Add loading skeletons (shadcn/ui Skeleton)
- Add error boundaries
- Smooth transitions (150-300ms)

---
## Task 16: Seed Data + Deploy

- [ ] **Step 1: Create seed script**

```python
# apps/api/scripts/seed.py
# Creates: 3 sectors (Zona Colonial, Piantini, Los Prados)
# Creates: 3 trucks (CAM-001, CAM-002, CAM-003)
# Creates: 3 drivers + 1 admin
# Creates: sample predictions
```

- [ ] **Step 2: Configure Vercel project**

```bash
cd apps/web
npx vercel --prod
# Set env vars: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_MAPBOX_TOKEN
```

- [ ] **Step 3: Deploy API**

```bash
# FastAPI on Vercel
cd apps/api
npx vercel --prod
```

Or use Render for Python backend.

- [ ] **Step 4: Create GitHub repo + push**

```bash
gh repo create al100 --public --source=. --remote=origin --push
```

Verify CI runs and deployment succeeds.
