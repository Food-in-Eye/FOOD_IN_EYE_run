from datetime import datetime

from core.common.mongo2 import MongodbController

DB = MongodbController('FIE_DB2')

class Preprocessor:

    @staticmethod
    def for_sale(orders:list) -> list:
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

            result = []
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
                    else:
                        pass
                        # todo: 정체를 알 수 없는 f_id가 있을 경우, 이 order_id에 대한 정보를 로그로 남겨야함.
                        #       그래야 관리자가 확인 후 처리 가능

                # store 데이터 정리 - num 추가, 기타 데이터 제외
                if order['s_id'] in stores_dict.keys():
                    result.append({
                        "s_num": stores_dict[order['s_id']],
                        "date": order['date'].strftime('%Y-%m-%d %H:%M:%S'),
                        "f_list": new_foods
                    })
                else:
                    pass
                    # todo: 정체를 알 수 없는 s_id가 있을 경우, 이 order_id에 대한 정보를 로그로 남겨야함.
                    #       그래야 관리자가 확인 후 처리 가능

            return result

        except Exception as e:
            print('ERROR', e)



