from pydantic import BaseModel


class SectorResponse(BaseModel):
    id: str
    name: str
    geometry: str
    population_density: float
    created_at: str
