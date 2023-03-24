"""
user_store
:Android APP에서 가게 정보를 불러오기
"""

from fastapi import APIRouter
from core.common.mongo import MongodbController

mongo = MongodbController('store')
store_router = APIRouter(prefix="/stores", tags=["Android"])

@store_router.get('/')
async def get_store_list():
    """ 모든 식당의 정보를 받아온다 """
    fields = ['_id', 'name', 'desc', 'schedule', 'notice', 'status', 'img_src', 'm_id']
    try:
        response = mongo.read_all(fields)
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