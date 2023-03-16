from pydantic import BaseModel, Field
from bson.objectid import ObjectId
from enum import Enum

class Status(Enum):
    open = 1
    close = 2


class StoreModel(BaseModel):
    _id: ObjectId | None
    name: str = Field(title="name of restuarant")
    desc: str = Field(title="description of the restuarant")
    schedule: str = Field(title="schedule of the restuarant")
    notice: str | None = Field(title="notice of the restuarant")
    status: Status = Field(title="Restaurant operation status[open:1/close:2]")
    img_src: str = Field(title="URI related to image request")
    m_id: str | None = Field(title="menu identifier currently in use by restaurant")
    
class FoodModel(BaseModel):
    name: str = Field(title="name of food")
    price: int = Field(title="price of food")
    img_src: str = Field(title="path where food images are stored")
    cal: int = Field(title="calories of food")
    desc: int = Field(title="description of food")
    loc: int = Field(title="location of food in menu")

class MenuModel(BaseModel):
    m_id: str = Field(title="menu identifier")
    menus: list[FoodModel] = Field(title="list of food")