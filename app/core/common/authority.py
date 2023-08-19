import os
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from fastapi import status, HTTPException


from core.common.mongo2 import MongodbController

DB = MongodbController('FIE_DB2')


class AuthManager:
    def __init__(self):
        self.password_handler = CryptContext(schemes=["bcrypt"], deprecated="auto")
    

    def get_hashed_pw(self, password: str) -> str:
        return self.password_handler.hash(password)

        

    def verify_pw(self, stored_password:str, hashed_password:str) -> bool:
        if self.password_handler.verify(stored_password, hashed_password):
            return True
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect password"
            )

        

class TokenManager: # todo: 작성하기
    def __init__(self) -> None:
        ALGORITHM = "HS256"

        ACCESS_EXPIRE_MINUTES = 30 # 만료 기간 30분
        ACCESS_SECRET_KEY = os.environ['JWT_ACCESS_SECRET_KEY']

        REFRESH_EXPIRE_MINUTES = 0 # 만료 기간은 사용자에 따라 차등 설정
        REFRESH_SECRET_KEY = os.environ['JWT_REFRESH_SECRET_KEY']