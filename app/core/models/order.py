from pydantic import BaseModel, Field

class FoodCount(BaseModel):
    f_id: str = Field(title="food identifier")
    count: int = Field(title="number of food")

class StoreOrder(BaseModel):
    s_id: str = Field(title="food identifier")
    m_id: str = Field(title="menu identifier")
    f_list: list[FoodCount]

class OrderModel(BaseModel):
    u_id: str = Field(title="user identifier")
    total_price: int = Field(title="the total price of all order")
    content: list[StoreOrder]

