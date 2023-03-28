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
    fields = ['_id', 'name', 'desc', 'schedule', 'notice', 'status', 'm_id']
    not_null_fields = ['name', 'desc', 'schedule', 'status']

    try:
        # result = mongo.read_all(fields)
        # response = []
        # for r in result:
        #     for item in not_null_fields:
        #         print(item) # 프린트 문 삭제 요망
        #         if r[item] is not None:
        #             if item == 'status':
        #                 response.append(r)
        #         else:
        #             break
        
        result = mongo.read_all(fields)
        response = []
        for r in result:
            btn = True
            for field in not_null_fields:
                if r[field] is None:
                    btn = False
                    break
            
            if btn:
                response.append(r)
        
        return (response)


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