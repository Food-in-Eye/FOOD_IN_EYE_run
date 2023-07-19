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
            new_id = Meta.DB.create('temp', meta)
            return new_id
        
        except:
            print('fail')
    
    @staticmethod
    def get_meta(date=datetime.now()):
        '''
            주어진 날짜 기준에서의 Meta data를 불러온다.
        '''
        try:
            data_list = Meta.DB.read_all_by_query('temp', {}, 'date', False)
            
        except:
            return None  

        result = data_list[0]
        for data in data_list:
            if data['date'] < date:
                return data
            else:
                result = data

    @staticmethod
    def get_detail(content: dict):

        try:
            
            s_id_list = content.keys()
            m_id_list = content.values()

            store_documents = Meta.DB.read_all_by_id('store', Meta.to_ObjectId_list(s_id_list))
            menu_documents = Meta.DB.read_all_by_id('menu', Meta.to_ObjectId_list(m_id_list))

            new_dict = {}
            for i in range(len(s_id_list)):
                k = store_documents[i]['num']
                v = Meta.get_f_num_list(menu_documents[i]['f_list'])

                new_dict[k]=v
            
            return new_dict
               
        except Exception as e:
            print(e)

    @staticmethod
    def to_ObjectId_list(str_list: list):
        new_list = []
        for str in str_list:
            new_list.append(ObjectId(str))
        
        return new_list
    
    @staticmethod
    def get_f_num_list(f_list):
        result = []
        for f in f_list:
            result.append(f['f_num'])
        return result