from bson.objectid import ObjectId
from datetime import datetime
import pytz
from core.error.exception import CustomException

class Util:

    @staticmethod
    def is_null(target:dict, fields:list[str]) -> bool :
        for field in fields:
            if target[field] is None:
                return True
            
        return False

    '''
        id 체크도 어떤 아이디가 안된건지 확인하고싶음
        예를들면 여기선 그냥 False로 두고 아님 걍 exception 발생시켜서 이 밖에서 'order_id'가 이상한지 'user_id'가 이상한지 알고싶음
    '''
    @staticmethod
    def check_id(id:str) -> ObjectId:
        if not ObjectId.is_valid(id):
            raise CustomException(503.71, f'id: \'{id}\'')
        else:
            return ObjectId(id)

    @staticmethod
    def get_cur_time() -> datetime:
        """ 원하는 timezone으로 현재 시간을 리턴한다. """
        current_time_utc = datetime.now(pytz.UTC)
        current_time = current_time_utc.astimezone(pytz.timezone('Asia/Seoul'))
        return current_time
    
    @staticmethod
    def get_custom_time(date:datetime) -> datetime:
        """ 
            datetime을 입력 받아 원하는 timezone으로 현재 시간을 리턴한다. 
            - input : datetime 객체(year, month, day)
        """
        custom_time = date.astimezone(pytz.timezone('Asia/Seoul'))
        return custom_time