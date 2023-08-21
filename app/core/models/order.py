from pydantic import BaseModel, Field

class StoreOrder(BaseModel):
    s_id: str = Field(title="store identifier")
    s_name: str = Field(title="store name")
    m_id: str = Field(title="menu identifier")
    f_list: list

class OrderModel(BaseModel):
    u_id: str = Field(title="user identifier")
    content: list[StoreOrder]

