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

# 아이디, 비밀번호만 따로 입력 받을 때 사용할 BaseModel

class IdModel(BaseModel):
    id: str

class PwModel(BaseModel):
    pw: str

# 정보 수정 시에 입력을 받는 BaseModel

class BuyerModifyModel(BaseModel):
    id: str
    old_pw: str
    new_pw: str
    name: str
    gender: Gender = Field(title="Gender of user [male:1/female:2]")
    age: int
    camera: bool

class SellerModifyModel(BaseModel):
    id: str
    old_pw: str
    new_pw: str

class Camera(BaseModel):
    camera: bool 