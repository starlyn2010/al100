# Task 2: Setup FastAPI + Clean Architecture Foundation

**Context:** Create the Python backend with Clean Architecture structure in `apps/api`.

**Working directory:** `/home/starlyn/Escritorio/AL100/apps/api`

## Steps

1. Create `pyproject.toml`:
```toml
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
    "psycopg2-binary>=2.9.0",
]
[project.optional-dependencies]
dev = ["pytest>=8.0.0", "pytest-asyncio>=0.24.0"]
```

2. Create directory structure:
```
src/
  __init__.py
  main.py
  domain/
    __init__.py
    entities/
      __init__.py
      user.py
      route.py
      truck.py
      sector.py
      incident.py
      prediction.py
      gps_log.py
      notification.py
    value_objects/
      __init__.py
      location.py
  application/
    __init__.py
    ports/
      __init__.py
      i_user_repo.py
      i_route_repo.py
      i_truck_repo.py
      i_incident_repo.py
      i_prediction_engine.py
      i_notification_service.py
    use_cases/
      __init__.py
      start_route.py
      end_route.py
      report_incident.py
      get_prediction.py
  infrastructure/
    __init__.py
    database/
      __init__.py
      models.py
      connection.py
    ai/
      __init__.py
      rules_engine.py
    notifications/
      __init__.py
      web_push.py
  interface/
    __init__.py
    api/
      __init__.py
      main.py
      dependencies.py
      routes/
        __init__.py
        auth.py
        routes.py
        trucks.py
        sectors.py
        incidents.py
        predictions.py
        admin.py
    schemas/
      __init__.py
      user.py
      route.py
      truck.py
      sector.py
      incident.py
      prediction.py
      gps_log.py
tests/
  __init__.py
```

3. Create `src/main.py`:
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AL100 API", description="Plataforma Inteligente de Recolección de Residuos", version="0.1.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
```

4. Create domain entities as Python dataclasses:
- `User`: id (UUID), name, email, role, code, phone, created_at
- `Location`: latitude (float), longitude (float) - frozen dataclass with to_dict()
- `Route`: id (UUID), truck_id (UUID), driver_id (UUID), date, start_time, end_time, status
- `Truck`: id (UUID), name, plate, sector_id, driver_id, status, created_at
- `Sector`: id (UUID), name, geometry, population_density, created_at
- `Incident`: id (UUID), user_id, type, description, photo_url, location (dict), status, created_at
- `Prediction`: id (UUID), sector_id, date, predicted_volume, confidence, recommendation, factors (dict), created_at
- `GPSLog`: id (int), route_id, latitude, longitude, timestamp
- `Notification`: id (UUID), user_id, type, title, message, data (dict), read, created_at

Use `from dataclasses import dataclass, field` and `from uuid import uuid4, UUID`, `from datetime import datetime`.

5. Create `src/interface/api/main.py` (import and include all routers).

6. Create empty route files with APIRouter prefixes:
- auth: `/api/auth` 
- routes: `/api/routes`
- trucks: `/api/trucks`
- sectors: `/api/sectors`
- incidents: `/api/incidents`
- predictions: `/api/predictions`
- admin: `/api/admin`

7. Create `src/interface/schemas/user.py` with Pydantic models:
```python
from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    role: str = "citizen"
    email: str | None = None
    code: str

class UserLogin(BaseModel):
    code: str
    password: str = "AL100"

class UserResponse(BaseModel):
    id: str
    name: str
    email: str | None = None
    role: str
    code: str
    created_at: str
```

8. Create `apps/api/.env.example`:
```
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/al100
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```

9. Install deps:
```bash
cd /home/starlyn/Escritorio/AL100/apps/api
python3 -m venv venv
source venv/bin/activate
pip install -e .
```

10. Update root `docker-compose.yml` to include the API service properly.

**Global constraints:**
- Python >= 3.12
- All entities as dataclasses
- Clean Architecture layers
- Spanish names where applicable
