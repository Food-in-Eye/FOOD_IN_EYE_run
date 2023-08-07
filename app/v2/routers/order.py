"""
order_router
"""

from fastapi import APIRouter
from core.models import OrderModel, RawGazeModel
from core.common.mongo2 import MongodbController
from core.common.s3 import Storage
from .src.util import Util
from .src.meta import Meta
from dotenv import load_dotenv

import os
import requests
import asyncio
import httpx
import math

from datetime import datetime, timedelta

from .websocket import websocket_manager as websocket_manager

order_router = APIRouter(prefix="/orders")

PREFIX = 'api/v2/orders'
DB = MongodbController('FIE_DB2')

storage = Storage('foodineye2')

@order_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

@order_router.get("/q")
async def get_order(s_id: str=None, u_id: str=None, today: bool=False, asc_by: str=None, asc: bool=True):
    ''' 특정 조건을 만족하는 주문 내역 전체를 반환한다.
        - s_id: 주문을 받은 가게가 일치하는 주문내역만 가져온다.
        - u_id: 주문자가 일치하는 주문내역만 가져온다.
        - today: True인 경우, 요청 날짜의 주문내역만 가져온다.
        - asc_by: 어떤 필드에 대해서 정렬할지.(지정하지 않을 경우 _id 기준)
        - asc: True면 오름차순, False면 내림차순(기본은 오름차순)
    '''
    query = {}
    q_str_list = []
    q_str = ""
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
    
    if asc_by:
        q_str_list.append(f"asc_by={asc_by}")
    
    if len(q_str_list) > 0:
        q_str = "?" + q_str_list.pop(0)
        for str in q_str_list:
            q_str = q_str + "&" + str

    try:
        response = DB.read_all_by_query('order', query, asc_by, asc)
    
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'GET {PREFIX}{q_str}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'GET {PREFIX}{q_str}',
        'status': 'OK',
        'response': response
    }

@order_router.get("/order")
async def get_order(id: str, detail: bool=False):
    ''' 특정 id에 대한 주문내역을 찾아서 반환'''
    q_str = ""
    try:
        q_str += f"id={id}"
        Util.check_id(id)
        response = DB.read_by_id('order', id)
        if detail:
            q_str += f"&detail={detail}"
            f_list = response["f_list"]
            new_list = []
            for dict in f_list:
                food_detail = DB.read_by_id("food", dict["f_id"])
                new_list.append({
                    "name": food_detail["name"],
                    "count": dict["count"],
                    "price": food_detail["price"]
                })
            response["f_list"] = new_list

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'GET {PREFIX}/order?{q_str}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'GET {PREFIX}/order?{q_str}',
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

        # websocket으로 전송 결과를 받기 위함 
        s_id = response['s_id']
        
        if s < 2:
            DB.update_field_by_id('order', id, 'status', s+1)

            # websocket으로 전달하기
            await websocket_manager.send_update(id)

        else:
            raise Exception('status is already finish')

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'PUT {PREFIX}/order?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
    return {
        'request': f'PUT {PREFIX}/order?id={id}',
        'status': 'OK',
        'message': f'status is now {s+1}'
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
        # u_id 채크도 나중에 추가할 것
        
        response_list = []
        order_id_list = []
        store_name_list = []

        total_price = 0           
        for store_order in body.content:
            store_price = 0
            for food in store_order.f_list:
                store_price += food['price'] * food['count']
            order = {
                "date": datetime.now(),
                "u_id": body.u_id,
                "s_id": store_order.s_id,
                "m_id": store_order.m_id,
                "s_name": store_order.s_name,
                "f_list": store_order.f_list,
                "total_price": store_price
            }

            total_price += store_price

            o_id =  str(DB.create('order', order))         
            order_id_list.append(o_id)
            store_name_list.append(store_order.s_name)
            response_list.append({
                "s_id": store_order.s_id,
                "o_id": o_id
            })

        history = {
           "u_id": body.u_id,
           "date": datetime.now(),
           "total_price": total_price,
           "raw_gaze_path": None,
           "fixation_path": None,
           "aoi_analysis": None,
           "orders": order_id_list,
           "s_names": store_name_list
        }
        
        h_id = str(DB.create('history', history))

        return {
            'request': f'POST {PREFIX}/order',
            'status': 'OK',
            'h_id': h_id,
            'response': response_list
        }
            
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/order',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

@order_router.post("/order/gaze")
async def new_order(h_id: str, body: list[RawGazeModel]):

    gaze_data = []
    for page in body:
        gaze_data.append(page.dict())

    try:
        Util.check_id(h_id)
        key = storage.upload(gaze_data, 'json', 'C_0714')

        if DB.update_field_by_id('history', h_id, 'raw_gaze_path', key):
            # 임시로 비활성화
            # asyncio.create_task(preprocess_and_update(key, h_id))

            # websocket으로 gaze 요청 그만 보내기
            websocket_manager.app_connections[h_id]['gaze'] = True
            
            return {
            'request': f'POST {PREFIX}/order/gaze?h_id={h_id}',
            'status': 'OK'
            }

        return {'success': 'call the admin'}
        
    except:
        return {'success': False}

async def preprocess_and_update(raw_data_key:str, h_id:str):
    load_dotenv()
    filter_url = os.environ['ANALYSIS_BASE_URL'] + "/anlz/v1/filter/execute"
    aoi_url = os.environ['ANALYSIS_BASE_URL'] + "/anlz/v1/filter/aoi"
    payload = {
        "raw_data_key": raw_data_key
    }
    headers = {"Content-Type": "application/json"}

    print('start', filter_url, aoi_url)
    async with httpx.AsyncClient() as client:
        response = await client.post(filter_url, json=payload, headers=headers)
        data = response.json()
        print(data)  
        fix_key = data["fixation_key"]
        DB.update_field_by_id('history', h_id, 'fixation_path', fix_key)
    
        doc = DB.read_by_id('history', h_id)
        payload = {'data' : Meta.get_meta_detail(doc['date'])}
        print(payload)
        response = await client.post(aoi_url + "?key=" + fix_key, json=payload, headers=headers)
        data = response.json()
        print('aoi result', data)
        DB.update_field_by_id('history', h_id, 'aoi_path', data["fixation_key"])

@order_router.get("/historys")
async def get_history_list(u_id: str, batch: int = 1):
    try:
        historys = DB.read_all_by_query('history', {'u_id':u_id}, 'date', False)

        if batch > 0 and batch < math.ceil(len(historys) / 10) + 1:
            response_list = []

            batch_items = historys[10*(batch-1):10*batch]
            for h in batch_items:
                response_list.append({
                    "h_id": h['_id'],
                    "date": h['date'],
                    "total_price": h['total_price'],
                    "s_names": h['s_names']
                })
        else:
            raise Exception('requested batch exceeds range')
        
        return {
            'request': f'POST {PREFIX}/historys?u_id={u_id}&batch={batch}',
            'status': 'OK',
            'max_batch': math.ceil(len(historys) / 10),
            'response': response_list
        }
     
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/historys?u_id={u_id}&batch={batch}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
    
@order_router.get("/history")
async def get_order_list(id: str):
    try:     
        response_list = {}

        history = DB.read_by_id('history', id)

        food_list = []
        for o_id in history['orders']:
            order = DB.read_by_id('order', o_id)
            s_name = order['s_name']
            for f in order['f_list']:
                food_list.append({
                    "s_name": s_name,
                    "f_name": f['f_name'],
                    "count": f['count'],
                    "price": f['price']
                })

        response_list = {
            "date": history['date'],
            "orders": food_list
        }
        
        return {
            'request': f'POST {PREFIX}/history?id={id}',
            'status': 'OK',
            'response': response_list
        }
     
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/history?id={id}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }

