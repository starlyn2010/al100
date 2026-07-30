from dataclasses import dataclass, field
from uuid import uuid4, UUID
from datetime import datetime


@dataclass
class Sector:
    id: UUID = field(default_factory=uuid4)
    name: str = ""
    geometry: str = ""
    population_density: float = 0.0
    created_at: datetime = field(default_factory=datetime.now)
