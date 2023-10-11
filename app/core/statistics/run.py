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
        aoi_datas = DataLoader.get_aoi_reports(query)
        
        aoi_daily_url = os.environ['ANALYSIS_BASE_URL'] + "/anlz/v1/aoi/daily"
        headers = {"Content-Type": "application/json"}

        payload = {
            "aoi_datas": aoi_datas
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(aoi_daily_url, json=payload, headers=headers)
            data = response.json()

        return data

    async def daily_summary():
        # today = Util.get_utc_time_by_datetime(datetime.now().replace(hour=0, minute=0, second=0, microsecond=0))
        today = datetime(2023, 8, 17)
        sale_report = await CallAnalysis.sale_stats(today)
        aoi_report = await CallAnalysis.aoi_stats(today)
        
        result = {
            'date': today.strptime('%Y-%m-%d'),
            'update_date': datetime.now(),
            'msg': 'for test Scheduler...'
        }
        
        for store in sale_report.keys():
            result[store]= {
                'sale_summary': sale_report[store],
                'aoi_summary': aoi_report[store]
            }
        try:
            object_id = DB.insert_one('daily', result)
            return str(object_id)

        except Exception as e:
            print(e)
            return False
        

