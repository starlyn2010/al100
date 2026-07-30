from abc import ABC, abstractmethod
from uuid import UUID

from src.domain.entities.prediction import Prediction


class IPredictionEngine(ABC):

    @abstractmethod
    async def predict_for_sector(self, sector_id: UUID) -> Prediction:
        ...
