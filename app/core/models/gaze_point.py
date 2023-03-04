"""Gaze Point Model"""
from pydantic import BaseModel


class GazePointModel(BaseModel):
    x: float | int = -99.9
    y: float | int = -99.9
    t: int