from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.incident import Incident


class IIncidentRepo(ABC):

    @abstractmethod
    async def get_by_id(self, incident_id: UUID) -> Incident | None:
        ...

    @abstractmethod
    async def get_by_user(self, user_id: UUID) -> list[Incident]:
        ...

    @abstractmethod
    async def create(self, incident: Incident) -> Incident:
        ...