@order_router.get("/store/dates")
async def get_dates(s_id: str, batch: int=1):
    PER_PAGE = 7
    pipeline = [
        { "$match": { "s_id": s_id } },
        { "$project": { "date": { "$dateToString": { "format": "%Y-%m-%d", "date": "$date" } } } },
        { "$group": { "_id": "$date" } },
        { "$sort": { "_id": 1 } }
    ]
    try:
        aggreagted_data = DB.aggregate_pipline('order', pipeline)
        distinct_dates = [entry["_id"] for entry in aggreagted_data]

        total_dates = len(distinct_dates)
        start_idx = (batch - 1) * PER_PAGE
        end_idx = start_idx + PER_PAGE
        paginated_dates = distinct_dates[start_idx:end_idx]

        return {
            'request': f'POST {PREFIX}/store/dates?s_id={s_id}&batch={batch}',
            'status': 'OK',
            'max_batch': math.ceil(total_dates / PER_PAGE),
            'response': paginated_dates
        }

    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/store/dates?s_id={s_id}&batch={batch}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }
        

@order_router.get("/store/date")
async def get_history_list(s_id: str, date: str, batch: int = 1):
    try:
        start_datetime = datetime.strptime(date, "%Y-%m-%d")
        end_datetime = start_datetime + timedelta(days=1)

        query = {
            "date": {"$gte": start_datetime, "$lt": end_datetime},
            "s_id": s_id
        }

        orders = DB.read_all_by_query('order', query, 'date', False)

        result = []

        for o in orders:
            result.append({
                'o_id': o['_id'],
                'date': o['date'],
                'detail': o['f_list']
            })
        
        return {
            'request': f'POST {PREFIX}/store/date?s_id={s_id}&date={date}',
            'status': 'OK',
            'response': result
        }
     
    except Exception as e:
        print('ERROR', e)
        return {
            'request': f'POST {PREFIX}/store/date?s_id={s_id}&date={date}',
            'status': 'ERROR',
            'message': f'ERROR {e}'
        }