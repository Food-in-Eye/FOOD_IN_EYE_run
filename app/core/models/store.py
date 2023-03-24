from pydantic import BaseModel, Field
from bson.objectid import ObjectId
from enum import Enum
from datetime import datetime
class Status(Enum):
    open = 1
    close = 2


class StoreModel(BaseModel):
    name: str = Field(title="name of restuarant")
    desc: str = Field(title="description of the restuarant")
    schedule: str = Field(title="schedule of the restuarant")
    notice: str | None = Field(title="notice of the restuarant")
    status: Status = Field(title="Restaurant operation status[open:1/close:2]")
    img_src: str = Field(title="URI related to image request")
    m_id: str | None = Field(title="menu identifier currently in use by restaurant")
    
class FoodModel(BaseModel):
    pos: int = Field(title="position of food in menu")
    name: str = Field(title="name of food")
    price: int = Field(title="price of food")
    img_src: str = Field(title="path where food images are stored")
    desc: str = Field(title="description of food")
    allergy: str = Field(title="Indication of food allergy-causing substances")
    origin: str = Field(title="Food country of origin indication")

class MenuModel(BaseModel):
    s_id: str = Field(title="Restaurant identifier for this menu")
    date: datetime = Field(title="the date of this menu was created")
    m_list: list[FoodModel] = Field(title="list of food")