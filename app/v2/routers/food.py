"""
food_router
"""
import io
from PIL import Image

from fastapi import APIRouter, UploadFile, Depends, Request
from core.models.store import FoodModel
from core.common.mongo import MongodbController
from core.error.exception import CustomException
from core.common.authority import TokenManagement
from core.common.s3 import Storage
from .src.util import Util


TokenManager = TokenManagement()

food_router = APIRouter(prefix="/foods", dependencies=[Depends(TokenManager.dispatch)])

PREFIX = 'api/v2/foods'
DB = MongodbController('FIE_DB2')
storage = Storage('foodineye2')

@food_router.get("/hello")
async def hello():
    return {"message": f"Hello '{PREFIX}'"}

@food_router.get("/q")
async def read_all_food(s_id:str): 
    """ 주어진 가게에 속하는 음식 정보를 모두 받아온다. """

    Util.check_id(s_id)

    response = DB.read_all('food', {'s_id': s_id})

    return response

@food_router.get("/food")
async def read_food(id:str):
    """ 해당하는 id의 음식 정보를 받아온다. """

    _id = Util.check_id(id)

    response = DB.read_one('food', {'_id': _id})
    
    return response

@food_router.post("/food")
async def create_food(s_id:str, food:FoodModel, request:Request):
    """ 해당하는 id의 음식 정보를 업데이트한다. """
    assert TokenManager.is_seller(request.state.token_scope), 403.1

    data = food.dict()

    data['s_id'] = s_id
    data['img_key'] = None


    food_list = DB.read_all('food', {'s_id': s_id})
    if not food_list:
        data['num'] = 1
    else:
        max_num = max(store['num'] for store in food_list)
        data['num'] = max_num + 1

    id = str(DB.insert_one('food', data))
    
    return {
        'document_id': id
    }

@food_router.put('/food')
async def update_food(id:str, food:FoodModel, request:Request):
    """ 해당하는 id의 food 정보를 변경한다. """
    assert TokenManager.is_seller(request.state.token_scope), 403.1

    data = food.dict()

    _id = Util.check_id(id)
    if DB.update_one('food', {'_id':_id}, data) == False:
        raise CustomException(503.54)



@food_router.put('/food/image')
async def update_food_image(id: str, file: UploadFile, request:Request):
    """ 해당하는 id의 이미지를 S3에 업로드하고 그 경로를 변경한다. """
    assert TokenManager.is_seller(request.state.token_scope), 403.1

    _id = Util.check_id(id)

    current = DB.read_one('food', {'_id':_id})

    if current['img_key'] is not None:
        storage.delete(current['img_key'])

    file_content = await file.read()
    
    # re-size 기능 고민
    if file.content_type not in ["image/jpeg", "image/jpg"]:
        with Image.open(io.BytesIO(file_content)) as im:
            im = im.convert('RGB')
            with io.BytesIO() as output:
                im.save(output, format='JPEG')
                file_content = output.getvalue()
        
    image_key = storage.upload(file_content, form='jpg', path='images')
    
    if DB.update_one('food', {'_id': _id}, {'img_key': image_key}):
        return {
            'img_url': 'https://foodineye2.s3.ap-northeast-2.amazonaws.com/' + image_key
        }
    else:
        raise CustomException(503.54)

