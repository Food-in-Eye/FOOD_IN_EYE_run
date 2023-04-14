"""
store_router
"""

from bson.objectid import ObjectId

from fastapi import APIRouter
from core.models.store import StoreModel
from core.common.mongo2 import MongodbController

store_router = APIRouter(prefix="/stores")

PREFIX = 'api/v2/stores'
DB = MongodbController('FIE_DB')

@store_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

def is_null(target:dict, fields:list[str]) -> bool :
    for field in fields:
        if target[field] is None:
            return True
        
    return False

def check_id(id:str):
    if not ObjectId.is_valid(id):
        raise Exception(f'The id format is not valid. Please check')

@store_router.get('/')
async def read_all_store():
    """ DB에 존재하는 모든 식당의 정보를 받아온다 """

    # not null check가 필요할까? 애초에 이러한 내용이 DB에 저장되지 않는 것이 맞음
    not_null_fields = ['name', 'desc', 'schedule', 'status']

    try:
        result = DB.read_all('store')
        response = []

        # 고민..
        for r in result:
            if is_null(r, not_null_fields):
                continue
            response.append(r)
            

    except Exception as e:
        print('ERROR', e)
        return {
            'request': PREFIX,
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': PREFIX,
        'status': 'OK',
        'response': response
    }


@store_router.get('/store')
async def read_store(id:str):
    """ 특정 id의 가게 정보를 받아온다."""

    try:
        check_id(id)

        response = DB.read_by_id('store', id)

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'{PREFIX}/store?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'{PREFIX}/store?id={id}',
        'status': 'OK',
        'response': response
    }


# ToDo: user id 같이 받아야 할 듯. 
@store_router.post("/store")
async def create_store(store:StoreModel):
    """ 입력받은 정보의 가게를 생성한다. (최초 가입시에만 가능) """

    data = store.dict()
    data['status'] = data['status'].value

    try:
        id = DB.create('store', data)

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'{PREFIX}/store',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'{PREFIX}/store',
        'status': 'OK',
        'document_id': str(id)
    }

@store_router.put('/store')
async def update_store(id:str, store: StoreModel):
    """ 해당하는 id의 document를 변경한다. """
    data = store.dict()
    data['status'] = data['status'].value
    
    try:
        check_id(id)
        
        if DB.update_by_id('store', id, data):
            return {
                'request': f'{PREFIX}/store?id={id}',
                'status': 'OK'
            }
        
        else:
            raise Exception(f'Update failed...')

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'{PREFIX}/store?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }