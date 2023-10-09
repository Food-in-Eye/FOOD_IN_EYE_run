from bson.objectid import ObjectId
from datetime import datetime
import pytz

class Util:

    @staticmethod
    def is_null(target:dict, fields:list[str]) -> bool :
        for field in fields:
            if target[field] is None:
                return True
            
        return False

    @staticmethod
    def check_id(id:str) -> ObjectId:
        if not ObjectId.is_valid(id):
            raise Exception(f'The id format is not valid. Please check')
        else:
            return ObjectId(id)


    @staticmethod
    def get_utc_time() -> datetime:
        """ 현재 local 시간을 가져와 UTC timezone으로 리턴한다. """
        date = datetime.now(pytz.timezone('Asia/Seoul'))
        utc_time = date.astimezone(pytz.utc)
        return utc_time
    
    @staticmethod
    def get_utc_time_by_datetime(date:datetime) -> datetime:
        """ local 시간을 입력받아 UTC timezone으로 리턴한다. """
        # timestamp = datetime.strptime(date, '%Y-%m-%d')
        utc_time = date.astimezone(pytz.utc)
        return utc_time
    
    @staticmethod
    def get_local_time(date:datetime) -> datetime:
        """ UTC 시간을 입력 받아 Asia/Seoul timezone으로 리턴한다. """
        local_time = date.astimezone(pytz.timezone('Asia/Seoul'))
        return local_time