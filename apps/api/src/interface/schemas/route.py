from pydantic import BaseModel
from datetime import datetime


class RouteResponse(BaseModel):
    id: str
    truck_id: str
    driver_id: str
    date: str
    start_time: datetime | None = None
    end_time: datetime | None = None
    status: str
