from datetime import datetime, timedelta
from dotenv import load_dotenv

import os
import httpx

from core.common.mongo import MongodbController
from .src import DataLoader

DB = MongodbController('FIE_DB2')


class CallAnalysis:
    @staticmethod
    async def sale_stats(today:datetime):
        """
            하루동안의 판매 통계를 하는 함수이다.
            1. 어제 00:00 ~ 오늘 00:00 까지의 주문(orders)를 불러온다.
            2. orders에 s_num, f_num을 추가한다.
            3. orders를 s_num, f_num으로 분류하여 저장한다.
            4. 분류된 데이터(store_data)에 대한 보고서를 불러와 리턴한다.
        """
        load_dotenv()

        yesterday = today - timedelta(1)
        
        # orderDB에서 어제 하루동안의 모든 주문내역 불러오기
        query = {'date':{"$gte": yesterday, "$lte": today}}
        # orders = DB.read_all_by_query('order', query)
        orders = DataLoader.get_orders(query)
        # s_num table, f_num table 불러옴 (각 _id 와 num이 매칭되어있음)
        s_table = DataLoader.get_store_table()
        f_table = DataLoader.get_food_table()

        anlz_sale_url = os.environ['ANALYSIS_BASE_URL'] + "/anlz/v1/sale/execute"
        headers = {"Content-Type": "application/json"}
        payload = {
            "orders": orders,
            "s_table": s_table,
            "f_table": f_table
        }
        
        async with httpx.AsyncClient() as client:
            response = await client.post(anlz_sale_url, json=payload, headers=headers)
            data = response.json()

        return data

    @staticmethod
    async def aoi_stats(today:datetime):
        load_dotenv()
        
        yesterday = today - timedelta(1)
        query = {'date':{"$gte": yesterday, "$lte": today}}
        aoi_keys = DataLoader.get_aoi_reports(query)
        
        aoi_daily_url = os.environ['ANALYSIS_BASE_URL'] + "/anlz/v1/aoi/daily"
        headers = {"Content-Type": "application/json"}

        payload = {
            "keys": aoi_keys
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(aoi_daily_url, json=payload, headers=headers)
            data = response.json()

        return data


