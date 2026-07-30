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
