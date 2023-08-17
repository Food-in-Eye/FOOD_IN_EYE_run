from fastapi import FastAPI, APIRouter
from datetime import datetime, timedelta
from dotenv import load_dotenv

import os
import httpx
import asyncio
import requests
import json

from core.common.mongo2 import MongodbController
from core.common.s3 import Storage
from .src import *

DB = MongodbController('FIE_DB2')

URL = "http://httpbin.org/uuid"


class ExecuteAnalysis:
    @staticmethod
    async def sale(today):
        """
            하루동안의 판매 통계를 하는 함수이다.
            1. 어제 00:00 ~ 오늘 00:00 까지의 주문(orders)를 불러온다.
            2. orders에 s_num, f_num을 추가한다.
            3. orders를 s_num, f_num으로 분류하여 저장한다.
            4. 분류된 데이터(store_data)에 대한 보고서를 불러와 리턴한다.
        """
        yesterday = today - timedelta(1)
        
        # orderDB에서 어제 하루동안의 모든 주문내역 불러오기
        query = {'date':{"$gte": yesterday, "$lte": today}}
        orders = DB.read_all_by_query('order', query)

        # s_num, f_num 추가하기, 필요한 데이터로만 정리하기
        orders = await Preprocess.for_sale(orders)

        load_dotenv()
        anlz_sale_url = os.environ['ANALYSIS_BASE_URL'] + "/anlz/v1/sale/analysis"
        headers = {"Content-Type": "application/json"}
        payload = {
            "data": orders
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(anlz_sale_url, json=payload, headers=headers)
            data = response.json()

        return data



