from pydantic import BaseModel, Field

class GazePointModel(BaseModel):
    x: float | int = -99.9
    y: float | int = -99.9
    t: int

class RawGazeModel(BaseModel):
    page: str = Field(title='Pages from which gaze was collected')
    s_num: int
    f_num: int
    gaze: list[GazePointModel]

    def dict(self, *args, **kwargs):
        return super().dict(*args, **kwargs, exclude_unset=True)