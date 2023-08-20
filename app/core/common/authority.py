from passlib.context import CryptContext
import re

import os
import time
from jose import jwt
from datetime import datetime, timedelta

from core.common.mongo2 import MongodbController

DB = MongodbController('FIE_DB2')


class AuthManagement:
    def __init__(self):
        self.pw_handler = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
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

    def get_hashed_pw(self, pw: str) -> str:
        return self.pw_handler.hash(pw)
    
    def verify_id(self, plain_id:str, stored_id:str):
        if plain_id != stored_id:
            raise Exception(f'Incorrect ID \'{plain_id}\'')

    def verify_pw(self, plain_pw:str, stored_pw:str):
        if not self.pw_handler.verify(plain_pw, stored_pw):
            raise Exception(f'Incorrect PW \'{plain_pw}\'')
    
    @staticmethod
    def validate_pw(v):
        if len(v) < 8:
            raise Exception("비밀번호는 8자리 이상 영문과 숫자를 포함하여 작성해 주세요.")
        
        pattern = re.compile(r'[!@#$%^&*()_+{}\[\]:;<>,.?~\\]')
        if not any(char.isdigit() for char in v) or not any(char.isalpha() for char in v) or not pattern.search(v):
            raise Exception("비밀번호는 8자리 이상 영문과 숫자, 특수문자(!,@,#,$,% 등)를 포함하여 작성해 주세요.")
            
        return v


        

class TokenManagement:
    def __init__(self) -> None:
        self.algorithm = "HS256"
        self.token_type = "bearer"

        self.ACCESS_EXP = 30 # 만료 기간 30분
        self.ACCESS_SK = os.environ['JWT_ACCESS_SECRET_KEY']
        self.ACCESS_TOKEN = ''

        self.REFRESH_SK = os.environ['JWT_REFRESH_SECRET_KEY']
    
    def create_access_token(self):
        data = {
            "sub": "FOOD-IN-EYE",
            "exp": self.ACCESS_EXP,
            "iat": int(time.time()),
            "role": "API server"
        }
        self.ACCESS_TOKEN = jwt.encode(data,  self.ACCESS_SK, algorithm=self.algorithm)
        return self.ACCESS_TOKEN
    
    def create_refresh_token(self, u_id, role):
        if role == 1:
            REFRESH_EXP = 60
        elif role == 2:
            REFRESH_EXP = 60 * 2

        data = {
            "sub": u_id,
            "exp": REFRESH_EXP,
            "iat": int(time.time()),
            "role": role
        }
        return jwt.encode(data,  self.REFRESH_SK, algorithm=self.algorithm)
        