from pydantic import BaseModel


class IncidentCreate(BaseModel):
    type: str
    description: str
    photo_url: str | None = None
    location: dict | None = None


class IncidentResponse(BaseModel):
    id: str
    user_id: str
    type: str
    description: str
    photo_url: str | None = None
    location: dict | None = None
    status: str
    created_at: str
