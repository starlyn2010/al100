from dataclasses import dataclass, field
from uuid import uuid4, UUID
from datetime import datetime


@dataclass
class User:
    id: UUID = field(default_factory=uuid4)
    name: str = ""
    email: str | None = None
    role: str = "citizen"
    code: str = ""
    phone: str | None = None
    created_at: datetime = field(default_factory=datetime.now)
