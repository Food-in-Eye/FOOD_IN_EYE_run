"""
user_store
:Android APP에서 가게 정보를 불러오기
"""

from fastapi import APIRouter
from core.common.mongo import MongodbController

mongo = MongodbController('store')
store_router = APIRouter(prefix="/stores", tags=["Android"])

def is_null(target:dict, fields:list[str]) -> bool :
    for field in fields:
        if target[field] is None:
            return True
        
    return False

@store_router.get('/')
async def get_store_list():
    """ 모든 식당의 정보를 받아온다 """
    fields = ['_id', 'name', 'desc', 'schedule', 'notice', 'status', 'm_id']
    not_null_fields = ['name', 'desc', 'schedule', 'status']

    try:
        result = mongo.read_all(fields)
        response = []
        for r in result:
            if is_null(r, not_null_fields):
                continue
            response.append(r)
            

    except Exception as e:
        print('ERROR', e)
        return {
            'request': 'api/v1/user/stores',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': 'api/v1/user/stores',
        'status': 'OK',
        'response': response
    }