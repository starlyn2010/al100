from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel

router = APIRouter(prefix="/api/auth", tags=["auth"])


class UserCreate(BaseModel):
    name: str
    role: str = "citizen"
    email: str | None = None
    code: str


class UserLogin(BaseModel):
    code: str


class UserResponse(BaseModel):
    id: str
    name: str
    email: str | None = None
    role: str
    code: str
    phone: str | None = None
    created_at: str


fake_users_db: dict[str, dict] = {}


@router.post("/register", response_model=UserResponse)
async def register(data: UserCreate):
    if data.code in fake_users_db:
        raise HTTPException(status_code=400, detail="Code already exists")
    user = {
        "id": data.code,
        "name": data.name,
        "email": data.email,
        "role": data.role,
        "code": data.code,
        "phone": None,
        "created_at": "2026-07-29T00:00:00Z",
    }
    fake_users_db[data.code] = user
    return user


@router.post("/login")
async def login(data: UserLogin):
    user = fake_users_db.get(data.code)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid code")
    return user


@router.get("/me")
async def get_me(code: str = ""):
    user = fake_users_db.get(code)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
