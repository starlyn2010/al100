from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.notification import Notification


class INotificationService(ABC):

    @abstractmethod
    async def send(self, notification: Notification) -> None:
        ...

    @abstractmethod
    async def get_by_user(self, user_id: UUID) -> list[Notification]:
        ...
