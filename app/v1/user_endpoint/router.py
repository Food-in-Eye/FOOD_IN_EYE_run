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
    """ test 할 수 있도록 임시로 추가 """
    return {
	'request': 'api/v1/user/stores',
	'response': [
		{
		    "_id": "640f314539dec4c7ae2cad9e",
		    "name": "니나노덮밥",
		    "description": "맛있는 함박오므라이스와 카레라이스를 팝니다~!",
		    "schedule": "9시~18시 영업, 월요일 휴무",
			"notice": None,
			"status": 1,
			"img_url": None,
			"m_id": "640f314539dec4c11e2c24d9e"
		},
		{
		    "_id": "640f30d62f922537bd16c4fa",
		    "name": "파스타",
		    "description": "다양한 양식 음식이 있습니다.",
		    "schedule": "9시~18시 영업, 주말 제외",
			"notice": "개인사정으로 다음주 화요일까지 잠시 휴업합니다.",
			"status": 2,
			"img_url": None,
			"m_id": "640f31451242144c11e2c24d9e"
		}
	]
}