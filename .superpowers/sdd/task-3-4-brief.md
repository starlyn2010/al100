# Tasks 3+4: Database Setup + Alembic + Auth API

**Context:** Create the database models, Alembic migrations, and auth endpoints. These are bundled because auth depends on the user model.

**Working directory:** `/home/starlyn/Escritorio/AL100/apps/api`

## Part A: Database Models (SQLAlchemy)

Create `src/infrastructure/database/models.py`:

```python
from sqlalchemy import Column, String, Float, DateTime, Boolean, JSON, ForeignKey, Text, Integer, BigInteger, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import DeclarativeBase, relationship
from sqlalchemy.sql import func
import uuid

class Base(DeclarativeBase):
    pass

def gen_uuid():
    return str(uuid.uuid4())

class UserModel(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    email = Column(String, unique=True, nullable=True)
    name = Column(String, nullable=False)
    role = Column(String, nullable=False)  # citizen, driver, admin
    code = Column(String, unique=True, nullable=False)
    phone = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SectorModel(Base):
    __tablename__ = "sectors"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    geometry = Column(JSON, nullable=False)
    population_density = Column(Float, default=0.0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class TruckModel(Base):
    __tablename__ = "trucks"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String, nullable=False)
    plate = Column(String, nullable=True)
    sector_id = Column(String, ForeignKey("sectors.id"), nullable=True)
    driver_id = Column(String, ForeignKey("users.id"), nullable=True)
    status = Column(String, default="available")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class RouteModel(Base):
    __tablename__ = "routes"
    id = Column(String, primary_key=True, default=gen_uuid)
    truck_id = Column(String, ForeignKey("trucks.id"), nullable=False)
    driver_id = Column(String, ForeignKey("users.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    status = Column(String, default="pending")

class GPSLogModel(Base):
    __tablename__ = "gps_logs"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    route_id = Column(String, ForeignKey("routes.id"), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

class IncidentModel(Base):
    __tablename__ = "incidents"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    photo_url = Column(String, nullable=True)
    location = Column(JSON, nullable=True)
    status = Column(String, default="reported")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class PredictionModel(Base):
    __tablename__ = "predictions"
    id = Column(String, primary_key=True, default=gen_uuid)
    sector_id = Column(String, ForeignKey("sectors.id"), nullable=False)
    date = Column(DateTime(timezone=True), nullable=False)
    predicted_volume = Column(Float, nullable=False)
    confidence = Column(Float, nullable=True)
    recommendation = Column(String, nullable=True)
    factors = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class NotificationModel(Base):
    __tablename__ = "notifications"
    id = Column(String, primary_key=True, default=gen_uuid)
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String, nullable=False)
    title = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    data = Column(JSON, nullable=True)
    read = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

Create `src/infrastructure/database/connection.py`:
```python
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/al100")

engine = create_async_engine(DATABASE_URL, echo=False)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def get_session():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
```

## Part B: Alembic Setup

```bash
cd /home/starlyn/Escritorio/AL100/apps/api
source venv/bin/activate
alembic init alembic
```

Configure `alembic/env.py` to use the async engine and import Base from models.

Create initial migration:
```bash
cd /home/starlyn/Escritorio/AL100/apps/api
source venv/bin/activate
alembic revision --autogenerate -m "initial"
```

## Part C: Auth API

Implement these files completely:

**`src/application/ports/i_user_repo.py`:**
```python
from abc import ABC, abstractmethod
from uuid import UUID
from src.domain.entities.user import User

class IUserRepo(ABC):
    @abstractmethod
    async def create(self, user: User) -> User: pass
    @abstractmethod
    async def get_by_code(self, code: str) -> User | None: pass
    @abstractmethod
    async def get_by_id(self, id: str) -> User | None: pass
    @abstractmethod
    async def list_all(self) -> list[User]: pass
```

**`src/infrastructure/database/repositories/user_repo.py`:**
Implement SQLAlchemy async version of IUserRepo.

**`src/interface/api/routes/auth.py`:**
```python
from fastapi import APIRouter, HTTPException, Depends
from src.interface.schemas.user import UserCreate, UserLogin, UserResponse
from src.application.use_cases.create_user import CreateUserUseCase

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=UserResponse)
async def register(data: UserCreate):
    # Admin creates user with code
    pass

@router.post("/login")
async def login(data: UserLogin):
    # Login with code, return user data
    pass

@router.get("/me")
async def get_me(user_id: str = None):
    # Get current user profile
    pass
```

Implement actual logic for register (create user in DB), login (find by code), and me.

**`src/application/use_cases/create_user.py`:**
```python
class CreateUserUseCase:
    def __init__(self, user_repo: IUserRepo):
        self.user_repo = user_repo
    
    async def execute(self, name: str, role: str, code: str, email: str = None) -> User:
        user = User(name=name, role=role, code=code, email=email)
        return await self.user_repo.create(user)
```

**`src/interface/api/dependencies.py`:**
```python
from fastapi import Request, HTTPException

async def get_current_user(request: Request):
    user_id = request.headers.get("X-User-Id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user_id

async def require_admin(request: Request):
    role = request.headers.get("X-User-Role")
    if role != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return True
```

Update `src/interface/api/main.py` to include all routers and wire dependencies.

After completion, run:
```bash
cd /home/starlyn/Escritorio/AL100/apps/api && source venv/bin/activate && python -c "from src.infrastructure.database.models import Base; print('All models loaded:', [c.__tablename__ for c in Base.registry.mappers])"
```

**Global constraints:**
- Python >= 3.12
- Clean Architecture: ports → use_cases → infrastructure
- All text in Spanish
- UUID as string for Supabase compatibility
