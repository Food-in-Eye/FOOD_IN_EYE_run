"""
order_router
"""

from fastapi import APIRouter, Depends, Request
from core.models import OrderModel, RawGazeModel
from core.common.mongo import MongodbController
from core.error.exception import CustomException
from core.common.authority import TokenManagement
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

TokenManager = TokenManagement()

order_router = APIRouter(prefix="/orders", dependencies=[Depends(TokenManager.dispatch)])


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


    response = DB.read_all('order', query, asc_by=asc_by, asc=asc)
    
    return {
        'response': response
    }

@order_router.get("/order")
async def get_order(id: str, detail: bool=False):
    ''' 특정 id에 대한 주문내역을 찾아서 반환'''
    q_str = ""

    q_str += f"id={id}"
    _id = Util.check_id(id)
    response = DB.read_one('order', {'_id':_id})
    if detail:
        q_str += f"&detail={detail}"
        f_list = response["f_list"]
        new_list = []
        for dict in f_list:
            _id = Util.check_id(dict["f_id"])
            food_detail = DB.read_one("food", {'_id':_id})
            new_list.append({
                "name": food_detail["name"],
                "count": dict["count"],
                "price": food_detail["price"]
            })
        response["f_list"] = new_list
    
    return {
        "_id": id,
        "date": response['date'],
        "u_id": response['u_id'],
        "s_id": response['s_id'],
        "m_id": response['m_id'],
        "status": response['status'],
        "f_list": response['f_list']
    }

@order_router.put("/order/status")
async def change_status(id: str, request:Request):
    ''' 특정 주문 내역의 진행 상태를 변경한다. '''
    assert TokenManager.is_seller(request.state.token_scope), 403.1

    _id = Util.check_id(id)
    response = DB.read_one('order', {'_id':_id})
    s = response['status']

    # websocket으로 전송 결과를 받기 위함 
    s_id = response['s_id']
    
    if s < 2:
        DB.update_one('order', {'_id':_id}, {'status': s+1})

        # websocket으로 전달하기
        await websocket_manager.send_update(id)

    else:
        raise CustomException(403.71)
    
    return {
        'status': {s+1}
    }

@order_router.post("/order")
async def new_order(body:OrderModel, request:Request):
    ''' app으로 부터 주문을 받고 처리한다.        
        [check 할 사항들]
        1. 사용자로부터 주문을 받아 가게별 주문으로 나누어 order DB에 저장한다. (O)
        2. 주문에 해당하는 가게에 websocket을 통해 메시지를 보낸다.
        3. 주문에 대한 데이터를 history DB에 추가한다. 
            -> (주문자 정보, 주문 날짜, 주문 총 가격, 시선데이터 경로, 주문 식별자 리스트)
        
        모든 과정이 마무리되면 OK 응답을 보낸다.
    '''
    assert TokenManager.is_buyer(request.state.token_scope), 403.1

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
            "total_price": store_price,
            "status": 0
        }

        total_price += store_price

        o_id =  str(DB.insert_one('order', order))         
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
    
    h_id = str(DB.insert_one('history', history))

    return {
        'h_id': h_id,
        'response': response_list
        }
            

@order_router.post("/order/gaze")
async def new_order(h_id: str, body: list[RawGazeModel], request:Request):
    assert TokenManager.is_buyer(request.state.token_scope), 403.1

    gaze_data = []
    for page in body:
        gaze_data.append(page.dict())

    try:
        _id = Util.check_id(h_id)
        key = storage.upload(gaze_data, 'json', 'C_0714')

        if DB.update_one('history', {'_id':_id}, {'raw_gaze_path': key}):
            # 임시로 비활성화
            asyncio.create_task(preprocess_and_update(key, h_id))

            # websocket으로 gaze 요청 그만 보내기
            # websocket_manager.app_connections[h_id]['gaze'] = True
            
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
    aoi_url = os.environ['ANALYSIS_BASE_URL'] + "/anlz/v1/aoi/analysis"
    headers = {"Content-Type": "application/json"}

    async with httpx.AsyncClient() as client:
        _id = Util.check_id(h_id)
        doc = DB.read_one('history', {'_id':_id})
        payload = {
        "raw_data_key": raw_data_key,
        "meta_info": Meta.get_meta_detail(doc['date'])
        }
        response = await client.post(filter_url, json=payload, headers=headers)
        data = response.json()
        fix_key = data["fixation_key"]

        response = await client.get(aoi_url + f'?key={fix_key}')
        data = response.json()
        aoi_key = data["aoi_key"]
        print(f'fixkey= {fix_key}, aoikey = {aoi_key}')
        
        DB.update_one('history', {'_id':_id}, {'fixation_path': fix_key, 'aoi_analysis': aoi_key})



