from pydantic import BaseModel, Field

class StoreModel(BaseModel):
    name: str = Field(title="name of restuarant")
    m_id: str = Field(title="menu identifier currently in use by restaurant")
    
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