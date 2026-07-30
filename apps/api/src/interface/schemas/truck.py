from pydantic import BaseModel


class TruckResponse(BaseModel):
    id: str
    name: str
    plate: str
    sector_id: str | None = None
    driver_id: str | None = None
    status: str
    created_at: str
