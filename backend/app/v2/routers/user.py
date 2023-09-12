"""
user_router
"""

from .src.util import Util
from core.models import *
from core.common.mongo import MongodbController
from core.common.authority import AuthManagement, TokenManagement
from core.error.exception import CustomException
from fastapi import APIRouter, Depends
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
async def check_duplicate_id(data: IdModel):
    if AuthManager.check_dup('user', {'id':data.id}):
        state = 'unavailable'
    else:
        state = 'available'
    return {
        'state': state
    }


"""
buyer API
"""

@user_router.post('/buyer/signup')
async def buyer_signup(data: BuyerModel):
    if AuthManager.check_dup('user', {'id':data.id}) == False:
        user = {
            'id': data.id,
            'pw': AuthManager.get_hashed_pw(data.pw),
            'scope': "buyer",
            'name': data.name,
            'gender': data.gender.value,
            'age': data.age,
            'R_Token': '',
            'camera': 0
        }
        u_id = str(DB.insert_one('user', user))
    else:
        raise CustomException(409.1)
    
    return {
        'u_id': u_id
    }


@user_router.post('/buyer/login')
async def buyer_login(data: OAuth2PasswordRequestForm = Depends()):
    u_id = AuthManager.get_uid(data.username)

    _id = Util.check_id(u_id)

    user = AuthManager.auth_user(u_id, data.password)
    user['R_Token'] = TokenManager.init_r_token(u_id, "buyer")

    DB.update_one('user', {'_id':_id}, {'R_Token': user['R_Token']})
    response = DB.read_one('user', {'_id':_id})
    result = {
        'u_id': u_id,
        'name': response['name'],
        'token_type': "bearer",
        'A_Token': TokenManager.ACCESS_TOKEN_buyer,
        'R_Token': user['R_Token'],
        'camera': response['camera']
    }
    try:
        # 현재 db에 아예 h_id field가 없는 경우가 많아서 일시적인 조치
        h_id = response['h_id']
    except:
        h_id = ""
    if h_id and Util.is_done(h_id):
        result['h_id'] = ""
    else:
        result['h_id'] = h_id
    return result


@user_router.post('/buyer/info')
async def get_buyer_info(u_id:str, data: PwModel, token:str = Depends(TokenManager.auth_a_token)):
    scope = TokenManager.get_payload('access', token).get("scope")
    assert TokenManager.is_buyer(scope), 403.1    
    
    user = AuthManager.auth_user(u_id, data.pw)
    
    return {
        'id': user['id'],
        'name': user['name'],
        'gender': user['gender'],
        'age': user['age'],
        'camera': user['camera']
    }
    
    
@user_router.put('/buyer/change')
async def change_buyer_info(u_id:str, data: BuyerModifyModel, token:str = Depends(TokenManager.auth_a_token)):
    scope = TokenManager.get_payload('access', token).get("scope")
    assert TokenManager.is_buyer(scope), 403.1

    _id = Util.check_id(u_id)

    if u_id != AuthManager.get_uid(data.id):
        raise CustomException(401.1)
    
    AuthManager.auth_user(u_id, data.old_pw)
    new_hashed_pw = AuthManager.get_hashed_pw(data.new_pw)

    new_data = {
        'pw': new_hashed_pw,
        'name': data.name,
        'gender': data.gender.value,
        'age': data.age,
        'camera': data.camera.value
    }

    DB.update_one('user', {'_id':_id}, new_data)
    

@user_router.put('/buyer/camera')
async def change_buyer_info(u_id:str, data:Camera, token:str = Depends(TokenManager.auth_a_token)):
    scope = TokenManager.get_payload('access', token).get("scope")
    assert TokenManager.is_buyer(scope), 403.1

    _id = Util.check_id(u_id)
    print(data.camera)
    print(type(data.camera))
    print(data.camera.value)
    DB.update_one('user', {'_id':_id}, {'camera': data.camera.value})



"""
seller API
"""

@user_router.post('/seller/signup')
async def seller_signup(data: SellerModel):
    if AuthManager.check_dup('user', {'id':data.id}) == False:
        user = {
            "id": data.id,
            "pw": AuthManager.get_hashed_pw(data.pw),
            "scope": "seller",
            "s_id": '',
            "R_Token": ""
        }
        u_id = str(DB.insert_one('user', user))
    else:
        raise CustomException(status_code=409.1)
    
    return {
        "u_id": u_id
    }


@user_router.post('/seller/login')
async def seller_login(data: OAuth2PasswordRequestForm = Depends()):
    u_id = AuthManager.get_uid(data.username)

    _id = Util.check_id(u_id)

    user = AuthManager.auth_user(u_id, data.password)
    user['R_Token'] = TokenManager.init_r_token(user['_id'], "seller")

    DB.update_one('user', {'_id':_id}, {"R_Token": user['R_Token']})

    return {
        'u_id': user['_id'],
        's_id': user['s_id'],
        'token_type': "bearer",
        'A_Token': TokenManager.ACCESS_TOKEN_seller,
        'R_Token': user['R_Token']
    }


@user_router.post('/seller/info')
async def get_seller_info(u_id:str, data: PwModel, token:str = Depends(TokenManager.auth_a_token)):
    scope = TokenManager.get_payload('access', token).get("scope")
    assert TokenManager.is_seller(scope), 403.1

    user = AuthManager.auth_user(u_id, data.pw)

    return {
        'id': user['id'],
        's_id': user['s_id']
    }
    
@user_router.put('/seller/change')
async def change_seller_info(u_id:str, data: SellerModifyModel, token:str = Depends(TokenManager.auth_a_token)):
    scope = TokenManager.get_payload('access', token).get("scope")
    assert TokenManager.is_seller(scope), 403.1

    _id = Util.check_id(u_id)

    if u_id != AuthManager.get_uid(data.id):
        raise CustomException(401.1)
    
    AuthManager.auth_user(u_id, data.old_pw)
    new_hashed_pw = AuthManager.get_hashed_pw(data.new_pw)

    new_data = {
        'pw': new_hashed_pw,
    }

    DB.update_one('user', {'_id':_id}, new_data)


"""
Token renewal API
"""

@user_router.get('/issue/access')
async def get_access_token(u_id:str, token: str = Depends(TokenManager.auth_r_token)):
    _id = Util.check_id(u_id)
    
    user = DB.read_one('user', {'_id':_id})

    if user['R_Token'] != token:
        raise CustomException(status_code=422.62)
    
    response = TokenManager.recreate_a_token(user['scope'])

    return {
        'A_Token': response
    }

@user_router.get('/issue/refresh')
async def get_refresh_token(u_id:str, token: str = Depends(TokenManager.auth_r_token)):
    _id = Util.check_id(u_id)

    user = DB.read_one('user', {'_id':_id})

    if user['R_Token'] != token:
        raise CustomException(status_code=422.62)
    
    response = TokenManager.recreate_r_token(token, u_id, user['scope'])

    DB.update_one('user', {'_id':_id}, {"R_Token": response})

    return {
        'R_Token': response
    }
    