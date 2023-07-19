from bson.objectid import ObjectId
from datetime import datetime
from core.common.mongo2 import MongodbController

class Meta:
    DB = MongodbController('FIE_DB2')

    @staticmethod
    def create(content: dict):

        try:
            meta = {
                'date': datetime.now(),
                'content': content
            }
            print(meta)
            new_id = Meta.DB.create('temp', meta)
            return new_id
        
        except:
            print('fail')
    
    @staticmethod
    def get_meta(date: datetime):
        '''
            주어진 날짜 기준에서의 Meta data를 불러온다.
        '''
        try:
            data_list = Meta.DB.read_all_by_query('temp', {}, 'date', False)
            
        except:
            return None  

        result = data_list[0]
        for data in data_list:
            print(data)
            if data['date'] < date:
                return data
            else:
                result = data

    @staticmethod
    def get_detail(meta: dict):

        try:
            s_id_list = meta.keys()
            m_id_list = meta.values()

            
            
        except:
            pass