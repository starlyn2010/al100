from dataclasses import dataclass, field
from uuid import uuid4, UUID
from datetime import datetime, date


@dataclass
class Route:
    id: UUID = field(default_factory=uuid4)
    truck_id: UUID = field(default_factory=uuid4)
    driver_id: UUID = field(default_factory=uuid4)
    date: date = field(default_factory=date.today)
    start_time: datetime | None = None
    end_time: datetime | None = None
    status: str = "pending"
