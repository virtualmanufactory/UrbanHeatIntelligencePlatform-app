"""Pydantic request/response models."""
from typing import List, Optional

from pydantic import BaseModel, Field


class Point(BaseModel):
    name: Optional[str] = None
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class IngestRequest(BaseModel):
    points: Optional[List[Point]] = None
    # ISO date (YYYY-MM-DD); defaults to today when omitted.
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
