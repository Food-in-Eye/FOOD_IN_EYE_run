from pydantic import BaseModel, Field
from enum import Enum
class OrderStatus(Enum):
    PENDING = 0
    PROCESSING = 1
    COMPLETED = 2
class StoreOrder(BaseModel):
    s_id: str = Field(title="food identifier")
    m_id: str = Field(title="menu identifier")
    f_list: list

class OrderModel(BaseModel):
    u_id: str = Field(title="user identifier")
    total_price: int = Field(title="the total price of all order")
    status: OrderStatus = Field(title="status of the order")
    content: list[StoreOrder]

