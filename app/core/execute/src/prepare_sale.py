from datetime import datetime

from core.common.mongo2 import MongodbController

DB = MongodbController('FIE_DB2')

class Preprocess:

    @staticmethod
    async def for_sale(orders:list) -> list:
        """
            전체 데이터 중에서 분석에 필요한 데이터를 정리하는 함수
            1. s_num, f_num 추가
            2. 판매 통계에 필요없는 데이터(u_id, m_id 등) 제외
            - input  : orders       (하루동안 발생한 모든 주문 데이터)
            - output : new_orders   (s_num, f_num이 추가된 데이터)
        """
        try:
            # store_DB에서 num 가져오기
            stores = DB.read_all('store')
            stores_dict = {}
            for store in stores:
                stores_dict[store['_id']] = store['num']

            # food_DB에서 num 가져오기
            foods = DB.read_all('food')
            foods_dict = {}
            for food in foods:
                foods_dict[food['_id']] = food['num']

            new_orders = []
            for order in orders:

                # food 데이터 정리 - num 추가, 기타 데이터 제외
                new_foods = []
                for f in order['f_list']:
                    if f['f_id'] in foods_dict.keys():
                        new_foods.append({
                            "f_num": foods_dict[f['f_id']],
                            "count": f['count'],
                            "price": f['price']
                        })

                # store 데이터 정리 - num 추가, 기타 데이터 제외
                if order['s_id'] in stores_dict.keys():
                    new_orders.append({
                        "s_num": stores_dict[order['s_id']],
                        "date": order['date'].strftime('%Y-%m-%d %H:%M:%S'),
                        "f_list": new_foods
                    })

            return new_orders

        except Exception as e:
            print('ERROR', e)



