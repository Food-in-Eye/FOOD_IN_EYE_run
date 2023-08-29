from passlib.context import CryptContext
from passlib.exc import UnknownHashError
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from bson.objectid import ObjectId
from v2.routers.src.util import Util

import os
from jose import jwt, JWTError
from datetime import datetime, timedelta
from fastapi import HTTPException, Request


from core.common.mongo import MongodbController

DB = MongodbController('FIE_DB2')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", scheme_name="JWT")


class AuthManagement:
    def __init__(self):
        self.pw_handler = CryptContext(schemes=["bcrypt"], deprecated="auto")
    
    def check_dup(self, id:str) -> dict:
        try:
            user = DB.read_one('user', {'id':id})
        except:
            return False
        return user

    def get_uid(self, id:str):
        user = self.check_dup(id)

        if user:
            return user['_id']
        raise HTTPException(status_code = 401, detail = f'Nonexistent ID')

    def get_hashed_pw(self, pw: str) -> str:
        return self.pw_handler.hash(pw)
    
    def auth_pw(self, plain_pw:str, hashed_pw:str):
        try:
            if self.pw_handler.verify(plain_pw, hashed_pw):
                return True
            raise HTTPException(status_code = 401, detail = f'Incorrect PW')
        except UnknownHashError as e:
            raise HTTPException(status_code = 401, detail = str(e))

    def auth_user(self, u_id, pw):
        try:  # ToDo : mongo 코드 바뀌면 Exception 바꾸기 - try-excepy 문을 밖으로 빼면 다른 오류들도 잡힘
            u_id = Util.check_id(u_id)
            user = DB.read_one('user', {'_id':ObjectId(u_id)})
        except Exception as e:
            raise HTTPException(status_code = 401, detail = e)

        if user:
            self.auth_pw(pw, user['pw'])
        else:
            raise HTTPException(status_code = 401, detail = f'Nonexistent ID')
        
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
        self.ACCESS_EXP = 0
        self.ACCESS_TOKEN_buyer = self.init_a_token("buyer")
        self.ACCESS_TOKEN_seller = self.init_a_token("seller")

        self.REFRESH_SK = os.environ['JWT_REFRESH_SECRET_KEY']
    


    def init_a_token(self, scope:str):
        self.ACCESS_EXP = int((datetime.now() + timedelta(minutes=30)).timestamp())
        
        data = {
            "iss": "ACCESS_Token",
            "exp": self.ACCESS_EXP,
            "iat": int(datetime.now().timestamp()),
            "scope": scope
        }
        self.ACCESS_TOKEN = jwt.encode(data, self.ACCESS_SK, algorithm=self.algorithm)
        return self.ACCESS_TOKEN
    
    def init_r_token(self, u_id:str, scope:str):
        if scope == "buyer":
            EXP = int((datetime.now() + timedelta(minutes=60)).timestamp())
        elif scope == "seller":
            EXP = int((datetime.now() + timedelta(minutes=60*2)).timestamp())

        data = {
            "iss": "REFRESH_Token",
            "sub": u_id,
            "exp": EXP,
            "iat": int(datetime.now().timestamp()),
            "scope": scope
        }
        return jwt.encode(data, self.REFRESH_SK, algorithm=self.algorithm)



    def recreate_a_token(self, scope:str):
        try:
            cur_time = int(datetime.now().timestamp())
            
            if self.ACCESS_EXP - cur_time > 0:
                raise HTTPException(status_code = 403, detail =f'Signature renewal denied.')
            
            return self.init_a_token(scope)
        
        except JWTError as e:
            raise HTTPException(status_code = 401, detail = str(e))

    def recreate_r_token(self, payload:dict, u_id:str, scope:str):
        try:
            cur_time = int(datetime.now().timestamp())
            exp_time = payload["exp"]

            if (exp_time - cur_time) > 60 * 10:
                raise HTTPException(status_code = 403, detail =f'Signature renewal has denied.')

            return self.init_r_token(u_id, scope)
        
        except JWTError as e:
            raise HTTPException(status_code = 401, detail = str(e))
        


    def auth_a_token(self, token: str = Depends(oauth2_scheme)):
        try:
            payload = jwt.decode(token, self.ACCESS_SK, algorithms=self.algorithm)
            return dict(payload)
        
        except JWTError as e:
            raise HTTPException(status_code = 401, detail = str(e))
        
    def auth_r_token(self, token: str = Depends(oauth2_scheme)):
        try:
            payload = jwt.decode(token, self.REFRESH_SK, algorithms=self.algorithm)
            return dict(payload)
        
        except JWTError as e:
            raise HTTPException(status_code = 401, detail = str(e))


    def dispatch(self, request: Request):
        try:
            token = request.headers.get("Authorization", "").split(" ")[1]

            payload = jwt.decode(token, self.ACCESS_SK, algorithms=self.algorithm)
            request.state.token_scope = payload.get("scope")
        except JWTError as e:
            raise HTTPException(status_code=401, detail=str(e))
        
        
    @staticmethod
    def is_buyer(request: Request) -> bool:
        if request.state.token_scope == "buyer":
            return True
        return False
    
    @staticmethod
    def is_seller(request: Request) -> bool:
        if request.state.token_scope == "seller":
            return True
        return False