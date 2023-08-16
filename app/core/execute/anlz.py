from fastapi import FastAPI, APIRouter
import httpx
import asyncio
import requests

from core.common.mongo2 import MongodbController
from core.common.s3 import Storage
from .src import *

DB = MongodbController('FIE_DB2')

URL = "http://httpbin.org/uuid"

async def execute_sale(yesterday, today):
    """
        하루동안의 판매 통계를 하는 함수이다.
        1. 어제 00:00 ~ 오늘 00:00 까지의 주문(orders)를 불러온다.
        2. orders에 s_num, f_num을 추가한다.
        3. orders를 s_num, f_num으로 분류하여 저장한다.
        4. 분류된 데이터(store_data)에 대한 보고서를 불러와 리턴한다.
    """
    # orderDB에서 어제 하루동안의 모든 주문내역 불러오기
    query = {'date':{"$gte": yesterday, "$lte": today}}
    orders = DB.read_all_by_query('order', query)

    # s_num, f_num 추가하기
    orders = data_preprocess(orders)

    # store와 food 별로 orders 정리하기
    store_data = split_by_store_n_food(orders)
    
    try:
        result = {}
        for k, v in store_data.items():
            print(v)
            # response = requests.get(URL, v)
            # response.raise_for_status()

            # result[f'Store {k}'] = response

    except requests.exceptions.Timeout:
        return "Timeout: The request took too long to complete."
    except requests.exceptions.RequestException as e:
        return f"An error occurred: {e}"
    return result


