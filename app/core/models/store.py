from pydantic import BaseModel, Field
from bson.objectid import ObjectId
from enum import Enum

class Status(Enum):
    open = 1
    close = 2


class StoreModel(BaseModel):
    name: str = Field(title="name of restuarant")
    desc: str = Field(title="description of the restuarant")
    schedule: str = Field(title="schedule of the restuarant")
    notice: str | None = Field(title="notice of the restuarant")
    status: Status = Field(title="Restaurant operation status[open:1/close:2]")
    
class FoodModel(BaseModel):
    name: str = Field(title="name of food")
    price: int = Field(title="price of food")
    desc: str = Field(title="description of food")
    allergy: str = Field(title="Indication of food allergy-causing substances")
    origin: str = Field(title="Food country of origin indication")

class FoodPos(BaseModel):
    f_id: str = Field(title="Food identifier")
    f_num: int = Field(title="number of food")

class MenuModel(BaseModel):
    f_list: list[FoodPos] = Field(title="list of food")

class NameModel(BaseModel):
    name: str