import os
from dotenv import load_dotenv
from pymongo import MongoClient

from bson.objectid import ObjectId


def dictToStr(d:dict) -> dict:
    for k, v in d.items():
        if type(v) is ObjectId:
            d[k] = str(v)

    return d
            
class MongodbController:
    """ 몽고디비를 통해 특정 collection을 지정하고 CRUD를 하도록 돕는 클래스 """
    
    def __init__(self, collection:str) -> None:
        load_dotenv()

        client = MongoClient(os.environ['DATABASE_URL'])
        db = client["FIE_DB"]
        collections = db.list_collection_names()
        if collection in collections:
            self.coll = db[collection]
        else:
            raise Exception(f'No collection exists with name \'{collection}\'')
        
    def create(self, data:dict) -> ObjectId:
        """ 딕셔너리를 받아서 collection에 새로운 document를 추가한다. """
        assert data is not None

        if "_id" in data:
            del data["_id"]
        
        result = self.coll.insert_one(data)
        if result.acknowledged is False:
            raise Exception(f'Failed to CREATE new document.')

        return result.inserted_id

    def update(self, id:str, data:dict) -> bool:
        """ id가 일치하는 document의 내용을 변경한다. """
        assert id and data is not None

        result = self.coll.replace_one({'_id': ObjectId(id)}, data)
        if result.acknowledged is False:
            raise Exception(f'Failed to UPDATE document with id \'{id}\'')
        
        if result.modified_count < 1:
            return False

        return True

    def update_one(self, id:str, field:str, value) -> bool:
        assert id and field and value is not None

        result = self.coll.update_one({'_id': ObjectId(id)},
                                      {'$set': {field: value}})
        if result.acknowledged is False:
            raise Exception(f'Failed to UPDATE document with id \'{id}\' to set \'{field}:{value}\'')
        
        if result.modified_count != 1:
            return False
        
        return True

    def read_one(self, id:str) -> dict:
        """ id가 일치하는 document를 읽어온다. """
        assert id is not None

        result = self.coll.find_one({'_id': ObjectId(id)})
        if result is None:
            raise Exception(f'Failed to READ document with id \'{id}\'')
        
        return dictToStr(result)
    
    def read_all(self, fields:list[str]) -> list:
        """ collection의 모든 document를 읽어온다. """

        result = self.coll.find()
        if result is None:
            raise Exception(f'Failed to READ document')
        
        response = []
        for r in result:
            response.append(dictToStr(r))
        
        return response  
    
    def read_all_by_id(self, id:str) -> dict:
        """ id가 일치하는 document를 모두 읽어온다. """
        assert id is not None

        result = list(self.coll.find({'_id': ObjectId(id)}))
        
        if result is None:
            raise Exception(f'Failed to READ document with id \'{id}\'')
        
        if len(result) != 1:
            raise Exception(f'Duplicate ID Error')
        
        else:
            result = result[0]

        return dictToStr(result)
    
    def read_all_by_feild(self, field:str, value:str) -> dict:
        """ field의 value가 일치하는 document를 모두 읽어온다. """
        assert id is not None

        result = list(self.coll.find({field: value}))
        
        if result is None:
            raise Exception(f'Failed to READ document with field \'{field}\'')

        response = []
        for r in result:
            response.append(dictToStr(r))
        
        return response  

    def delete(self, id:str) -> bool:
        """ id가 일치하는 document를 삭제한다. """
        assert id is not None

        result = self.coll.delete_one({'_id': ObjectId(id)})
        if result.acknowledged is False:
            raise Exception(f'Failed to DELETE document with id \'{id}\'')
        
        return True
    