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

@order_router.post("/order")
async def new_order(body:OrderModel):
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