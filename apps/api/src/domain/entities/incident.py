from dataclasses import dataclass, field
from uuid import uuid4, UUID
from datetime import datetime


@dataclass
class Incident:
    id: UUID = field(default_factory=uuid4)
    user_id: UUID = field(default_factory=uuid4)
    type: str = ""
    description: str = ""
    photo_url: str | None = None
    location: dict | None = None
    status: str = "pending"
    created_at: datetime = field(default_factory=datetime.now)
