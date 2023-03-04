from pydantic import BaseModel, Field
from .gaze_point import GazePointModel


class FixationModel(BaseModel):
    cx: float = Field(title="center x of fixation")
    cy: float = Field(title="center y of fixation")
    st: int = Field(title="start time of fixation")
    et: int = Field(title="end time of fixation")
    r: float = Field(title="radius of fixation")
    gp: list[GazePointModel] = Field(title="list of gaze points")