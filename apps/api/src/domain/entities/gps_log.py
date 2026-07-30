from dataclasses import dataclass, field
from uuid import UUID
from datetime import datetime


@dataclass
class GPSLog:
    id: int = 0
    route_id: UUID = field(default_factory=UUID)
    latitude: float = 0.0
    longitude: float = 0.0
    timestamp: datetime = field(default_factory=datetime.now)
