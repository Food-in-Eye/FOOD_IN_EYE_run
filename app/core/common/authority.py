import os
from fastapi import HTTPException
from jose import jwt
from passlib.context import CryptContext
from pydantic import validator
import re

from core.common.mongo2 import MongodbController

DB = MongodbController('FIE_DB2')


class AuthManager:
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


        

class TokenManager: # todo: 작성하기
    def __init__(self) -> None:
        ALGORITHM = "HS256"

        ACCESS_EXPIRE_MINUTES = 30 # 만료 기간 30분
        ACCESS_SECRET_KEY = os.environ['JWT_ACCESS_SECRET_KEY']

        REFRESH_EXPIRE_MINUTES = 0 # 만료 기간은 사용자에 따라 차등 설정
        REFRESH_SECRET_KEY = os.environ['JWT_REFRESH_SECRET_KEY']