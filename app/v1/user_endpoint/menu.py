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

@menu_router.get('/{s_id}')
async def get_lastest_menu(s_id:str):
    """ 해당하는 id의 메뉴판 정보를 받아온다. """
    
    try:
        response = mongo.read_lastest_one(s_id)

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/user/menus/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/user/menus/{s_id}',
        'status': 'OK',
        'response': response
    }

@menu_router.get('/list/{s_id}')
async def get_lastest_menu_list(s_id:str):
    """ 해당하는 id의 메뉴판의 음식 정보를 받아온다. """
    
    try:
        menu = mongo.read_lastest_one(s_id)

        food_list = menu.get('m_list', [])

        for item in food_list:
            food_id = item['m_id']
            food = mongo_food.read_one(food_id)
            item['name'] = food['name']
            item['price'] = food['price']
            item['img_src'] = food['img_src']
            item['allergy'] = food['allergy']
            item['origin'] = food['origin']

        response = menu
        
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/user/menus/list/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/user/menus/list/{s_id}',
        'status': 'OK',
        'response': response
    }