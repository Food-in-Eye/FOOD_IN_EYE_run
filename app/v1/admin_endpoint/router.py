"""
Admin Router
:React WEB과 상호작용
"""

from fastapi import APIRouter
from core.models.store import StoreModel
from core.common.mongo import MongodbController

mongo = MongodbController('store')
router = APIRouter(prefix="/admin", tags=["Web"])

@router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/admin/hi'"}

@router.get('/store/{s_id}')
async def get_store(s_id:str):
    """ 해당하는 id의 식당 정보를 받아온다. """
    
    try:
        response = mongo.read_one(s_id)
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/store/{s_id}',
            'status': 'ERROR',
            'message': e
        }
    
    return {
        'request': f'api/v1/admin/store/{s_id}',
        'status': 'OK',
        'response': response
    }

@router.put('/store/{s_id}')
async def get_store(s_id:str, store: StoreModel):
    """ 해당하는 id의 document를 변경한다. """
    data = store.dict()
    data['status'] = data['status'].value
    
    try:
        if mongo.update(s_id, data):
            return {
                'request': f'api/v1/admin/store/{s_id}',
                'status': 'OK'
            }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/store/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

