from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.user import User


class IUserRepo(ABC):

    @abstractmethod
    async def get_by_id(self, user_id: UUID) -> User | None:
        ...

    @abstractmethod
    async def get_by_code(self, code: str) -> User | None:
        ...

    @abstractmethod
    async def create(self, user: User) -> User:
        ...
