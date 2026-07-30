from pydantic import BaseModel
from datetime import datetime


class GPSLogResponse(BaseModel):
    id: int
    route_id: str
    latitude: float
    longitude: float
    timestamp: datetime
