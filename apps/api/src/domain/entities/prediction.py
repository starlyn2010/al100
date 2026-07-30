from dataclasses import dataclass, field
from uuid import uuid4, UUID
from datetime import datetime, date


@dataclass
class Prediction:
    id: UUID = field(default_factory=uuid4)
    sector_id: UUID = field(default_factory=uuid4)
    date: date = field(default_factory=date.today)
    predicted_volume: float = 0.0
    confidence: float = 0.0
    recommendation: str = ""
    factors: dict | None = None
    created_at: datetime = field(default_factory=datetime.now)
