
from core.common.mongo import MongodbController
from core.error.exception import CustomException

DB = MongodbController('FIE_DB2')

class DataLoader:
    
    @staticmethod
    def get_store_table():
        
        try:
            stores = DB.read_all('store', {}, {'_id': 1, 'num':1})
            result = {}
            for store in stores:
               result[store['_id']] = store['num']
            
            return result

        except CustomException as e:
            print(e)
    
    @staticmethod
    def get_food_table():
        
        try:
            foods = DB.read_all('food', {}, {'_id': 1, 'num':1})
            result = {}
            for food in foods:
               result[food['_id']] = food['num']
            return result

        except CustomException as e:
            print(e)

    def get_orders(query):

        try:
            orders = DB.read_all('order', query, {'s_id': 1, 'date':1, 'f_list':1})
            for order in orders:
                order['date'] = str(order['date'])
            return orders

        except CustomException as e:
            print(e)

    def get_aoi_reports(query):
        result = []
        try:
            historys = DB.read_all('history', query, {'date':1, 'aoi_analysis':1})
            for history in historys:
                result.append({
                    "date": str(history['date']),
                    "aoi_key": history['aoi_analysis']})
            return result

        except CustomException as e:
            print(e)