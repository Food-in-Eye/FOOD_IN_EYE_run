from passlib.context import CryptContext
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

import os
import time
from jose import jwt, JWTError
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException


from core.common.mongo2 import MongodbController

DB = MongodbController('FIE_DB2')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", scheme_name="JWT")

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
    
    def auth_user(self, data: OAuth2PasswordRequestForm, role:int):
        user = self.check_id(data.username, role)
        if user:
            user_id = user['id']
            user_pw = user['pw']

            if data.username != user_id:
                raise Exception(f'Incorrect ID')
            if not self.pw_handler.verify(data.password, user_pw):
                raise Exception(f'Incorrect PW')
        else:
            raise Exception(f'Nonexistent ID')
        
        return user
        

class TokenManagement:
    def __init__(self) -> None:
        self.algorithm = "HS256"
        self.token_type = "bearer"

        self.ACCESS_SK = os.environ['JWT_ACCESS_SECRET_KEY']
        self.ACCESS_EXP = 0
        self.ACCESS_TOKEN = self.create_a_token()

        self.REFRESH_SK = os.environ['JWT_REFRESH_SECRET_KEY']

    
    def create_a_token(self):
        self.ACCESS_EXP = int((datetime.now() + timedelta(seconds=20)).timestamp()) #Todo : 테스트 끝난 후에 minutes = 30 으로 수정할 것
        data = {
            "iss": "FOOD-IN-EYE",
            "sub": "FOOD-IN-EYE",
            "exp": self.ACCESS_EXP,
            "iat": int(datetime.now().timestamp()),
            "role": 0
        }
        self.ACCESS_TOKEN = jwt.encode(data, self.ACCESS_SK, algorithm=self.algorithm)
        return self.ACCESS_TOKEN
    
    def create_r_token(self, u_id, role):
        if role == 1:
            EXP = int((datetime.now() + timedelta(seconds=20)).timestamp()) # Todo : 테스트 이후 minutes = 60 으로 바꿀 것
        elif role == 2:
            EXP = int((datetime.now() + timedelta(seconds=20)).timestamp()) # Todo : 테스트 이후 minutes = 60 * 2 로 바꿀 것

        data = {
            "iss": "FOOD-IN-EYE",
            "sub": u_id,
            "exp": EXP,
            "iat": int(datetime.now().timestamp()),
            "role": role
        }
        return jwt.encode(data, self.REFRESH_SK, algorithm=self.algorithm)



    def recreate_a_token(self):
        try:
            cur_time = int(datetime.now().timestamp())
            
            if self.ACCESS_EXP - cur_time > 10: # Todo: 테스트 후에는 0 으로 설정(0초)
                raise HTTPException(status_code = 403, detail =f'Signature renew has denied.')
            
            return self.create_a_token()
        
        except JWTError as e:
            raise HTTPException(status_code = 401, detail = str(e))
        
    def recreate_r_token(self, token:str, u_id:str, role:int):
        try:
            payload = jwt.decode(token, self.REFRESH_SK, algorithms=self.algorithm)

            cur_time = int(datetime.now().timestamp())
            exp_time = payload.get("exp", 0)
            print(datetime.fromtimestamp(cur_time))
            print(datetime.fromtimestamp(exp_time))
            if (exp_time - cur_time) > 10: # Todo: 테스트 후에는 60 * 10 으로 설정(10분)
                raise HTTPException(status_code = 403, detail =f'Signature renew has denied.')

            return self.create_r_token(u_id, role)
        
        except JWTError as e:
            raise HTTPException(status_code = 401, detail = str(e))
        


    def auth_a_token(self, token: str = Depends(oauth2_scheme)):
        try:
            payload = jwt.decode(token, self.ACCESS_SK, algorithms=self.algorithm)
            return token
        
        except JWTError as e:
            raise HTTPException(status_code = 401, detail = str(e))
        
    def auth_r_token(self, token: str = Depends(oauth2_scheme)):
        try:
            payload = jwt.decode(token, self.REFRESH_SK, algorithms=self.algorithm)
            return token
        
        except JWTError as e:
            raise HTTPException(status_code = 401, detail = str(e))



