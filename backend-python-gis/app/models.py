"""Pydantic request/response models."""
from typing import List, Optional

from pydantic import BaseModel, Field, model_validator

from . import config


def is_in_poland(latitude: float, longitude: float) -> bool:
    bounds = config.POLAND_BOUNDS
    return (
        bounds["minLatitude"] <= latitude <= bounds["maxLatitude"]
        and bounds["minLongitude"] <= longitude <= bounds["maxLongitude"]
    )


class Point(BaseModel):
    name: str = Field(..., min_length=1)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)

    @model_validator(mode="after")
    def validate_poland_bounds(self):
        if not is_in_poland(self.latitude, self.longitude):
            raise ValueError("Współrzędne muszą leżeć na terenie Polski.")
        return self


class IngestRequest(BaseModel):
    points: List[Point] = Field(..., min_length=1)
    date: Optional[str] = None


class Measurement(BaseModel):
    name: Optional[str] = None
    latitude: float
    longitude: float
    temperature: float
    measurementDate: str


class IngestResponse(BaseModel):
    mode: str
    topic: str
    published: int
    measurements: List[Measurement]
