"""
store_router
"""

from fastapi import APIRouter, Depends, Request, HTTPException
from core.models.store import StoreModel, NameModel
from core.common.mongo import MongodbController
from core.common.authority import TokenManagement
from core.error.exception import CustomException
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
    """ DB에 존재하는 모든 식당의 정보를 받아온다 """
    assert TokenManager.is_buyer(request.state.token_scope), 403.1  

    result = DB.read_all('store')
    response = []

    for r in result:
        response.append(r)
  
    return {
        'response' : response
    }


@store_router.get('/store')
async def read_store(id:str):
    """ 특정 id의 가게 정보를 받아온다."""

    _id = Util.check_id(id)

    response = DB.read_one('store', {'_id':_id})

    return {
        "_id": response['_id'],
        "name": response['name'],
        "desc": response['desc'],
        "schedule": response['schedule'],
        "notice": response['notice'],
        "status": response['status'],
        "num": response['num']
    }


@store_router.post('/namecheck')
async def check_duplicate_name(data:NameModel, request:Request):
    """ store name의 중복 여부를 확인한다. """
    assert TokenManager.is_seller(request.state.token_scope), 403.1 
    print(data.name)
    try:
        store = DB.read_one('store', {'name': data.name})
        if store:
            state = 'unavailable'
    except CustomException:
        state = 'available'

    return {
        'state': state
    }

@store_router.post("/store")
async def create_store(u_id:str, store:StoreModel, request:Request):
    """ 입력받은 정보의 가게를 생성한다. (최초 가입시에만 가능) """
    assert TokenManager.is_seller(request.state.token_scope), 403.1 

    data = store.dict()
    data['status'] = data['status'].value

    u_id = Util.check_id(u_id)

    name_data = NameModel(name=store.name)
    state = await check_duplicate_name(name_data, request)
    if state == 'unavailable':
        raise CustomException(409.2)
    
    store_list = DB.read_all('store')
    if not store_list: # store 최초 등록
        data['num'] = 1
    else:
        max_num = max(store["num"] for store in store_list)
        data['num'] = max_num + 1

    id = str(DB.insert_one('store', data))
    
    DB.update_one('user', {'_id':u_id}, {'s_id': id})
    
    return {
        'document_id': id
    }

@store_router.put('/store')
async def update_store(id:str, store: StoreModel, request:Request):
    """ 해당하는 id의 document를 변경한다. """

    assert TokenManager.is_seller(request.state.token_scope), 403.1 

    data = store.dict()
    data['status'] = data['status'].value
    
    _id = Util.check_id(id)

    name_data = NameModel(name=store.name)
    state = await check_duplicate_name(name_data, request)
    if state == 'unavailable':
        raise CustomException(409.2)
    
    if DB.replace_one('store', {'_id':_id}, data) == False:
        raise CustomException(503.54)
