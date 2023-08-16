from .data import *
from core.common.mongo2 import MongodbController

DB = MongodbController('FIE_DB2')

def data_preprocess(orders:list) -> list:
    """
        분석하고자 하는 데이터에 s_num, f_num을 추가하는 함수
        - input  : orders   (하루동안 발생한 모든 주문 데이터)
        - output : orders  (s_num, f_num이 추가된 데이터)
    """
    try:
        store_info = DB.read_all('store')
        store_info_dict = {}
        for item in store_info:
            store_info_dict[item['_id']] = item

        food_info = DB.read_all('food')
        food_info_dict = {}
        for item in food_info:
            food_info_dict[item['_id']] = item


        for order in orders:
            if order['s_id'] in store_info_dict.keys():
                order['s_num'] = store_info_dict[order['s_id']]['num']
            for f in order['f_list']:
                if f['f_id'] in food_info_dict.keys():
                    f['f_num'] = food_info_dict[f['f_id']]['num']

        return orders

    except Exception as e:
        print('ERROR', e)


def split_by_store_n_food(orders:list) -> dict:
    """
        orders를 store, food 별로 분류한다.
        - input  : orders         (하루동안 발생한 모든 주문 데이터)
        - output : store_data     (분류된 데이터)
    """
    store_data = {}
    
    for order in orders:
        S_NUM = order['s_num']

        if S_NUM not in store_data.keys():
            store_data[S_NUM] = StoreData(S_NUM)
        store_data[S_NUM].total_order += 1
        store_data[S_NUM].order_list.append(order)

        for f in order['f_list']:
            F_NUM = f['f_num']

            if F_NUM not in store_data[S_NUM].food_dict.keys():
                store_data[S_NUM].food_dict[F_NUM] = FoodData(F_NUM)
            store_data[S_NUM].food_dict[F_NUM].total_count += f['count']
            store_data[S_NUM].food_dict[F_NUM].total_sales += f['count'] * f['price']

    return store_data
