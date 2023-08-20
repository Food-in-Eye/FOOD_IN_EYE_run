
from core.common.mongo2 import MongodbController

DB = MongodbController('FIE_DB2')

class DataLoader:
    
    @staticmethod
    def get_store_table():
        
        try:
            stores = DB.read_all_about_fileds('store', {'_id': 1, 'num':1})
            result = {}
            for store in stores:
               print(store)
               result[store['_id']] = store['num']
            
            print(result)
            return result

        except Exception as e:
            print(e)
    
    @staticmethod
    def get_food_table():
        
        try:
            foods = DB.read_all_about_fileds('food', {'_id': 1, 'num':1})
            result = {}
            for food in foods:
               result[food['_id']] = food['num']
            print(result)
            return result

        except Exception as e:
            print(e)

    def get_orders(query):

        try:
            orders = DB.read_all_about_fileds_by_query('order', query, {'s_id': 1, 'date':1, 'f_list':1})
            for order in orders:
                order['date'] = order['date'].strftime('%Y-%m-%d %H:%M:%S')
            return orders

        except Exception as e:
            print(e)