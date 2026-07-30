from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.route import Route


class IRouteRepo(ABC):

    @abstractmethod
    async def get_by_id(self, route_id: UUID) -> Route | None:
        ...

    @abstractmethod
    async def get_active_by_truck(self, truck_id: UUID) -> Route | None:
        ...

    @abstractmethod
    async def create(self, route: Route) -> Route:
        ...
