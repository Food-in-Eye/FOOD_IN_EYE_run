from bson.objectid import ObjectId
from core.error.exception import CustomException

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
            raise CustomException(503.61, f'The id format is not valid. Please check')
        else:
            return ObjectId(id)
