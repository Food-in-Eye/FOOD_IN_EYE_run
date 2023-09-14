from passlib.context import CryptContext
from passlib.exc import UnknownHashError
from fastapi import Depends, Request
from fastapi.security import OAuth2PasswordBearer
from bson.objectid import ObjectId

from v2.routers.src.util import Util
from core.error import CustomException
from core.common.mongo import MongodbController

import os
from jose import jwt, ExpiredSignatureError
from datetime import datetime, timedelta


DB = MongodbController('FIE_DB2')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", scheme_name="JWT")


class AuthManagement:
    def __init__(self):
        self.pw_handler = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    def check_dup(self, collection:str, field:str) -> dict:
        try:
            user = DB.read_one(collection, field)
        except:
            return False
        return user

    def get_uid(self, id:str):        
        user = self.check_dup('user', {'id':id})

        if user:
            return user['_id']
        raise CustomException(status_code=401.1)

    def get_hashed_pw(self, pw: str) -> str:
        return self.pw_handler.hash(pw)
    
    def auth_pw(self, plain_pw:str, hashed_pw:str):
        if self.pw_handler.verify(plain_pw, hashed_pw):
            return True
        raise CustomException(status_code=401.1)
        
    def auth_user(self, u_id, pw):
        u_id = Util.check_id(u_id)
        user = DB.read_one('user', {'_id':ObjectId(u_id)})

        if user:
            self.auth_pw(pw, user['pw'])
        else:
            raise CustomException(status_code=401.1)
        
        return user
    


class TokenManagement:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.initialize()  # 인스턴스 초기화 메서드 호출
        return cls._instance

    def initialize(self):
        self.algorithm = "HS256"
        self.token_type = "bearer"

        self.ACCESS_SK = os.environ['JWT_ACCESS_SECRET_KEY']
        self.REFRESH_SK = os.environ['JWT_REFRESH_SECRET_KEY']
    
    def init_a_token(self, u_id:str, scope:str):
        data = {
            "iss": "ACCESS_Token",
            "sub": u_id,
            "exp": int((datetime.now() + timedelta(seconds=10)).timestamp()),
            "iat": int(datetime.now().timestamp()),
            "scope": scope
        }
        return jwt.encode(data, self.ACCESS_SK, algorithm=self.algorithm)
    
    def init_r_token(self, u_id:str, scope:str):
        if scope == "buyer":
            EXP = int((datetime.now() + timedelta(minutes=60)).timestamp())
        elif scope == "seller":
            EXP = int((datetime.now() + timedelta(minutes=60*2)).timestamp())

        data = {
            "iss": "REFRESH_Token",
            "sub": u_id,
            "exp": EXP,
            "iat": int(Util.get_cur_time().timestamp()),
            "scope": scope
        }
        return jwt.encode(data, self.REFRESH_SK, algorithm=self.algorithm)


    # Todo : a_token 재생성 방법 생각해봐야 함
    def recreate_a_token(self, a_token:str, u_id:str, scope:str):
        try:
            self.get_payload('access', a_token)
        except CustomException:
            return self.init_a_token(u_id, scope)

        raise CustomException(status_code=403.6)

    def recreate_r_token(self, r_token:str, u_id:str, scope:str):
        payload = self.get_payload('refresh', r_token)

        cur_time = int(datetime.now().timestamp())
        exp_time = payload["exp"]

        if (exp_time - cur_time) > 60 * 10:
            raise CustomException(status_code=403.6)

        return self.init_r_token(u_id, scope)
        

    def get_payload(self, field:str, token:str):
        SK = self.ACCESS_SK if field == 'access' else self.REFRESH_SK
        try:
            return jwt.decode(token, SK, algorithms=self.algorithm)
            
        except ExpiredSignatureError:
            raise CustomException(status_code=401.62)
    

    def auth_a_token(self, token: str = Depends(oauth2_scheme)):
        self.get_payload('access', token)
        return token

    def auth_r_token(self, token: str = Depends(oauth2_scheme)):
        self.get_payload('refresh', token)
        return token
        

    def dispatch(self, request: Request):
        try:
            token = request.headers.get("Authorization", "").split(" ")[1]

            payload = self.get_payload('access', token)
            request.state.token_scope = payload.get("scope")

        except IndexError:
            raise CustomException(status_code=401.61)
        
        
    @staticmethod
    def is_buyer(scope:str) -> bool:
        if scope == "buyer":
            return True
        return False
    
    @staticmethod
    def is_seller(scope:str) -> bool:
        if scope == "seller":
            return True
        return False
    