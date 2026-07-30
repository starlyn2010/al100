from pydantic import BaseModel


class PredictionResponse(BaseModel):
    id: str
    sector_id: str
    date: str
    predicted_volume: float
    confidence: float
    recommendation: str
    factors: dict | None = None
    created_at: str
