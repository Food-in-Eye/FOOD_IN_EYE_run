from passlib.context import CryptContext
from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

import os
import time
from jose import jwt, JWTError
from datetime import datetime, timedelta
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
        self.ACCESS_TOKEN = self.create_a_token()

        self.REFRESH_SK = os.environ['JWT_REFRESH_SECRET_KEY']
    
    def create_a_token(self):
        data = {
            "iss": "FOOD-IN-EYE",
            "sub": "FOOD-IN-EYE",
            "exp": datetime.utcnow() + timedelta(minutes = 1),
            "iat": int(time.time()),
            "role": 0
        }
        self.ACCESS_TOKEN = jwt.encode(data, self.ACCESS_SK, algorithm=self.algorithm)
        return self.ACCESS_TOKEN
    
    def create_r_token(self, u_id, role):
        if role == 1:
            EXP = datetime.utcnow() + timedelta(minutes = 5)
        elif role == 2:
            EXP = datetime.utcnow() + timedelta(minutes = 5)

        data = {
            "iss": "FOOD-IN-EYE",
            "sub": u_id,
            "exp": EXP,
            "iat": int(time.time()),
            "role": role
        }
        return jwt.encode(data, self.REFRESH_SK, algorithm=self.algorithm)



    def recreate_a_token(self):
        payload = jwt.decode(self.ACCESS_TOKEN, self.ACCESS_SK, algorithms=self.algorithm)

        cur_time = int(time.time())
        exp_time = payload.get("exp", 0)

        if (exp_time - cur_time) > 0:
            raise Exception(f'Token not expired')
        
        return self.create_a_token()
        
    def recreate_r_token(self, token:str, u_id:str, role:int):
        try:
            payload = jwt.decode(token, self.REFRESH_SK, algorithms=self.algorithm)

            cur_time = int(time.time())
            exp_time = payload.get("exp", 0)

            if (exp_time - cur_time) > 10 or (exp_time - cur_time) < 0:
                raise Exception(f'Token not expired')
            
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




