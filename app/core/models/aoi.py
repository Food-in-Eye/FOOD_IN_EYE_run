from pydantic import BaseModel, Field


class BoundingBox(BaseModel):
    """Bounding Box Model"""

    x1: int = Field(title="top left x coordinate")
    y1: int = Field(title="top left y coordinate")
    x2: int = Field(title="bottom right x coordinate")
    y2: int = Field(title="bottom right y coordiante")

class AoiModel(BaseModel):
    """Aoi Model"""

    m_id: str = Field(title="")
    name: str = Field(title="unique name of the aoi")
    bounding_box: BoundingBox = Field(title="bounding box of the aoi")
    num_gaze_points: int | None = Field(
        default=None, title="Number of gaze points in the aoi"
    )
    num_fixations: int | None = Field(
        default=None, title="Number of fixations in the aoi"
    )
    duration: int | None = Field(
        default=None,
        title="Total number of fixation duration within the aoi in milliseconds",
    )
    revisited_count: int | None = Field(
        default=None, title="Number of revisit in the aoi"
    )