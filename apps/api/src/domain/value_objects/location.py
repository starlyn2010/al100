from dataclasses import dataclass


@dataclass(frozen=True)
class Location:
    latitude: float
    longitude: float

    def to_dict(self) -> dict:
        return {"latitude": self.latitude, "longitude": self.longitude}
