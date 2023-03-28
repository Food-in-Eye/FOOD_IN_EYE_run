"""
user_menu
:Android APP에서 메뉴 정보를 불러오기
"""

from fastapi import APIRouter
from core.models.store import MenuModel
from core.models.store import FoodModel
from core.common.mongo import MongodbController

mongo = MongodbController('menu')
mongo_food = MongodbController('food')
menu_router = APIRouter(prefix="/menus")

@menu_router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/user/hi'"}

@menu_router.get('/{m_id}')
async def get_lastest_menu(m_id:str):
    """ 해당하는 id의 메뉴판 정보를 받아온다. """
    # 메뉴의 아이디로 메뉴 디비에서 받아올 수 있도록.
    # 아래 함수와 합쳐서 food 정보를 넣을지 넣지 말지 결정할 수 있게 쿼리로 받기
    try:
        response = mongo.read_lastest_one(m_id, 'date', False)

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/user/menus/{m_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/user/menus/{m_id}',
        'status': 'OK',
        'response': response
    }

@menu_router.get('/list/{m_id}')
async def get_lastest_menu_list(m_id:str):
    """ 해당하는 id의 메뉴판의 음식 정보를 받아온다. """
    
    try:
        menu = mongo.read_lastest_one(m_id)

        food_ids = [food['f_id'] for food in menu['f_list']]
        food_list = []

        for food_id in food_ids:
            food = mongo_food.read_one(food_id)
            food_list.append({
                "name": food['name'],
                "price": food['price'],
                "img_key" : food['img_key'],
                "desc" : food['desc'],
                "allergy" : food['allergy'],
                "origin" : food['origin']
        })
        response = food_list
        
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/user/menus/list/{m_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/user/menus/list/{m_id}',
        'status': 'OK',
        'response': response
    }
