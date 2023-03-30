"""
admin_menu
React에서 메뉴를 설정할 수 있도록 제공
"""

import operator
from fastapi import APIRouter
from datetime import datetime

from core.models.store import MenuModel
from core.common.mongo import MongodbController

mongo = MongodbController('menu')
mongo_store = MongodbController('store')
menu_router = APIRouter(prefix="/menus")

@menu_router.get('/{m_id}')
async def get_menu(m_id:str):
    """ 해당하는 id의 menu 정보를 받아온다. """
    try:
        response = mongo.read_one(m_id)


    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/menus/{m_id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'api/v1/admin/menus/{m_id}',
        'status': 'OK',
        'response': response
    }

@menu_router.post('/')
async def post_menus(menu:MenuModel):
    """ 해당하는 id의 document를 변경한다.(menu 수정, menu date 갱신) """
    data = menu.dict()
    sotred_f_list = sorted(data['f_list'], key=operator.itemgetter("pos"))

    new_menu = {
        's_id': data['s_id'],
        'date': datetime.now(),
        'f_list': sotred_f_list
    }
    
    try:
        new_menu_id = mongo.create(new_menu)

        if mongo_store.update_one(data['s_id'], 'm_id', new_menu_id):
            return {
                'request': f'api/v1/admin/menus/menu',
                'status': 'OK'
            }
        
        else:
            return {
            'request': f'api/v1/admin/menus/menu',
            'status': 'ERROR',
            'message': f'ERROR!! Please contact your administrator'
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'api/v1/admin/menus/menu',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    