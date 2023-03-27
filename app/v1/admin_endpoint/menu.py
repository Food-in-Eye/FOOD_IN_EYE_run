"""
admin_menu
React에서 메뉴를 설정할 수 있도록 제공
"""

import operator
from fastapi import APIRouter
from datetime import datetime

from core.models.store import MenuModel
from core.models.store import FoodModel
from core.models.store import FoodPos
from core.common.mongo import MongodbController

mongo = MongodbController('menu')
mongo_food = MongodbController('food')
mongo_store = MongodbController('store')
menu_router = APIRouter(prefix="/menus")

@menu_router.get('/{s_id}')
async def get_menu(s_id:str):
    """ 해당하는 id의 menu 정보를 받아온다. """
    
    try:
        response = mongo.read_lastest_one(s_id)
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/menus/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/admin/menus/{s_id}',
        'status': 'OK',
        'response': response
    }

@menu_router.put('/food/{f_id}')
async def put_food(f_id:str, food:FoodModel):
    """ 해당하는 id의 document를 변경한다.(food 수정) """
    data = food.dict()

    try:
        if mongo_food.update(f_id, data):
            return {
                'request': f'api/v1/admin/menus/food/{f_id}',
                'status': 'OK'
            }
        
        else:
            return {
            'request': f'api/v1/admin/menus/food/{f_id}',
            'status': 'ERROR',
            'message': f'ERROR update failed'
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/menus/food/{f_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

@menu_router.put('/menu/{s_id}')
async def put_menus(s_id:str, menu:MenuModel):
    """ 해당하는 id의 document를 변경한다.(menu 수정, menu date 갱신) """
    data = menu.dict()
    data = data['f_list']
    
    sotred_data = sorted(data, key=operator.itemgetter("pos"))

    new_menu = {
        's_id': s_id,
        'date': datetime.now(),
        'f_list': sotred_data
    }
    
    try:
        if mongo.create(new_menu):
            menu = mongo.read_lastest_one(s_id)
            store = mongo_store.read_one(s_id)
            new_store = {
                'name': store['name'],
                'desc': store['desc'],
                'schedule': store['schedule'],
                'notice': store['notice'],
                'status': store['status'],
                'm_id': menu['_id']
            }
            mongo_store.update(s_id, new_store)
            return {
                'request': f'api/v1/admin/menus/menu/list/{s_id}',
                'status': 'OK'
            }
        
        else:
            return {
            'request': f'api/v1/admin/menus/menu/list/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR update failed'
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/menus/menu/list/{s_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    