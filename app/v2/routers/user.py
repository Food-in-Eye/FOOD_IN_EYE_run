"""
user_router
"""

from core.models import *
from core.common.mongo2 import MongodbController
from core.common.authority import AuthManagement, TokenManagement

from typing import Annotated

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

user_router = APIRouter(prefix="/users")
AuthManager = AuthManagement()
TokenManager = TokenManagement()

PREFIX = 'api/v2/users'

DB = MongodbController('FIE_DB2')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token", scheme_name="JWT")


@user_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}


@user_router.post('/idcheck')
async def check_duplicate_id(data: dict = Body(...)):
    try:
        if AuthManager.check_id(data['id']):
            response = 'unavailable'
        else:
            response = 'available'

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/idcheck',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    return {
        'request': f'POST {PREFIX}/idcheck',
        'status': 'OK',
        'response': response
    }


@user_router.post('/buyer/signup')
async def buyer_signup(data: BuyerModel):
    try:
        response = {}
        if AuthManager.check_id(data.id) == False:
            user = {
                'id': data.id,
                'pw': AuthManager.get_hashed_pw(data.pw),
                'role': 1,
                'name': data.name,
                'gender': data.gender.value,
                'age': data.age,
                'R_Token': ''
            }
                            
            response = {"u_id" : str(DB.create('user', user))}
        else:
            raise Exception(f'Duplicate ID')
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/buyer/signup',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    return {
        'request': f'POST {PREFIX}/buyer/signup',
        'status': 'OK',
        'response': response
    }


@user_router.post('/buyer/login')
async def buyer_login(data: OAuth2PasswordRequestForm = Depends()):
    try:
        response = {}

        user = AuthManager.auth_user(data, 1)
        user['R_Token'] = TokenManager.create_r_token(user['_id'], 1)

        DB.update_by_id('user', user['_id'], {"R_Token": user['R_Token']})

        response = {
            "user_id": user['_id'],
            "token_type": "bearer",
            "A_Token": TokenManager.ACCESS_TOKEN,
            "R_Token": user['R_Token']
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/buyer/login',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

    return {
        'request': f'POST {PREFIX}/buyer/login',
        'status': 'OK',
        'response': response
    }



@user_router.post('/seller/signup')
async def seller_signup(data: SellerModel):
    try:
        response = {}
        if AuthManager.check_id(data.id) == False:
            user = {
                "id": data.id,
                "pw": AuthManager.get_hashed_pw(data.pw),
                "role": 2,
                "R_Token": ""
            }           
            response = {"u_id" : str(DB.create('user', user))}

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/seller/signup',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    return {
        'request': f'POST {PREFIX}/seller/signup',
        'status': 'OK',
        'response': response
    }


@user_router.post('/seller/login')
async def seller_login(data: OAuth2PasswordRequestForm = Depends()):
    try:
        response = {}

        user = AuthManager.auth_user(data, 2)
        user['R_Token'] = TokenManager.create_r_token(user['_id'], 2)

        DB.update_by_id('user', user['_id'], {"R_Token": user['R_Token']})

        response = {
            "token_type": "bearer",
            "A_Token": TokenManager.ACCESS_TOKEN,
            "R_Token": user['R_Token']
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/seller/login',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    return {
        'request': f'POST {PREFIX}/seller/login',
        'status': 'OK',
        'response': response
    }

@user_router.get('/issue/access')
async def get_access_token(u_id:str, r_token: str = Depends(TokenManager.auth_r_token)):
    try:
        user = DB.read_by_id('user', u_id)
        print(user)
        if user['R_Token'] == r_token:
            return {
                "A_Token": TokenManager.recreate_a_token()
            }
    except Exception as e:
        raise HTTPException(status_code = 400, detail = str(e))

@user_router.get('/issue/refresh')
async def get_refresh_token(u_id:str, r_token: str = Depends(TokenManager.auth_r_token)):
    try:
        user = DB.read_by_id('user', u_id)
        print(user)
        if user['R_Token'] == r_token:
            return {
                "R_Token": TokenManager.recreate_r_token(r_token, u_id, user['role'])
            }
    except Exception as e:
        raise HTTPException(status_code = 400, detail = str(e))
    


@user_router.get('/tokentest')
async def get_refresh_token(a_token: str = Depends(TokenManager.auth_a_token)):
    try:
        return a_token
    except Exception as e:
        raise HTTPException(status_code = 400, detail = str(e))