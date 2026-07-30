from dataclasses import dataclass, field
from uuid import uuid4, UUID
from datetime import datetime


@dataclass
class Truck:
    id: UUID = field(default_factory=uuid4)
    name: str = ""
    plate: str = ""
    sector_id: UUID | None = None
    driver_id: UUID | None = None
    status: str = "available"
    created_at: datetime = field(default_factory=datetime.now)
