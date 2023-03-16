"""
User Router
:Android APP과 상호작용
"""

from fastapi import APIRouter
from core.models.store import StoreModel
from core.common.mongo import MongodbController

mongo = MongodbController('store')
router = APIRouter(prefix="/user", tags=["Android"])

@router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/user/hi'"}

# 초기 데이터를 넣기 위해 임시로 작성. 실제로는 사용하지 않을예정
# @router.post("/store")
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

@router.get('/stores')
async def get_store_list():
    """ 모든 식당의 정보를 받아온다 """
    fields = ['_id', 'name', 'desc', 'schedule', 'notice', 'status', 'img_src', 'm_id']

    try:
        response = mongo.read_all(fields)
    except Exception as e:
        print('ERROR', e)
        return {
            'request': '/stores',
            'status': 'ERROR',
            'message': e
        }
    
    return {
        'request': 'api/v1/user/stores',
        'status': 'OK',
        'response': response
    }