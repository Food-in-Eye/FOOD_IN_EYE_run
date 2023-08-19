"""
user_router
"""

from core.models import *
from core.common.mongo2 import MongodbController
from core.common.authority import AuthManager, TokenManager

from typing import Annotated

from fastapi import APIRouter, Depends, FastAPI, HTTPException, Body
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

user_router = APIRouter(prefix="/users")
AuthManager = AuthManager()

PREFIX = 'api/v2/users'

DB = MongodbController('FIE_DB2')
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


@user_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}


@user_router.post('/signup/idcheck')
async def check_duplicate_id(id: dict = Body(...)):
    try:
        response = ''

        result = DB.read_all_by_feild('user', 'id', id)

        if result is not None and len(result) > 0:
            response = 'unavailable'
        else:
            response = 'available'

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/signup/idcheck',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

    return {
        'request': f'POST {PREFIX}/signup/idcheck',
        'status': 'OK',
        'response': response
    }


@user_router.post('/signup/buyer')
async def signup_seller(data: BuyerModel):
    try:
        user = {
            'id': data.id,
            'pw': AuthManager.get_hashed_pw(data.pw),
            'role': 1,
            'name': data.name,
            'gender': data.gender.value,
            'age': data.age,
            'R_Token': ''
        }
        id = str(DB.create('user', user))

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/signup/buyer',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'POST {PREFIX}/signup/buyer',
        'status': 'OK',
        'document_id': id,
    }


@user_router.post('/login/buyer')
async def login(formdata: OAuth2PasswordRequestForm = Depends()):
    try:
        user = DB.read_all_by_feild('user', 'id', formdata.username)
        if user:
            print(user)
            hashed_pw = AuthManager.get_hashed_pw(formdata.password)
            AuthManager.verify_pw(user['pw'], hashed_pw)

        response = ""    # todo: AT, RT가 들어가야 함

    except HTTPException as e_http:
        print('HTTP_ERROR', e_http)
        return {
            'request': f'POST {PREFIX}/login/buyer',
            'status': 'ERROR',
            'message': f'ERROR {e_http}'
        }
    
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/login/buyer',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

    return {
        'request': f'POST {PREFIX}/login/buyer',
        'status': 'OK',
        'response': response
    }


@user_router.post('/signup/seller')
async def signup_seller(data: SellerModel):
    try:
        user = {
            'id': data.id,
            'pw': AuthManager.get_hashed_pw(data.pw),
            'role': 2,
            's_id': '',
            'R_Token': ''
        }
        id = str(DB.create('user', user))

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/signup/seller',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'POST {PREFIX}/signup/seller',
        'status': 'OK',
        'document_id': id,
    }


@user_router.post('/login/seller')
async def login(formdata: OAuth2PasswordRequestForm = Depends()):
    try:
        user = DB.read_all_by_feild('user', 'id', formdata.username)
        if user:
            print(user)
            hashed_pw = AuthManager.get_hashed_pw(formdata.password)
            AuthManager.verify_pw(user['pw'], hashed_pw)

        response = ""    # todo: AT, RT가 들어가야 함

    except HTTPException as e_http:
        print('HTTP_ERROR', e_http)
        return {
            'request': f'POST {PREFIX}/login/seller',
            'status': 'ERROR',
            'message': f'ERROR {e_http}'
        }
    
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/login/seller',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

    return {
        'request': f'POST {PREFIX}/login/seller',
        'status': 'OK',
        'response': response
    }
