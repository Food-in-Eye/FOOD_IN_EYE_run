from pydantic import BaseModel, Field

class StoreOrder(BaseModel):
    s_id: str = Field(title="food identifier")
    m_id: str = Field(title="menu identifier")
    f_list: list

class OrderModel(BaseModel):
    u_id: str = Field(title="user identifier")
    total_price: int = Field(title="the total price of all order")
    content: list[StoreOrder]

