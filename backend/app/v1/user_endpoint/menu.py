"""
user_menu
:Android APP에서 메뉴 정보를 불러오기
"""

from fastapi import APIRouter
from typing import Optional

from core.common.mongo import MongodbController

mongo_menu = MongodbController('menu')
mongo_food = MongodbController('food')
menu_router = APIRouter(prefix="/menus")

@menu_router.get("/hi")
async def hello():
    return {"message": "Hello 'api/v1/user/menus/hi'"}

@menu_router.get('/{m_id}')
async def get_menu(m_id:str, food_opt: Optional[bool] = True):  
    """ 해당하는 id의 메뉴판 정보를 받아온다. 
        쿼리 파라미터(food_opt)을 통해 음식에 대한 정보를 받을지 아닐지 선택 가능(기본값은 True)"""

    try:
        menu = mongo_menu.read_one(m_id)
        response = menu
        if food_opt == True:
            food_ids = [food['f_id'] for food in menu['f_list']]
            food_list = []

            for id in food_ids:
                food = mongo_food.read_one(id)
                food_list.append({
                    "f_id": id,
                    "name": food['name'],
                    "price": food['price'],
                    "img_key" : food['img_key'],
                    "desc" : food['desc'],
                    "allergy" : food['allergy'],
                    "origin" : food['origin']
                })
            response['f_list'] = food_list

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/user/menus/{m_id}?food_opt={food_opt}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/user/menus/{m_id}?food_opt={food_opt}',
        'status': 'OK',
        'response': response
    }
