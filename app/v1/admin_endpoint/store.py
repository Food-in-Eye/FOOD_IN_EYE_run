"""
admin_store
React에서 가게를 설정할 수 있도록 제공
"""

from fastapi import APIRouter
from core.models.store import StoreModel
from core.common.mongo import MongodbController

mongo = MongodbController('store')
store_router = APIRouter(prefix="/stores")

@store_router.get('/{s_id}')
async def get_store(s_id:str):
    """ 해당하는 id의 식당 정보를 받아온다. """
    
    try:
        response = mongo.read_one(s_id)
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/store/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/admin/store/{s_id}',
        'status': 'OK',
        'response': response
    }

@store_router.put('/{s_id}')
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
        
        else:
            return {
            'request': f'api/v1/admin/store/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR update failed'
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/store/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

# 나중에 가게 초기설정에 필요할 수 있어서 임시로 주석처리
# @store_router.post("/store")
# async def create_store(store: StoreModel):
#     print(store)
#     data = store.dict()
#     print(data['status'])
#     data['status'] = data['status'].value
#     print(data['status'])
#     try:
#         id = mongo.create(data)
#     except Exception as e:
#         print('ERROR:', e)
#         return {
#             'request': '/item',
#             'status': 'ERROR',
#             'message': e
#         }
    
#     return {
#         'request': '/item',
#         'status': 'OK',
#         'document_id': str(id)
#     }