"""
user_food
:Android APP에서 음식 정보를 불러오기
"""

from fastapi import APIRouter
from core.models.store import FoodModel
from core.common.mongo import MongodbController

mongo_food = MongodbController('food')
food_router = APIRouter(prefix="/foods")

# todo: get(read), post(create), delete(delete) 추가할 것 
#       +) 음식 이미지 변경도 가능해야함

@food_router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/user/foods/hi'"}

@food_router.put('/{f_id}')
async def put_food(f_id:str, food:FoodModel):
    """ 해당하는 id의 document를 변경한다.(food 수정) """
    data = food.dict()

    try:
        if mongo_food.update(f_id, data):
            return {
                'request': f'api/v1/admin/foods/{f_id}',
                'status': 'OK'
            }
        
        else:
            return {
            'request': f'api/v1/admin/foods/{f_id}',
            'status': 'ERROR',
            'message': f'ERROR update failed'
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/foods/{f_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }