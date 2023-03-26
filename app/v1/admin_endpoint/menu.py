"""
admin_menu
React에서 메뉴를 설정할 수 있도록 제공
"""

from fastapi import APIRouter
from datetime import datetime

from core.models.store import MenuModel
from core.models.store import FoodModel
from core.common.mongo import MongodbController

mongo = MongodbController('menu')
mongo_food = MongodbController('food')
menu_router = APIRouter(prefix="/menus")

@menu_router.get('/{s_id}')
async def get_store(s_id:str):
    """ 해당하는 id의 식당 정보를 받아온다. """
    
    try:
        response = mongo.read_lastest_one(s_id)
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/stores/list/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/admin/store/{s_id}',
        'status': 'OK',
        'response': response
    }

@menu_router.put('/list/{s_id}')
async def get_store(s_id:str, food:FoodModel):
    """ 해당하는 id의 document를 변경한다.(food 수정, menu date 갱신) """
    data = food.dict()

    try:
        if mongo_food.update(s_id, data):
            old_menu = mongo.read_lastest_one(data['s_id'])
            new_menu = {
                's_id': old_menu['s_id'],
                'date': datetime.now(),
                'm_list': old_menu['m_list']
            }
            mongo.create(new_menu)

            return {
                'request': f'api/v1/admin/stores/list/{s_id}',
                'status': 'OK'
            }
        
        else:
            return {
            'request': f'api/v1/admin/store/list/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR update failed'
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/store/list/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }