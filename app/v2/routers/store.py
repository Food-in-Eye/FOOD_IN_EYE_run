"""
store_router
"""

from fastapi import APIRouter, Depends, Request, HTTPException
from core.models.store import StoreModel, NameModel
from core.common.mongo import MongodbController
from core.common.authority import TokenManagement
from core.error.exception import *
from .src.util import Util


TokenManager = TokenManagement()

store_router = APIRouter(prefix="/stores", dependencies=[Depends(TokenManager.dispatch)])

PREFIX = 'api/v2/stores'
DB = MongodbController('FIE_DB2')


@store_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

@store_router.get('/')
async def read_all_store(request: Request):
    print(request)
    """ DB에 존재하는 모든 식당의 정보를 받아온다 """

    assert TokenManager.is_buyer(request), 403.1

    try:
        result = DB.read_all('store')
        response = []

        for r in result:
            response.append(r)

    except Exception as e:
        print('ERROR', e)
        raise HTTPException(status_code=403, detail=str(e))

    
    return {
        'request': f'GET {PREFIX}',
        'status': 'OK',
        'response': response
    }


@store_router.get('/store')
async def read_store(id:str):
    """ 특정 id의 가게 정보를 받아온다."""

    try:
        _id = Util.check_id(id)

        response = DB.read_one('store', {'_id':_id})

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'GET {PREFIX}/store?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'GET {PREFIX}/store?id={id}',
        'status': 'OK',
        'response': response
    }


@store_router.post('/namecheck')
async def check_duplicate_id(data:NameModel, request:Request):
    """ store name의 중복 여부를 확인한다. """

    assert TokenManager.is_seller(request), "This request is only allowed for sellers."

    try:
        store = DB.read_one('store', {'name': data['name']})

        if store:
            state = 'unavailable'
        else:
            state = 'available'

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/store/namecheck',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'POST {PREFIX}/store/namecheck',
        'status': 'OK',
        'state': state
    }

@store_router.post("/store")
async def create_store(u_id:str, store:StoreModel, request:Request):
    """ 입력받은 정보의 가게를 생성한다. (최초 가입시에만 가능) """

    assert TokenManager.is_seller(request), "This request is only allowed for sellers."

    data = store.dict()
    data['status'] = data['status'].value

    try:
        Util.check_id(u_id)

        name_dup = DB.read_one('store', {'name':data['name']})
        if name_dup:
            raise Exception(f'Request name has already exist.')
        
        store_list = DB.read_all('store')
        if not store_list: # store 최초 등록
            data['num'] = 1
        else:
            max_num = max(store["num"] for store in store_list)
            data['num'] = max_num + 1

        id = str(DB.insert_one('store', data))

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/store?u_id={u_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'POST {PREFIX}/store?u_id={u_id}',
        'status': 'OK',
        'document_id': id
    }

@store_router.put('/store')
async def update_store(id:str, store: StoreModel, request:Request):
    """ 해당하는 id의 document를 변경한다. """

    assert TokenManager.is_seller(request), "This request is only allowed for sellers."

    data = store.dict()
    data['status'] = data['status'].value
    
    try:
        _id = Util.check_id(id)

        name_dup = DB.read_one('store', {'name':data['name']})
        if name_dup:
            raise Exception(f'Request name has already exist.')
        
        if DB.replace_one('store', {'_id':_id}, data):
            return {
                'request': f'PUT {PREFIX}/store?id={id}',
                'status': 'OK'
            }
        
        else:
            raise Exception(f'Update failed...')

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'PUT {PREFIX}/store?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }