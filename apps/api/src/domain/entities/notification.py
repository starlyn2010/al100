from dataclasses import dataclass, field
from uuid import uuid4, UUID
from datetime import datetime


@dataclass
class Notification:
    id: UUID = field(default_factory=uuid4)
    user_id: UUID = field(default_factory=uuid4)
    type: str = ""
    title: str = ""
    message: str = ""
    data: dict | None = None
    read: bool = False
    created_at: datetime = field(default_factory=datetime.now)
