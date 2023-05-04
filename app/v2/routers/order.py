"""
order_router
"""

from fastapi import APIRouter
from core.models import OrderModel
from core.common.mongo2 import MongodbController
from .src.util import Util

from datetime import datetime, timedelta

order_router = APIRouter(prefix="/orders")

PREFIX = 'api/v2/orders'
DB = MongodbController('FIE_DB')

@order_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

@order_router.get("/")
async def get_order(s_id: str=None, u_id: str=None, today: bool=False, ascending: bool=True):
    ''' 특정 조건을 만족하는 주문 내역 전체를 반환한다.
        - s_id: 주문을 받은 가게가 일치하는 주문내역만 가져온다.
        - u_id: 주문자가 일치하는 주문내역만 가져온다.
        - today: True인 경우, 요청 날짜의 주문내역만 가져온다.
        - ascending: True인 경우, 오름차순으로 정렬한다.
    '''
    query = {}
    q_str_list = []
    if s_id:
        query["s_id"] = s_id
        q_str_list.append(f"s_id={s_id}")
    if u_id:
        query["u_id"] = u_id
        q_str_list.append(f"u_id={u_id}")
    if today:
        today_str = datetime.today().strftime("%Y-%m-%d")
        today_start = datetime.strptime(today_str, "%Y-%m-%d")
        today_end = today_start + timedelta(days=1)
        query["date"] = {"$gte": today_start, "$lt": today_end}
        q_str_list.append(f"today={today}")
    
    if ascending:
        q_str_list.append(f"ascending={ascending}")
    
    if len(q_str_list) > 1:
        q_str = q_str_list.pop(0)
        for str in q_str_list:
            q_str = q_str + "&" + str

    try:
        response = DB.read_all_by_query('order', query, ascending)
    
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'GET {PREFIX}?{q_str}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'GET {PREFIX}?{q_str}',
        'status': 'OK',
        'response': response
    }

@order_router.get("/order")
async def get_order(id: str):
    ''' 특정 id에 대한 주문내역을 찾아서 반환'''

    try:
        Util.check_id(id)

        response = DB.read_by_id('order', id)
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'GET {PREFIX}/order?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'GET {PREFIX}/order?id={id}',
        'status': 'OK',
        'response': response
    }

@order_router.put("/order/status")
async def change_status(id: str):
    ''' 특정 주문 내역의 진행 상태를 변경한다.'''
    
    try:
        Util.check_id(id)
        response = DB.read_by_id('order', id)
        s = response['status']
        
        if s < 2:
            DB.update_field_by_id('order', id, 'status', s+1)
        else:
            raise Exception('status is already finish')

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'GET {PREFIX}/order?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'GET {PREFIX}/order?id={id}',
        'status': 'OK'
    }

@order_router.post("/order")
async def new_order(body:OrderModel):
    ''' app으로 부터 주문을 받고 처리한다.        
        [check 할 사항들]
        1. 사용자로부터 주문을 받아 가게별 주문으로 나누어 order DB에 저장한다. (O)
        2. 주문에 해당하는 가게에 websocket을 통해 메시지를 보낸다.
        3. 주문에 대한 데이터를 history DB에 추가한다. 
            -> (주문자 정보, 주문 날짜, 주문 총 가격, 시선데이터 경로, 주문 식별자 리스트)
        
        모든 과정이 마무리되면 OK 응답을 보낸다.
    '''
    try:
        order_id_list = []
        for store_order in body.content:
            print(store_order)
            order = {
                "u_id": body.u_id,
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
        
        h_id = str(DB.create('test', history)) # todo: colection 수정 필요

        # print("h_id:", h_id)
        # print("\t", history)
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