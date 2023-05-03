"""
order_router
"""

from fastapi import APIRouter
from core.models import OrderModel
from core.common.mongo2 import MongodbController
from .src.util import Util

from datetime import datetime

order_router = APIRouter(prefix="/orders")

PREFIX = 'api/v2/orders'
DB = MongodbController('FIE_DB')

@order_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

@order_router.get("/")
async def get_order(s_id: str, today=False):
    ''' 특정 가게의 주문 내역을 여러개 찾아서 반환한다. 
        "today" -> True일 경우 오늘 주문 내역만 반환한다. (기본값은 False)
        "asce" -> True일 경우 데이터를 오름차순으로 정렬하여 반환한다. (기본값은 False)
    '''
    pass

@order_router.get("/order")
async def get_order(id: str):
    ''' 특정 id에 대한 주문내역을 찾아서 반환'''
    pass

@order_router.post("/order")
async def new_order(body:OrderModel):
    ''' app으로 부터 주문을 받고 처리한다.
        [check 할 사항들]
        1. 사용자로부터 주문을 받아 가게별 주문으로 나누어 order DB에 저장한다.
        2. 주문에 해당하는 가게에 websocket을 통해 메시지를 보낸다.
        3. 주문에 대한 데이터를 history DB에 추가한다. 
            -> (주문자 정보, 주문 날짜, 주문 총 가격, 시선데이터 경로, 주문 식별자 리스트)
        4. 모든 과정이 마무리되면 OK 응답을 보낸다.
    '''
    try:
        order_id_list = []
        for store_order in body.content:
            order = {
                "s_id": store_order.s_id,
                "m_id": store_order.m_id,
                "f_list": store_order.f_list
            }

            order_id_list.append(str(DB.create('test', order))) # 임시로 test 디비에 보낸다.
        # history DB에도 넣는다 (지금은 임시로 test디비에)
        history = {
           "u_id": body.u_id,
           "date": datetime.now(),
           "total_price": body.total_price,
           "gaze_path": None,
           "orders": order_id_list
        }
        
        h_id = str(DB.create('test', history))

        print("h_id:", h_id)
        print("\t", history)
        return {
            'request': f'POST {PREFIX}/order',
            'status': 'OK'
        }
            
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/order',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }