from pydantic import BaseModel, Field
from enum import Enum

class Gender(Enum):
    male = 1
    female = 2

# 회원 가입 시에 입력으로 받는 BaseModel

class BuyerModel(BaseModel):
    id: str = Field(title="name of restuarant")
    pw: str
    name: str
    # role: int = Field(title="Gender of user [buyer:1/seller:2]")
    gender: Gender = Field(title="Gender of user [male:1/female:2]")
    age: int

class SellerModel(BaseModel):
    id: str
    pw: str

