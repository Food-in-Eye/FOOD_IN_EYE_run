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
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


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
        AuthManager.validate_pw(data.pw)

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
            raise Exception(f'Duplicate ID \'{data.id}\'')
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
        user = AuthManager.check_id(data.username, 1)
        if user:
            AuthManager.verify_id(data.username, user['id'])
            AuthManager.verify_pw(data.password, user['pw'])

            response = {
                "user_id": user['_id'],
                "A_Token": '',#TokenManager.ACCESS_TOKEN,
                "R_Token": '',#TokenManager.create_refresh_token(user['_id'], 1)
            }
        
        else:
            raise Exception(f'Nonexistent ID \'{data.username}\'')
        
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
        AuthManager.validate_pw(data.pw)

        response = {}
        if AuthManager.check_id(data.id) == False:
            user = {
                'id': data.id,
                'pw': AuthManager.get_hashed_pw(data.pw),
                'role': 2,
                'R_Token': ''
            }           
            response = {"u_id" : str(DB.create('user', user))}
        else:
            raise Exception(f'Duplicate ID \'{data.id}\'')

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
        user = AuthManager.check_id(data.username, 2)
        if user:
            AuthManager.verify_id(data.username, user['id'])
            AuthManager.verify_pw(data.password, user['pw'])

            response = {
                "user_id": user['_id'],
                "A_Token": '',#TokenManager.ACCESS_TOKEN,
                "R_Token": '',#TokenManager.create_refresh_token(user['_id'], 2)
            } 

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/seller/login',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    return {
        'request': f'POST {PREFIX}//seller/login',
        'status': 'OK',
        'response': response
    }
