import os
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from fastapi import status, HTTPException


from core.common.mongo2 import MongodbController

DB = MongodbController('FIE_DB2')


class AuthManager:
    def __init__(self):
        self.pw_handler = CryptContext(schemes=["bcrypt"], deprecated="auto")
    

    def get_hashed_pw(self, pw: str) -> str:
        return self.pw_handler.hash(pw)

    def check_id(self, id:str, role:int = 0) -> bool:
        if role == 0:
            query = {'id': id}
        else:    
            query = {'id': id, 'role': role}
            
        users = DB.read_all_by_query('user', query)
        
        if users:
            return users[0]
        else:
            return False

    def verify_id(self, plain_id:str, stored_id:str):
        if plain_id != stored_id:
            raise Exception(f'Incorrect ID \'{plain_id}\'')

    def verify_pw(self, plain_pw:str, stored_pw:str):
        if not self.pw_handler.verify(plain_pw, stored_pw):
            raise Exception(f'Incorrect PW \'{plain_pw}\'')

        

class TokenManager: # todo: 작성하기
    def __init__(self) -> None:
        ALGORITHM = "HS256"

        ACCESS_EXPIRE_MINUTES = 30 # 만료 기간 30분
        ACCESS_SECRET_KEY = os.environ['JWT_ACCESS_SECRET_KEY']

        REFRESH_EXPIRE_MINUTES = 0 # 만료 기간은 사용자에 따라 차등 설정
        REFRESH_SECRET_KEY = os.environ['JWT_REFRESH_SECRET_KEY']