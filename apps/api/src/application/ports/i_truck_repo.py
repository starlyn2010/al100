from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.truck import Truck


class ITruckRepo(ABC):

    @abstractmethod
    async def get_by_id(self, truck_id: UUID) -> Truck | None:
        ...

    @abstractmethod
    async def get_by_sector(self, sector_id: UUID) -> list[Truck]:
        ...

    @abstractmethod
    async def create(self, truck: Truck) -> Truck:
        ...