@order_router.get("/historys")
async def get_history_list(u_id: str, request:Request, batch: int = 1):
    assert TokenManager.is_buyer(request.state.token_scope), 403.1

    historys = DB.read_all('history', {'u_id':u_id}, asc_by='date', asc=False)

    if batch > 0 and batch < math.ceil(len(historys) / 10) + 1:
        response_list = []

        batch_items = historys[10*(batch-1):10*batch]
        for h in batch_items:
            if 's_names' in h.keys(): s_names = h['s_names']
            else: s_names = ["nothing", "is", 'here']
            response_list.append({
                "h_id": h['_id'],
                "date": h['date'],
                "total_price": h['total_price'],
                "s_names": s_names
            })
    else:
        raise CustomException(403.72)
    
    return {
        'max_batch': math.ceil(len(historys) / 10),
        'response': response_list
    }
    
@order_router.get("/history")
async def get_order_list(id: str, request:Request):
    assert TokenManager.is_buyer(request.state.token_scope), 403.1

    _id = Util.check_id(id)     

    history = DB.read_one('history', {'_id':_id})

    food_list = []
    for o_id in history['orders']:
        _id = Util.check_id(o_id)  
        order = DB.read_one('order', {'_id':_id})
        s_name = order['s_name']
        for f in order['f_list']:
            if 'f_name' in f.keys(): f_name = f['f_name']
            else: f_name = 'unknown'
            food_list.append({
                "s_name": s_name,
                "f_name": f_name,
                "count": f['count'],
                "price": f['price']
            })
    
    return {
        'date': history['date'],
        'orders': food_list
    }


@order_router.get("/store/dates")
async def get_dates(request:Request, s_id: str, batch: int=1, start_date:str = None, end_date:str = None):
    assert TokenManager.is_seller(request.state.token_scope), 403.1
    
    PER_PAGE = 7
    pipeline = [
        { "$match": { "s_id": s_id } },
        { "$project": { "date": { "$dateToString": { "format": "%Y-%m-%d", "date": "$date" } }, "total_price": 1 } },
        { "$group": { "_id": "$date", "total_price": { "$sum": "$total_price" } } },
        { "$sort": { "_id": 1 } }
    ]
    if (start_date != None) and (end_date != None):
        pipeline[0]["$match"]["date"] = {
            "$gte": datetime.strptime(start_date, "%Y-%m-%d"),
            "$lte": datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
        }

    aggreagted_data = DB.aggregate_pipline('order', pipeline)
    
    distinct_dates = []
    for entry in aggreagted_data:
        distinct_dates.append({
            "date": entry["_id"],
            "total_price": entry["total_price"]
        })

    total_dates = len(distinct_dates)
    start_idx = (batch - 1) * PER_PAGE
    end_idx = start_idx + PER_PAGE
    paginated_dates = distinct_dates[start_idx:end_idx]

    return {
        'max_batch': math.ceil(total_dates / PER_PAGE),
        'response': paginated_dates
    }
        

@order_router.get("/store/date")
async def get_history_list(request:Request, s_id: str, date: str):
    assert TokenManager.is_seller(request.state.token_scope), 403.1

    start_datetime = datetime.strptime(date, "%Y-%m-%d")
    end_datetime = start_datetime + timedelta(days=1)

    query = {
        "date": {"$gte": start_datetime, "$lt": end_datetime},
        "s_id": s_id
    }

    orders = DB.read_all('order', query, asc_by='date', asc=False)

    result = []

    for o in orders:
        result.append({
            'o_id': o['_id'],
            'date': o['date'],
            'detail': o['f_list'],
            'total': o['total_price']
        })
    
    return {
        'response': result
    }
     